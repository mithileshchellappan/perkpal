import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6">PerkPal: Credit Card Rewards Optimizer</h1>
      
      <div className="max-w-xl text-center mb-8">
        <p className="mb-4">
          PerkPal helps you maximize your credit card rewards by analyzing your cards
          and suggesting the best ways to earn and redeem points.
        </p>
        <p>
          Powered by BIN lookup and Perplexity AI, we provide detailed insights into
          your cards' earning potential, redemption options, and strategic use.
        </p>
        </div>
      
      <div className="flex flex-wrap gap-4 justify-center">
        <Link 
          href="/dashboard" 
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          Get Started
        </Link>
        <Link 
          href="/api-docs" 
          className="px-5 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
        >
          API Documentation
        </Link>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">BIN Lookup</h2>
          <p>Enter your card's first 6-8 digits to automatically identify your bank and card type.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Card Analysis</h2>
          <p>Get comprehensive insights about your card's rewards structure, redemption options, and transfer partners.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Current Promotions</h2>
          <p>Stay updated with the latest promotions and offers to maximize your points value.</p>
        </div>
      </div>
      
      <footer className="mt-16 text-sm text-gray-500">
        <p>Created for the Perplexity Hackathon 2024 • <a href="https://github.com/yourusername/perkpal" className="underline">GitHub</a></p>
      </footer>
    </main>
  );
}
