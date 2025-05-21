import { CoreMessage, streamText } from 'ai'
import { perplexity } from '@ai-sdk/perplexity'

export async function POST(req: Request) {
    try {
        const { messages, system }: { messages: CoreMessage[], system: string } = await req.json()
        const result = streamText({
            model: perplexity('sonar-pro'),
            system,
            messages,
        })
        return result.toDataStreamResponse({
            getErrorMessage: (error) => {
                console.log("Error in chat route:", error)
                return "An error occurred while processing your request. Please try again later."
            },
            sendReasoning: true,
            sendSources: true,
        })
    } catch (error) {
        console.error('Error in chat route:', error)
        return new Response('Internal Server Error', { status: 500 })
    }
}