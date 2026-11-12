'use client'

import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { AlertTriangle } from 'lucide-react'
import { getDb } from '@/lib/firebase'

export function MaintenanceModeAlert() {
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const db = getDb()

    const settingsRef = doc(
      db,
      'admin_config',
      'settings'
    )

    const unsubscribe = onSnapshot(
      settingsRef,
      (snapshot) => {
        const data = snapshot.data()

        setMaintenanceMode(
          data?.maintenanceMode === true
        )

        setIsLoaded(true)
      },
      (error) => {
        console.error(
          '[AZIBO] Error checking maintenance mode:',
          error
        )

        setMaintenanceMode(false)
        setIsLoaded(true)
      }
    )

    return () => unsubscribe()
  }, [])

  if (!isLoaded || !maintenanceMode) {
    return null
  }

  return (
    <div className="fixed top-20 left-0 right-0 bg-destructive/10 border-b border-destructive/50 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
        <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />

        <div>
          <h3 className="font-semibold text-destructive">
            Website Under Maintenance
          </h3>

          <p className="text-sm text-destructive/80">
            Some services may be temporarily unavailable.
            Please check back soon.
          </p>
        </div>
      </div>
    </div>
  )
}