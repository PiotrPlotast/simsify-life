import Skill from "./Skill";
import AddSkill from "./AddSkill";
import { useState, useEffect } from "react";
import { ipcRenderer } from "electron";
import db from "../db";

export default function SkillList() {
  const [skillName, setSkillName] = useState("");
  const [icon, setIcon] = useState("");
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    // Fetch skills from the database when the component mounts
    window.Electron.ipcRenderer
      .invoke("get-skills")
      .then((rows) => {
        setSkills(rows);
      })
      .catch((err) => {
        console.error("Error querying data", err);
      });
  }, []);

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
