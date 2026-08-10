'use client'

import { useState } from 'react'
import { Plus, MessageSquare, Star, Folder, ChevronRight, Search, Database, Trash2, Edit3 } from 'lucide-react'
import Link from 'next/link'

interface ConversationItem {
  id: string
  title: string
  updatedAt: string
  isFavorite?: boolean
}

interface ChatSidebarProps {
  conversations?: ConversationItem[]
  currentId?: string
  onSelect?: (id: string) => void
  onNewChat?: () => void
  connectedDbName?: string
  tableCount?: number
}

export function ChatSidebar({
  conversations = [],
  currentId,
  onSelect,
  onNewChat,
  connectedDbName = 'Production DB',
  tableCount = 84,
}: ChatSidebarProps) {
  const [filter, setFilter] = useState('')

  const filtered = conversations.filter(c => c.title.toLowerCase().includes(filter.toLowerCase()))
  const favorites = filtered.filter(c => c.isFavorite)

  return (
    <div className="h-full flex flex-col bg-[#0B0F17] border-r border-slate-800/80 font-sans text-xs select-none">
      {/* New Chat CTA */}
      <div className="p-3 border-b border-slate-800/80">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-md shadow-indigo-600/20"
        >
          <Plus size={15} />
          <span>New Conversation</span>
        </button>
      </div>

      {/* Filter search */}
      <div className="px-3 pt-3">
        <div className="relative">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Search chats..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 outline-none placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {/* Saved / Favorites */}
        {favorites.length > 0 && (
          <div>
            <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider mb-1.5 px-2">
              <Star size={10} className="fill-amber-400" />
              <span>SAVED QUERIES</span>
            </div>
            <div className="space-y-0.5">
              {favorites.map(c => (
                <button
                  key={c.id}
                  onClick={() => onSelect?.(c.id)}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left transition-colors ${
                    currentId === c.id ? 'bg-indigo-600/20 text-white border border-indigo-500/30' : 'text-slate-300 hover:bg-slate-900/60'
                  }`}
                >
                  <MessageSquare size={13} className="text-amber-400 shrink-0" />
                  <span className="truncate font-medium">{c.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recent Chats */}
        <div>
          <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5 px-2">
            RECENT CHATS
          </div>
          {filtered.length === 0 ? (
            <div className="text-slate-500 text-center py-6 text-xs">No conversations yet</div>
          ) : (
            <div className="space-y-0.5">
              {filtered.map(c => {
                const isActive = currentId === c.id
                return (
                  <button
                    key={c.id}
                    onClick={() => onSelect?.(c.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-colors group ${
                      isActive
                        ? 'bg-indigo-600/20 text-white border border-indigo-500/30 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <MessageSquare size={13} className={isActive ? 'text-indigo-400' : 'text-slate-500'} />
                      <span className="truncate">{c.title}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Connected DB status footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <div className="flex-1 truncate">
            <div className="font-bold text-white text-xs truncate">{connectedDbName}</div>
            <div className="text-[10px] text-slate-500 font-mono">{tableCount} tables indexed</div>
          </div>
        </div>
      </div>
    </div>
  )
}
