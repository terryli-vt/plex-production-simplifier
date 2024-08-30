import React, { useEffect, useRef } from "react";

interface LogBoxProps {
  messages: string[];
  backgroundColor?: string; // Optional prop for background color
}

const LogBox: React.FC<LogBoxProps> = ({
  messages,
  backgroundColor = "white",
}) => {
  const logBoxRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (logBoxRef.current) {
      logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={logBoxRef}
      style={{ backgroundColor }}
      className="h-80 overflow-y-auto my-4 p-4 border border-gray-300 rounded-md"
    >
      {messages.map((message, index) => (
        <div key={index} className="text-3xl text-gray-800 mb-5">
          {message}
        </div>
      ))}
    </div>
  );
};

export default LogBox;
