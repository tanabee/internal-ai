'use client'

import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import {
  GoogleAuthProvider,
  type User,
  signOut as _signOut,
  onAuthStateChanged,
  signInWithPopup,
} from 'firebase/auth'

import { auth } from './firebase'

type AuthContextType = {
  user: User | null
  claims: any | null
  initialized: boolean
}

const AuthContext = createContext<AuthContextType>({
  claims: null,
  initialized: false,
  user: null,
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [{ user, claims, initialized }, setData] = useState<AuthContextType>({
    claims: null,
    initialized: false,
    user: null,
  })

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setData({ claims: null, initialized: true, user })
    })
  }, [])

  useEffect(() => {
    if (user) {
      user
        .getIdTokenResult(true)
        .then(({ claims }) => setData({ claims, initialized, user }))
    }
  }, [user])

  return (
    <AuthContext.Provider
      value={{ claims, initialized, user }}
      children={children}
    />
  )
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
