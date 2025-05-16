import { CardStatementAnalysisResponse, CardStatementCategory } from '@/types/cards';
import { perplexity } from '@ai-sdk/perplexity';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { CardStatementAnalysisResponseSchema } from '@/types/cards';

/**
 * Analyze a credit card statement using Perplexity AI
 * @param userId User ID
 * @param cardName Card name
 * @param issuingBank Issuing bank
 * @param country Country
 * @param pdfBuffer PDF file as buffer
 * @param statementMonth Statement month
 * @param statementYear Statement year
 * @returns Analyzed statement data
 */
export async function analyzeCardStatement(
  userId: string,
  cardName: string,
  issuingBank: string,
  country: string,
  pdfBuffer: Buffer,
  statementMonth: string,
  statementYear: string
): Promise<CardStatementAnalysisResponse> {
  // For now, we're using a simplified approach while PDF support in AI SDK evolves
  // We're assuming the PDF content can be analyzed with the text-based approach
  
  const systemPrompt = `You are an AI financial analyst specializing in credit card rewards optimization. 
  Your task is to analyze credit card statements and extract transaction information to calculate reward 
  points earned and identify opportunities where more points could have been earned.`;

  // Format the month and year for display
  const date = new Date(`${statementYear}-${statementMonth}-01`);
  const statementPeriod = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const userPrompt = `
    Analyze the credit card statement for '${cardName}' from '${issuingBank}' in ${country} 
    for the statement period ${statementPeriod}.

    Based on the statement data, analyze transactions and identify spending categories (dining, travel, shopping, groceries, fuel, entertainment, utilities, other).
    For each category:
    1. Calculate points earned
    2. Estimate potential points that could have been earned with optimal card usage
    3. Count the number of transactions
    4. Calculate total spend
    5. Provide optimization tips

    Also calculate overall metrics:
    - Total points earned across all categories
    - Total potential points across all categories
    - Percentage of potential points missed

    If you can't determine exact values from the statement, make reasonable estimates based on typical reward structures.
    For currency, use the appropriate currency for ${country}.
  `;

  try {
    // Note: In a production environment, you would use proper PDF extraction and parsing
    // This is a simplified implementation
    
    const { object } = await generateObject({
      model: openai('gpt-4o'),
      system: systemPrompt,
      schema: CardStatementAnalysisResponseSchema,
      messages: [
        {
            role: 'user',
            content: userPrompt
        },
        {
          role: 'user',
          content: [
            {
              type: 'file',
              data: pdfBuffer,
              mimeType: 'application/pdf',
            }
          ]
        }
      ],
      providerOptions: {
        perplexity: {
          thinking: { type: "enabled" },
          search_after_date_filter: "1/1/2025",
          web_search_options: {
            country: country
          }
        }
      }
    });
    
    return {
      ...object,
      userId,
      cardName,
      issuingBank,
      country,
      statementPeriod,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as CardStatementAnalysisResponse;
  } catch (error) {
    console.error('Error analyzing card statement with Perplexity:', error);
    throw new Error(`Failed to analyze card statement: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Process a statement PDF file and analyze rewards
 * @param pdfBuffer PDF file as buffer
 * @param userId User ID
 * @param cardName Card name
 * @param issuingBank Issuing bank
 * @param country Country
 * @param statementMonth Statement month
 * @param statementYear Statement year
 * @returns Analyzed statement data
 */
export async function processStatementPDF(
  pdfBuffer: Buffer,
  userId: string,
  cardName: string,
  issuingBank: string,
  country: string,
  statementMonth: string,
  statementYear: string
): Promise<CardStatementAnalysisResponse> {
  // Analyze the PDF
  const analysis = await analyzeCardStatement(
    userId,
    cardName,
    issuingBank,
    country,
    pdfBuffer,
    statementMonth,
    statementYear
  );
  
  return analysis;
}

/**
 * Store statement analysis in the database
 * @param analysis Statement analysis data
 * @returns Stored statement analysis data
 */
export async function storeStatementAnalysis(
  analysis: CardStatementAnalysisResponse
): Promise<CardStatementAnalysisResponse> {
  try {
    // In a real implementation, you would store this in your database
    // For demonstration purposes, we'll just return the analysis
    
    // Example database storage code:
    // const db = getDatabase();
    // await db.collection('statementanalysis').insertOne(analysis);
    
    return analysis;
  } catch (error) {
    console.error('Error storing statement analysis:', error);
    throw new Error('Failed to store statement analysis');
  }
} 