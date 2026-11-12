import {
  cert,
  getApps,
  initializeApp,
  type App,
} from 'firebase-admin/app'
import {
  getAuth as getFirebaseAuth,
  type Auth,
} from 'firebase-admin/auth'
import {
  getFirestore,
  type Firestore,
} from 'firebase-admin/firestore'
import { getServerEnv } from './env'

let adminApp: App | null = null

const initializeAdmin = (): App => {
  if (adminApp) {
    return adminApp
  }

  const existingApps = getApps()

  if (existingApps.length > 0) {
    adminApp = existingApps[0]
    return adminApp
  }

  const env = getServerEnv()

  if (
    !env.firebaseAdmin.projectId ||
    !env.firebaseAdmin.clientEmail ||
    !env.firebaseAdmin.privateKey
  ) {
    throw new Error(
      'Missing Firebase Admin credentials. Check FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY.'
    )
  }

  const rawPrivateKey =
    env.firebaseAdmin.privateKey

  const privateKey =
    rawPrivateKey.replace(/\\n/g, '\n')

  const beginsCorrectly =
    privateKey.startsWith(
      '-----BEGIN PRIVATE KEY-----'
    )

  const endsCorrectly =
    privateKey.trimEnd().endsWith(
      '-----END PRIVATE KEY-----'
    )

  const hasEscapedNewlines =
    rawPrivateKey.includes('\\n')

  if (!beginsCorrectly || !endsCorrectly) {
    throw new Error(
      `Firebase Admin private key format check failed. beginsCorrectly=${beginsCorrectly}, endsCorrectly=${endsCorrectly}, hasEscapedNewlines=${hasEscapedNewlines}, keyLength=${privateKey.length}`
    )
  }

  try {
    adminApp = initializeApp({
      credential: cert({
        projectId:
          env.firebaseAdmin.projectId,
        clientEmail:
          env.firebaseAdmin.clientEmail,
        privateKey,
      }),
    })
  } catch (error) {
    throw new Error(
      `Firebase Admin private key could not be parsed. beginsCorrectly=${beginsCorrectly}, endsCorrectly=${endsCorrectly}, hasEscapedNewlines=${hasEscapedNewlines}, keyLength=${privateKey.length}. The key itself is not printed. Original error: ${
        error instanceof Error
          ? error.message
          : 'Unknown error'
      }`
    )
  }

  return adminApp
}

export const getAdminDb = (): Firestore => {
  const app = initializeAdmin()
  return getFirestore(app)
}

export const getAdminAuth = (): Auth => {
  const app = initializeAdmin()
  return getFirebaseAuth(app)
}

/**
 * Compatibility exports for existing server routes.
 * These keep already-corrected files working without
 * forcing unnecessary changes throughout the project.
 */
export const getDb = getAdminDb
export const getAuth = getAdminAuth

export const adminDb = getAdminDb()
export const adminAuth = getAdminAuth()