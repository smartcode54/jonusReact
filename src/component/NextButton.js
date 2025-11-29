import React from 'react'

function NextButton({ dispatch, answer, index, numQuestions}) {
     if (answer === null) return;
     
     const isLastQuestion = index === numQuestions - 1;
     return (
          <div>
               <button className='btn btn-ui'
                    onClick={() => dispatch({ type: 'nextQuestion' })}>
                    {isLastQuestion ? 'Finish' : 'Next'}
               </button>
          </div>
     )
}

export default NextButton ;