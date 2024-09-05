import React, { useState } from "react";
import ContainerInfo from "../components/ContainerInfo";
import ScanInput from "../components/ScanInput";
import LogBox from "../components/LogBox";
import * as api from "../services/apiClient";

const RepairCenter: React.FC = () => {
  const plexServer = api.getPlexServer();
  const [containerInfo, setContainerInfo] = useState<{
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
  // handle the scanned result
  const handleScan = async (serialNo: string) => {
    setBackgroundColor("#ffffff"); // reset background color
    setMessages(() => []); // clear messages
    setInfoStatus("Loading");

    try {
      let response;
      response = await api.checkContainer(serialNo);
      setContainerInfo(response.containerInfo);
      setInfoStatus("Loaded");
      logMessage(response.message);
    } catch (error: any) {
      setInfoStatus("Error");
      logMessage(`Error: ${error.message} ❌`, "#FF6666");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Repair Center</h1>
      <div className="flex">
        <div className="w-1/3 pr-4">
          <ContainerInfo
            status={infoStatus}
            plexServer={plexServer}
            containerInfo={containerInfo}
          />
        </div>
        <div className="w-2/3">
          <div className="mb-4">
            <ScanInput
              onScan={handleScan}
              placeholder="Scan barcode on the label..."
            />
          </div>
          {/* button group */}
          <div className="flex">
            <button className={`btn btn-lg btn-wide btn-success mr-5`}>
              OK
            </button>
            <button className={`btn btn-lg btn-wide btn-warning mr-5`}>
              Hold
            </button>
            <button className={`btn btn-lg btn-wide btn-error`}>Scrap</button>
          </div>
          <LogBox messages={messages} backgroundColor={backgroundColor} />
        </div>
      </div>
    </div>
  );
};

export default RepairCenter;
