interface BinLookupResult {
  bank: string
  country: string
  network: "visa" | "mastercard" | "amex" | "discover" | "other"
  cardTypes: string[]
}


export async function lookupBin(bin: string): Promise<BinLookupResult | null> {
  const response = await fetch('/api/bin-lookup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ bin }),
  })
  const data = await response.json()
  if(data.success) {
    const cardTypes = await getCardTypes(data.data.bank.name, data.data.country.name)
    const returnObj = {
      bank: data.data.bank.name,
      country: data.data.country.name,
      network: data.data.card.scheme,
      cardTypes: cardTypes.map((card: any) => card.card_name)
    }
    
    return returnObj
  }

  return null
}

export async function getCardTypes(bankName: string, country: string) {
  const response = await fetch('/api/card-suggestions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ bankName, country }),
  })
  const data = await response.json()
  if(data.success) {
    return data.data.suggested_cards
  }
  return []
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
