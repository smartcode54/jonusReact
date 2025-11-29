import React from 'react'

export default function ProgressBar({ index, numQuestions }) {
  return (
    <div className='progress-bar'>
      <progress max={numQuestions} value={index + 1}></progress>
    </div>
  )
}
