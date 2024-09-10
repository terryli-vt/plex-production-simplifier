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

  const loadContainerInfo = async (serialNo: string) => {
    setScanStatus("Loading"); // set loading state
    setBackgroundColor("#ffffff"); // reset background color
    setMessages(() => []); // clear messages
    setInfoStatus("Loading");
    try {
      const response = await api.checkContainer(serialNo);
      setContainerInfo(response.containerInfo);
      setSerial(response.serialNo);
      setInfoStatus("Loaded");
      logMessage(response.message);
      logMessage(`Container Status: ${response.containerInfo["Status"]}`);
    } catch (error: any) {
      setInfoStatus("Error");
      logMessage(`Error: ${error.message} ❌`, "#FF6666");
    } finally {
      setScanStatus("Ready"); // enable scan
    }
  };

  const changeContainerStatus = async (serialNo: string, newStatus: string) => {
    try {
      const response = await api.changeContainerStatus(serialNo, newStatus);
      logMessage(response.message);
    } catch (error: any) {
      logMessage(`Error: ${error.message} ❌`, "#FF6666");
    }
  };

  /* Handle Scrap */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrapping, setIsScrapping] = useState(false);

  // Function to handle scrap confirmation
  const handleScrap = async () => {
    setIsScrapping(true);
    setIsModalOpen(false);
    setScanStatus("Loading"); // disable scan

    try {
      await api.scrapContainer(serial!);
      setMessages(() => []); // clear messages
      setInfoStatus("Idle");
    } catch (error: any) {
      logMessage(`Error: ${error.message} ❌`, "#FF6666");
      console.error("Failed to scrap the container:", error);
    } finally {
      setIsScrapping(false);
      setScanStatus("Ready"); // enable scan
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
              onScan={loadContainerInfo}
              placeholder="Scan barcode on the label..."
              status={scanStatus}
            />
          </div>
          {/* button group */}
          <div
            className={`flex ${
              infoStatus === "Loaded" && !isScrapping ? "" : "hidden"
            }`}
          >
            <button
              className={`btn btn-lg btn-wide btn-success mr-5`}
              onClick={async () => {
                await changeContainerStatus(serial!, "OK");
                loadContainerInfo(serial!);
              }}
            >
              OK
            </button>
            <button
              className={`btn btn-lg btn-wide btn-warning mr-5`}
              onClick={async () => {
                await changeContainerStatus(serial!, "Hold");
                loadContainerInfo(serial!);
              }}
            >
              Hold
            </button>
            <button
              className={`btn btn-lg btn-wide btn-error`}
              onClick={() => setIsModalOpen(true)}
              disabled={isScrapping}
            >
              Scrap
            </button>

            {/* Modal dialog for confirmation */}
            {isModalOpen && (
              <div className="modal modal-open">
                <div className="modal-box">
                  <h3 className="font-bold text-lg">Are you sure?</h3>
                  <p className="py-4">
                    Do you really want to scrap this container? This action
                    cannot be undone.
                  </p>
                  <div className="modal-action">
                    {/* Confirm Button */}
                    <button className="btn btn-error" onClick={handleScrap}>
                      Yes, Scrap it
                    </button>

                    {/* Cancel Button */}
                    <button
                      className="btn"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button
            className={`btn btn-lg btn-wide ${isScrapping ? "" : "hidden"}`}
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

export default RepairCenter;
