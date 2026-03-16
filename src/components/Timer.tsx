"use client";

import { useEffect, useState, useCallback } from "react";

interface TimerProps {
  initialSeconds: number;
  onTimeUp?: () => void;
  onTick?: (secondsLeft: number) => void;
  paused?: boolean;
}

export default function Timer({ initialSeconds, onTimeUp, onTick, paused }: TimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  const handleTick = useCallback(() => {
    if (onTick) onTick(seconds - 1);
  }, [onTick, seconds]);

  useEffect(() => {
    if (paused || seconds <= 0) return;
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
      handleTick();
    }, 1000);
    return () => clearInterval(interval);
  }, [paused, seconds <= 0, handleTick, onTimeUp]);

  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const isWarning = seconds < 300;
  const isCritical = seconds < 60;

  return (
    <div
      className={`font-mono text-lg font-bold px-4 py-2 rounded-lg ${
        isCritical
          ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
          : isWarning
          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
          : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
      }`}
    >
      {hours > 0 && `${hours}:`}
      {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
    </div>
  );
}
