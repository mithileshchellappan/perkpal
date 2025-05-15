import { ArrowRight } from "lucide-react"

interface InventoryDetailsProps {
  totalValue: number
  cardCount: number
}

export function InventoryDetails({ totalValue, cardCount }: InventoryDetailsProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Inventory Details</h2>
        <div className="flex space-x-2">
          <button className="p-2 rounded-full bg-gray-700">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>
          <button className="p-2 rounded-full bg-gray-700">
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
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex rounded-lg overflow-hidden">
        <div className="bg-white text-gray-900 p-6 flex-1">
          <p className="text-sm mb-2">Your balance:</p>
          <h3 className="text-3xl font-bold mb-2">${totalValue.toLocaleString()}</h3>
          <p className="text-sm text-gray-600">{cardCount} CARD</p>
        </div>
        <div className="bg-green-400 flex-1 flex items-end justify-end p-4">
          <button className="bg-white text-gray-900 rounded-lg px-4 py-2 flex items-center">
            <span className="mr-2">Details</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
