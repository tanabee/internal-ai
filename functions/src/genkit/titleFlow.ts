import { gemini20Flash001, vertexAI } from '@genkit-ai/vertexai'
import { genkit, z } from 'genkit'

const ai = genkit({
  promptDir: 'src/genkit/prompts',
  plugins: [
    vertexAI({
      location: 'us-central1',
      projectId: 'internal-ai-demo',
    }),
  ],
  model: gemini20Flash001,
})

export const titleFlow = ai.defineFlow(
  {
    name: 'titleFlow',
    inputSchema: z.string(),
    outputSchema: z.object({ title: z.string() }),
  },
  async (message) => {
    const prompt = ai.prompt('title')
    const response = await prompt({ message })
    return response.output
  },
)
