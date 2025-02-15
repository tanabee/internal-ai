import { Timestamp, getFirestore } from 'firebase-admin/firestore'
import { HttpsError, beforeUserCreated } from 'firebase-functions/identity'
const db = getFirestore()

export const beforeusercreated = beforeUserCreated(async (event) => {
  const user = event.data

  if (!user) return

  // TODO: Replace with your company domain
  const domain = '@tanabee.dev'
  if (!user?.email?.includes(domain)) {
    throw new HttpsError('permission-denied', 'Unauthorized email')
  }

  const userCount = await db
    .collection('users')
    .get()
    .then(({ docs }) => docs.length)
  const role = userCount === 0 ? 'admin' : 'user'

  await db.doc(`users/${user.uid}`).set({
    email: user.email,
    role,
    displayName: user.displayName || null,
    photoURL: user.photoURL || null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
})
