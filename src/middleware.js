import { getCachedService, setCachedService } from "./cache.js";

/**
 * Creates a MonoPay middleware handler for protecting routes with payment verification
 * @param {string} apiKey - Your MonoPay API key
 * @param {string} [hostApi] - Optional MonoPay host API URL
 * @returns {Function} Middleware function that validates payments
 */
export function createMonoPayMiddleware(apiKey, hostApi) {
  const HOST_API = hostApi || process.env.MONOPAY_HOST_API || "https://api.monopay.xyz";

  return async (request) => {
    try {
      let config = getCachedService(apiKey);

      if (!config) {
        const res = await fetch(`${HOST_API}/service/config?apikey=${apiKey}`);
        const data = await res.json();

        if (!data.success) {
          return new Response(JSON.stringify({ error: "Invalid API key" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        config = data.data;
        setCachedService(apiKey, config);
      }

      const url = new URL(request.url);
      const route = url.pathname;

      const matched = config.allowedRoutes.some((r) => route.startsWith(r));
      if (!matched) {
        return new Response("OK", { status: 200 });
      }

      const txSig = request.headers.get("x-tx-signature");

      if (!txSig) {
        const paymentRequired = {
          requiresPayment: true,
          serviceId: config.serviceId,
          wallet: config.payoutWallet,
          priceLamports: config.priceLamports,
          message: "Payment required for this route",
        };

        return new Response(JSON.stringify(paymentRequired), {
          status: 402,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Verification logic (currently commented in original)
      // Uncomment when ready to verify payments
      const verifyRes = await fetch(`${HOST_API}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txSignature: txSig,
          serviceId: config.serviceId,
          payoutWallet: config.payoutWallet,
          priceLamports: config.priceLamports,
        }),
      });

      const verify = await verifyRes.json();
      if (!verify.success) {
        return new Response(JSON.stringify({ error: verify.error || "Invalid payment" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }
      
      return new Response("OK", { status: 200 });
    } catch (err) {
      console.error("MonoPay middleware error:", err);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  };
}
