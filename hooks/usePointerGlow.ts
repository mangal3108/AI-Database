'use client'

import { useEffect } from 'react'

/**
 * Custom hook for subtle desktop pointer light tracking.
 * Throttles update cycles and respects touch device boundaries.
 */
export function usePointerGlow(enabled = true) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    // Disable mouse tracking on mobile/touch devices or reduced motion
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (isTouch || prefersReducedMotion) return

    let rafId: number | null = null

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        const x = e.clientX
        const y = e.clientY
        document.documentElement.style.setProperty('--mouse-x', `${x}px`)
        document.documentElement.style.setProperty('--mouse-y', `${y}px`)
        rafId = null
      })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [enabled])
}
