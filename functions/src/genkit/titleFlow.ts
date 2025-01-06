import { gemini15Flash, vertexAI } from '@genkit-ai/vertexai'
import { genkit, z } from 'genkit'

const ai = genkit({
  plugins: [
    vertexAI({
      location: 'asia-northeast1',
      projectId: 'internal-ai-demo',
    }),
  ],
  model: gemini15Flash,
})

export const titleFlow = ai.defineFlow(
  {
    name: 'titleFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (message) => {
    // TODO: Use dotprompt
    const response = await ai.generate(
      [
        `Generate a title for the chat in under 50 characters.`,
        `Return the output as a single line, just the title, no other text.`,
        `## Chat Message`,
        message,
      ].join('\n'),
    )
    return response.text
  },
)
