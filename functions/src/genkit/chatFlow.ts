import { gemini15Flash, vertexAI } from '@genkit-ai/vertexai'
import * as cheerio from 'cheerio'
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

const webLoader = ai.defineTool(
  {
    name: 'webLoader',
    description: 'When a URL is received, it accesses the URL and retrieves the content inside.',
    inputSchema: z.object({ url: z.string() }),
    outputSchema: z.string(),
  },
  async ({ url }) => {
    const res = await fetch(url)
    const html = await res.text()
    const $ = cheerio.load(html)
    $('script, style, noscript').remove()
    if ($('article')) {
      return $('article').text()
    }
    return $('body').text()
  },
)

export const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: z.array(MessageSchema),
    outputSchema: z.array(MessageSchema),
  },
  async (messages) => {
    const response = await ai.generate({
      messages,
      tools: [webLoader],
    })
    return response.messages
  },
)
