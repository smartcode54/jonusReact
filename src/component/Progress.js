import React from 'react'
import { useQuiz } from '../context/QuizContext'

export default function Progress() {
     const { index, points, questions } = useQuiz();
     const numQuestions = questions.length;
     const totalPoints = questions.reduce((acc, question) => acc + question.points, 0);

     return (
     <div className='progress'>
          <p>Question <strong>{index + 1}</strong> / {numQuestions}</p>
          <div>
               <p> <strong>{points}</strong> / {totalPoints} </p>
          </div>
     </div>
     )
}
