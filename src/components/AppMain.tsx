import { useState, useEffect } from "react";
import SkillList from "./SkillList";
import Dashboard from "./Dashboard";
function App() {
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    window.Electron.ipcRenderer
      .invoke("get-total-time")
      .then((row) => {
        if (row) {
          setTotalTime(row.total_time);
        } else {
          console.error("No time");
        }
      })
      .catch((err) => {
        console.error("Error querying data", err);
      });
  }, []);

  function handleSetTotalTime() {
    window.Electron.ipcRenderer
      .invoke("set-total-time", totalTime + 1)
      .then(() => setTotalTime(totalTime + 1));
  }
  return (
    <div className="h-[100dvh] flex flex-col items-center">
      <h1 className="text-2xl font-bold">Simsify Life</h1>
      <Dashboard totalTime={totalTime} />
      <SkillList onSetTotalTime={handleSetTotalTime} />
      <button className="text-5xl fixed bottom-0 right-0 p-8">⚙</button>
    </div>
  );
}

export default App;
