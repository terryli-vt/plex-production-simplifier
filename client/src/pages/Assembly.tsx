import React, { useState } from "react";
import ScanInput from "../components/ScanInput";
import LogBox from "../components/LogBox";
import * as api from "../services/apiClient";
import WorkcenterInfo from "./../components/WorkcenterInfo";

const Assembly: React.FC = () => {
  const workcenterKey = api.getAssemblyWorkcenterKey();

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
    setScanStatus("Idle"); // scan input is idle
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
      setScanStatus("Ready"); // scan input is ready
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
  const [scanStatus, setScanStatus] = useState<string>("Idle");
  // const [lastScannedSub, setlastScannedSub] = useState<string | null>(null); // serial number of the last scanned substrate, to avoid duplicate scan

  const [lastSerial, setLastSerial] = useState<string | null>(null); // finished good serial after recording production
  let prevLocation = "Edgefold-1";
  let currLocation = "Assemble-1";
  // if we're working with BT1
  if (workcenterKey === "75077") {
    prevLocation = "Edgefold-3";
    currLocation = "Assemble-2";
  }
  // if we're working with U725
  if (workcenterKey === "72543") {
    prevLocation = "Edgefold-2";
    currLocation = "Assemble-3";
  }

  // handle the scanned result
  const handleScan = async (serialNo: string) => {
    setScanStatus("Loading"); // disable scan
    setBackgroundColor("#ffffff"); // reset background color
    setMessages(() => []); // clear messages
    // setlastScannedSub(serialNo); // store the last scanned serial number, to prevent duplicate scan in the future

    try {
      logMessage("Loading, please wait... ⏳");

      // check duplicate scan
      /* console.log(
        "last scanned sub = ",
        localStorage.getItem("lastScannedSub")
      ); */
      if (localStorage.getItem("lastScannedSub") === serialNo) {
        throw new Error(`Duplicate scan. You have scanned this part before.`);
      }
      localStorage.setItem("lastScannedSub", serialNo);

      let response = await api.checkWorkcenterLogin(workcenterKey);

      // make sure the printer is online
      response = await api.pingPrinter("Assembly");

      response = await api.getLoadedSerial(
        substratePartNo!,
        parseInt(workcenterKey)
      );
      if (response.length !== 0) {
        logMessage(
          `Found ${response.length} loaded serial(s). Unloading them now... ⏳`
        );

        // Loop through each serial number and call `moveContainer`
        for (const loadedSerialNo of response) {
          await api.moveContainer(loadedSerialNo, prevLocation);
          // logMessage(`Unloaded serial number: ${loadedSerialNo} ✔️`);
        }
        logMessage("All loaded serials are unloaded ✔️");
      }

      response = await api.checkContainer(serialNo);

      // Check if the container is on hold
      if (response.containerInfo["Status"] === "Hold") {
        // throw new Error("Container is on hold.");
        logMessage(`Changing container status from Hold to OK... ⏳`);
        await api.changeContainerStatus(serialNo, "OK");
      }

      // Check if the container is active
      if (response.containerInfo["Quantity"] === 0) {
        /*
        logMessage(`Container is inactive. Borrowing container... ⏳`);
        const borrowedSerial = await api.borrowContainer(
          substratePartNo!,
          "20"
        ); // operationNo = 20

        logMessage(`Borrowed serial: ${borrowedSerial}`);

        serialNo = borrowedSerial; // use the borrowed serial number
        */
        throw new Error("Container is inactive.");
      }
      // logMessage(response.message); // container exists
      logMessage("Recording production, please wait... ⏳");
      // Check if the scanned substrate number matches the workcenter setup
      if (String(response.containerInfo["Part Number"]) !== substratePartNo) {
        throw new Error(
          `Substrate part number does not match, please check workcenter configuration on Plex. Expected: ${substratePartNo}, Scanned: ${response.containerInfo["Part Number"]}`
        );
      }
      // logMessage("Substrate part number matched ✔️");

      // Check if the container is edgefolded
      // For BT1 Hybrid, the previous operation is waterjet
      if (
        substratePartNo !== "BT1CC019" &&
        String(response.containerInfo["Operation"]) !== "Edgefold-BFB"
      ) {
        throw new Error(
          `This container is not in edgefold operation. Current operation: ${response.containerInfo["Operation"]}`
        );
      }

      response = await api.moveContainer(serialNo, currLocation);
      // logMessage(response.message); // move container success
      //logMessage("Ready for production ✔️");
      //logMessage("Recording production, please wait... ⏳");
      response = await api.recordProduction(workcenterKey);
      const newSerialNo = response.newSerialNo;
      // logMessage(response.message);

      setLastSerial(newSerialNo); // save the new serial number (for potential hold)

      await handleInfoUpdate(); // Refresh workcenter info

      response = await api.printLabel(newSerialNo, "Assembly");
      logMessage("Success!", "#00CC66");
    } catch (error: any) {
      if (
        error.message !== `Duplicate scan. You have scanned this part before.`
      ) {
        localStorage.removeItem("lastScannedSub");
      }

      if (error.message === `Container is inactive.`) {
        logMessage(`Warning: ${error.message} ⚠️`, "#FFA500"); // Orange background for the warning
      } else if (error.message === `Workcenter has insufficient source`) {
        logMessage(
          `Error: Workcenter has insufficient source, or Workcenter Status doesn't allow production ❌`,
          "#FF6666"
        );
        logMessage(
          `Check Source Inventory or Workcenter Status on Plex. `,
          "#FF6666"
        );
      } else if (error.message.startsWith("Failed to connect to the printer")) {
        logMessage(`Error: ${error.message} ❌`, "#FF6666");
        logMessage(
          "Try restart the printer, wait 1 minute and try again.",
          "#FF6666"
        );
      } else {
        logMessage(`Error: ${error.message} ❌`, "#FF6666");
      }
      setLastSerial(null); // clear serial number
    } finally {
      setScanStatus("Ready"); // enable scan
    }
  };

  const handleHold = async () => {
    if (!lastSerial) return;

    try {
      await api.changeContainerStatus(lastSerial, "Hold");
      logMessage("Hold Success!", "#00CC66");
    } catch (error: any) {
      logMessage(`Error: ${error.message} ❌`, "#FF6666");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Assembly Station</h1>
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/3 lg:pr-4 mb-4 lg:mb-0">
          <WorkcenterInfo
            workcenterName="Assembly"
            status={infoStatus}
            plexServer={plexServer}
            workcenterInfo={workcenterInfo}
            onUpdate={handleInfoUpdate}
            substratePartNo={substratePartNo}
          />
        </div>
        <div
          className={`w-full lg:w-2/3 ${
            infoStatus === "Loaded" ? "" : "hidden"
          }`}
        >
          <div className="mb-4">
            <ScanInput
              onScan={handleScan}
              placeholder="Scan barcode on substrate label..."
              status={scanStatus}
            />
          </div>
          {lastSerial && (
            <div className="flex flex-col my-5 md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <button
                className={`btn btn-lg btn-warning flex-grow w-full md:w-auto`}
                onClick={() => handleHold()}
                disabled={scanStatus !== "Ready"}
              >
                Hold Container {lastSerial}
              </button>
            </div>
          )}
          <LogBox messages={messages} backgroundColor={backgroundColor} />
        </div>
      </div>
    </div>
  );
};

export default Assembly;
