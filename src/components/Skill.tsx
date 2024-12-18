import { useState, useRef, useEffect } from "react";

interface SkillProps {
  skillName: string;
  level: number;
  progress: number;
  icon: string;
  onHandleProgress: (skill: string) => void;
  onHandleLvlUp: (skill: string) => void;
}

export default function Skill({
  skillName,
  level,
  progress,
  icon,
  onHandleProgress,
  onHandleLvlUp,
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
      if (progress >= 100) {
        onHandleLvlUp(skillName);
      }
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
      <h2 className="w-16">
        <span
          className={`h-full block bg-green-300`}
          style={{ width: `calc(100% - calc(100% - ${progress}%))` }}
        ></span>
      </h2>
      <h2>{level}</h2>
      <button onClick={handleProgress}>{isStarted ? "Stop" : "Start"}</button>
    </div>
  );
}
