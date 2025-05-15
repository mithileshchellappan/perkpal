import { CreditCardDashboard } from "@/components/credit-card-dashboard"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function Home() {
  const user = await currentUser()
  if (!user) {
    redirect("/sign-in")
  }
  return (
    <main className="min-h-screen bg-gray-100">
      <CreditCardDashboard />
    </main>
  )
}