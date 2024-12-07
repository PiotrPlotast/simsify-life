interface SkillProps {
  skillName: string;
  level: number;
  progress: number;
  icon: string;
}

export default function Skill({
  skillName,
  level,
  progress,
  icon,
}: SkillProps) {
  return (
    <div className="flex space-x-8">
      <h2 className="w-2">{icon}</h2>
      <h2 className="w-14">{skillName}</h2>
      <h2 className="w-48">
        <span
          className={`h-full block bg-green-300`}
          style={{ width: `calc(100% - calc(100% - ${progress}%))` }}
        ></span>
      </h2>
      <h2>{level}</h2>
      <button className="border">Start</button>
    </div>
  );
}
