import React, { useEffect, useState } from 'react'
import ProgressRing from '../components/Common/ProgressRing'

export default function Pomodoro() {
	const [running, setRunning] = useState(false)
	const [seconds, setSeconds] = useState(25 * 60)
	const [completed, setCompleted] = useState(0)
	const total = 25 * 60
	const progress = ((total - seconds) / total) * 100

	useEffect(() => {
		if (!running) return
		const id = setInterval(() => setSeconds((s)=>{
			if (s <= 1) {
				setRunning(false)
				setCompleted((c)=>c+1)
				return total
			}
			return s - 1
		}), 1000)
		return () => clearInterval(id)
	}, [running])

	const reset = () => { setRunning(false); setSeconds(total) }

	const mm = String(Math.floor(seconds/60)).padStart(2,'0')
	const ss = String(seconds%60).padStart(2,'0')

	return (
		<div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
			<div className="glass rounded-2xl p-6 text-center">
				<div className="mx-auto w-56">
					<ProgressRing size={220} strokeWidth={12} progress={progress} />
					<div className="-mt-40 text-5xl font-semibold select-none">{mm}:{ss}</div>
				</div>
				<div className="mt-4 flex items-center justify-center gap-2">
					<button className="px-4 py-2 rounded-xl bg-indigo-600 text-white" onClick={()=>setRunning((v)=>!v)}>{running ? 'Pause' : 'Start'}</button>
					<button className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800" onClick={reset}>Reset</button>
				</div>
				<div className="mt-3 text-sm text-slate-600 dark:text-slate-300">Completed sessions: {completed}</div>
			</div>
		</div>
	)
}
