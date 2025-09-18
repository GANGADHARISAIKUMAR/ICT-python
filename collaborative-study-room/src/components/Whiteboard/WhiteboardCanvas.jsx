import React, { useEffect, useRef, useState } from 'react'
import { addStroke, subscribeStrokes } from '../../lib/realtime'

export default function WhiteboardCanvas({ boardId = 'default' }) {
	const canvasRef = useRef(null)
	const [isDrawing, setIsDrawing] = useState(false)
	const [mode, setMode] = useState('draw') // 'draw' | 'erase' | 'text'
	const [color, setColor] = useState('#111827')
	const [size, setSize] = useState(3)
  const [strokes, setStrokes] = useState([])

	useEffect(() => {
		const canvas = canvasRef.current
		const ctx = canvas.getContext('2d')
		const dpr = window.devicePixelRatio || 1
		const setSizeForCanvas = () => {
			const rect = canvas.getBoundingClientRect()
			canvas.width = rect.width * dpr
			canvas.height = rect.height * dpr
			ctx.setTransform(1,0,0,1,0,0)
			ctx.scale(dpr, dpr)
			ctx.lineCap = 'round'
			redraw()
		}
		setSizeForCanvas()
		window.addEventListener('resize', setSizeForCanvas)
		return () => window.removeEventListener('resize', setSizeForCanvas)
	}, [])

	const getCtx = () => canvasRef.current.getContext('2d')

	// Subscribe to saved strokes/texts and redraw when they change
	useEffect(() => {
		const unsub = subscribeStrokes({ boardId, onChange: setStrokes })
		return unsub
	}, [boardId])

	useEffect(() => {
		redraw()
	}, [strokes])

	const redraw = () => {
		const ctx = getCtx()
		const rect = canvasRef.current.getBoundingClientRect()
		ctx.clearRect(0, 0, rect.width, rect.height)
		for (const s of strokes) {
			if (s.mode === 'text' && s.text && s.position) {
				ctx.save()
				ctx.fillStyle = s.color || '#111827'
				ctx.font = `${(s.size || 16) * 4}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto`
				ctx.textBaseline = 'top'
				ctx.fillText(s.text, s.position.x, s.position.y)
				ctx.restore()
			} else if (Array.isArray(s.points) && s.points.length > 1) {
				ctx.save()
				ctx.strokeStyle = s.mode === 'erase' ? '#ffffff' : (s.color || '#111827')
				ctx.lineWidth = s.size || 3
				ctx.beginPath()
				ctx.moveTo(s.points[0].x, s.points[0].y)
				for (let i = 1; i < s.points.length; i++) ctx.lineTo(s.points[i].x, s.points[i].y)
				ctx.stroke()
				ctx.restore()
			} else if (Array.isArray(s.points) && s.points.length === 1) {
				// Single point sample
				ctx.save()
				ctx.fillStyle = s.color || '#111827'
				const r = (s.size || 3) / 2
				ctx.beginPath()
				ctx.arc(s.points[0].x, s.points[0].y, r, 0, Math.PI * 2)
				ctx.fill()
				ctx.restore()
			}
		}
	}

	const onPointerDown = (e) => {
		const rect = canvasRef.current.getBoundingClientRect()
		if (mode === 'text') {
			const x = e.clientX - rect.left
			const y = e.clientY - rect.top
			const text = window.prompt('Enter text')
			if (text && text.trim()) {
				// Draw locally
				const ctx = getCtx()
				ctx.save()
				ctx.fillStyle = color
				ctx.font = `${size * 4}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto`
				ctx.textBaseline = 'top'
				ctx.fillText(text, x, y)
				ctx.restore()
				// Persist
				addStroke({ boardId, points:[{x,y}], color, size, mode:'text', text, position:{x,y} }).catch(()=>{})
			}
			return
		}
		setIsDrawing(true)
		const ctx = getCtx()
		ctx.beginPath()
		ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
	}
	const onPointerMove = (e) => {
		if (!isDrawing) return
		const rect = canvasRef.current.getBoundingClientRect()
		const ctx = getCtx()
		ctx.strokeStyle = mode === 'erase' ? '#ffffff' : color
		ctx.lineWidth = size
		ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
		ctx.stroke()
	}
	const onPointerUp = () => setIsDrawing(false)

	const clear = () => {
		const ctx = getCtx()
		const rect = canvasRef.current.getBoundingClientRect()
		ctx.clearRect(0, 0, rect.width, rect.height)
	}

	return (
		<div className="glass rounded-2xl p-3">
			<div className="flex items-center gap-2 mb-3">
				<select className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800" value={mode} onChange={(e)=>setMode(e.target.value)}>
					<option value="draw">Draw</option>
					<option value="erase">Erase</option>
				</select>
				<input type="color" value={color} onChange={(e)=>setColor(e.target.value)} className="h-8 w-8" />
				<input type="range" min="1" max="20" value={size} onChange={(e)=>setSize(Number(e.target.value))} />
				<button onClick={clear} className="px-3 py-1.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200">Clear</button>
				<button onClick={()=>{
					const rect = canvasRef.current.getBoundingClientRect()
					// Simple stroke sample: store a single point path for demo
					addStroke({ boardId, points:[{x:Math.random()*rect.width,y:Math.random()*rect.height}], color, size, mode })
				}} className="px-3 py-1.5 rounded bg-slate-100 dark:bg-slate-800">Save Stroke</button>
			</div>
			<div className="h-[60dvh] bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
				<canvas
					ref={canvasRef}
					className="w-full h-full touch-none"
					onPointerDown={onPointerDown}
					onPointerMove={onPointerMove}
					onPointerUp={onPointerUp}
					onPointerLeave={onPointerUp}
				/>
			</div>
		</div>
	)
}
