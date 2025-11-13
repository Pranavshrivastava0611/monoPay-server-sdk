/**
 * Validates a payment signature
 * @param {string} txSignature - Transaction signature from request
 * @param {string} serviceId - Your service ID
 * @param {string} payoutWallet - Payout wallet address
 * @param {number} priceLamports - Price in lamports
 * @param {string} [hostApi] - Optional MonoPay host API URL
 * @returns {Promise<Object>} Verification result
 */
export async function verifyPayment(txSignature, serviceId, payoutWallet, priceLamports, hostApi) {
    const HOST_API = hostApi || process.env.MONOPAY_HOST_API || "https://api.monopay.xyz";
  
    try {
      const res = await fetch(`${HOST_API}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txSignature,
          serviceId,
          payoutWallet,
          priceLamports,
        }),
      });
  
      return await res.json();
    } catch (err) {
      console.error("Payment verification error:", err);
      return {
        success: false,
        error: "Verification failed",
      };
    }
  }
  