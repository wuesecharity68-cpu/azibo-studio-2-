'use client'

import Link from 'next/link'
import { X } from 'lucide-react'
import { useState } from 'react'

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-secondary to-primary text-primary-foreground py-3 px-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 text-center">
          <p className="text-sm font-semibold flex items-center justify-center gap-2">
            <span>🔥 LIMITED-TIME OFFER</span>

            <span className="hidden sm:inline">—</span>

            <Link
              href="/pricing"
              className="underline hover:opacity-80 transition-opacity"
            >
              Lock in our exclusive launch prices before the offer ends
            </Link>
          </p>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
          aria-label="Close banner"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}