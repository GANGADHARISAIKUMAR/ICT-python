// Firebase initialization and Auth helpers
import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported as analyticsSupported } from 'firebase/analytics'
import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
} from 'firebase/auth'

const firebaseConfig = {
	apiKey: 'AIzaSyCehxRlCsT4K0N7yXWOGrf9smqDDufG_kY',
	authDomain: 'study-place-af3c1.firebaseapp.com',
	projectId: 'study-place-af3c1',
	storageBucket: 'study-place-af3c1.firebasestorage.app',
	messagingSenderId: '147792319133',
	appId: '1:147792319133:web:ef022d869ac910c062fa74',
	measurementId: 'G-VX1FY7SGPJ',
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

// Initialize analytics only if supported (avoids SSR build issues)
export let analytics = null
;(async () => {
	try {
		if (typeof window !== 'undefined' && (await analyticsSupported())) {
			analytics = getAnalytics(app)
		}
	} catch {}
})()

export const googleProvider = new GoogleAuthProvider()

export async function signInWithGooglePopup() {
	return signInWithPopup(auth, googleProvider)
}

export async function emailPasswordLogin(email, password) {
	return signInWithEmailAndPassword(auth, email, password)
}

export async function emailPasswordSignup(email, password) {
	return createUserWithEmailAndPassword(auth, email, password)
}

export async function logoutFirebase() {
	return signOut(auth)
}

export { onAuthStateChanged }


