import { NextResponse } from 'next/server';
import { getBankCardProducts } from '@/lib/db';

// Define interfaces for our data structures
interface CardProduct {
  id: string;
  name: string;
  briefDescription?: string;
}

interface BankWithCards {
  name: string;
  cards: CardProduct[];
}

export async function GET(request: Request) {
  try {
    // Get country from query params
    const url = new URL(request.url);
    const country = url.searchParams.get('country');
    
    // Get bank cards filtered by country if provided
    const allProducts = await getBankCardProducts(undefined, country || undefined);
    
    if (!allProducts || allProducts.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No bank card products found' 
        },
        { status: 404 }
      );
    }
    
    // Group products by bank
    const groupedByBank: Record<string, CardProduct[]> = allProducts.reduce((acc: Record<string, CardProduct[]>, product) => {
      const bankName = product.bankName;
      if (!acc[bankName]) {
        acc[bankName] = [];
      }
      
      acc[bankName].push({
        id: product.id,
        name: product.cardName,
        briefDescription: product.briefDescription,
      });
      
      return acc;
    }, {});
    
    // Convert to array format for the frontend
    const banksList: BankWithCards[] = Object.keys(groupedByBank).map(bankName => ({
      name: bankName,
      cards: groupedByBank[bankName]
    }));
    
    return NextResponse.json({
      success: true,
      data: banksList
    });
    
  } catch (error) {
    console.error('Error in bank cards API:', error);
    return NextResponse.json(
      { error: 'Failed to get bank cards' },
      { status: 500 }
    );
  }
} 