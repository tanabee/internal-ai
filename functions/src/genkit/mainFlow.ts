import { firebaseAuth } from '@genkit-ai/firebase/auth'
import { onFlow } from '@genkit-ai/firebase/functions'
import { vertexAI } from '@genkit-ai/vertexai'
import { gemini15Flash } from '@genkit-ai/vertexai'
import { genkit, z } from 'genkit'

const ai = genkit({
  plugins: [
    vertexAI({ location: 'asia-northeast1', projectId: 'internal-ai-demo' }),
  ],
})

export const mainFlow = onFlow(
  ai,
  {
    name: 'mainFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
    authPolicy: firebaseAuth((user) => {
      console.log('user', user)
      if (!user.email_verified) {
        throw new Error('Verified email required to run flow')
      }
    }),
  },
  async (prompt) => {
    const llmResponse = await ai.generate({
      model: gemini15Flash,
      prompt,
      config: { temperature: 1 },
    })
    return llmResponse.text
  },
)
