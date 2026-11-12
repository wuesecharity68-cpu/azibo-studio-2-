import { getFirestore } from 'firebase/firestore'
import { getFirebaseAppInstance } from './firebase'

export const db = getFirestore(getFirebaseAppInstance())