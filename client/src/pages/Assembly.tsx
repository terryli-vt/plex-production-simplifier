// src/pages/Assembly.tsx
import React, { useState } from "react";
import ScanInput from "../components/ScanInput";
import LogBox from "../components/LogBox";
import {
  checkContainerExists,
  moveContainer,
  printLabel,
  recordProduction,
} from "../services/apiClient";

const Assembly: React.FC = () => {
  // for managing the message & background color of the log box
  const [messages, setMessages] = useState<string[]>([]); // State to manage log messages
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff");

  // Function to log messages and change background color
  const logMessage = (message: string, color?: string) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    if (color) {
      setBackgroundColor(color);
    }
  };

  // Handle the scanned result
  const handleScan = async (serialNo: string) => {
    setBackgroundColor("#ffffff"); // reset background color
    setMessages(() => []); // clear messages

    try {
      let response;
      response = await checkContainerExists(serialNo);
      logMessage(response.message);

      response = await moveContainer(serialNo, "RIVIAN");
      logMessage(response.message);

      logMessage("Recording production, please wait... ⏳");
      response = await recordProduction();
      const newSerialNo = response.newSerialNo;
      logMessage(response.message);

      response = await printLabel(newSerialNo);
      logMessage(response.message, "#00CC66");
    } catch (error: any) {
      logMessage(`Error: ${error.message} ❌`, "#FF6666");
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
