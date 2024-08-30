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
import WorkcenterInfo from "../components/WorkcenterInfo";
import { useWorkcenterStore } from "../store/useWorkcenterStore";

const Assembly: React.FC = () => {
  const { status, substratePartNo } = useWorkcenterStore();

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

      if (String(response.partNo) != substratePartNo) {
        throw new Error(
          `Substrate part number does not match, please check workcenter configuration on Plex.Expected: ${substratePartNo}, Scanned: ${response.partNo}`
        );
      }
      logMessage("Substrate part number matched ✔️");

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

  const scanClassName = `w-2/3 ${status === "Loaded" ? "" : "hidden"}`;
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">RIVIAN Assembly Station</h1>
      <div className="flex">
        <div className="w-1/3 pr-4">
          <WorkcenterInfo />
        </div>
        <div className={scanClassName}>
          <div className="mb-4">
            <ScanInput onScan={handleScan} />
          </div>
          <LogBox messages={messages} backgroundColor={backgroundColor} />
        </div>
      </div>
    </div>
  );
};

export default Assembly;
