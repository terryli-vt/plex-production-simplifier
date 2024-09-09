import React, { useState } from "react";
import ScanInput from "../components/ScanInput";
import LogBox from "../components/LogBox";
import * as api from "../services/apiClient";
import WorkcenterInfo from "./../components/WorkcenterInfo";

const Assembly: React.FC = () => {
  const workcenterKey = "72323"; // RIVIAN workcenter key

  // For workcenterInfo component
  const [infoStatus, setInfoStatus] = useState<string>("Idle");
  const [workcenterInfo, setWorkcenterInfo] = useState<{
    [key: string]: string | number;
  } | null>(null);
  const [substratePartNo, setSubstratePartNo] = useState<string | null>(null);
  const [plexServer, setPlexServer] = useState<string | null>(null);

  // For handling update event from WorkcenterInfo component
  const handleInfoUpdate = async () => {
    setInfoStatus("Loading");
    try {
      const info = await api.getWorkcenterInfo(workcenterKey); // fetched info
      setWorkcenterInfo(info);

      if (info && info["Part Number"]) {
        setSubstratePartNo(
          await api.getSubstratePartNumber(info["Part Number"])
        );
      }
      setPlexServer(api.getPlexServer());
      setInfoStatus("Loaded");
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setInfoStatus("Error");
    }
  };

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
  // Loading state for ScanInput
  const [isScanLoading, setIsScanLoading] = useState(false);

  // handle the scanned result
  const handleScan = async (serialNo: string) => {
    setIsScanLoading(true); // set loading state
    setBackgroundColor("#ffffff"); // reset background color
    setMessages(() => []); // clear messages

    try {
      let response = await api.checkContainer(serialNo);

      // Check if the container is active
      if (response.containerInfo["Quantity"] === 0) {
        throw new Error("Container is inactive.");
      }

      logMessage(response.message); // container exists

      // Check if the scanned substrate number matches the workcenter setup
      if (String(response.containerInfo["Part Number"]) != substratePartNo) {
        throw new Error(
          `Substrate part number does not match, please check workcenter configuration on Plex. Expected: ${substratePartNo}, Scanned: ${response.containerInfo["Part Number"]}`
        );
      }
      logMessage("Substrate part number matched ✔️");

      // Check if the container is edgefolded
      if (String(response.containerInfo["Operation"]) !== "Edgefold") {
        throw new Error(
          `This container is not in edgefold operation. Current operation: ${response.containerInfo["Operation"]}`
        );
      }

      response = await api.moveContainer(serialNo, "RIVIAN");
      logMessage(response.message);

      logMessage("Recording production, please wait... ⏳");
      response = await api.recordProduction(workcenterKey);
      const newSerialNo = response.newSerialNo;
      logMessage(response.message);

      await handleInfoUpdate(); // Refresh workcenter info

      response = await api.printLabel(newSerialNo, "RIVIAN");
      logMessage(response.message, "#00CC66");
    } catch (error: any) {
      logMessage(`Error: ${error.message} ❌`, "#FF6666");
    } finally {
      setIsScanLoading(false); // Stop loading when done
    }
  };

  const scanClassName = `w-2/3 ${infoStatus === "Loaded" ? "" : "hidden"}`;
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">RIVIAN Assembly Station</h1>
      <div className="flex">
        <div className="w-1/3 pr-4">
          <WorkcenterInfo
            workcenterName="Assembly"
            status={infoStatus}
            plexServer={plexServer}
            workcenterInfo={workcenterInfo}
            onUpdate={handleInfoUpdate}
            substratePartNo={substratePartNo}
          />
        </div>
        <div className={scanClassName}>
          <div className="mb-4">
            <ScanInput
              onScan={handleScan}
              placeholder="Scan barcode on substrate label..."
              loading={isScanLoading}
            />
          </div>
          <LogBox messages={messages} backgroundColor={backgroundColor} />
        </div>
      </div>
    </div>
  );
};

export default Assembly;
