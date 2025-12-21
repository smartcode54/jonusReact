import React from 'react'
import { useQuiz } from '../context/QuizContext'

export default function ProgressBar() {
  const { index, questions } = useQuiz();
  const numQuestions = questions.length;

  return (
    <div className='progress-bar'>
      <progress max={numQuestions} value={index + 1}></progress>
    </div>
  )
}
