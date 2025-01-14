import { Timestamp, getFirestore } from 'firebase-admin/firestore'
import { HttpsError, beforeUserCreated } from 'firebase-functions/identity'
const db = getFirestore()

export const beforeusercreated = beforeUserCreated(async (event) => {
  const user = event.data
  console.log('user', user)

  if (!user) return

  // TODO: Replace with your company domain
  const domain = '@tanabee.dev'
  if (!user?.email?.includes(domain)) {
    throw new HttpsError('permission-denied', 'Unauthorized email')
  }

  await db.doc(`users/${user.uid}`).set({
    email: user.email,
    role: 'user',
    displayName: user.displayName || null,
    photoURL: user.photoURL || null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
})
