"use client"
import react from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
  
  const queryClient = new QueryClient()

const TanstackQuery = ({children}:{children: React.ReactNode}) => {
  return (
  <QueryClientProvider client={queryClient}>
     {children}
  </QueryClientProvider>
  )
}

export default TanstackQuery
