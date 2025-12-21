import { QuizProvider, useQuiz } from './context/QuizContext';

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
import Timer from './component/Timer';

// Inner component that uses the context
function AppContent() {
  const { status } = useQuiz();

  return (
    <div className="app">
      <Header />

      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && <StartScreen />}
        {status === 'active' &&
          <>
            <ProgressBar />
            <Progress />
            <Questions />
            <footer>
              <Timer />
              <NextButton />
            </footer>
          </>
        }
        {status === 'finished' && <FinishScreen />}
      </Main>
    </div>
  );
}

// Main App component with Provider
export default function App() {
  return (
    <QuizProvider>
      <AppContent />
    </QuizProvider>
  );
}
