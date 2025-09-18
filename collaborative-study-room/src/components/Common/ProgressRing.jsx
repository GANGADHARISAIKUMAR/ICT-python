import React from 'react'

export default function ProgressRing({ size = 120, strokeWidth = 10, progress = 0, className = '' }) {
	const radius = (size - strokeWidth) / 2
	const circumference = 2 * Math.PI * radius
	const offset = circumference - (progress / 100) * circumference
	return (
		<svg width={size} height={size} className={className}>
			<circle
				stroke="currentColor"
				className="text-slate-200 dark:text-slate-800"
				fill="transparent"
				strokeWidth={strokeWidth}
				cx={size / 2}
				cy={size / 2}
				r={radius}
			/>
			<circle
				stroke="currentColor"
				className="text-indigo-600"
				fill="transparent"
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				strokeDasharray={`${circumference} ${circumference}`}
				strokeDashoffset={offset}
				cx={size / 2}
				cy={size / 2}
				r={radius}
				style={{ transition: 'stroke-dashoffset 0.2s ease' }}
			/>
		</svg>
	)
}
