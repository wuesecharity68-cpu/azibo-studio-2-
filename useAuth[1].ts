'use client'

import { useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  User,
} from 'firebase/auth'
import { getAuth } from '@/lib/firebase'
import {
  getUserProfile,
  type UserProfile,
} from '@/lib/auth-utils'

interface UseAuthReturn {
  user: User | null
  profile: UserProfile | null
  loading: boolean
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] =
    useState<User | null>(null)

  const [profile, setProfile] =
    useState<UserProfile | null>(null)

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    let mounted = true

    try {
      const auth = getAuth()

      if (!auth) {
        console.warn(
          '[AZIBO] Firebase Auth is not available.'
        )

        if (mounted) {
          setLoading(false)
        }

        return
      }

      const unsubscribe = onAuthStateChanged(
        auth,
        async (currentUser) => {
          if (!mounted) {
            return
          }

          setUser(currentUser)

          if (!currentUser) {
            setProfile(null)
            setLoading(false)
            return
          }

          try {
            const userProfile =
              await getUserProfile(
                currentUser.uid
              )

            if (!mounted) {
              return
            }

            setProfile(userProfile)
          } catch (error) {
            console.error(
              '[AZIBO] Failed to load user profile:',
              error
            )

            if (!mounted) {
              return
            }

            setProfile(null)
          } finally {
            if (mounted) {
              setLoading(false)
            }
          }
        }
      )

      return () => {
        mounted = false
        unsubscribe()
      }
    } catch (error) {
      console.error(
        '[AZIBO] useAuth error:',
        error
      )

      if (mounted) {
        setUser(null)
        setProfile(null)
        setLoading(false)
      }

      return () => {
        mounted = false
      }
    }
  }, [])

  return {
    user,
    profile,
    loading,
  }
}