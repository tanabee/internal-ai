import { initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'

const firebaseConfig = {
  apiKey: 'AIzaSyCrDQQ8qifVSggLZHIe7FL_r8yfkKW3_nk',
  authDomain: 'internal-ai-demo.firebaseapp.com',
  projectId: 'internal-ai-demo',
  storageBucket: 'internal-ai-demo.firebasestorage.app',
  messagingSenderId: '19659781336',
  appId: '1:19659781336:web:c820f4aed85779f3f893ad',
  measurementId: 'G-T6B2EW2WX5',
}

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)
const functions = getFunctions(app, 'asia-northeast1')
const auth = getAuth(app)

if (import.meta.env.DEV) {
  connectFunctionsEmulator(functions, 'localhost', 5001)
  connectFirestoreEmulator(db, 'localhost', 8080)
  // FIXME: 下部のバナーを非表示にする。現状は css で対応している
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
}

export { app, auth, db, functions }
