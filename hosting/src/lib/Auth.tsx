'use client'

import { type ReactNode, createContext, useContext, useEffect, useState } from 'react'

import {
  GoogleAuthProvider,
  isSignInWithEmailLink as _isSignInWithEmailLink,
  sendSignInLinkToEmail as _sendSignInLinkToEmail,
  signInWithEmailLink as _signInWithEmailLink,
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

export const signInWithEmailLink = (email: string) => {
  return _signInWithEmailLink(auth, email, window.location.href).then(() => {
    window.localStorage.removeItem('emailForSignIn')
  })
}

export const sendSignInLinkToEmail = (email: string) => {
  return _sendSignInLinkToEmail(auth, email, {
    url: `${window.location.origin}/finishSignUp`,
    handleCodeInApp: true,
  }).then(() => {
    window.localStorage.setItem('emailForSignIn', email)
  })
}

export const isSignInWithEmailLink = (url: string) => {
  return _isSignInWithEmailLink(auth, url)
}

export const getSignInEmail = () => {
  return window.localStorage.getItem('emailForSignIn')
}

export const signOut = () => {
  return _signOut(auth)
}
