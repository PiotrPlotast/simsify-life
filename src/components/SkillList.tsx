import Skill from "./Skill";
import AddSkill from "./AddSkill";
import { useState, useEffect } from "react";
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

  function handleProgress(skillName: string) {
    const nextSkills = skills.map((s) => {
      if (s.name === skillName) {
        s.progress += 2 / s.level;
      }
      return s;
    });
    setSkills(nextSkills);
    window.Electron.ipcRenderer
      .invoke("progress", skillName)
      .then(() => console.log(skills))
      .catch((err) => {
        console.error("Error querying data", err);
      });
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
    window.Electron.ipcRenderer
      .invoke("lvl-up", skillName)
      .then(() => console.log("Skill leveled up"))
      .catch((err) => {
        console.error("Error querying data", err);
      });
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
    console.log("Adding skill", skillName, icon);
    window.Electron.ipcRenderer
      .invoke("add-skill", skillName, icon)
      .then(() => console.log("Skill added to db"))
      .catch((err) => {
        console.error("Error querying data", err);
      });
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
