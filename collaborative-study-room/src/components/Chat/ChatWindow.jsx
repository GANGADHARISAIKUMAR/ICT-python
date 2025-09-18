import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FaceSmileIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { auth } from '../../lib/firebase'
import { subscribeChat, sendMessage as sendMsg, toggleReaction as toggleReact } from '../../lib/realtime'

const reactions = ['👍','❤️','😂','🎉','🤔','👏']

export default function ChatWindow({ roomId = 'default', initialMessages = [], participants = [] }) {
	const [messages, setMessages] = useState(initialMessages)
	const [text, setText] = useState('')
	const endRef = useRef(null)

	const me = useMemo(() => {
		// Create a lightweight guest identity if not authenticated
		const getGuest = () => {
			try {
				let g = JSON.parse(localStorage.getItem('csr_guest') || 'null')
				if (!g) {
					g = { id: `guest-${Math.random().toString(36).slice(2,8)}`, name: 'Guest' }
					localStorage.setItem('csr_guest', JSON.stringify(g))
				}
				return g
			} catch { return { id: 'guest', name: 'Guest' } }
		}
		return {
			id: auth.currentUser?.uid || getGuest().id,
			name: auth.currentUser?.displayName || 'You',
		}
	}, [])

	useEffect(() => {
		const unsub = subscribeChat({ roomId, onChange: setMessages })
		return unsub
	}, [roomId])

	// Auto-scroll when messages change
	useEffect(() => {
		queueMicrotask(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }))
	}, [messages])

	const addMessage = async (content) => {
		if (!content.trim()) return
		try {
			await sendMsg({ roomId, user: { id: me.id, name: me.name }, content })
			setText('')
			queueMicrotask(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }))
		} catch (err) {
			// Optimistic local append so user gets immediate feedback
			const temp = { id: `local-${Date.now()}`, user: { id: me.id, name: me.name }, content, reactions: {} }
			setMessages((m)=>[...m, temp])
			setText('')
			console.warn('Send failed (likely Firestore rules). Showing locally only.', err)
		}
	}

	const toggleReaction = async (id, emoji) => {
		const msg = messages.find((m)=>m.id===id)
		const active = !(msg?.reactions?.[emoji])
		await toggleReact({ roomId, messageId: id, emoji, active })
	}

	return (
		<div className="glass rounded-2xl p-4 h-[70dvh] flex flex-col">
			<div className="flex-1 overflow-y-auto space-y-3 pr-1">
				{messages.map((m) => (
					<motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`max-w-[80%] w-fit ${m.user.id==='me' ? 'ml-auto' : ''}`}>
						<div className={`px-3 py-2 rounded-2xl ${m.user.id==='me' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-slate-100 dark:bg-slate-800 rounded-bl-sm'}`}>
							<div className="text-xs opacity-70 mb-0.5">{m.user.name}</div>
							<div>{m.content}</div>
						</div>
						<div className="flex gap-1 mt-1">
							{reactions.map((emoji) => (
								<button key={emoji} className={`text-xs px-2 py-0.5 rounded-full ${(m.reactions?.[emoji]) ? 'bg-amber-100 dark:bg-amber-900/40' : 'bg-slate-100 dark:bg-slate-800'}`} onClick={() => toggleReaction(m.id, emoji)}>
									{emoji}{(m.reactions?.[emoji]) ? '' : ''}
								</button>
							))}
						</div>
					</motion.div>
				))}
				<div ref={endRef} />
			</div>
			<div className="mt-3 flex items-center gap-2">
				<button className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 shrink-0" aria-label="Emoji">
					<FaceSmileIcon className="w-5 h-5" />
				</button>
				<input value={text} onChange={(e)=>setText(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter') addMessage(text) }} placeholder="Type a message..." className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
				<button type="button" onClick={()=>addMessage(text)} className="px-3 py-2 rounded-xl bg-brand-600 text-white flex items-center gap-1 shrink-0">
					<PaperAirplaneIcon className="w-4 h-4" /> Send
				</button>
			</div>
		</div>
	)
}
