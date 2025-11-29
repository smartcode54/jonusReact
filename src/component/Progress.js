import React from 'react'

export default function Progress({ index, numQuestions, points , totalPoints }) {
     return (
     <div className='progress'>
          <p>Question <strong>{index + 1}</strong> / {numQuestions}</p>
          <div>
               <p> <strong>{points}</strong> / {totalPoints} </p>
          </div>
     </div>
     )
}
