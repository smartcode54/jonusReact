import React from 'react'

export default function Timer({ secondsRemaining }) {
  if (secondsRemaining === null) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedSeconds = seconds.toString().padStart(2, '0');

  return (
    <div className="timer">
      Time: {minutes}:{formattedSeconds}
    </div>
  );
}
