import Skill from "./Skill";
import AddSkill from "./AddSkill";
import { useState, useEffect } from "react";
export default function SkillList({
  onSetTotalTime,
}: {
  onSetTotalTime: () => void;
}) {
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
        s.time += 1;
      }
      return s;
    });
    setSkills(nextSkills);
    onSetTotalTime();
    window.Electron.ipcRenderer
      .invoke("skill-time", [skillName])
      .catch((err) => {
        console.error("Error querying data", err);
      });
  }

  function handleAddSkill() {
    setSkills([
      ...skills,
      {
        name: skillName,
        time: 0,
        icon: icon,
      },
    ]);
    console.log("Adding skill", skillName, icon);
    window.Electron.ipcRenderer
      .invoke("add-skill", skillName, icon)
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
            time={skill.time}
            icon={skill.icon}
            onHandleProgress={handleProgress}
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
