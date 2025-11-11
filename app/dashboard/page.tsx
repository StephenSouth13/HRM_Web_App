"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")

    if (!userRole) {
      router.push("/auth/login")
    } else {
      const roleMap: Record<string, string> = {
        bod: "/dashboard/bod",
        leader: "/dashboard/leader",
        employee: "/dashboard/employee",
      }
      router.push(roleMap[userRole] || "/auth/login")
    }

    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return <div className="min-h-screen bg-background" />
  }

  return null
}
