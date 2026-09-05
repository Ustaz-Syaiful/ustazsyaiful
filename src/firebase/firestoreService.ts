import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { RPHItem, PbdStudentRecord, TasmikRecord } from '../types';

export const COLLECTIONS = {
  RPH: 'rph',
  PBD: 'pbd_students',
  TASMIK: 'tasmik_records'
} as const;

/**
 * Save or update an e-RPH item in Firestore
 */
export async function saveRphToFirestore(rph: RPHItem): Promise<void> {
  if (!db) return;
  const path = `${COLLECTIONS.RPH}/${rph.id}`;
  try {
    const docRef = doc(db, COLLECTIONS.RPH, rph.id);
    await setDoc(docRef, {
      ...rph,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Delete an e-RPH item from Firestore
 */
export async function deleteRphFromFirestore(id: string): Promise<void> {
  if (!db) return;
  const path = `${COLLECTIONS.RPH}/${id}`;
  try {
    await deleteDoc(doc(db, COLLECTIONS.RPH, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Subscribe to real-time e-RPH updates
 */
export function subscribeToRph(
  onData: (items: RPHItem[]) => void,
  onError?: (error: Error) => void
): () => void {
  if (!db) return () => {};
  const path = COLLECTIONS.RPH;
  try {
    const q = query(collection(db, path), orderBy('week', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: RPHItem[] = [];
        snapshot.forEach((d) => {
          items.push(d.data() as RPHItem);
        });
        onData(items);
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.GET, path);
        } catch (e: any) {
          onError?.(e);
        }
      }
    );
    return unsubscribe;
  } catch (err: any) {
    onError?.(err);
    return () => {};
  }
}

/**
 * Save PBD Student record
 */
export async function savePbdStudentToFirestore(student: PbdStudentRecord): Promise<void> {
  if (!db) return;
  const path = `${COLLECTIONS.PBD}/${student.id}`;
  try {
    await setDoc(doc(db, COLLECTIONS.PBD, student.id), {
      ...student,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Save Tasmik record
 */
export async function saveTasmikRecordToFirestore(record: TasmikRecord): Promise<void> {
  if (!db) return;
  const path = `${COLLECTIONS.TASMIK}/${record.id}`;
  try {
    await setDoc(doc(db, COLLECTIONS.TASMIK, record.id), {
      ...record,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
