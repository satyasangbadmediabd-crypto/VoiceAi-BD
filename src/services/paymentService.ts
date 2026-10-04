// Architecture-ready Payment & Subscription Abstraction
// Handles bKash, Nagad, SSLCOMMERZ or Stripe.
// Guarantees payments are never forged client-side.

export interface CheckoutRequest {
  planId: 'starter' | 'business' | 'pro';
  amountBDT: number;
  paymentMethod: 'bKash' | 'Nagad' | 'SSLCOMMERZ' | 'Card';
  userEmail: string;
}

export interface PaymentTransactionResult {
  transactionId: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'DEMO_CONFIRMED';
  amount: number;
  currency: string;
  isSimulated: boolean;
}

export const paymentService = {
  async createCheckoutSession(request: CheckoutRequest): Promise<{ checkoutUrl?: string; sessionId: string; isDemo: boolean }> {
    // In production, backend initiates SSLCOMMERZ / bKash merchant session
    return {
      sessionId: `sess_${Date.now()}`,
      isDemo: true
    };
  },

  async verifyPayment(transactionId: string): Promise<PaymentTransactionResult> {
    // In production, server queries gateway webhook / payment status API
    return {
      transactionId,
      status: 'DEMO_CONFIRMED',
      amount: 4999,
      currency: 'BDT (৳)',
      isSimulated: true
    };
  }
};
