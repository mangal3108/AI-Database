import { ChatInterface } from '@/components/chat/chat-interface'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chat — Internite',
}

export default function ChatPage() {
  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      <ChatInterface />
    </div>
  )
}
