import React, { useEffect, useState } from "react";
import ScanInput from "../components/ScanInput";
import LogBox from "../components/LogBox";
import * as api from "../services/apiClient";
import WorkcenterInfo from "./../components/WorkcenterInfo";
import PackList from "./../components/PackList";

const Pack: React.FC = () => {
  const workcenterKey = api.getPackWorkcenterKey();

  const packMode = api.getPackMode();

  // For workcenterInfo component
  const [infoStatus, setInfoStatus] = useState<string>("Idle");
  const [workcenterInfo, setWorkcenterInfo] = useState<{
    [key: string]: string | number;
  } | null>(null);
  const [stdPackQty, setstdPackQty] = useState<number | null>(null);
  const [plexServer, setPlexServer] = useState<string | null>(null);

  // For handling update event from WorkcenterInfo component
  const handleInfoUpdate = async () => {
    setInfoStatus("Loading");
    setScanStatus("Idle"); // scan input is idle
    try {
      const info = await api.getWorkcenterInfo(workcenterKey); // fetched info
      setWorkcenterInfo(info);

      if (packMode === "Rack" && info && info["Part Number"]) {
        setstdPackQty(await api.getStdPackQty(info["Part Number"]));
      } else {
        setstdPackQty(1);
      }

      setPlexServer(api.getPlexServer());

      await updateList(info["Part Number"]); // update the pack list

      setInfoStatus("Loaded");
      setScanStatus("Ready"); // scan input is ready
    } catch (error) {
      console.error("Failed to fetch workcenter info:", error);
      setInfoStatus("Error");
    }
  };

  // PackList Component
  const [list, setList] = useState<string[]>([]);
  const [isPacking, setIsPacking] = useState(false);
  const [isChangingList, setIsChangingList] = useState(false); // for handling list changes (like hold or unload)

  // For RIVIAN
  let prevLocation = "Assemble-1";
  let currLocation = "Pack-1";
  // if we're working with BT1 Sunroof
  if (workcenterKey === "74916") {
    prevLocation = "Assemble-2";
    currLocation = "Pack-2";
  }
  // if we're working with BT1 Fullroof
  if (workcenterKey === "75079") {
    prevLocation = "Waterjet-4";
    currLocation = "Pack-4";
  }

  const updateList = async (partNo: string) => {
    try {
      const loadedSerial = await api.getLoadedSerial(
        partNo,
        parseInt(workcenterKey)
      );
      // console.log("Loaded serials:", loadedSerial);
      setList(loadedSerial);
    } catch (error) {
      console.error("Failed to fetch loaded serials:", error);
    }
  };

  // Handle unloading a serial number
  const handleUnload = async (serialNo: string) => {
    setIsChangingList(true); // disable list changes
    if (list.length === 0) {
      setBackgroundColor("#ffffff"); // reset background color
      setMessages(() => []); // clear messages
    }

    try {
      // Change serial's location back to assembly station
      await api.moveContainer(serialNo, prevLocation);
      logMessage(`Container ${serialNo} is unloaded ✔️`, "#00CC66");
      await updateList(workcenterInfo!["Part Number"] as string); // Refresh the list
    } catch (error: any) {
      logMessage(`Error: ${error.message} ❌`, "#FF6666");
    } finally {
      setIsChangingList(false); // enable list changes
    }
  };

  // Handle holding a serial number
  const handleHold = async (serialNo: string) => {
    setIsChangingList(true); // disable
    if (list.length === 0) {
      setBackgroundColor("#ffffff"); // reset background color
      setMessages(() => []); // clear messages
    }

    try {
      // Change serial's location back to assembly station
      await api.moveContainer(serialNo, prevLocation);
      await api.changeContainerStatus(serialNo, "Hold");
      logMessage(`Container ${serialNo} is on hold ✔️`, "#00CC66");
      await updateList(workcenterInfo!["Part Number"] as string); // Refresh the list
    } catch (error: any) {
      logMessage(`Error: ${error.message} ❌`, "#FF6666");
    } finally {
      setIsChangingList(false); // enable list changes
    }
  };

  // Handle packing action (called when progress is 100% or user confirms)
  const handlePack = async () => {
    setIsPacking(true);
    setIsChangingList(true); // disable list changes
    setScanStatus("Loading"); // disable scan
    try {
      // Record production
      logMessage("Loading, please wait... ⏳");
      let response = await api.checkWorkcenterLogin(workcenterKey);

      // make sure the printer is online
      response = await api.pingPrinter("Pack");

      // logMessage("Recording production, please wait... ⏳");
      response = await api.recordProduction(workcenterKey, list.length);
      const newSerialNo = response.newSerialNo;
      //logMessage(response.message);

      response = await api.printLabel(newSerialNo, "Pack");
      logMessage("Success!", "#00CC66");

      await handleInfoUpdate(); // Refresh workcenter info
    } catch (error: any) {
      if (error.message.startsWith("Failed to connect to the printer")) {
        logMessage(`Error: ${error.message} ❌`, "#FF6666");
        logMessage(
          "Try restart the printer, wait 1 minute and try again.",
          "#FF6666"
        );
      } else {
        logMessage(`Error: ${error.message} ❌`, "#FF6666");
      }
    } finally {
      setIsPacking(false); // packing finished
      setIsChangingList(false); // enable list changes
      setScanStatus("Ready");
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

  // handle the scanned result
  const handleScan = async (serialNo: string) => {
    setScanStatus("Loading"); // disable scan
    setIsChangingList(true); // disable list changes
    if (list.length === 0) {
      // clear log messages and background color
      setBackgroundColor("#ffffff"); // reset background color
      setMessages(() => []); // clear messages
    }

    try {
      // prevent duplicates
      if (list.includes(serialNo)) {
        throw new Error(
          `The serial number ${serialNo} is already in the pack list.`
        );
      }

      let response = await api.checkContainer(serialNo);
      if (response.containerInfo["Status"] === "Hold") {
        throw new Error("Container is on hold.");
      }

      // Check if the container is active
      if (response.containerInfo["Quantity"] === 0) {
        throw new Error("Container is inactive.");
      }

      // Check if the scanned part number matches the workcenter setup
      const workcenterPartNo = workcenterInfo!["Part Number"];
      if (String(response.containerInfo["Part Number"]) != workcenterPartNo) {
        throw new Error(
          `Scanned part number does not match, please check workcenter configuration on Plex. Expected: ${workcenterPartNo}, Scanned: ${response.containerInfo["Part Number"]}`
        );
      }

      // Check if the container is in Assembly operation (for anything other than BT1 Fullroof)
      if (
        String(response.containerInfo["Operation"]) !== "Assembly" &&
        workcenterKey !== "75079"
      ) {
        throw new Error(
          `This container is not in Assembly operation. Current operation: ${response.containerInfo["Operation"]}`
        );
      }

      // For BT1 Fullroof
      if (
        String(response.containerInfo["Operation"]) !== "Waterjet" &&
        workcenterKey === "75079"
      ) {
        throw new Error(
          `This container is not in Waterjet operation. Current operation: ${response.containerInfo["Operation"]}`
        );
      }

      response = await api.moveContainer(serialNo, currLocation);
      await updateList(workcenterPartNo as string); // Refresh the list
      logMessage(`${serialNo} is packed ✔️`, "#00CC66");
    } catch (error: any) {
      if (
        error.message ===
        `The serial number ${serialNo} is already in the pack list.`
      ) {
        logMessage(`Warning: ${error.message} ⚠️`, "#FFA500"); // Orange background for the warning
      } else {
        logMessage(`Error: ${error.message} ❌`, "#FF6666"); // Red background for other errors
      }
    } finally {
      setScanStatus("Ready"); // enable scan
      setIsChangingList(false); // enable list changes
    }
  };

  // prevent accidental page refresh
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    // Attach the event listener
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Pack Station</h1>
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/3 lg:pr-4 lg:mb-0">
          <WorkcenterInfo
            workcenterName="Pack"
            status={infoStatus}
            plexServer={plexServer}
            workcenterInfo={workcenterInfo}
            onUpdate={handleInfoUpdate}
            stdPackQty={stdPackQty}
            packMode={packMode}
          />
        </div>
        <div
          className={`w-full lg:w-1/3 lg:pr-4 mt-4 lg:mt-0 ${
            infoStatus === "Loaded" ? "" : "hidden"
          }`}
        >
          <PackList
            stdPackQty={stdPackQty!}
            list={list}
            onPack={handlePack}
            onHold={handleHold}
            onUnload={handleUnload}
            isPacking={isPacking}
            isChangingList={isChangingList}
          />
        </div>
        <div
          className={`w-full lg:w-1/3 mt-7 lg:mt-0 ${
            infoStatus === "Loaded" ? "" : "hidden"
          }`}
        >
          <div className="mb-4">
            <ScanInput
              onScan={handleScan}
              placeholder="Scan barcode on FG label..."
              status={scanStatus}
            />
          </div>
          <LogBox messages={messages} backgroundColor={backgroundColor} />
        </div>
      </div>
    </div>
  );
};

export default Pack;
