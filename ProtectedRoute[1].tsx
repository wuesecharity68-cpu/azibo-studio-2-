'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'owner' | 'support' | 'user'
}

function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
      return
    }

    if (!loading && requiredRole && profile) {
      const hasAccess =
        profile.role === requiredRole ||
        (requiredRole === 'user' && profile.role === 'owner')

      if (!hasAccess) {
        router.push('/')
      }
    }
  }, [user, profile, loading, router, requiredRole])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-border border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requiredRole && profile) {
    const hasAccess =
      profile.role === requiredRole ||
      (requiredRole === 'user' && profile.role === 'owner')

    if (!hasAccess) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Access Denied
            </h1>

            <p className="text-muted-foreground">
              You don&apos;t have permission to access this page.
            </p>
          </div>
        </div>
      )
    }
  }

  return <>{children}</>
}

export { ProtectedRoute }
export default ProtectedRoute