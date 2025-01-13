'use client'

import { type ReactNode, createContext, useContext, useEffect, useState } from 'react'

import {
  GoogleAuthProvider,
  signOut as _signOut,
  onAuthStateChanged,
  signInWithPopup,
} from 'firebase/auth'

import { auth } from './firebase'
import { getDoc } from './firestore'

type AuthContextType = {
  user: Record<string, any> | null
  initialized: boolean
}

const AuthContext = createContext<AuthContextType>({ initialized: false, user: null })

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [{ user, initialized }, setData] = useState<AuthContextType>({
    initialized: false,
    user: null,
  })

  useEffect(() => {
    return onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        getDoc(`users/${firebaseUser.uid}`).then((user) => {
          setData({ user, initialized: true })
        })
      } else {
        setData({ user: null, initialized: true })
      }
    })
  }, [])

  return <AuthContext.Provider value={{ initialized, user }} children={children} />
}

export const useAuth = () => {
  return useContext(AuthContext)
}

export const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider()
  provider.addScope('email')
  return signInWithPopup(auth, provider)
}

export const signOut = () => {
  return _signOut(auth)
}
