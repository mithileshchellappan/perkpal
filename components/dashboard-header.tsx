import { Bell, Search, Wallet } from "lucide-react"

export function DashboardHeader() {
  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="text-gray-400">Welcome</p>
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-800 rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>

        <button className="p-2 rounded-full bg-gray-800">
          <Bell className="h-5 w-5" />
        </button>

        <button className="flex items-center space-x-2 bg-gray-800 rounded-full px-4 py-2">
          <Wallet className="h-5 w-5" />
          <span>Wallet</span>
        </button>
      </div>
    </div>
  )
}
