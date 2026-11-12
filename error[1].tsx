'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log error to console for debugging
    console.error('[v0] Error occurred:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 bg-destructive/20 rounded-lg flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-2">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-2 border border-border text-foreground font-semibold rounded-lg hover:bg-card transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
