import React from 'react'
import { PlayIcon } from '@heroicons/react/24/solid'

const recordings = [
	{ id: 'r1', title: 'Algebra Session - Sep 10', duration: '45:12' },
	{ id: 'r2', title: 'Biology Diagrams - Sep 12', duration: '38:04' },
]

export default function Recordings() {
	return (
		<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
			<div className="grid sm:grid-cols-2 gap-4">
				{recordings.map((r)=> (
					<div key={r.id} className="glass rounded-2xl p-4 flex items-center justify-between">
						<div>
							<div className="font-semibold">{r.title}</div>
							<div className="text-sm text-slate-600 dark:text-slate-300">{r.duration}</div>
						</div>
						<button className="p-3 rounded-full bg-indigo-600 text-white"><PlayIcon className="w-5 h-5" /></button>
					</div>
				))}
			</div>
		</div>
	)
}
