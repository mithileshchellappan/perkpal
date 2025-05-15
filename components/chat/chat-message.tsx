"use client"

import type React from "react"
import { formatDistanceToNow } from "date-fns"
import { motion } from "framer-motion"
import type { Message } from "@/lib/types"

interface ChatMessageProps {
  message: Message
  renderComponent: (componentName: string) => React.ReactNode
}

export function ChatMessage({ message, renderComponent }: ChatMessageProps) {
  const isUser = message.role === "user"
  const formattedTime = formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && <div className="w-8 h-8 rounded-full bg-green-500 mr-2 flex-shrink-0 self-start mt-1"></div>}
      <div className={`max-w-[80%] rounded-lg p-4 ${isUser ? "bg-green-600 text-white" : "bg-gray-700 text-white"}`}>
        <div className="mb-1">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        {message.component && (
          <div className="mt-4 border-t border-gray-600 pt-4">{renderComponent(message.component)}</div>
        )}

        <div className="mt-2 text-xs opacity-70 text-right">{formattedTime}</div>
      </div>
      {isUser && <div className="w-8 h-8 rounded-full bg-gray-600 ml-2 flex-shrink-0 self-start mt-1"></div>}
    </motion.div>
  )
}
