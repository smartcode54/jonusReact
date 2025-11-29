import Option from './Options';

export default function Questions({ question, dispatch, answer, index }) {
  // Safety check: if question doesn't exist, don't render
  if (!question) return null;

  return (
    <div>
      <h4>Question {index + 1} : <br /> {question.question}</h4>
      <Option question={question} dispatch={dispatch} answer={answer} />
    </div>
  );
}
