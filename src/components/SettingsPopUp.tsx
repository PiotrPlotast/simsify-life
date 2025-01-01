export default function SettingsPopUp({
  isSettingsOpen,
  onSetHandleDarkMode,
}: {
  isSettingsOpen: boolean;
  onSetHandleDarkMode: () => void;
}) {
  return (
    <div
      className={`border absolute bottom-20 right-20 p-4 bg-white ${
        isSettingsOpen ? "" : "hidden"
      }`}
    >
      <h2 className="font-bold text-xl">Settings</h2>
      <ul>
        <li className="mt-2">
          <h3>Dark Mode</h3>
          <button onClick={onSetHandleDarkMode}>Toggle Dark Mode</button>
        </li>
        <li className="mt-2">
          <h3>Notifications</h3>
          <button>Toggle Notifications</button>
        </li>
        <li className="mt-2">
          <h3>Clear Data</h3>
          <button>Clear All Data</button>
        </li>
      </ul>
    </div>
  );
}
