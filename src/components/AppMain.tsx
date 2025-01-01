import { useState, useEffect } from "react";
import SkillList from "./SkillList";
import Dashboard from "./Dashboard";
import SettingsPopUp from "./SettingsPopUp";
function App() {
  const [totalTime, setTotalTime] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    const hours = Math.floor(totalTime / 3600);
    const minutes = Math.floor((totalTime % 3600) / 60);
    const seconds = Math.floor(totalTime % 60);

    setTotalHours(hours);
    setTotalMinutes(minutes);
    setTotalSeconds(seconds);
  }, [totalTime]);

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

  useEffect(() => {
    window.Electron.ipcRenderer
      .invoke("get-dark-mode")
      .then((row) => {
        setIsDarkMode(row.dark_mode);
      })
      .catch((err) => {
        console.error("Error querying dark mode", err);
      });
  }, []);

  useEffect(() => {
    if (isDarkMode === 1) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  function handleSetTotalTime() {
    window.Electron.ipcRenderer
      .invoke("set-total-time", totalTime + 1)
      .then(() => setTotalTime(totalTime + 1));
  }

  function handleSetDarkMode() {
    window.Electron.ipcRenderer
      .invoke("set-dark-mode", isDarkMode === 1 ? 0 : 1)
      .then(() => setIsDarkMode(isDarkMode === 1 ? 0 : 1));
  }
  return (
    <div className="h-[100dvh] w-[100dvw] flex flex-col items-center pt-8">
      <h1 className="text-2xl font-bold">Skills Time Tracker</h1>
      <Dashboard
        totalHours={totalHours}
        totalMinutes={totalMinutes}
        totalSeconds={totalSeconds}
      />
      <SkillList onSetTotalTime={handleSetTotalTime} />
      <SettingsPopUp
        onSetHandleDarkMode={handleSetDarkMode}
        isSettingsOpen={isSettingsOpen}
      />
      <button
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        className="text-5xl fixed bottom-0 right-0 p-8"
      >
        ⚙
      </button>
    </div>
  );
}

export default App;
