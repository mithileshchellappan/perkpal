import { NextResponse, NextRequest } from 'next/server';
import { getBankCardProducts } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface CardProduct {
  id: string;
  name: string;
  briefDescription?: string;
}

interface BankWithCards {
  name: string;
  cards: CardProduct[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const country = searchParams.get('country');
    
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