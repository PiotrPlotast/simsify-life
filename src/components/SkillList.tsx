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
    level: 20,
    icon: "🧠",
  },
  {
    name: "Cooking",
    progress: 50,
    level: 2,
    icon: "🍳",
  },
  {
    name: "Music",
    progress: 100,
    level: 1,
    icon: "🎵",
  },
  {
    name: "Robotics",
    progress: 0,
    level: 1,
    icon: "🤖",
  },
];

export default function SkillList() {
  const [skillName, setSkillName] = useState("");
  const [icon, setIcon] = useState("");
  const [skills, setSkills] = useState(SKILLS);

  function handleProgress(skill: string) {
    const nextSkills = skills.map((s) => {
      if (s.name === skill) {
        s.progress += 2 / s.level;
      }
      return s;
    });
    setSkills(nextSkills);
  }

  function handleLvlUp(skillName: string) {
    const nextSkills = skills.map((s) => {
      if (s.name === skillName) {
        s.level += 1;
        s.progress = 0;
      }
      return s;
    });
    setSkills(nextSkills);
  }

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

  return (
    <div>
      <ul>
        {skills.map((skill, index) => (
          <Skill
            key={index}
            skillName={skill.name}
            progress={skill.progress}
            level={skill.level}
            icon={skill.icon}
            onHandleProgress={handleProgress}
            onHandleLvlUp={handleLvlUp}
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
