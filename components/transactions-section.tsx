import { Calendar } from "lucide-react"

export function TransactionsSection() {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Transactions</h2>
        <div className="flex space-x-2">
          <button className="flex items-center space-x-2 bg-gray-700 rounded-lg px-4 py-2">
            <Calendar className="h-4 w-4" />
            <span>Calendar</span>
          </button>
          <button className="p-2 rounded-lg bg-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
          <button className="p-2 rounded-lg bg-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex space-x-2 mb-6">
        <button className="bg-gray-700 rounded-full px-6 py-2">All</button>
        <button className="text-gray-400 rounded-full px-6 py-2 hover:bg-gray-700">Revenues</button>
        <button className="text-gray-400 rounded-full px-6 py-2 hover:bg-gray-700">Expense</button>
      </div>

      <div className="text-center py-8 text-gray-500">
        <p>No transactions to display</p>
      </div>
    </div>
  )
}
