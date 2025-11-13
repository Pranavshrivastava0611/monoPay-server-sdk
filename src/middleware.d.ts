export interface PaymentRequiredResponse {
    requiresPayment: true;
    serviceId: string;
    wallet: string;
    priceLamports: number;
    message: string;
  }
  
  export function createMonoPayMiddleware(
    apiKey: string,
    hostApi?: string
  ): (request: Request) => Promise<Response>;