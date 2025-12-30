import React, { useState, useEffect } from 'react';
import './Countdown.css';

type CountdownProps = {
  start: number;
  onComplete: () => void;
};

export const Countdown: React.FC<CountdownProps> = ({ start, onComplete }) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => {
        setCount(count - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [count, onComplete]);

  return (
    <div className="countdown-overlay">
      <div className="countdown-timer">{count}</div>
    </div>
  );
};
