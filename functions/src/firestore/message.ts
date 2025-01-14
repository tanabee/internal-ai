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

    console.log('messages', messages)

    const threadDocRef = db.doc(`users/${uid}/threads/${threadId}`)
    if (messages.length === 1) {
      console.log('messages.length === 1')
      const title = await titleFlow(messages[0].content[0].text ?? '')
      await threadDocRef.update({ title, updatedAt: now })
    } else {
      console.log('messages.length !== 1')
      await threadDocRef.update({ updatedAt: now })
    }
    console.log('chatFlow')

    const newMessages = await chatFlow(messages)
    console.log('chatFlow done')
    console.log(JSON.stringify(newMessages, null, 2))
    await db.collection(`users/${uid}/threads/${threadId}/messages`).add({
      message: newMessages.at(-1),
      createdAt: now,
    })
    console.log('add message done')
  },
)
