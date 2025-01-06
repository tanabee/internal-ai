import { useEffect, useState } from 'react'

import {
  type DocumentSnapshot,
  Timestamp,
  addDoc as _addDoc,
  deleteDoc as _deleteDoc,
  getDoc as _getDoc,
  getDocs as _getDocs,
  setDoc as _setDoc,
  updateDoc as _updateDoc,
  where as _where,
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'

import { db } from './firebase'

const format = (data: Record<string, any>) => {
  const _data: Record<string, any> = {}
  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof Date) {
      _data[key] = Timestamp.fromDate(value)
    } else {
      _data[key] = value
    }
  })
  return _data
}

const parseDoc = (doc: DocumentSnapshot) => {
  const data = doc.data({ serverTimestamps: 'estimate' })

  if (!data) throw new Error('Data not found')

  const parse = (object: Record<string, any>) => {
    Object.entries(object).forEach(([key, value]) => {
      if (value instanceof Timestamp) {
        object[key] = value.toDate()
      } else if (value instanceof Object) {
        if (Array.isArray(value)) {
          // Array
          object[key] = value.map((x) => {
            parse(x)
            return x
          })
        } else {
          // Object
          parse(object[key])
        }
      }
    })
  }
  parse(data)

  return { ...data, id: doc.id }
}

export const addDoc = (path: string, data: object) => {
  const createdAt = serverTimestamp()
  return _addDoc(collection(db, path), format({ ...data, createdAt, updatedAt: createdAt }))
}

export const setDoc = (path: string, data: object) => {
  const createdAt = serverTimestamp()
  return _setDoc(doc(db, path), format({ ...data, createdAt, updatedAt: createdAt }))
}

export const updateDoc = (path: string, data: object) => {
  return _updateDoc(doc(db, path), format({ ...data, updatedAt: serverTimestamp() }))
}

export const deleteDoc = (path: string) => {
  return _deleteDoc(doc(db, path))
}

export const getDoc = (path: string) => {
  return _getDoc(doc(db, path)).then(parseDoc)
}

export const getDocs = (path: string, ...conditions: any[]) => {
  return _getDocs(query(collection(db, path), ...conditions)).then(({ docs }) => docs.map(parseDoc))
}

const validateDocPath = (path: string) => {
  if (!path) return false
  const elements = path.split('/')
  if (elements.length % 2 !== 0) return false
  const hasEmptyString = elements.some((x) => x === '')
  return !hasEmptyString
}

export const useDoc = (path: string) => {
  const [item, setItem] = useState(null)

  useEffect(() => {
    if (validateDocPath(path)) {
      return onSnapshot(doc(db, path), (doc) => {
        setItem(parseDoc(doc))
      })
    }
  }, [path])

  return item
}

export const useDocs = (path: string, ...conditions: any[]) => {
  const [items, setItems] = useState([])

  useEffect(() => {
    return onSnapshot(query(collection(db, path), ...conditions), ({ docs }) => {
      setItems(docs.map(parseDoc))
    })
  }, [path])

  return { items }
}

export const where = (field: string, operator: any, value: any) => {
  if (value instanceof Date) {
    value = Timestamp.fromDate(value)
  }
  return _where(field, operator, value)
}

export const generateId = (path: string) => {
  return doc(collection(db, path)).id
}

export { orderBy, limit, serverTimestamp }
