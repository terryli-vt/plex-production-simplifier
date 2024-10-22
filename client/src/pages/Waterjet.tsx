import React, { useState } from "react";
// import ScanInput from "../components/ScanInput";
import LogBox from "../components/LogBox";
import * as api from "../services/apiClient";
import WorkcenterInfo from "./../components/WorkcenterInfo";

const Waterjet: React.FC = () => {
  const workcenterKey = api.getWaterjetWorkcenterKey();

  // For workcenterInfo component
  const [infoStatus, setInfoStatus] = useState<string>("Idle");
  const [workcenterInfo, setWorkcenterInfo] = useState<{
    [key: string]: string | number;
  } | null>(null);
  const [plexServer, setPlexServer] = useState<string | null>(null);
  // const [components, setComponents] = useState<string[] | null>(null);

  // For handling update event from WorkcenterInfo component
  const handleInfoUpdate = async () => {
    setInfoStatus("Loading");
    //setScanStatus("Idle"); // scan input is idle
    try {
      const info = await api.getWorkcenterInfo(workcenterKey); // fetched info
      setWorkcenterInfo(info);
      setPlexServer(api.getPlexServer());
      // setComponents(await api.getComponentPartNo(info["Part Number"]));
      setInfoStatus("Loaded");
      //setScanStatus("Ready"); // scan input is ready
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
  // Loading state for ScanInput (Idle, Loading, Ready)
  // const [scanStatus, setScanStatus] = useState<string>("Idle");

  /* // handle the scanned result
  const handleScan = async (serialNo: string) => {
    setScanStatus("Loading"); // disable scan by setting loading state for scan input
    setBackgroundColor("#ffffff"); // reset background color
    setMessages(() => []); // clear messages

    try {
      let response = await api.checkContainer(serialNo);
      // logMessage(response.message);

      if (!components!.includes(response.containerInfo["Part Number"])) {
        throw new Error(
          `This container is not part of the BOM for part number ${
            workcenterInfo!["Part Number"]
          }`
        );
      }

      response = await api.moveContainer(serialNo, "Waterjet-3");
      // logMessage(response.message);
      logMessage("Source loaded ✔️", "#00CC66");
    } catch (error: any) {
      logMessage(`Error: ${error.message} ❌`, "#FF6666");
    } finally {
      setScanStatus("Ready"); // enable scan
    }
  }; */

  /* buttons */
  const [isOkLoading, setIsOkLoading] = useState(false);
  const [isHoldLoading, setIsHoldLoading] = useState(false);

  // Reusable function for handling button clicks
  const handleButtonClick = async (
    setLoadingState: (value: boolean) => void,
    asyncOperation: () => Promise<void>
  ) => {
    setLoadingState(true);
    //setScanStatus("Loading"); // disable scan
    try {
      await asyncOperation();
    } catch (error) {
      console.error("Failed to perform async operation:", error);
    } finally {
      setLoadingState(false);
      //setScanStatus("Ready"); // enable scan
    }
  };

  // Example async operations
  const okOperation = async () => {
    setBackgroundColor("#ffffff"); // reset background color
    setMessages(() => []); // clear messages

    try {
      // logMessage("Recording production, please wait... ⏳");
      logMessage("Loading, please wait... ⏳");
      let response = await api.recordProduction(workcenterKey);
      const newSerialNo = response.newSerialNo;
      // logMessage(response.message);

      response = await api.printLabel(newSerialNo, "Waterjet-3");
      // logMessage(response.message, "#00CC66");
      logMessage("Success!", "#00CC66");

      await handleInfoUpdate(); // Refresh workcenter info
    } catch (error: any) {
      logMessage(`Error: ${error.message} ❌`, "#FF6666");
    }
  };

  const holdOperation = async () => {
    setBackgroundColor("#ffffff"); // reset background color
    setMessages(() => []); // clear messages

    try {
      // logMessage("Recording production, please wait... ⏳");
      logMessage("Loading, please wait... ⏳");
      let response = await api.recordProduction(workcenterKey);
      const newSerialNo = response.newSerialNo;
      //logMessage(response.message);

      response = await api.changeContainerStatus(newSerialNo, "Hold");
      //logMessage(response.message);

      response = await api.printLabel(newSerialNo, "Waterjet-3");
      //logMessage(response.message, "#00CC66");
      logMessage("Success!", "#00CC66");
      await handleInfoUpdate(); // Refresh workcenter info
    } catch (error: any) {
      logMessage(`Error: ${error.message} ❌`, "#FF6666");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Waterjet Station</h1>

      {/* Flex container for WorkcenterInfo and ScanInput */}
      <div className="flex flex-col lg:flex-row">
        {/* WorkcenterInfo */}
        <div className="w-full lg:w-1/3 lg:pr-4 mb-4 lg:mb-0">
          <WorkcenterInfo
            workcenterName="Waterjet"
            status={infoStatus}
            plexServer={plexServer}
            workcenterInfo={workcenterInfo}
            onUpdate={handleInfoUpdate}
          />
        </div>

        {/* ScanInput and button group */}
        <div
          className={`w-full lg:w-2/3 ${
            infoStatus === "Loaded" ? "" : "hidden"
          }`}
        >
          {/* <div className="mb-4">
            <ScanInput
              onScan={handleScan}
              placeholder="To load source, scan or type serial number..."
              status={scanStatus}
            />
          </div> */}

          {/* Button group - flex-grow makes them responsive */}
          <div className="flex flex-col mb-5 md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <button
              className={`btn btn-lg btn-success flex-grow ${
                isOkLoading || isHoldLoading ? "hidden" : ""
              } w-full md:w-auto`}
              onClick={() => handleButtonClick(setIsOkLoading, okOperation)}
            >
              Produce OK
            </button>
            <button
              className={`btn btn-lg btn-warning flex-grow ${
                isOkLoading || isHoldLoading ? "hidden" : ""
              } w-full md:w-auto`}
              onClick={() => handleButtonClick(setIsHoldLoading, holdOperation)}
            >
              Produce Hold
            </button>
            <button
              className={`btn btn-lg flex-grow ${
                isOkLoading || isHoldLoading ? "" : "hidden"
              } w-full md:w-auto`}
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
