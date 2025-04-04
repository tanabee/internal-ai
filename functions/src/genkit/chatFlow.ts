import { gemini20Flash, vertexAI } from '@genkit-ai/vertexai'
import { MessageSchema, genkit, z } from 'genkit'

const ai = genkit({
  plugins: [
    vertexAI({
      location: 'us-central1',
      projectId: 'internal-ai-demo',
    }),
  ],
  model: gemini20Flash,
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
