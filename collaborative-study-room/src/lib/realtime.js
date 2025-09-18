import { app } from './firebase'
import {
	getFirestore,
	collection,
	addDoc,
	serverTimestamp,
	onSnapshot,
	query,
	orderBy,
	updateDoc,
	doc,
} from 'firebase/firestore'

const db = getFirestore(app)

// CHAT
export function subscribeChat({ roomId = 'default', onChange }) {
	const ref = collection(db, 'rooms', roomId, 'messages')
	const q = query(ref, orderBy('createdAt', 'asc'))
	return onSnapshot(q, (snap) => {
		onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
	})
}

export async function sendMessage({ roomId = 'default', user, content }) {
	const ref = collection(db, 'rooms', roomId, 'messages')
	await addDoc(ref, { user, content, reactions: {}, createdAt: serverTimestamp() })
}

export async function toggleReaction({ roomId = 'default', messageId, emoji, active }) {
	const ref = doc(db, 'rooms', roomId, 'messages', messageId)
	await updateDoc(ref, { [`reactions.${emoji}`]: active ? 1 : 0 })
}

// WHITEBOARD (stroke list)
export function subscribeStrokes({ boardId = 'default', onChange }) {
	const ref = collection(db, 'whiteboards', boardId, 'strokes')
	const q = query(ref, orderBy('createdAt', 'asc'))
	return onSnapshot(q, (snap) => {
		onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
	})
}

export async function addStroke({ boardId = 'default', points, color, size, mode }) {
	const ref = collection(db, 'whiteboards', boardId, 'strokes')
	await addDoc(ref, { points, color, size, mode, createdAt: serverTimestamp() })
}


