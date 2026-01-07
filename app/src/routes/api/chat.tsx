import { createFileRoute } from '@tanstack/react-router'
import { chat, toServerSentEventsResponse } from '@tanstack/ai'
import { createOllamaChat } from '@tanstack/ai-ollama'
import 'dotenv/config'

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        console.log('process', process)
        // Check for API key
        const ollamaServerUrl = process.env.OLLAMA_HOST
        console.log('ollamaServerUrl', ollamaServerUrl)
        if (!ollamaServerUrl) {
          return new Response(
            JSON.stringify({
              error: 'OLLAMA_SERVER not configured',
            }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            },
          )
        }

        const adapter = createOllamaChat('llama3', ollamaServerUrl)

        const { messages, conversationId } = await request.json()

        try {
          // Create a streaming chat response
          const stream = chat({
            adapter: adapter,
            messages,
            conversationId,
          })

          // Convert stream to HTTP response
          return toServerSentEventsResponse(stream)
        } catch (error) {
          return new Response(
            JSON.stringify({
              error:
                error instanceof Error ? error.message : 'An error occurred',
            }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            },
          )
        }
      },
    },
  },
})
