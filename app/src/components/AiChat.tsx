// components/Chat.tsx
import { useState } from 'react'
import { useChat, fetchServerSentEvents } from '@tanstack/ai-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircleIcon } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

export function AiChat() {
  const [input, setInput] = useState('')

  const { messages, sendMessage, isLoading, error } = useChat({
    connection: fetchServerSentEvents('/api/chat'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      sendMessage(input)
      setInput('')
    }
  }

  return (
    <div className="flex flex-col h-[400px]">
      <h2 className="text-2xl font-bold text-gray-900 sm:truncate sm:text-2xl sm:tracking-tight">
        Chat with me
      </h2>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.role === 'assistant' ? 'text-blue-600' : 'text-gray-800'
            }`}
          >
            <div className="font-semibold mb-1">
              {message.role === 'assistant' ? 'Assistant' : 'You'}
            </div>
            <div>
              {message.parts.map((part, idx) => {
                if (part.type === 'thinking') {
                  return (
                    <div
                      key={idx}
                      className="text-sm text-gray-500 italic mb-2"
                    >
                      💭 Thinking: {part.content}
                    </div>
                  )
                }
                if (part.type === 'text') {
                  return (
                    <div
                      key={idx}
                      className="prose prose-sm dark:prose-invert max-w-none"
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                      >
                        {part.content}
                      </ReactMarkdown>
                    </div>
                  )
                }
                return null
              })}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>An error occurred!</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
            isLoading={isLoading}
          />
          <Button
            type="submit"
            variant={'default'}
            disabled={!input.trim() || isLoading}
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  )
}
