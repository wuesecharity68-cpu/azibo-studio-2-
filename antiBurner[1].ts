import { FieldValue } from 'firebase-admin/firestore'
import { getDb } from './firebase-admin.server'

interface FreeCreditClaim {
  ip: string
  userId: string
  used: boolean
  createdAt: FieldValue
}

export async function checkIPLimit(
  ip: string
): Promise<{
  allowed: boolean
  reason: string
}> {
  if (!ip || ip === 'unknown') {
    return {
      allowed: true,
      reason: '',
    }
  }

  try {
    const db = getDb()

    const ref = db.collection('freeCredits').doc(ip)
    const existing = await ref.get()

    if (
      existing.exists &&
      existing.data()?.used === true
    ) {
      return {
        allowed: false,
        reason:
          'Free credits already used from this IP.',
      }
    }

    return {
      allowed: true,
      reason: '',
    }
  } catch (error) {
    console.error(
      '[AZIBO] Error checking IP limit:',
      error
    )

    /*
     * Do not block legitimate users simply because
     * the anti-abuse check temporarily failed.
     */
    return {
      allowed: true,
      reason: '',
    }
  }
}

export async function markIPUsed(
  ip: string,
  userId: string
): Promise<void> {
  if (!ip || ip === 'unknown') {
    return
  }

  try {
    const db = getDb()

    const ref = db.collection('freeCredits').doc(ip)

    const claim: FreeCreditClaim = {
      ip,
      userId,
      used: true,
      createdAt: FieldValue.serverTimestamp(),
    }

    await db.runTransaction(async (transaction) => {
      const existing = await transaction.get(ref)

      if (
        existing.exists &&
        existing.data()?.used === true
      ) {
        return
      }

      transaction.set(ref, claim, {
        merge: true,
      })
    })
  } catch (error) {
    console.error(
      '[AZIBO] Error recording IP claim:',
      error
    )
  }
}

export function getClientIP(
  request: Request
): string {
  /*
   * Vercel forwards the original client IP through
   * x-forwarded-for. Use the first address in the list.
   */
  const forwardedFor =
    request.headers.get('x-forwarded-for')

  if (forwardedFor) {
    const firstIP = forwardedFor
      .split(',')[0]
      .trim()

    if (firstIP) {
      return firstIP
    }
  }

  const realIP =
    request.headers.get('x-real-ip')

  if (realIP) {
    const ip = realIP.trim()

    if (ip) {
      return ip
    }
  }

  return 'unknown'
}