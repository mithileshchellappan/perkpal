interface BinLookupResult {
  bank: string
  country: string
  network: "visa" | "mastercard" | "amex" | "discover" | "other"
  cardTypes: string[]
}

// Sample BIN database for demonstration
const binDatabase: Record<string, BinLookupResult> = {
  // Visa cards
  "40123456": {
    bank: "Chase Bank",
    country: "United States",
    network: "visa",
    cardTypes: ["Chase Sapphire Preferred", "Chase Freedom Unlimited", "Chase Sapphire Reserve"],
  },
  "41234567": {
    bank: "Bank of America",
    country: "United States",
    network: "visa",
    cardTypes: ["Bank of America Premium Rewards", "Bank of America Travel Rewards", "Bank of America Cash Rewards"],
  },
  "42345678": {
    bank: "Wells Fargo",
    country: "United States",
    network: "visa",
    cardTypes: ["Wells Fargo Active Cash", "Wells Fargo Autograph", "Wells Fargo Reflect"],
  },

  // Mastercard
  "51234567": {
    bank: "Citi",
    country: "United States",
    network: "mastercard",
    cardTypes: ["Citi Premier", "Citi Custom Cash", "Citi Double Cash"],
  },
  "52345678": {
    bank: "Capital One",
    country: "United States",
    network: "mastercard",
    cardTypes: ["Capital One Venture X", "Capital One Venture", "Capital One Quicksilver"],
  },
  "53456789": {
    bank: "Barclays",
    country: "United Kingdom",
    network: "mastercard",
    cardTypes: ["Barclaycard Arrival Plus", "Barclays View", "Barclays Aviator Red"],
  },

  // American Express
  "34567890": {
    bank: "American Express",
    country: "United States",
    network: "amex",
    cardTypes: ["Amex Gold Card", "Amex Platinum Card", "Amex Green Card", "Amex Blue Cash Preferred"],
  },
  "37654321": {
    bank: "American Express",
    country: "United Kingdom",
    network: "amex",
    cardTypes: ["Amex British Airways", "Amex Preferred Rewards Gold", "Amex Platinum Cashback"],
  },

  // Discover
  "60123456": {
    bank: "Discover",
    country: "United States",
    network: "discover",
    cardTypes: ["Discover it Cash Back", "Discover it Miles", "Discover it Student"],
  },
}

export async function lookupBin(bin: string): Promise<BinLookupResult | null> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Find the matching BIN
  const matchedBin = Object.keys(binDatabase).find((key) => bin.startsWith(key))

  if (matchedBin) {
    return binDatabase[matchedBin]
  }

  return null
}

// Get network-based gradient colors
export function getNetworkGradient(network: string, uniqueSeed: string): { primary: string; secondary: string } {
  // Base colors for each network
  const baseColors = {
    visa: { primary: "#1a1f71", secondary: "#436dc4" }, // Blue
    mastercard: { primary: "#eb001b", secondary: "#f79e1b" }, // Red-Orange
    amex: { primary: "#006fcf", secondary: "#00abeb" }, // Blue-Teal
    discover: { primary: "#ff6000", secondary: "#d35213" }, // Orange
    other: { primary: "#333333", secondary: "#777777" }, // Gray
  }

  // Get base color for the network
  const baseColor = baseColors[network as keyof typeof baseColors] || baseColors.other

  // Generate a unique variation based on the seed (card name or other unique identifier)
  const hash = Array.from(uniqueSeed).reduce((acc, char) => acc + char.charCodeAt(0), 0)

  // Adjust the colors slightly to make each card unique but still recognizable as the network
  const adjustColor = (color: string, adjustment: number): string => {
    const hex = color.replace("#", "")
    const r = Math.min(255, Math.max(0, Number.parseInt(hex.substring(0, 2), 16) + (adjustment % 30) - 15))
    const g = Math.min(255, Math.max(0, Number.parseInt(hex.substring(2, 4), 16) + ((adjustment + 7) % 30) - 15))
    const b = Math.min(255, Math.max(0, Number.parseInt(hex.substring(4, 6), 16) + ((adjustment + 13) % 30) - 15))

    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
  }

  return {
    primary: adjustColor(baseColor.primary, hash),
    secondary: adjustColor(baseColor.secondary, hash + 10),
  }
}
