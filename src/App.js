import { useEffect, useReducer } from 'react';

import Header from './component/Header';
import Main from './component/Main';
import Loader from './component/Loader';
import Error from './component/Error';
import StartScreen from './component/StartScreen';
import Questions from './component/Questions';
import NextButton from './component/NextButton';
import Progress from './component/Progress';
import ProgressBar from './component/ProgressBar';
import FinishScreen from './component/FinishScreen';
import Timer from './component/Timer'; // Add this import

const SECONDS_PER_QUESTION = 30;
const initialState = {
  questions: [],
  status: 'loading', // 'loading', 'error', 'active', 'finished', newAnser, nextQuestion, restart
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null, // Add timer state
};

// ย้าย reducer ออกมาข้างนอก component
function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return {
        ...state,
        questions: action.payload,
        status: 'ready',
      };
    case 'dataFailed':
      return {
        ...state,
        status: 'error',
      };
    case 'start':
      return {
        ...state,
        status: 'active',
        index: 0,
        answer: null,
        points: 0,
        secondsRemaining: state.questions.length * SECONDS_PER_QUESTION, // Set timer to 7 minutes
      };
    case 'tick':
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? 'finished' : state.status,
      };
    case 'newAnswer':
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points: action.payload === question.correctOption ?
          state.points + question.points :
          state.points,
      };
    case 'nextQuestion':
      if (state.index + 1 >= state.questions.length) {
        return {
          ...state,
          status: 'finished',
          highscore: state.points > state.highscore ? state.points : state.highscore,
        };
      }
      else {
        return {
          ...state,
          index: state.index + 1,
          answer: null,
        };
      }
    case 'restart':
      return {
        ...initialState,
        questions: state.questions,
        status: 'ready',
        highscore: 0,
        points: 0,
        index: 0,
        answer: null,
        secondsRemaining: null, // Reset timer
      };
    default:
      throw new Error('Action unknown');
  }
}

// ตั้งชื่อ component ให้ชัดเจน
export default function App() {
  const [{ questions, status, index, answer, points, highscore, secondsRemaining }, dispatch] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const totalPoints = questions.reduce((acc, question) => acc + question.points, 0);

  useEffect(function fetchQuestions() { // ตั้งชื่อ function ใน useEffect
    fetch('http://localhost:9000/questions')
      .then(res => res.json())
      .then(data => dispatch({ type: 'dataReceived', payload: data }))
      .catch(err => dispatch({ type: 'dataFailed' }));
  }, []);

  // Timer useEffect
  useEffect(function () {
    if (status !== 'active' || secondsRemaining === null) return;

    const interval = setInterval(function () {
      dispatch({ type: 'tick' });
    }, 1000);

    return () => clearInterval(interval);
  }, [status, secondsRemaining]);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' &&
          <StartScreen
            numQuestions={numQuestions}
            dispatch={dispatch} />}
        {status === 'active' &&
          <>
            <ProgressBar
              index={index}
              numQuestions={numQuestions} />
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              totalPoints={totalPoints} />
            <Questions
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
              index={index} />
            <footer>
              <Timer secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                numQuestions={numQuestions}
                index={index}
                answer={answer} />
            </footer>
          </>
        }
        {status === 'finished' &&
          <FinishScreen
            points={points}
            totalPoints={totalPoints}
            dispatch={dispatch}
            highscore={highscore} />}
      </Main>


    </div>
  );
}
