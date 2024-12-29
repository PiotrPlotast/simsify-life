import { useState, useRef, useEffect } from "react";

interface SkillProps {
  skillName: string;
  level: number;
  time: number;
  icon: string;
  onHandleProgress: (skill: string) => void;
}

export default function Skill({
  skillName,
  level,
  time,
  icon,
  onHandleProgress,
}: SkillProps) {
  const [isStarted, setIsStarted] = useState(false);

  function handleProgress() {
    setIsStarted(!isStarted);
  }

  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isStarted) {
      intervalIdRef.current = setInterval(() => {
        onHandleProgress(skillName);
      }, 1000);
    } else if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [isStarted, onHandleProgress, skillName]);

  return (
    <div className="flex w-48">
      <h2>{icon}</h2>
      <h2>{skillName}</h2>
      <h2>{time}</h2>
      <h2>{level}</h2>
      <button onClick={handleProgress}>{isStarted ? "Stop" : "Start"}</button>
    </div>
  );
}
