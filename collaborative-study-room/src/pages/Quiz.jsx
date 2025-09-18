import React from 'react'
import QuizRunner from '../components/Quiz/QuizRunner'

const questions = [
	{ id: 'q1', title: '2 + 2 = ?', options: [
		{ id: 'a', label: '3', correct: false },
		{ id: 'b', label: '4', correct: true },
		{ id: 'c', label: '5', correct: false },
	] },
	{ id: 'q2', title: 'Capital of France?', options: [
		{ id: 'a', label: 'Berlin', correct: false },
		{ id: 'b', label: 'Paris', correct: true },
		{ id: 'c', label: 'Rome', correct: false },
	] },
	{ id: 'q3', title: 'Derivative of x^2?', options: [
		{ id: 'a', label: '2x', correct: true },
		{ id: 'b', label: 'x', correct: false },
		{ id: 'c', label: 'x^3', correct: false },
	] },
	{ id: 'q4', title: 'Which is a prime number?', options: [
		{ id: 'a', label: '21', correct: false },
		{ id: 'b', label: '29', correct: true },
		{ id: 'c', label: '1', correct: false },
	] },
	{ id: 'q5', title: 'H2O is the chemical formula for?', options: [
		{ id: 'a', label: 'Oxygen', correct: false },
		{ id: 'b', label: 'Hydrogen', correct: false },
		{ id: 'c', label: 'Water', correct: true },
	] },
]

export default function Quiz() {
	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
			<QuizRunner quizId="general-knowledge" questions={questions} />
		</div>
	)
}
