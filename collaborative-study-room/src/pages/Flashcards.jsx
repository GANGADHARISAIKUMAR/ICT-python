import React from 'react'
import Flashcard from '../components/Flashcards/Flashcard'

const cards = [
	{ id: '1', front: 'Derivative of sin(x)?', back: 'cos(x)' },
	{ id: '2', front: 'Capital of Japan?', back: 'Tokyo' },
	{ id: '3', front: 'H2O is?', back: 'Water' },
]

export default function Flashcards() {
	return (
		<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
			<div className="grid sm:grid-cols-2 gap-4">
				{cards.map((c) => (
					<Flashcard key={c.id} front={c.front} back={c.back} />
				))}
			</div>
		</div>
	)
}
