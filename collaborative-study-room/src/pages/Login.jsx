import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { signInWithGooglePopup, emailPasswordLogin } from '../lib/firebase'

export default function Login({ onLogin }) {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')

	const submit = async (e) => {
		e.preventDefault()
		setError('')
		try {
			if (!email || !password) throw new Error('Please enter email and password')
			const { user } = await emailPasswordLogin(email, password)
			onLogin?.({ name: user.displayName || (user.email?.split('@')[0]) || 'Student', email: user.email })
		} catch (err) {
			setError(err.message || 'Login failed')
		}
	}

	return (
		<div className="min-h-[80dvh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
			<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
				<div className="glass p-6 rounded-3xl">
					<div className="flex items-center gap-3 mb-5">
						<span className="inline-block h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700"></span>
						<div>
							<h1 className="text-xl font-semibold leading-tight">Welcome back</h1>
							<p className="text-sm text-slate-600 dark:text-slate-300">Sign in to continue studying</p>
						</div>
					</div>

				<form onSubmit={submit} className="space-y-3">
					<input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
					<input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
					{error && <div className="text-sm text-rose-600">{error}</div>}
					<button type="submit" className="w-full px-3 py-2 rounded-xl bg-indigo-600 text-white">Login</button>
				</form>

				<div className="my-4 flex items-center gap-3 text-xs text-slate-500">
					<div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
					<span>or</span>
					<div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
				</div>
				<div className="grid grid-cols-2 gap-2">
					<button className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800" onClick={async ()=>{ try { const { user } = await signInWithGooglePopup(); onLogin?.({ name: user.displayName || 'Student', email: user.email }) } catch (err) { setError(err.message) } }}>Google</button>
					<button className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800" disabled>GitHub</button>
				</div>

				<p className="mt-4 text-sm text-center text-slate-600 dark:text-slate-300">
					No account? <NavLink to="/signup" className="text-indigo-600">Sign up</NavLink>
				</p>
				</div>
			</motion.div>
		</div>
	)
}


