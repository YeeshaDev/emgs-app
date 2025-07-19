import api from "@/lib/store/api"
import { useQuery } from "@tanstack/react-query"

// Types
export interface FAQ {
  _id: string
  question: string
  answer: string
  category?: string
}

// API functions
export const fetchFAQs = async (): Promise<FAQ[]> => {
  const response = await api.get("/faqs")
  return response.data.data
}

export const useFAQs = () => {
  return useQuery({
    queryKey: ["faqs"],
    queryFn: fetchFAQs,
  })
}

