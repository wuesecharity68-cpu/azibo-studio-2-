'use client'

import { useEffect } from 'react'
import { useAuth } from './useAuth'

export function usePageTracking(
  page: string = '/'
) {
  const { user } = useAuth()

  useEffect(() => {
    let cancelled = false

    const trackVisit = async () => {
      try {
        const response = await fetch(
          '/api/track-visit',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user?.uid || null,
              page,
            }),
          }
        )

        if (!response.ok && !cancelled) {
          console.warn(
            '[AZIBO] Page visit tracking failed:',
            response.status
          )
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            '[AZIBO] Failed to track page visit:',
            error
          )
        }
      }
    }

    trackVisit()

    return () => {
      cancelled = true
    }
  }, [page, user?.uid])
}