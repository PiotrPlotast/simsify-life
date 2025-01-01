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
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    setTotalHours(hours);
    setTotalMinutes(minutes);
    setTotalSeconds(seconds);
  }, [time]);
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
    <div className="flex space-x-4 border p-4 rounded-lg">
      <h2>{icon}</h2>
      <h2 className="px-4">{skillName}</h2>
      <h2>
        {totalHours}:{totalMinutes}:{totalSeconds}
      </h2>
      <h2>{level}</h2>
      <button className="self-end" onClick={handleProgress}>
        {isStarted ? "Stop" : "Start"}
      </button>
    </div>
  );
}
