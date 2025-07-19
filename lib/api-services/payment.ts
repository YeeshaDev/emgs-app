import api from "@/lib/store/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// Types
export interface PaymentInitiationRequest {
  itemId: string
  itemType: string
  callbackUrl: string
}

export interface PaymentInitiationResponse {
  authorization_url: string
  access_code: string
  reference: string
}

export interface PaymentVerificationResponse {
  status: boolean
  message: string
  detail: string
  data: {
    verified: boolean
    amount: number
    currency: string
    reference: string
    status: string
    paidAt: string
    metadata: {
      id: string
      itemId: string
      itemType: string
    }
  }
}

// API functions
// Update the initiatePayment function to use a simple string for callbackUrl
export const initiatePayment = async (params: {
  itemId: string
  itemType: string
  callbackUrl: string
}): Promise<PaymentInitiationResponse> => {
  const response = await api.post("/payment/initiate", params)
  return response.data.data
}

// Update the verifyPayment function to accept all Paystack parameters
export const verifyPayment = async (paymentParams: Record<string, string>): Promise<PaymentVerificationResponse> => {
  const response = await api.post("/payment/verify", paymentParams)
  return response.data
}

// Update the useVerifyPayment hook (no changes needed to the implementation)
export const useInitiatePayment = () => {
  return useMutation({
    mutationFn: initiatePayment,
  })
}

export const useVerifyPayment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: verifyPayment,
    onSuccess: () => {
      // Invalidate courses query to refresh enrolled status
      queryClient.invalidateQueries({ queryKey: ["courses"] })
    },
  })
}
