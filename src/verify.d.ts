export interface VerifyPaymentResponse {
    success: boolean;
    error?: string;
    data?: any;
  }
  
  export function verifyPayment(
    txSignature: string,
    serviceId: string,
    payoutWallet: string,
    priceLamports: number,
    hostApi?: string
  ): Promise<VerifyPaymentResponse>;