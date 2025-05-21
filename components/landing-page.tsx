"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CreditCard, Gift, BarChart, Bot, FileText, Zap, Shield, TrendingUp } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface LandingPageProps {
  onLogin: () => void
}

export function LandingPage({ onLogin }: LandingPageProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = () => {
    setIsLoading(true)
    // Redirect to the Clerk sign-in page
    router.push('/sign-in')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <CreditCard className="h-8 w-8" />
          <span className="text-2xl font-bold">PerkPal</span>
        </div>
        <Button onClick={handleLogin} disabled={isLoading} className="rounded-lg">
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">Maximize Your Credit Card Rewards</h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
          PerkPal helps you track, optimize, and redeem your credit card points and perks, all in one place.
        </p>
        <Button size="lg" onClick={handleLogin} disabled={isLoading} className="text-lg px-8 py-6 rounded-lg">
          {isLoading ? "Logging in..." : "Get Started"}
        </Button>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">Everything You Need to Maximize Value</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<CreditCard className="h-10 w-10" />}
            title="Card Management"
            description="Track all your credit cards in one place with real-time updates on points, cash value, and annual fees."
          />
          <FeatureCard
            icon={<Gift className="h-10 w-10" />}
            title="Rewards Tracking"
            description="Visualize your rewards across spending categories and track your progress toward bonus thresholds."
          />
          <FeatureCard
            icon={<FileText className="h-10 w-10" />}
            title="Statement Analysis"
            description="Upload your statements and let our AI analyze your spending patterns to maximize point earnings."
          />
          <FeatureCard
            icon={<BarChart className="h-10 w-10" />}
            title="Card Comparison"
            description="Compare benefits, rewards, and fees across multiple cards to find the perfect combination."
          />
          <FeatureCard
            icon={<Bot className="h-10 w-10" />}
            title="Assistant"
            description="Get personalized recommendations and answers to your credit card questions from our AI assistant."
          />
          <FeatureCard
            icon={<TrendingUp className="h-10 w-10" />}
            title="New Card Recommendations"
            description="Discover new cards that complement your existing portfolio based on your spending habits."
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20 bg-gray-900 rounded-3xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">How PerkPal Works</h2>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-bold mb-4">Add Your Cards</h3>
            <p className="text-gray-300">
              Securely add your credit cards to PerkPal and we'll automatically track your points and rewards.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-bold mb-4">Upload Statements</h3>
            <p className="text-gray-300">
              Upload your monthly statements and our AI will analyze your spending to maximize your rewards.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-bold mb-4">Optimize & Save</h3>
            <p className="text-gray-300">
              Get personalized recommendations on which cards to use for different purchases to maximize value.
            </p>
          </div>
        </div>
      </section>

      {/* Powered by Perplexity */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-10">
          <h2 className="text-3xl font-bold mb-6">Powered by Perplexity</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            PerkPal leverages Perplexity's advanced AI to analyze your spending patterns, provide personalized
            recommendations, and help you maximize the value of your credit cards.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Zap className="h-6 w-6 text-purple-400" />
            <span className="text-lg font-medium text-purple-400">AI-Powered Insights</span>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <CreditCard className="h-6 w-6" />
              <span className="text-xl font-bold">PerkPal</span>
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                About
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Features
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500">
            <p>© {new Date().getFullYear()} PerkPal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="p-6 bg-gray-800 border-none rounded-lg">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </Card>
  )
}
