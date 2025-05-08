import Link from 'next/link';

export default function Dashboard() {
  return (
    <main className="flex min-h-screen flex-col p-8">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            &larr; Back to Home
          </Link>
          <h1 className="text-3xl font-bold">PerkPal Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your credit cards and maximize your rewards.
          </p>
        </div>

        {/* Card Input Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Add Your Card</h2>
          <p className="mb-4">Enter the first 6-8 digits of your credit card (BIN) to get started.</p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              className="border rounded-md px-4 py-2 w-full sm:w-64" 
              placeholder="e.g., 411111"
              maxLength={8}
            />
            <button className="btn btn-primary">
              Look Up Card
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mt-2">
            We only need the first 6-8 digits to identify your card. Do not enter your full card number.
          </p>
        </div>

        {/* Cards Dashboard - Placeholder */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example Card */}
            <div className="card">
              <div className="flex justify-between mb-3">
                <h3 className="font-bold">Chase Sapphire Preferred</h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">VISA</span>
              </div>
              <div className="mb-3">
                <span className="text-sm text-gray-500">Current Points:</span>
                <span className="ml-2 font-semibold">45,000 UR</span>
              </div>
              <div className="mb-3">
                <span className="text-sm text-gray-500">Best Categories:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">3x Dining</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">3x Online Groceries</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">5x Travel (via Portal)</span>
                </div>
              </div>
              <button className="text-sm text-blue-600 hover:underline">View Details</button>
            </div>

            {/* Empty Card Slot */}
            <div className="card flex items-center justify-center h-48 border-2 border-dashed border-gray-300">
              <div className="text-center">
                <p className="text-gray-500 mb-2">Add another card</p>
                <button className="btn btn-secondary text-sm">+ Add Card</button>
              </div>
            </div>
          </div>
        </div>

        {/* Spend Optimizer - Placeholder */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Spend Optimizer</h2>
          <p className="mb-4">Simulate a transaction to see which card would earn you the most rewards.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Merchant Category
              </label>
              <select className="border rounded-md px-4 py-2 w-full">
                <option>Restaurant / Dining</option>
                <option>Groceries</option>
                <option>Gas Station</option>
                <option>Travel</option>
                <option>Online Shopping</option>
                <option>Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input 
                  type="text" 
                  className="border rounded-md pl-7 px-4 py-2 w-full" 
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
          
          <button className="btn btn-primary mt-4">
            Find Best Card
          </button>
        </div>

        {/* Current Promotions - Placeholder */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Current Promotions</h2>
          <p className="text-gray-500 italic">
            Add cards to your wallet to see relevant promotions and transfer bonuses.
          </p>
        </div>
      </div>
    </main>
  );
} 