import { useState, useEffect, useCallback } from "react";

export function useTimer(initialTime: number) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, timeLeft]);

  const start = useCallback(() => {
    setIsRunning(true);
    setIsCompleted(false);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(initialTime);
    setIsCompleted(false);
  }, [initialTime]);

  const resume = useCallback(() => {
    if (timeLeft > 0) {
      setIsRunning(true);
    }
  }, [timeLeft]);

  // Reset timer when initialTime changes
  useEffect(() => {
    setTimeLeft(initialTime);
    setIsRunning(false);
    setIsCompleted(false);
  }, [initialTime]);

  return {
    timeLeft,
    isRunning,
    isCompleted,
    start,
    pause,
    reset,
    resume,
  };
}
