import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { signInWithGooglePopup, emailPasswordSignup } from '../lib/firebase'

export default function Signup({ onSignup }) {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')

	const submit = (e) => {
		e.preventDefault()
		if (!name || !email || !password) {
			setError('Please fill all fields')
			return
		}
		onSignup?.({ name, email })
	}

	return (
		<div className="min-h-[80dvh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
			<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
				<div className="glass p-6 rounded-3xl">
					<div className="flex items-center gap-3 mb-5">
						<span className="inline-block h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700"></span>
						<div>
							<h1 className="text-xl font-semibold leading-tight">Create your account</h1>
							<p className="text-sm text-slate-600 dark:text-slate-300">Start collaborating in minutes</p>
						</div>
					</div>

				<form onSubmit={submit} className="space-y-3">
					<input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
					<input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
					<input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
					{error && <div className="text-sm text-rose-600">{error}</div>}
					<button type="submit" className="w-full px-3 py-2 rounded-xl bg-indigo-600 text-white" onClick={async (e)=>{ e.preventDefault(); try { const { user } = await emailPasswordSignup(email, password); onSignup?.({ name: name || user.displayName || user.email.split('@')[0], email: user.email }) } catch (err) { setError(err.message) } }}>Create Account</button>
				</form>

				<div className="my-4 flex items-center gap-3 text-xs text-slate-500">
					<div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
					<span>or</span>
					<div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
				</div>
				<div className="grid grid-cols-2 gap-2">
					<button className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800" onClick={async ()=>{ try { const { user } = await signInWithGooglePopup(); onSignup?.({ name: user.displayName || 'Student', email: user.email }) } catch (err) { setError(err.message) } }}>Google</button>
					<button className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800" disabled>GitHub</button>
				</div>

				<p className="mt-4 text-sm text-center text-slate-600 dark:text-slate-300">
					Already have an account? <NavLink to="/login" className="text-indigo-600">Login</NavLink>
				</p>
				</div>
			</motion.div>
		</div>
	)
}


