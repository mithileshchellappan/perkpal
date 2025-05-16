import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to generate a consistent color from a string (card name)
export function generateColorFromString(str: string): string {
  // Simple hash function for strings
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  // Convert hash to an HSL color with controlled saturation and lightness for a darker aesthetic
  // We use HSL to ensure visually pleasing colors with appropriate darkness
  const h = Math.abs(hash % 360) // 0-359 degrees on color wheel
  const s = 65 + (hash % 15) // 65-79% saturation - rich but not overpowering
  const l = 18 + (hash % 10) // 18-27% lightness - dark but not too dark for white text

  return `hsl(${h}, ${s}%, ${l}%)`
}

// Function to adjust a color for gradients
export function adjustColor(color: string, amount: number): string {
  if (color.startsWith("hsl")) {
    // For HSL colors, extract components and adjust lightness
    const matches = color.match(/hsl$$(\d+),\s*(\d+)%,\s*(\d+)%$$/)
    if (matches) {
      const h = Number.parseInt(matches[1])
      const s = Number.parseInt(matches[2])
      const l = Math.min(40, Math.max(10, Number.parseInt(matches[3]) + amount))

      // Slightly shift the hue for more interesting gradients
      const newH = (h + amount * 5) % 360
      return `hsl(${newH}, ${s}%, ${l}%)`
    }
  }

  // For hex colors, convert to RGB and adjust
  if (color.startsWith("#")) {
    return color.replace(/^#/, "").replace(/.{1,2}/g, (c) => {
      const hex = Math.min(255, Math.max(0, Number.parseInt(c, 16) + amount)).toString(16)
      return hex.padStart(2, "0")
    })
  }

  return color // Return original if format not recognized
}
