export function RecommendedCards() {
  const recommendedCards = [
    {
      name: "Premium Travel Card",
      benefits: "3x points on travel, no foreign transaction fees",
      annualFee: "$95",
      pointsValue: "$0.015 per point",
    },
    {
      name: "Cash Back Plus",
      benefits: "2% on all purchases, 3% on groceries",
      annualFee: "$0",
      pointsValue: "Direct cash back",
    },
    {
      name: "Business Rewards",
      benefits: "5x on office supplies, 2x on dining",
      annualFee: "$125",
      pointsValue: "$0.012 per point",
    },
  ]

  return (
    <div className="mt-4 space-y-3">
      {recommendedCards.map((card, index) => (
        <div key={index} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
          <h3 className="font-bold text-green-400">{card.name}</h3>
          <p className="text-sm">{card.benefits}</p>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>Annual Fee: {card.annualFee}</span>
            <span>Value: {card.pointsValue}</span>
          </div>
        </div>
      ))}
      <button className="w-full mt-2 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm transition-colors">
        Compare All Cards
      </button>
    </div>
  )
}
