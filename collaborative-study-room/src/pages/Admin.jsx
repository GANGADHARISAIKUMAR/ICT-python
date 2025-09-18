import React, { useState } from 'react'

export default function Admin() {
	const [actions, setActions] = useState([])
	const log = (msg) => setActions((a)=>[msg, ...a].slice(0,8))
	return (
		<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
			<div className="grid md:grid-cols-2 gap-4">
				<div className="glass rounded-2xl p-4">
					<h3 className="font-semibold mb-2">Session Controls</h3>
					<div className="grid grid-cols-2 gap-2">
						<button className="px-3 py-2 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200" onClick={()=>log('All participants muted')}>Mute All</button>
						<button className="px-3 py-2 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200" onClick={()=>log('Removed user: Rohan')}>Remove User</button>
						<button className="px-3 py-2 rounded-xl bg-brand-600 text-white" onClick={()=>log('Quiz started')}>Start Quiz</button>
						<button className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800" onClick={()=>log('Session ended')}>End Session</button>
					</div>
				</div>
				<div className="glass rounded-2xl p-4">
					<h3 className="font-semibold mb-2">Activity Log</h3>
					<ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
						{actions.map((a,i)=>(<li key={i}>• {a}</li>))}
					</ul>
				</div>
			</div>
		</div>
	)
}
