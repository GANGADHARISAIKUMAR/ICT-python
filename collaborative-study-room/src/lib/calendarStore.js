import { app } from './firebase'
import {
	getFirestore,
	collection,
	query,
	where,
	orderBy,
	onSnapshot,
	addDoc,
	doc,
	updateDoc,
	deleteDoc,
	serverTimestamp,
	Timestamp,
} from 'firebase/firestore'

const db = getFirestore(app)

export function subscribeToMonthSessions({ uid, year, monthIndex, onChange }) {
	const start = new Date(year, monthIndex, 1)
	const end = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999)
	const colRef = collection(db, 'users', uid, 'sessions')
	const q = query(
		colRef,
		where('startsAt', '>=', Timestamp.fromDate(start)),
		where('startsAt', '<=', Timestamp.fromDate(end)),
		orderBy('startsAt', 'asc')
	)
	return onSnapshot(q, (snap) => {
		const events = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
		onChange(events)
	})
}

export async function createSession(uid, data) {
	const colRef = collection(db, 'users', uid, 'sessions')
	await addDoc(colRef, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
}

export async function updateSession(uid, id, data) {
	const ref = doc(db, 'users', uid, 'sessions', id)
	await updateDoc(ref, { ...data, updatedAt: serverTimestamp() })
}

export async function deleteSession(uid, id) {
	const ref = doc(db, 'users', uid, 'sessions', id)
	await deleteDoc(ref)
}

export { Timestamp }


