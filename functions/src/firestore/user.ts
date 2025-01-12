import { getAuth } from 'firebase-admin/auth'
import { onDocumentWritten } from 'firebase-functions/firestore'

export const onuserwritten = onDocumentWritten({ document: 'users/{id}' }, async (event) => {
  const before = event.data?.before?.data()
  const after = event.data?.after?.data()

  // Apply role to Custom Claims
  if (before?.role !== after?.role) {
    await getAuth().setCustomUserClaims(event.params.id, { role: after?.role })
  }
})
