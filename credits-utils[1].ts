import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  where,
  type Firestore,
} from 'firebase/firestore'
import { getDb } from '@/lib/firebase'

export type CreditTransaction = {
  id: string
  user_id: string
  amount: number
  type:
    | 'purchase'
    | 'deduction'
    | 'refund'
    | 'bonus'
  description: string
  created_at: string | Date | unknown
}

type UserCreditData = {
  credits?: number
  role?: 'owner' | 'support' | 'user'
  subscriptionPlan?:
    | 'free'
    | 'starter'
    | 'creator'
    | 'professional'
}

/**
 * AZIBO video-generation unit costs.
 *
 * 1 unit = 5 seconds of 720p generation.
 *
 * 720p:
 * 5s  = 1 unit
 * 10s = 2 units
 * 15s = 3 units
 *
 * 1080p:
 * 5s  = 2 units
 * 10s = 4 units
 * 15s = 6 units
 */
export const AZIBO_CREDIT_MAP = {
  '5s_720p': 1,
  '10s_720p': 2,
  '15s_720p': 3,
  '5s_1080p': 2,
  '10s_1080p': 4,
  '15s_1080p': 6,
} as const

export type AziboGenerationCost =
  keyof typeof AZIBO_CREDIT_MAP

const getFirestore = (): Firestore => {
  return getDb()
}

/**
 * Get the current credit balance for a user.
 */
export async function getUserCredits(
  userId: string
): Promise<number> {
  if (!userId) {
    return 0
  }

  try {
    const db = getFirestore()
    const userRef = doc(db, 'users', userId)
    const userSnapshot = await getDoc(userRef)

    if (!userSnapshot.exists()) {
      return 0
    }

    const userData =
      userSnapshot.data() as UserCreditData

    return typeof userData.credits === 'number'
      ? Math.max(0, userData.credits)
      : 0
  } catch (error: unknown) {
    console.error(
      '[AZIBO] Error fetching credits:',
      error
    )

    return 0
  }
}

/**
 * Get the number of units required for a generation.
 */
export function getGenerationCost(
  duration: 5 | 10 | 15,
  resolution: '720p' | '1080p'
): number {
  const key =
    `${duration}s_${resolution}` as AziboGenerationCost

  return AZIBO_CREDIT_MAP[key]
}

/**
 * Deduct units from a user's balance.
 *
 * Owner accounts have unlimited access and are
 * never charged units.
 *
 * The balance update and transaction record are
 * performed atomically.
 */
export async function deductCredits(
  userId: string,
  amount: number,
  description = 'Video generation'
): Promise<{
  success: boolean
  error?: string
}> {
  if (!userId) {
    return {
      success: false,
      error: 'User ID is required.',
    }
  }

  if (
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return {
      success: false,
      error: 'Invalid credit amount.',
    }
  }

  try {
    const db = getFirestore()
    const userRef = doc(db, 'users', userId)

    await runTransaction(
      db,
      async (transaction) => {
        const userSnapshot =
          await transaction.get(userRef)

        if (!userSnapshot.exists()) {
          throw new Error(
            'User profile not found.'
          )
        }

        const userData =
          userSnapshot.data() as UserCreditData

        /*
         * Owners have unlimited access.
         * No units are deducted and no deduction
         * transaction is recorded.
         */
        if (userData.role === 'owner') {
          return
        }

        const currentCredits =
          typeof userData.credits === 'number'
            ? Math.max(0, userData.credits)
            : 0

        if (currentCredits < amount) {
          throw new Error(
            'Insufficient credits.'
          )
        }

        const transactionRef = doc(
          collection(
            db,
            'credit_transactions'
          )
        )

        transaction.update(userRef, {
          credits:
            currentCredits - amount,
        })

        transaction.set(
          transactionRef,
          {
            id: transactionRef.id,
            user_id: userId,
            amount: -amount,
            type: 'deduction',
            description,
            created_at:
              new Date().toISOString(),
          }
        )
      }
    )

    return {
      success: true,
    }
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to deduct credits.'

    console.error(
      '[AZIBO] Error deducting credits:',
      error
    )

    return {
      success: false,
      error: message,
    }
  }
}

/**
 * Add units to a user's balance.
 *
 * Purchase/subscription units should normally be
 * awarded by the trusted Paystack webhook/server.
 */
export async function addCredits(
  userId: string,
  amount: number,
  type:
    | 'purchase'
    | 'bonus'
    | 'refund',
  description: string
): Promise<boolean> {
  if (
    !userId ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return false
  }

  try {
    const db = getFirestore()
    const userRef = doc(db, 'users', userId)

    await runTransaction(
      db,
      async (transaction) => {
        const userSnapshot =
          await transaction.get(userRef)

        if (!userSnapshot.exists()) {
          throw new Error(
            'User profile not found.'
          )
        }

        const userData =
          userSnapshot.data() as UserCreditData

        const currentCredits =
          typeof userData.credits === 'number'
            ? Math.max(0, userData.credits)
            : 0

        const transactionRef = doc(
          collection(
            db,
            'credit_transactions'
          )
        )

        transaction.update(userRef, {
          credits:
            currentCredits + amount,
        })

        transaction.set(
          transactionRef,
          {
            id: transactionRef.id,
            user_id: userId,
            amount,
            type,
            description,
            created_at:
              new Date().toISOString(),
          }
        )
      }
    )

    return true
  } catch (error: unknown) {
    console.error(
      '[AZIBO] Error adding credits:',
      error
    )

    return false
  }
}

/**
 * Get transaction history for a user.
 */
export async function getCreditTransactions(
  userId: string,
  transactionLimit = 50
): Promise<CreditTransaction[]> {
  if (!userId) {
    return []
  }

  try {
    const db = getFirestore()

    const safeLimit = Math.min(
      Math.max(
        Number.isFinite(transactionLimit)
          ? Math.floor(transactionLimit)
          : 50,
        1
      ),
      100
    )

    const transactionsRef =
      collection(
        db,
        'credit_transactions'
      )

    const transactionsQuery = query(
      transactionsRef,
      where(
        'user_id',
        '==',
        userId
      ),
      orderBy(
        'created_at',
        'desc'
      ),
      limit(safeLimit)
    )

    const snapshot =
      await getDocs(
        transactionsQuery
      )

    return snapshot.docs.map(
      (transactionDoc) => {
        const data =
          transactionDoc.data() as Omit<
            CreditTransaction,
            'id'
          >

        return {
          id: transactionDoc.id,
          ...data,
        }
      }
    )
  } catch (error: unknown) {
    console.error(
      '[AZIBO] Error fetching credit transactions:',
      error
    )

    return []
  }
}

/**
 * Get the most recent credit transactions
 * for a user.
 */
export async function getRecentCreditTransactions(
  userId: string,
  transactionLimit = 10
): Promise<CreditTransaction[]> {
  return getCreditTransactions(
    userId,
    transactionLimit
  )
}