import { CreditCardType } from "./types"

export const addCardToDB = async (cardData: CreditCardType) => {
    console.log("cardData", cardData)
    const data = {
        bin: cardData.number,
        cardProductName: cardData.name,
        bank: cardData.issuer,
        network: cardData.network,
        country: cardData.country,
        pointsBalance: cardData.pointsBalance,
        cashValue: cardData.cashValue,
    }
  const response = await fetch('/api/user-cards', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  return response.json()
}

export const getUserCards = async () => {
    const response = await fetch('/api/user-cards')
    return response.json()
}