import { gemini15Flash, vertexAI } from '@genkit-ai/vertexai'
import { MessageSchema, genkit, z } from 'genkit'

const ai = genkit({
  plugins: [
    vertexAI({
      location: 'asia-northeast1',
      projectId: 'internal-ai-demo',
    }),
  ],
  model: gemini15Flash,
})

export const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: z.array(MessageSchema),
    outputSchema: z.array(MessageSchema),
  },
  async (messages) => {
    const response = await ai.generate({ messages })
    return response.messages
  },
)
