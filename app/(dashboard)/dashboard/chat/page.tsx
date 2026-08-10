import { ChatInterface } from '@/components/chat/chat-interface'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chat — Internite AI',
}

export default function ChatPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center px-6 h-14 border-b border-border/50 flex-shrink-0">
        <h1 className="font-semibold text-foreground text-sm">New Conversation</h1>
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  )
}
