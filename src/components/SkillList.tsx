import Skill from "./Skill";
import AddSkill from "./AddSkill";
import { useState } from "react";
const SKILLS = [
  {
    name: "Coding",
    progress: 15,
    level: 1,
    icon: "💻",
  },
  {
    name: "Chess",
    progress: 88,
    level: 1,
    icon: "♟",
  },
  {
    name: "Graphics",
    progress: 69,
    level: 1,
    icon: "🎨",
  },
  {
    name: "Psychology",
    progress: 14,
    level: 3,
    icon: "🧠",
  },
  {
    name: "Cooking",
    progress: 50,
    level: 2,
    icon: "🍳",
  },
];

export default function SkillList() {
  const [skillName, setSkillName] = useState("");
  const [icon, setIcon] = useState("");
  const [skills, setSkills] = useState(SKILLS);
  function handleAddSkill() {
    setSkills([
      ...skills,
      {
        name: skillName,
        progress: 0,
        level: 1,
        icon: icon,
      },
    ]);
  }

  function handleDeleteSkill(skillName: string) {
    setSkills(skills.filter((skill) => skill.name !== skillName));
  }

  return (
    <div className="w-full border border-red-500 flex flex-col justify-center items-center">
      <ul>
        {skills.map((skill, index) => (
          <Skill
            key={index}
            skillName={skill.name}
            progress={skill.progress}
            level={skill.level}
            icon={skill.icon}
          />
        ))}
      </ul>
      <AddSkill
        onHandleAddSkill={handleAddSkill}
        setSkillName={setSkillName}
        setIcon={setIcon}
        icon={icon}
        skillName={skillName}
      />
    </div>
  );
}
