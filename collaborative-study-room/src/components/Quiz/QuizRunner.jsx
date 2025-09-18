import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { auth } from '../../lib/firebase'
import { recordQuizResult, subscribeLeaderboard } from '../../lib/quizStore'

export default function QuizRunner({ quizId = 'default', questions }) {
	const [idx, setIdx] = useState(0)
	const [score, setScore] = useState(0)
	const [timeLeft, setTimeLeft] = useState(20)
	const [leaders, setLeaders] = useState([])
	const current = questions[idx]
	const progress = ((idx) / questions.length) * 100

	useEffect(() => {
		setTimeLeft(20)
		const id = setInterval(() => setTimeLeft((t) => {
			if (t <= 1) {
				clearInterval(id)
				next()
				return 0
			}
			return t - 1
		}), 1000)
		return () => clearInterval(id)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [idx])

	const choose = (opt) => {
		if (opt.correct) setScore((s) => s + 1)
		next()
	}
	const next = () => {
		setIdx((i) => Math.min(i + 1, questions.length))
	}

	useEffect(() => {
		const unsub = subscribeLeaderboard({ quizId, onChange: setLeaders })
		return unsub
	}, [quizId])

	if (idx >= questions.length) {
		return (
			<div className="glass rounded-2xl p-6">
				<h3 className="text-xl font-semibold">Quiz finished!</h3>
				<p className="mt-2">Score: {score} / {questions.length}</p>
				<div className="mt-3">
					<button className="px-3 py-2 rounded-lg bg-indigo-600 text-white" onClick={async ()=>{
						const u = auth.currentUser
						await recordQuizResult({
							uid: u?.uid || 'anon',
							displayName: u?.displayName || 'Anonymous',
							quizId,
							score,
							total: questions.length,
						})
					}}>Save Result</button>
				</div>
				<div className="mt-4">
					<h4 className="font-semibold mb-2">Leaderboard</h4>
					<ul className="text-sm space-y-1">
						{leaders.map((r,i)=>(
							<li key={r.id} className="flex justify-between"><span>{i+1}. {r.displayName}</span><span>{r.percentage}%</span></li>
						))}
					</ul>
				</div>
			</div>
		)
	}

	return (
		<div className="glass rounded-2xl p-4">
			<div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
				<div className="h-full bg-brand-600" style={{ width: `${progress}%` }} />
			</div>
			<div className="mt-4 flex items-center justify-between">
				<div className="text-sm text-slate-600 dark:text-slate-300">Question {idx + 1} / {questions.length}</div>
				<div className="text-sm">⏳ {timeLeft}s</div>
			</div>
			<h3 className="mt-3 text-lg font-semibold">{current.title}</h3>
			<div className="mt-3 grid gap-2">
				{current.options.map((o) => (
					<motion.button whileTap={{ scale: 0.98 }} key={o.id} className="text-left px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700" onClick={() => choose(o)}>
						{o.label}
					</motion.button>
				))}
			</div>
		</div>
	)
}
