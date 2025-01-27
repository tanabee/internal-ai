import { useEffect } from 'react'
import { useNavigate } from 'react-router'

import Loading from '@/components/Loading'
import { getSignInEmail, isSignInWithEmailLink, signInWithEmailLink } from '@/lib/Auth'

export default function FinishSignUp() {
  const navigate = useNavigate()
  const email = getSignInEmail()

  useEffect(() => {
    if (email) {
      signInWithEmailLink(email).catch((error) => {
        console.log(error)
      })
    }
  }, [navigate, email])

  if (!isSignInWithEmailLink(window.location.href)) {
    navigate('/login', { replace: true })
  }

  return <Loading />
}
