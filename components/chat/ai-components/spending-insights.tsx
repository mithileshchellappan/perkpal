export function SpendingInsights() {
  const monthlySpending = [
    { month: "Jan", amount: 1250 },
    { month: "Feb", amount: 1450 },
    { month: "Mar", amount: 1100 },
    { month: "Apr", amount: 1800 },
    { month: "May", amount: 1600 },
    { month: "Jun", amount: 1350 },
  ]

  const maxAmount = Math.max(...monthlySpending.map((item) => item.amount))

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-3">Monthly Spending Trend</h3>

      <div className="flex items-end h-32 space-x-2 mb-2">
        {monthlySpending.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className="w-full bg-green-500 rounded-t-sm"
              style={{ height: `${(item.amount / maxAmount) * 100}%` }}
            ></div>
            <span className="text-xs mt-1">{item.month}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
          <h4 className="font-semibold text-green-400">Top Spending Categories</h4>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Dining</span>
              <span>$580</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Travel</span>
              <span>$450</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shopping</span>
              <span>$320</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
          <h4 className="font-semibold text-yellow-400">Alert</h4>
          <p className="text-sm mt-1">Your spending is 15% higher than last month. Consider reviewing your budget.</p>
        </div>
      </div>
    </div>
  )
}
