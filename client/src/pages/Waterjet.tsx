import React, { useState } from "react";
import ScanInput from "../components/ScanInput";
import LogBox from "../components/LogBox";
import * as api from "../services/apiClient";
import WorkcenterInfo from "./../components/WorkcenterInfo";

const Waterjet: React.FC = () => {
  const workcenterKey = "74886"; // Waterjet3 workcenter key

  // For workcenterInfo component
  const [infoStatus, setInfoStatus] = useState<string>("Idle");
  const [workcenterInfo, setWorkcenterInfo] = useState<{
    [key: string]: string | number;
  } | null>(null);
  const [plexServer, setPlexServer] = useState<string | null>(null);

  // For handling update event from WorkcenterInfo component
  const handleInfoUpdate = async () => {
    setInfoStatus("Loading");
    try {
      const info = await api.getWorkcenterInfo(workcenterKey); // fetched info
      setWorkcenterInfo(info);
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
      logMessage(response.message);

      response = await api.moveContainer(serialNo, "Waterjet-3");
      logMessage(response.message);
    } catch (error: any) {
      logMessage(`Error: ${error.message} ❌`, "#FF6666");
    } finally {
      setIsScanLoading(false); // Stop loading when done
    }
  };

  /* buttons */
  const [isOkLoading, setIsOkLoading] = useState(false);
  const [isHoldLoading, setIsHoldLoading] = useState(false);

  // Reusable function for handling button clicks
  const handleButtonClick = async (
    setLoadingState: (value: boolean) => void,
    asyncOperation: () => Promise<void>
  ) => {
    setLoadingState(true);
    try {
      await asyncOperation();
    } catch (error) {
      console.error("Failed to perform async operation:", error);
    } finally {
      setLoadingState(false);
    }
  };

  // Example async operations
  const okOperation = async () => {
    setBackgroundColor("#ffffff"); // reset background color
    setMessages(() => []); // clear messages

    try {
      /* // Simulate an async operation (fetching from an endpoint)
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Example: 2 seconds delay */

      let response;
      logMessage("Recording production, please wait... ⏳");
      response = await api.recordProduction(workcenterKey);
      const newSerialNo = response.newSerialNo;
      logMessage(response.message);

      response = await api.printLabel(newSerialNo, "Waterjet-3");
      logMessage(response.message, "#00CC66");

      await handleInfoUpdate(); // Refresh workcenter info
    } catch (error: any) {
      logMessage(`Error: ${error.message} ❌`, "#FF6666");
    }
  };

  const holdOperation = async () => {
    setBackgroundColor("#ffffff"); // reset background color
    setMessages(() => []); // clear messages

    try {
      /* // Simulate an async operation (fetching from an endpoint)
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Example: 2 seconds delay */

      let response;
      logMessage("Recording production, please wait... ⏳");
      response = await api.recordProduction(workcenterKey);
      const newSerialNo = response.newSerialNo;
      logMessage(response.message);

      response = await api.changeContainerStatus(newSerialNo, "Hold");
      logMessage(response.message);

      response = await api.printLabel(newSerialNo, "Waterjet-3");
      logMessage(response.message, "#00CC66");

      await handleInfoUpdate(); // Refresh workcenter info
    } catch (error: any) {
      logMessage(`Error: ${error.message} ❌`, "#FF6666");
    }
  };

  const scanClassName = `w-2/3 ${infoStatus === "Loaded" ? "" : "hidden"}`;
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">RIVIAN Waterjet Station</h1>
      <div className="flex">
        <div className="w-1/3 pr-4">
          <WorkcenterInfo
            workcenterName="Waterjet3"
            status={infoStatus}
            plexServer={plexServer}
            workcenterInfo={workcenterInfo}
            onUpdate={handleInfoUpdate}
          />
        </div>
        <div className={scanClassName}>
          <div className="mb-4">
            <ScanInput
              onScan={handleScan}
              placeholder="To load carpet, scan or type serial number..."
              loading={isScanLoading}
            />
          </div>
          {/* button group */}
          <div className="flex space-x-4">
            <button
              className={`btn btn-lg btn-wide btn-success mr-5 ${
                isOkLoading || isHoldLoading ? "hidden" : ""
              }`}
              onClick={() => handleButtonClick(setIsOkLoading, okOperation)}
            >
              Produce OK
            </button>
            <button
              className={`btn btn-lg btn-wide btn-warning ${
                isOkLoading || isHoldLoading ? "hidden" : ""
              }`}
              onClick={() => handleButtonClick(setIsHoldLoading, holdOperation)}
            >
              Produce Hold
            </button>
            <button
              className={`btn btn-lg btn-wide ${
                isOkLoading || isHoldLoading ? "" : "hidden"
              }`}
            >
              <span className="loading loading-spinner"></span>
              loading
            </button>
          </div>
          <LogBox messages={messages} backgroundColor={backgroundColor} />
        </div>
      </div>
    </div>
  );
};

export default Waterjet;
