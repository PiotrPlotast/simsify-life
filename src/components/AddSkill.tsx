import { useState } from "react";

interface AddSkillProps {
  setSkillName: React.Dispatch<React.SetStateAction<string>>;
  onHandleAddSkill: (e: React.FormEvent) => void;
  setIcon: React.Dispatch<React.SetStateAction<string>>;
  icon: string;
  skillName: string;
}

const AddSkill: React.FC<AddSkillProps> = ({
  icon,
  skillName,
  setSkillName,
  setIcon,
  onHandleAddSkill,
}) => {
  const [addSkill, setAddSkill] = useState(false);
  const addSkillHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (icon === "" || skillName === "") {
      console.log("Please fill in all fields");
    } else {
      onHandleAddSkill(e);
      setAddSkill(!addSkill);
      setIcon("");
      setSkillName("");
    }
  };
  return (
    <div>
      {!addSkill ? (
        <button
          className="border border-blue-500 px-4 py-2"
          onClick={() => setAddSkill(!addSkill)}
        >
          Add Skill
        </button>
      ) : (
        <form>
          <input
            name="skillName"
            type="text"
            placeholder="Skill Name"
            onChange={(e) => setSkillName(e.target.value)}
          />
          <label htmlFor="icon">Choose Icon:</label>
          <select id="icon" onChange={(e) => setIcon(e.target.value)}>
            <option value="💻">💻</option>
            <option value="♟">♟</option>
            <option value="🎨">🎨</option>
            <option value="🧠">🧠</option>
            <option value="🍳">🍳</option>
          </select>
          <button
            className="border border-blue-500 px-4 py-2"
            onClick={(e) => addSkillHandler(e)}
          >
            Add
          </button>
          <button
            className="border border-blue-500 px-4 py-2"
            onClick={() => setAddSkill(!addSkill)}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default AddSkill;
