import { gemini20Flash, vertexAI } from '@genkit-ai/vertexai'
import { genkit, z } from 'genkit'

const ai = genkit({
  promptDir: 'src/genkit/prompts',
  plugins: [
    vertexAI({
      location: 'us-central1',
      projectId: 'internal-ai-demo',
    }),
  ],
  model: gemini20Flash,
})

export const titleFlow = ai.defineFlow(
  {
    name: 'titleFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (message) => {
    const prompt = ai.prompt('title')
    const response = await prompt({ message })
    return response.text
  },
)
