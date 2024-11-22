import React, { useState } from "react";
import ContainerInfo from "../components/ContainerInfo";
import ScanInput from "../components/ScanInput";
import LogBox from "../components/LogBox";
import * as api from "../services/apiClient";

const Label: React.FC = () => {
  const plexServer = api.getPlexServer();
  const [containerInfo, setContainerInfo] = useState<{
    [key: string]: string | number;
  } | null>(null);
  const [serial, setSerial] = useState<string | null>(null);
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
  const [scanStatus, setScanStatus] = useState<string>("Ready");
  const [disableBtns, setDisableBtns] = useState(false);

  const loadContainerInfo = async (serialNo: string) => {
    setScanStatus("Loading"); // set loading state
    setBackgroundColor("#ffffff"); // reset background color
    setMessages(() => []); // clear messages
    setInfoStatus("Loading");
    setDisableBtns(false);
    try {
      const response = await api.checkContainer(serialNo);

      if (response.containerInfo["Quantity"] === 0) {
        response.containerInfo["Status"] = "Inactive";
        setDisableBtns(true);
      }

      setContainerInfo(response.containerInfo);
      setSerial(response.serialNo);
      setInfoStatus("Loaded");

      // logMessage(response.message);
      if (response.containerInfo["Quantity"] === 0) {
        logMessage(`This container is inactive ⚠️`, "#FFA500");
      } else {
        logMessage(`Container Status: ${response.containerInfo["Status"]}`);
      }
    } catch (error: any) {
      setInfoStatus("Error");
      logMessage(`Error: ${error.message} ❌`, "#FF6666");
    } finally {
      setScanStatus("Ready"); // enable scan
    }
  };

  const [isPrinting, setIsPrinting] = useState(false);
  // Printing label event handler
  const handlePrint = async () => {
    setIsPrinting(true);
    setScanStatus("Loading"); // disable scan

    try {
      await api.printLabel(serial!, "Container");
      setMessages(() => []); // clear messages
      setInfoStatus("Idle");
    } catch (error: any) {
      logMessage(`Error: ${error.message} ❌`, "#FF6666");
      console.error("Failed to print the container label:", error);
    } finally {
      setIsPrinting(false);
      setScanStatus("Ready"); // enable scan
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Container Label Printer</h1>
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 lg:pr-4 mb-4 lg:mb-0">
          <ContainerInfo
            status={infoStatus}
            plexServer={plexServer}
            containerInfo={containerInfo}
          />
        </div>
        <div className="w-full lg:w-1/2">
          <div className="mb-4">
            <ScanInput
              onScan={loadContainerInfo}
              placeholder="Scan barcode on the label..."
              status={scanStatus}
            />
          </div>
          {/* button */}
          <button
            className={`btn btn-lg btn-info flex-grow w-full ${
              infoStatus === "Loaded" && !isPrinting && !disableBtns
                ? ""
                : "hidden"
            }`}
            onClick={handlePrint}
            disabled={isPrinting}
          >
            Print Label
          </button>
          <button
            className={`btn btn-lg flex-grow ${
              isPrinting ? "" : "hidden"
            } w-full`}
          >
            <span className="loading loading-spinner"></span>
            loading
          </button>
          <LogBox messages={messages} backgroundColor={backgroundColor} />
        </div>
      </div>
    </div>
  );
};

export default Label;
