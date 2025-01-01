import { useState, useEffect } from "react";
import quotes from "../quotes.json";
export default function Dashboard({ totalTime }: { totalTime: number }) {
  const [randomQuote, setRandomQuote] = useState(
    "Eighty percent of success is showing up."
  );
  useEffect(() => {
    const intervalId = setInterval(() => {
      const newQoute =
        quotes.quotes[Math.floor(Math.random() * quotes.quotes.length)];
      setRandomQuote(newQoute.quote);
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h2>Time spent tracking your skills: {totalTime}</h2>
      <h3>Charts</h3>
      <h4>{randomQuote}</h4>
    </div>
  );
}
