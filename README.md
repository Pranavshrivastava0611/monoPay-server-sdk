@monopay/middleware
A lightweight JavaScript middleware for protecting routes with MonoPay payment verification. Easily integrate Solana-based payments into your Node.js/Next.js application.

Installation
bash
npm install @monopay/middleware
# or
yarn add @monopay/middleware
# or
pnpm add @monopay/middleware
Quick Start
Setup in Next.js
Create a middleware file at middleware.js in your project root:

javascript
import { createMonoPayMiddleware } from "@monopay/middleware";
import { NextResponse } from "next/server";

const monoPayMiddleware = createMonoPayMiddleware(process.env.MONOPAY_API_KEY);

export async function middleware(request) {
  const response = await monoPayMiddleware(request);

  if (response.status === 402) {
    return response;
  }

  if (response.status === 401 || response.status === 403 || response.status === 500) {
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/protected/:path*"],
};
Setup in Express
javascript
const express = require("express");
const { createMonoPayMiddleware } = require("@monopay/middleware");

const app = express();
const monoPayMiddleware = createMonoPayMiddleware(process.env.MONOPAY_API_KEY);

app.use("/api/protected", async (req, res, next) => {
  const request = new Request(`http://localhost:${req.socket.remoteAddress}${req.url}`, {
    method: req.method,
    headers: req.headers,
  });

  const response = await monoPayMiddleware(request);

  if (response.status === 402) {
    const data = await response.json();
    return res.status(402).json(data);
  }

  if (!response.ok) {
    const data = await response.json();
    return res.status(response.status).json(data);
  }

  next();
});

app.listen(3000);
Environment Variables
Create a .env.local file:

env
MONOPAY_API_KEY=your_api_key_here
MONOPAY_HOST_API=https://api.monopay.xyz  # Optional, uses default if omitted
API Reference
createMonoPayMiddleware(apiKey, hostApi?)
Creates a middleware function that validates MonoPay payments.

Parameters:

apiKey (string): Your MonoPay API key
hostApi (string, optional): Custom MonoPay host API URL
Returns: Middleware function that processes requests

Example:

javascript
const middleware = createMonoPayMiddleware(
  process.env.MONOPAY_API_KEY,
  "https://custom-api.monopay.xyz"
);
verifyPayment(txSignature, serviceId, payoutWallet, priceLamports, hostApi?)
Manually verify a payment signature.

Parameters:

txSignature (string): Transaction signature
serviceId (string): Your service ID
payoutWallet (string): Payout wallet address
priceLamports (number): Price in lamports
hostApi (string, optional): Custom API URL
Returns: Promise<Object>

Example:

javascript
const { verifyPayment } = require("@monopay/middleware");

const result = await verifyPayment(
  "tx_signature_here",
  "service_123",
  "wallet_address",
  5000000
);

if (result.success) {
  console.log("Payment verified!");
}
Caching
The middleware automatically caches service configurations for 5 minutes internally to reduce API calls. This is handled transparently - no action needed from you.

Response Types
Payment Required (402)
javascript
{
  requiresPayment: true,
  serviceId: "string",
  wallet: "string",
  priceLamports: 5000000,
  message: "Payment required for this route"
}
Success (200)
Route access granted after payment verification.

Errors
401: Invalid API key
403: Invalid payment
500: Internal server error
Examples
Basic Usage
javascript
const { createMonoPayMiddleware } = require("@monopay/middleware");

const middleware = createMonoPayMiddleware(process.env.MONOPAY_API_KEY);

// Use in your request handler
const response = await middleware(request);

if (response.status === 402) {
  // Handle payment required
  const paymentData = await response.json();
  console.log("Payment required:", paymentData);
}
Manual Verification
javascript
const { verifyPayment } = require("@monopay/middleware");

async function handlePayment(req, res) {
  const txSig = req.headers["x-tx-signature"];

  const result = await verifyPayment(
    txSig,
    config.serviceId,
    config.payoutWallet,
    config.priceLamports
  );

  if (!result.success) {
    return res.status(403).json({ error: "Payment invalid" });
  }

  // Process the request
  res.json({ success: true });
}
With API Route Handler
javascript
import { createMonoPayMiddleware } from "@monopay/middleware";

const monoPayMiddleware = createMonoPayMiddleware(process.env.MONOPAY_API_KEY);

export default async function handler(req, res) {
  const response = await monoPayMiddleware(req);

  if (response.status === 402) {
    const data = await response.json();
    return res.status(402).json(data);
  }

  if (!response.ok) {
    const data = await response.json();
    return res.status(response.status).json(data);
  }

  // Your protected logic here
  res.json({ data: "Protected content" });
}
Usage
javascript
const { createMonoPayMiddleware, verifyPayment } = require("@monopay/middleware");
Error Handling
All errors are caught and logged. Common scenarios:

Invalid API Key: Returns 401 status
Missing Payment Signature: Returns 402 with payment details
Payment Verification Failed: Returns 403
Network/Server Error: Returns 500
Project Structure
monopay-middleware/
├── src/
│   ├── index.js          # Main middleware and utilities
│   ├── cache.js          # Caching logic
│   └── package.json
├── README.md
└── .gitignore
Publishing to NPM
bash
# 1. Login to npm
npm login

# 2. Update version in package.json
npm version patch  # or minor/major

# 3. Publish
npm publish
License
MIT

Support
For issues and questions, visit GitHub Issues

