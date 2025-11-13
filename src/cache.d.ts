export interface ServiceConfig {
    serviceId: string;
    payoutWallet: string;
    allowedRoutes: string[];
    priceLamports: number;
  }
  
  export function getCachedService(apiKey: string): ServiceConfig | null;
  export function setCachedService(apiKey: string, data: ServiceConfig): void;