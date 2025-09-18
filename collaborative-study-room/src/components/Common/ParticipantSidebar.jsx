import React from 'react'
import { UserIcon } from '@heroicons/react/24/solid'

export default function ParticipantSidebar({ participants = [], onAction }) {
	return (
		<aside className="w-full md:w-64 glass rounded-2xl p-4 h-fit">
			<h3 className="font-semibold mb-3">Participants</h3>
			<ul className="space-y-2">
				{participants.map((p) => (
					<li key={p.id} className="flex items-center justify-between">
						<span className="flex items-center gap-2">
							<UserIcon className={`w-5 h-5 ${p.isHost ? 'text-amber-500' : 'text-slate-400'}`} />
							<span>{p.name}</span>
						</span>
						<div className="flex gap-1">
							<button className="px-2 py-1 text-xs rounded bg-slate-100 dark:bg-slate-800" onClick={() => onAction?.('mute', p)}>Mute</button>
							<button className="px-2 py-1 text-xs rounded bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200" onClick={() => onAction?.('remove', p)}>Remove</button>
						</div>
					</li>
				))}
			</ul>
		</aside>
	)
}
