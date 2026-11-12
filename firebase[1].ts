import {
  initializeApp,
  getApps,
  getApp as getFirebaseApp,
  type FirebaseApp,
  type FirebaseOptions,
} from 'firebase/app'
import {
  getAuth as getAuthFromFirebase,
  type Auth,
} from 'firebase/auth'
import {
  getFirestore,
  type Firestore,
} from 'firebase/firestore'
import { getClientEnv } from './env'

let app: FirebaseApp | null = null
let authInstance: Auth | null = null
let dbInstance: Firestore | null = null

const initializeFirebase = (): void => {
  if (app && authInstance && dbInstance) {
    return
  }

  const config = getClientEnv()

  if (!config.firebase.projectId) {
    throw new Error(
      'Missing ENV: NEXT_PUBLIC_FIREBASE_PROJECT_ID'
    )
  }

  const firebaseConfig: FirebaseOptions = config.firebase

  const apps = getApps()

  app =
    apps.length === 0
      ? initializeApp(firebaseConfig)
      : getFirebaseApp()

  authInstance = getAuthFromFirebase(app)
  dbInstance = getFirestore(app)

  console.log('[AZIBO] Firebase initialized successfully')
}

export const getAuth = (): Auth => {
  initializeFirebase()

  if (!authInstance) {
    throw new Error('Firebase Auth failed to initialize')
  }

  return authInstance
}

export const getDb = (): Firestore => {
  initializeFirebase()

  if (!dbInstance) {
    throw new Error('Firebase Firestore failed to initialize')
  }

  return dbInstance
}

export const getFirebaseAppInstance = (): FirebaseApp => {
  initializeFirebase()

  if (!app) {
    throw new Error('Firebase App failed to initialize')
  }

  return app
}

export { initializeFirebase }

export default app