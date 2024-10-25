import React, { useState } from "react";
import LogBox from "../components/LogBox";
import BOMInfo from "../components/BOMInfo";
import TextInput from "../components/TextInput";
import * as api from "../services/apiClient";

const RepairCenter: React.FC = () => {
  const plexServer = api.getPlexServer();
  const [BOM, setBOM] = useState<{
    [key: string]: string | number;
  } | null>(null);
  const [infoStatus, setInfoStatus] = useState<string>("Idle");

  // LogBox Component
  // managing the message & background color
  const [messages, setMessages] = useState<string[]>([]); // State to manage log messages
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff");

  // log messages and change background color
  const logMessage = (message: string, color?: string) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    if (color) {
      setBackgroundColor(color);
    }
  };

  // ScanInput Component
  // Loading state for ScanInput (Idle, Loading, Ready)
  const [inputStatus, setInputStatus] = useState<string>("Ready");

  const loadBOMInfo = async (partNo: string) => {
    setInputStatus("Loading"); // set loading state
    setBackgroundColor("#ffffff"); // reset background color
    setMessages(() => []); // clear messages
    setInfoStatus("Loading");
    try {
      const response = await api.getBOMInfo(partNo);
      console.log("response from BOM component: ", response);
      setBOM(response);
      setInfoStatus("Loaded");
    } catch (error: any) {
      setInfoStatus("Error");
      logMessage(`Error: ${error.message} ❌`, "#FF6666");
    } finally {
      setInputStatus("Ready"); // enable scan
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Bill of Material</h1>
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 lg:pr-4 mb-4 lg:mb-0">
          <BOMInfo plexServer={plexServer} status={infoStatus} bomInfo={BOM} />
        </div>
        <div className="w-full lg:w-1/2">
          <div className="mb-4">
            <TextInput
              onSubmit={loadBOMInfo}
              placeholder="Enter the part number here..."
              status={inputStatus}
            />
          </div>
          <LogBox messages={messages} backgroundColor={backgroundColor} />
        </div>
      </div>
    </div>
  );
};

export default RepairCenter;
