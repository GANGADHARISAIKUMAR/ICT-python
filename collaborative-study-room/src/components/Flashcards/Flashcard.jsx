import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function Flashcard({ front, back }) {
	const [flipped, setFlipped] = useState(false)
	return (
		<motion.div className="w-full h-48 sm:h-56 md:h-64 perspective"
			onClick={() => setFlipped((v)=>!v)}>
			<motion.div
				className="relative w-full h-full rounded-2xl glass cursor-pointer"
				style={{ transformStyle: 'preserve-3d' }}
				animate={{ rotateY: flipped ? 180 : 0 }}
				transition={{ duration: 0.4 }}
			>
				<div className="absolute inset-0 backface-hidden flex items-center justify-center p-6 text-center">
					<div>
						<p className="text-sm uppercase tracking-wide text-slate-500">Question</p>
						<div className="mt-2 text-lg sm:text-xl font-semibold">{front}</div>
					</div>
				</div>
				<div className="absolute inset-0 backface-hidden rotate-y-180 flex items-center justify-center p-6 text-center">
					<div>
						<p className="text-sm uppercase tracking-wide text-slate-500">Answer</p>
						<div className="mt-2 text-lg sm:text-xl font-semibold">{back}</div>
					</div>
				</div>
			</motion.div>
		</motion.div>
	)
}

// CSS helpers
const style = document.createElement('style')
style.innerHTML = `.perspective{perspective:1000px}.backface-hidden{backface-visibility:hidden}.rotate-y-180{transform:rotateY(180deg)}`
if (typeof document !== 'undefined' && !document.getElementById('flashcard-helpers')) {
	style.id = 'flashcard-helpers'
	document.head.appendChild(style)
}
