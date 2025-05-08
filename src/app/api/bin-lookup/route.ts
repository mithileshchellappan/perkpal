import { NextResponse } from 'next/server';
import { lookupBin } from '@/lib/services/binLookupService';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { bin } = body;

    // Validate the BIN
    if (!bin) {
      return NextResponse.json(
        { error: 'BIN is required' },
        { status: 400 }
      );
    }

    // Basic validation - BIN should be numeric and 6-8 digits
    const binRegex = /^\d{6,8}$/;
    if (!binRegex.test(bin)) {
      return NextResponse.json(
        { error: 'BIN must be 6-8 digits' },
        { status: 400 }
      );
    }

    // Lookup the BIN
    const binInfo = await lookupBin(bin);

    return NextResponse.json({
      success: true,
      data: binInfo,
    });
  } catch (error) {
    console.error('Error in BIN lookup API:', error);
    return NextResponse.json(
      { error: 'Failed to lookup BIN' },
      { status: 500 }
    );
  }
} 