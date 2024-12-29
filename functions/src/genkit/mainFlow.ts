import { firebaseAuth } from '@genkit-ai/firebase/auth'
import { onFlow } from '@genkit-ai/firebase/functions'
import { vertexAI } from '@genkit-ai/vertexai'
import { gemini15Flash } from '@genkit-ai/vertexai'
import { genkit, z } from 'genkit'

const ai = genkit({
  plugins: [
    vertexAI({ location: 'asia-northeast1', projectId: 'internal-ai-demo' }),
  ],
  model: gemini15Flash,
})

export const mainFlow = onFlow(
  ai,
  {
    name: 'mainFlow',
    authPolicy: firebaseAuth((user) => {
      // if (!user.email_verified) {
      //   throw new Error('Verified email required to run flow')
      // }
    }),
  },
  async (messages) => {
    console.log('messages', messages)
    const response = await ai.generate({ messages })
    return response.messages
  },
)
