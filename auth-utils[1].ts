import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import {
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore'
import { getAuth, getDb } from '@/lib/firebase'

export const OWNER_EMAIL =
  'christianaayu63@gmail.com'

export type AziboUserRole =
  | 'owner'
  | 'support'
  | 'user'

export type SubscriptionPlan =
  | 'free'
  | 'starter'
  | 'creator'
  | 'professional'

export interface UserProfile {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  role: AziboUserRole
  credits: number
  subscriptionPlan: SubscriptionPlan
  emailVerified: boolean
}

export type AuthUserProfile = UserProfile

export interface AuthActionResult {
  success: boolean
  user?: User
  error?: string
}

const normalizeEmail = (
  email: string | null | undefined
): string => {
  return (email ?? '').trim().toLowerCase()
}

export const isOwnerEmail = (
  email: string | null | undefined
): boolean => {
  return (
    normalizeEmail(email) ===
    OWNER_EMAIL.toLowerCase()
  )
}

const getAuthErrorMessage = (
  error: unknown
): string => {
  if (
    error &&
    typeof error === 'object' &&
    'code' in error
  ) {
    const code = String(
      (error as { code?: unknown }).code ?? ''
    )

    switch (code) {
      case 'auth/invalid-credential':
        return 'Invalid email or password.'

      case 'auth/invalid-email':
        return 'Please enter a valid email address.'

      case 'auth/user-disabled':
        return 'This account has been disabled.'

      case 'auth/user-not-found':
        return 'No account was found with this email address.'

      case 'auth/wrong-password':
        return 'Invalid email or password.'

      case 'auth/email-already-in-use':
        return 'An account with this email already exists.'

      case 'auth/weak-password':
        return 'Your password is too weak.'

      case 'auth/popup-closed-by-user':
        return 'Google sign-in was cancelled.'

      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.'

      default:
        break
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong. Please try again.'
}

const ensureUserProfile = async (
  user: User
): Promise<void> => {
  const db = getDb()

  const userRef = doc(
    db,
    'users',
    user.uid
  )

  const snapshot = await getDoc(userRef)

  if (snapshot.exists()) {
    return
  }

  const owner = isOwnerEmail(user.email)

  await setDoc(userRef, {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName ?? null,
    photoURL: user.photoURL ?? null,
    role: owner ? 'owner' : 'user',
    credits: owner ? 0 : 100,
    subscriptionPlan: 'free',
    emailVerified: user.emailVerified,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
}

export const signInWithEmail = async (
  email: string,
  password: string
): Promise<AuthActionResult> => {
  try {
    const auth = getAuth()

    const credential =
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      )

    await ensureUserProfile(credential.user)

    return {
      success: true,
      user: credential.user,
    }
  } catch (error) {
    console.error(
      '[AZIBO] Email sign-in error:',
      error
    )

    return {
      success: false,
      error: getAuthErrorMessage(error),
    }
  }
}

export const signInWithGoogle =
  async (): Promise<AuthActionResult> => {
    try {
      const auth = getAuth()
      const provider =
        new GoogleAuthProvider()

      const credential =
        await signInWithPopup(
          auth,
          provider
        )

      await ensureUserProfile(
        credential.user
      )

      return {
        success: true,
        user: credential.user,
      }
    } catch (error) {
      console.error(
        '[AZIBO] Google sign-in error:',
        error
      )

      return {
        success: false,
        error: getAuthErrorMessage(error),
      }
    }
  }

export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName?: string
): Promise<AuthActionResult> => {
  try {
    const auth = getAuth()

    const credential =
      await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      )

    const user = credential.user

    if (displayName?.trim()) {
      await updateProfile(user, {
        displayName: displayName.trim(),
      })
    }

    await ensureUserProfile(user)

    return {
      success: true,
      user,
    }
  } catch (error) {
    console.error(
      '[AZIBO] Sign-up error:',
      error
    )

    return {
      success: false,
      error: getAuthErrorMessage(error),
    }
  }
}

export const getCurrentUser =
  (): User | null => {
    try {
      return getAuth().currentUser
    } catch (error) {
      console.error(
        '[AZIBO] Error getting current Firebase user:',
        error
      )

      return null
    }
  }

export const getCurrentUserId =
  (): string | null => {
    return getCurrentUser()?.uid ?? null
  }

export const getCurrentUserEmail =
  (): string | null => {
    return getCurrentUser()?.email ?? null
  }

export const isAuthenticated =
  (): boolean => {
    return getCurrentUser() !== null
  }

export const getUserProfile =
  async (
    userId?: string
  ): Promise<UserProfile | null> => {
    try {
      const firebaseUser =
        getCurrentUser()

      const uid =
        userId ?? firebaseUser?.uid

      if (!uid) {
        return null
      }

      const db = getDb()

      const userRef = doc(
        db,
        'users',
        uid
      )

      const userSnapshot =
        await getDoc(userRef)

      if (!userSnapshot.exists()) {
        if (!firebaseUser) {
          return null
        }

        const owner =
          isOwnerEmail(
            firebaseUser.email
          )

        return {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName:
            firebaseUser.displayName,
          photoURL:
            firebaseUser.photoURL,
          role: owner ? 'owner' : 'user',
          credits: owner ? 0 : 100,
          subscriptionPlan: 'free',
          emailVerified:
            firebaseUser.emailVerified,
        }
      }

      const data =
        userSnapshot.data()

      const ownerByEmail =
        isOwnerEmail(
          firebaseUser?.email ??
            (typeof data.email === 'string'
              ? data.email
              : null)
        )

      const storedRole: AziboUserRole =
        data.role === 'owner'
          ? 'owner'
          : data.role === 'support'
            ? 'support'
            : 'user'

      const role: AziboUserRole =
        ownerByEmail
          ? 'owner'
          : storedRole

      const subscriptionPlan: SubscriptionPlan =
        data.subscriptionPlan === 'starter'
          ? 'starter'
          : data.subscriptionPlan === 'creator'
            ? 'creator'
            : data.subscriptionPlan === 'professional'
              ? 'professional'
              : 'free'

      return {
        uid,
        email:
          firebaseUser?.email ??
          (typeof data.email === 'string'
            ? data.email
            : null),
        displayName:
          firebaseUser?.displayName ??
          (typeof data.displayName === 'string'
            ? data.displayName
            : null),
        photoURL:
          firebaseUser?.photoURL ??
          (typeof data.photoURL === 'string'
            ? data.photoURL
            : null),
        role,
        credits:
          typeof data.credits === 'number'
            ? Math.max(0, data.credits)
            : role === 'owner'
              ? 0
              : 100,
        subscriptionPlan,
        emailVerified:
          firebaseUser?.emailVerified ??
          Boolean(data.emailVerified),
      }
    } catch (error) {
      console.error(
        '[AZIBO] Error getting user profile:',
        error
      )

      return null
    }
  }

export const getUserRole =
  async (
    userId?: string
  ): Promise<
    AziboUserRole | null
  > => {
    const profile =
      await getUserProfile(userId)

    return profile?.role ?? null
  }

export const isCurrentUserOwner =
  async (): Promise<boolean> => {
    const user = getCurrentUser()

    if (!user) {
      return false
    }

    return isOwnerEmail(user.email)
  }

export const isCurrentUserSupport =
  async (): Promise<boolean> => {
    const profile =
      await getUserProfile()

    return profile?.role === 'support'
  }

export const onAuthChange = (
  callback: (
    user: User | null
  ) => void
): (() => void) => {
  try {
    return onAuthStateChanged(
      getAuth(),
      callback
    )
  } catch (error) {
    console.error(
      '[AZIBO] Error subscribing to auth changes:',
      error
    )

    callback(null)

    return () => {}
  }
}

export const signOutUser =
  async (): Promise<{
    success: boolean
    error?: string
  }> => {
    try {
      await signOut(getAuth())

      return {
        success: true,
      }
    } catch (error) {
      console.error(
        '[AZIBO] Error signing out:',
        error
      )

      return {
        success: false,
        error: getAuthErrorMessage(error),
      }
    }
  }

export const logout =
  signOutUser

export const getFreshIdToken =
  async (): Promise<
    string | null
  > => {
    try {
      const user =
        getCurrentUser()

      if (!user) {
        return null
      }

      return await user.getIdToken(true)
    } catch (error) {
      console.error(
        '[AZIBO] Error getting fresh ID token:',
        error
      )

      return null
    }
  }