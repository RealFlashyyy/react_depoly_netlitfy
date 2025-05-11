
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface QuizTimerProps {
  startTime: number;
  onTimeUpdate?: (seconds: number) => void;
}

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const QuizTimer = ({ startTime, onTimeUpdate }: QuizTimerProps) => {
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      const newTime = Math.floor((Date.now() - startTime) / 1000);
      setTimeSpent(newTime);
      if (onTimeUpdate) {
        onTimeUpdate(newTime);
      }
    }, 1000);
    
    return () => clearInterval(timerInterval);
  }, [startTime, onTimeUpdate]);

  return (
    <div className="flex items-center gap-2 bg-muted py-2 px-3 rounded-md">
      <Clock className="h-4 w-4 text-quiz-purple" />
      <span className="text-sm font-medium">{formatTime(timeSpent)}</span>
    </div>
  );
};
