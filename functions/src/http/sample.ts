import { onRequest } from 'firebase-functions/v2/https'

export const helloWorld = onRequest((request, response) => {
  console.log('Hello logs!')
  response.send('Hello from Firebase!')
})
