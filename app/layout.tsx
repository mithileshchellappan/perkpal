import "@/styles/globals.css"
import { Inter } from "next/font/google"
import type React from "react"
import { ClerkProvider } from "@clerk/nextjs"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <title>PerkPal - Credit Card Rewards Manager</title>
          <meta name="description" content="Manage and optimize your credit card rewards with PerkPal" />
        </head>
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  )
}