'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  X,
  AlertCircle,
  CheckCircle,
  Info,
  Database,
  CreditCard,
  Shield,
  Zap,
  BarChart3,
  Clock,
  ChevronRight,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================
// TYPES
// ============================================

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    href: string
  }
}

// ============================================
// CONSTANTS
// ============================================

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Usage warning',
    message: 'You\'ve used 82% of your monthly AI queries.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    action: { label: 'View Usage', href: '/dashboard/usage' },
  },
  {
    id: '2',
    type: 'success',
    title: 'Database sync',
    message: 'Production PostgreSQL schema sync completed.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'Billing',
    message: 'Your invoice for August 2026 is ready.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
    action: { label: 'View Invoice', href: '/dashboard/billing' },
  },
  {
    id: '4',
    type: 'success',
    title: 'API key created',
    message: 'A new API key "Production Read-Only" was created.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    read: true,
  },
]

// ============================================
// COMPONENT
// ============================================

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  function markAsRead(id: string) {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  function markAllAsRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  function getIcon(type: Notification['type']) {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-400" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />
      default:
        return <Info className="w-4 h-4 text-blue-400" />
    }
  }

  function formatTime(date: Date): string {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
      >
        <Bell className="w-5 h-5 text-slate-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 bg-[#0D111A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-slate-400" />
                <h3 className="font-bold text-white text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[10px] text-slate-400 hover:text-white transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      'p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer',
                      !notification.read && 'bg-slate-800/20'
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className="mt-0.5">{getIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white text-sm truncate">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-indigo-500 rounded-full shrink-0" />
                          )}
                        </div>
                        <p className="text-slate-400 text-xs mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span className="text-[10px] text-slate-500">
                            {formatTime(notification.timestamp)}
                          </span>
                          {notification.action && (
                            <a
                              href={notification.action.href}
                              className="ml-auto text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {notification.action.label}
                              <ChevronRight className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-800">
              <a
                href="/dashboard/settings/notifications"
                className="flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <Settings className="w-3 h-3" />
                Notification settings
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
