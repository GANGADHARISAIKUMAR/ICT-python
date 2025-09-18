import React, { useEffect, useMemo, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '@heroicons/react/24/outline'
import { auth, onAuthStateChanged } from '../lib/firebase'
import { subscribeToMonthSessions, createSession, updateSession, deleteSession, Timestamp } from '../lib/calendarStore'

function generateMonth(year, month) {
	const first = new Date(year, month, 1)
	const last = new Date(year, month + 1, 0)
	const days = []
	for (let i = 1; i <= last.getDate(); i++) days.push(new Date(year, month, i))
	const leading = first.getDay()
	const trailing = 6 - last.getDay()
	return { days, leading, trailing }
}

export default function Calendar() {
	const today = new Date()
	const [ym, setYm] = useState({ y: today.getFullYear(), m: today.getMonth() })
  const [events, setEvents] = useState({}) // key: yyyy-mm-dd -> [{id,title,time}]
  const [uid, setUid] = useState(null)
	const { days, leading, trailing } = useMemo(() => generateMonth(ym.y, ym.m), [ym])

	const key = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  // Track auth state so Calendar loads/saves reliably
  useEffect(() => {
    const off = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid || null)
    })
    return off
  }, [])

  useEffect(() => {
    if (!uid) return
    const unsub = subscribeToMonthSessions({
      uid,
      year: ym.y,
      monthIndex: ym.m,
      onChange: (list) => {
        const grouped = {}
        for (const ev of list) {
          const dt = ev.startsAt?.toDate?.() || new Date()
          const k = key(dt)
          if (!grouped[k]) grouped[k] = []
          grouped[k].push({ id: ev.id, title: ev.title, time: ev.time || '', startsAt: ev.startsAt })
        }
        setEvents(grouped)
      },
    })
    return unsub
  }, [uid, ym.y, ym.m])

  const add = async (d) => {
    const title = prompt('Session title?')
    if (!title) return
    const time = prompt('Time (e.g., 4:00 PM)') || ''
    const starts = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 16, 0, 0)
    if (!uid) return alert('Please login first')
    try {
      await createSession(uid, { title, time, startsAt: Timestamp.fromDate(starts) })
      // Feedback will appear via subscription; optionally toast
    } catch (err) {
      alert('Failed to save session: ' + (err?.message || 'Unknown error'))
    }
  }

	return (
		<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
			<div className="flex items-center justify-between mb-3">
				<button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800" onClick={()=>setYm(({y,m})=> m===0?{y:y-1,m:11}:{y,m:m-1})}><ChevronLeftIcon className="w-5 h-5" /></button>
				<h3 className="font-semibold">{new Date(ym.y, ym.m).toLocaleString(undefined,{ month:'long', year:'numeric' })}</h3>
				<button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800" onClick={()=>setYm(({y,m})=> m===11?{y:y+1,m:0}:{y,m:m+1})}><ChevronRightIcon className="w-5 h-5" /></button>
			</div>
			<div className="grid grid-cols-7 gap-2 text-xs text-slate-500">
				{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d)=> <div key={d} className="text-center">{d}</div>)}
			</div>
			<div className="mt-2 grid grid-cols-7 gap-2">
				{Array.from({length:leading}).map((_,i)=> <div key={`l${i}`}></div>)}
				{days.map((d)=> (
					<div key={d.toISOString()} className="glass rounded-xl p-2 min-h-24">
						<div className="flex items-center justify-between">
							<div className="text-sm font-medium">{d.getDate()}</div>
							<button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800" onClick={()=>add(d)}><PlusIcon className="w-4 h-4" /></button>
						</div>
						<div className="mt-1 space-y-1">
							{(events[key(d)]||[]).map((ev, i)=> (
								<div key={i} className="px-2 py-1 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200 text-xs">
									{ev.time && <span className="mr-1">{ev.time}</span>}{ev.title}
								</div>
							))}
						</div>
					</div>
				))}
				{Array.from({length:trailing}).map((_,i)=> <div key={`t${i}`}></div>)}
			</div>
		</div>
	)
}
