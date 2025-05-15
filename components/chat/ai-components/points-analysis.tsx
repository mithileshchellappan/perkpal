export function PointsAnalysis() {
  const pointsData = [
    { category: "Travel", value: 45000, percentage: 40 },
    { category: "Dining", value: 28000, percentage: 25 },
    { category: "Shopping", value: 22500, percentage: 20 },
    { category: "Other", value: 16875, percentage: 15 },
  ]

  const totalPoints = pointsData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">Total Points: {totalPoints.toLocaleString()}</h3>
        <span className="text-sm text-green-400">Est. Value: ${(totalPoints * 0.012).toLocaleString()}</span>
      </div>

      <div className="space-y-3">
        {pointsData.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span>{item.category}</span>
              <span>{item.value.toLocaleString()} pts</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-gray-800 rounded-lg p-3 border border-gray-700">
        <h4 className="font-semibold text-green-400 mb-1">Recommendation</h4>
        <p className="text-sm">Consider transferring your Shopping points to Travel for a 20% bonus this month.</p>
      </div>
    </div>
  )
}
