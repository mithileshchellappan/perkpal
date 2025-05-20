import { NextRequest, NextResponse } from 'next/server';
import { processStatementPDF, storeStatementAnalysis } from '@/lib/services/statementAnalysisService';
import { CardStatementAnalysisRequest, CardStatementAnalysisRequestSchema } from '@/types/cards';
import { supabase } from '@/lib/supabase';

// Use the newer route segment config format
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('statement_file') as File | null;
    
    // Check if file exists
    if (!file) {
      return NextResponse.json(
        { message: 'No statement file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { message: 'Only PDF statement files are supported' },
        { status: 400 }
      );
    }

    // Extract form data
    const userId = formData.get('userId') as string;
    const cardName = formData.get('cardName') as string; 
    const issuingBank = formData.get('issuingBank') as string;
    const country = formData.get('country') as string;
    const statementMonth = formData.get('statementMonth') as string;
    const statementYear = formData.get('statementYear') as string;

    // Validate form data
    const requestData: CardStatementAnalysisRequest = {
      userId,
      cardName,
      issuingBank,
      country,
      statementMonth,
      statementYear,
    };

    const validationResult = CardStatementAnalysisRequestSchema.safeParse(requestData);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          message: 'Invalid request data',
          errors: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }

    // Read the file as buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const analysis = await processStatementPDF(
      buffer,
      userId,
      cardName,
      issuingBank,
      country,
      statementMonth,
      statementYear
    );

    // Store the analysis
    const savedAnalysis = await storeStatementAnalysis(analysis);

    return NextResponse.json(savedAnalysis);

  } catch (error: any) {
    console.error('[API /statement-analysis POST] Error:', error);
    
    let errorMessage = 'An unexpected error occurred.';
    if (error.message) {
      errorMessage = error.message;
    }
    
    if (error.message && error.message.includes('Failed to extract text from PDF')) {
      return NextResponse.json({ message: `Error processing PDF: ${errorMessage}` }, { status: 422 });
    }
    
    if (error.message && error.message.includes('Failed to analyze card statement')) {
      return NextResponse.json({ message: `Error analyzing statement: ${errorMessage}` }, { status: 502 });
    }
    
    return NextResponse.json({ message: `Server error: ${errorMessage}` }, { status: 500 });
  }
}

// GET endpoint to retrieve statement analyses for a user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { message: 'userId is required' },
        { status: 400 }
      );
    }
    
    // Query the database for statement analyses
    const { data: analyses, error } = await supabase
      .from('statement_analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching statement analyses:', error);
      return NextResponse.json(
        { message: 'Failed to fetch statement analyses' },
        { status: 500 }
      );
    }
    
    // Process the analyses to convert them to the expected format
    const formattedAnalyses = analyses.map(analysis => ({
      userId: analysis.user_id,
      cardName: analysis.card_name,
      issuingBank: analysis.issuing_bank,
      country: analysis.country,
      statementPeriod: analysis.statement_period,
      totalPointsEarned: analysis.total_points_earned,
      totalPotentialPoints: analysis.total_potential_points,
      pointsMissedPercentage: analysis.points_missed_percentage,
      pointsBalance: analysis.points_balance,
      categories: JSON.parse(analysis.categories || '[]'),
      createdAt: analysis.created_at
    }));
    
    return NextResponse.json({
      success: true,
      userId,
      analyses: formattedAnalyses
    });
    
  } catch (error: any) {
    console.error('[API /statement-analysis GET] Error:', error);
    
    let errorMessage = 'An unexpected error occurred.';
    if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json({ message: `Server error: ${errorMessage}` }, { status: 500 });
  }
} 