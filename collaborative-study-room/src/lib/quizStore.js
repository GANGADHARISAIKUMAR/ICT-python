import { app } from './firebase'
import {
	getFirestore,
	collection,
	addDoc,
	serverTimestamp,
	query,
	orderBy,
	limit,
	onSnapshot,
} from 'firebase/firestore'

const db = getFirestore(app)

export async function recordQuizResult({ uid, displayName, quizId, score, total }) {
	const col = collection(db, 'quizzes', quizId, 'results')
	await addDoc(col, {
		uid,
		displayName,
		score,
		total,
		percentage: total ? Math.round((score / total) * 100) : 0,
		createdAt: serverTimestamp(),
	})
}

export function subscribeLeaderboard({ quizId, top = 10, onChange }) {
	const col = collection(db, 'quizzes', quizId, 'results')
	const q = query(col, orderBy('percentage', 'desc'), orderBy('createdAt', 'asc'), limit(top))
	return onSnapshot(q, (snap) => {
		const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
		onChange(rows)
	})
}


