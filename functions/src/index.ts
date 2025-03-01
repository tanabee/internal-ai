import { initializeApp } from 'firebase-admin/app'
import { setGlobalOptions } from 'firebase-functions/v2'

initializeApp()
setGlobalOptions({ region: 'asia-northeast1' })

export * from './auth'
export * from './firestore'
