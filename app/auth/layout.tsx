import type React from "react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-primary via-background to-background flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  )
}
