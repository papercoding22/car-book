import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

function hasRequiredFirebaseConfig() {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId,
  )
}

export const firebaseApp = hasRequiredFirebaseConfig()
  ? (getApps()[0] ?? initializeApp(firebaseConfig))
  : null

let analyticsInstance: Analytics | null = null

export async function getFirebaseAnalytics() {
  if (!firebaseApp || analyticsInstance || !import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
    return analyticsInstance
  }

  const supported = await isSupported()
  if (!supported) {
    return null
  }

  analyticsInstance = getAnalytics(getApp())
  return analyticsInstance
}
