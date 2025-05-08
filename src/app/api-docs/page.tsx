import Link from 'next/link';

export default function ApiDocs() {
  return (
    <main className="flex min-h-screen flex-col p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          &larr; Back to Home
        </Link>
        <h1 className="text-3xl font-bold">PerkPal API Documentation</h1>
        <p className="text-gray-600 mt-2">
          This documentation outlines the API endpoints available for integrating with the PerkPal credit card rewards optimizer.
        </p>
      </div>

      <div className="space-y-12">
        {/* BIN Lookup */}
        <section id="bin-lookup" className="border-b pb-8">
          <h2 className="text-2xl font-semibold mb-4">BIN Lookup</h2>
          <p className="mb-4">
            This endpoint allows you to look up a credit card's Bank Identification Number (BIN)
            to determine the issuing bank and card network.
          </p>

          <div className="bg-gray-100 p-4 rounded-md mb-4">
            <h3 className="font-mono text-blue-700 mb-2">POST /api/bin-lookup</h3>
            <p className="mb-2"><strong>Request Body:</strong></p>
            <pre className="bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
              {`{
  "bin": "411111"  // First 6-8 digits of the credit card
}`}
            </pre>
            
            <p className="mt-4 mb-2"><strong>Response:</strong></p>
            <pre className="bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
              {`{
  "success": true,
  "data": {
    "bin": "411111",
    "bank": {
      "name": "JPMORGAN CHASE BANK, N.A.",
      "url": "https://www.chase.com",
      "phone": "1-800-432-3117",
      "city": "Columbus, OH"
    },
    "card": {
      "type": "credit",
      "category": "Visa Signature",
      "scheme": "visa",
      "brand": "Traditional"
    },
    "country": {
      "name": "United States",
      "alpha2": "US",
      "numeric": "840",
      "currency": "USD"
    }
  }
}`}
            </pre>
          </div>
        </section>

        {/* Card Suggestions */}
        <section id="card-suggestions" className="border-b pb-8">
          <h2 className="text-2xl font-semibold mb-4">Card Suggestions</h2>
          <p className="mb-4">
            This endpoint retrieves a list of card products offered by a specified bank, 
            leveraging the Perplexity API to gather up-to-date information.
          </p>

          <div className="bg-gray-100 p-4 rounded-md mb-4">
            <h3 className="font-mono text-blue-700 mb-2">POST /api/card-suggestions</h3>
            <p className="mb-2"><strong>Request Body:</strong></p>
            <pre className="bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
              {`{
  "bankName": "American Express"
}`}
            </pre>
            
            <p className="mt-4 mb-2"><strong>Response:</strong></p>
            <pre className="bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
              {`{
  "success": true,
  "data": {
    "issuing_bank": "American Express",
    "suggested_cards": [
      {
        "card_name": "American Express® Gold Card",
        "brief_description": "Rewards on dining worldwide & U.S. supermarkets."
      },
      {
        "card_name": "The Platinum Card® from American Express",
        "brief_description": "Premium travel benefits, lounge access, and statement credits."
      },
      {
        "card_name": "Blue Cash Everyday® Card from American Express",
        "brief_description": "Cash back on U.S. gas stations, U.S. supermarkets, U.S. online retail."
      }
      // ... more cards
    ]
  }
}`}
            </pre>
          </div>
        </section>

        {/* Card Analysis */}
        <section id="card-analysis" className="border-b pb-8">
          <h2 className="text-2xl font-semibold mb-4">Card Analysis</h2>
          <p className="mb-4">
            This endpoint provides comprehensive details about a specific credit card,
            including its rewards structure, redemption options, transfer partners, and strategic insights.
          </p>

          <div className="bg-gray-100 p-4 rounded-md mb-4">
            <h3 className="font-mono text-blue-700 mb-2">POST /api/card-analysis</h3>
            <p className="mb-2"><strong>Request Body:</strong></p>
            <pre className="bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
              {`{
  "cardName": "Chase Sapphire Preferred",
  "issuingBank": "JPMORGAN CHASE BANK, N.A."
}`}
            </pre>
            
            <p className="mt-4 mb-2"><strong>Response:</strong></p>
            <pre className="bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
              {`{
  "success": true,
  "data": {
    "card_name": "Chase Sapphire Preferred® Card",
    "issuing_bank": "JPMORGAN CHASE BANK, N.A.",
    "earning_rewards": [
      {
        "category": "Dining",
        "multiplier_description": "3x points",
        "notes": "Includes takeout and eligible delivery services."
      },
      // ... more categories
    ],
    "redemption_options": [
      {
        "type": "Travel via Chase Ultimate Rewards®",
        "value_per_point_cents": 1.25,
        "value_description": "Points are worth 25% more when redeemed for travel."
      },
      // ... more redemption options
    ],
    "transfer_partners": [
      {
        "partner_name": "World of Hyatt",
        "partner_type": "Hotel",
        "transfer_ratio": "1:1",
        "notes": "Generally considered a high-value transfer partner."
      },
      // ... more transfer partners
    ],
    "strategic_insights": [
      {
        "strategy_title": "Hyatt Hotel Stays",
        "description": "Transferring points to World of Hyatt often yields exceptional value, especially for luxury properties.",
        "value_proposition": "Can achieve point values of 1.5-3+ cents per point."
      },
      // ... more insights
    ],
    "information_sources": [
      "https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred",
      // ... more sources
    ]
  }
}`}
            </pre>
          </div>
        </section>

        {/* Promotions */}
        <section id="promotions">
          <h2 className="text-2xl font-semibold mb-4">Promotions</h2>
          <p className="mb-4">
            This endpoint retrieves current promotions, transfer bonuses, and limited-time offers
            for a specific credit card or its rewards ecosystem.
          </p>

          <div className="bg-gray-100 p-4 rounded-md mb-4">
            <h3 className="font-mono text-blue-700 mb-2">POST /api/promotions</h3>
            <p className="mb-2"><strong>Request Body:</strong></p>
            <pre className="bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
              {`{
  "cardName": "Chase Sapphire Preferred",
  "rewardsProgram": "Chase Ultimate Rewards"  // Optional
}`}
            </pre>
            
            <p className="mt-4 mb-2"><strong>Response:</strong></p>
            <pre className="bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
              {`{
  "success": true,
  "data": {
    "card_context": "Chase Sapphire Preferred® Card / Chase Ultimate Rewards points",
    "promotions": [
      {
        "promotion_title": "25% Transfer Bonus to Flying Blue (Air France/KLM)",
        "description": "Receive a 25% bonus when transferring Chase Ultimate Rewards points to Flying Blue.",
        "partner_involved": "Flying Blue (Air France/KLM)",
        "offer_type": "Transfer Bonus",
        "valid_until": "2024-05-31",
        "source_url": "https://onemileatatime.com/deals/chase-flying-blue-transfer-bonus/"
      },
      // ... more promotions
    ]
  }
}`}
            </pre>
          </div>
        </section>
      </div>

      <footer className="mt-16 text-sm text-gray-500 text-center">
        <p>PerkPal API Documentation • Created for the Perplexity Hackathon 2024</p>
      </footer>
    </main>
  );
} 