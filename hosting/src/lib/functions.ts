import { httpsCallable as _httpsCallable } from 'firebase/functions'

import { functions } from './firebase'

export const httpsCallable = (name: string, options?: any) =>
  _httpsCallable(functions, name, options)
