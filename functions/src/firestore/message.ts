import {
  type QueryDocumentSnapshot,
  type QuerySnapshot,
  Timestamp,
  getFirestore,
} from 'firebase-admin/firestore'
import { onDocumentCreated } from 'firebase-functions/firestore'
import { chatFlow, titleFlow } from '../genkit'

const db = getFirestore()

export const onmessagecreated = onDocumentCreated(
  { document: 'users/{uid}/threads/{threadId}/messages/{messageId}' },
  async (event) => {
    const { uid, threadId } = event.params
    const now = Timestamp.now()

    const snapshot = event.data
    if (!snapshot) return

    const item = snapshot.data()
    if (item.message.role !== 'user') return

    const messages = await db
      .collection(`users/${uid}/threads/${threadId}/messages`)
      .orderBy('createdAt', 'asc')
      .limit(10)
      .get()
      .then((res: QuerySnapshot) =>
        res.docs.map((doc: QueryDocumentSnapshot) => doc.data().message),
      )

    const newMessageId = db.collection(`users/${uid}/threads/${threadId}/messages`).doc().id
    await db.doc(`users/${uid}/threads/${threadId}/messages/${newMessageId}`).set({
      message: {
        role: 'model',
        content: [{ type: 'text', text: '' }],
      },
      createdAt: now,
    })

    await Promise.all([
      (async () => {
        const threadDocRef = db.doc(`users/${uid}/threads/${threadId}`)
        if (messages.length === 1) {
          const title = await titleFlow(messages[0].content[0].text ?? '')
          await threadDocRef.update({ title, updatedAt: now })
        } else {
          await threadDocRef.update({ updatedAt: now })
        }
      })(),
      (async () => {
        try {
          const newMessages = await chatFlow(messages)
          await db.doc(`users/${uid}/threads/${threadId}/messages/${newMessageId}`).set({
            message: newMessages.at(-1),
            createdAt: now,
          })
        } catch (error: any) {
          const errorMessage = error.message || 'An error occurred'
          await db.doc(`users/${uid}/threads/${threadId}/messages/${newMessageId}`).set({
            message: {
              role: 'model',
              content: [{ type: 'text', text: '' }],
            },
            error: errorMessage,
            createdAt: now,
          })
        }
      })(),
    ])
  },
)
