// src/pages/Assembly.tsx
import React, { useState } from "react";
import ScanInput from "./common/ScanInput";
import LogBox from "./common/LogBox";

const Assembly: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]); // State to manage log messages
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff");

  // Handle the scanned result
  const handleScan = (parsedResult: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      `Scanned Result: ${parsedResult}`,
    ]);
    // You can also handle other processes with the parsedResult here
  };

  // Function to log messages and change background color
  const logMessage = (message: string, color?: string) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    if (color) {
      setBackgroundColor(color);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">RIVIAN Assembly Station</h1>
      <div className="mb-4">
        <ScanInput onScan={handleScan} />
      </div>
      <LogBox messages={messages} backgroundColor={backgroundColor} />
    </div>
  );
};

export default Assembly;
