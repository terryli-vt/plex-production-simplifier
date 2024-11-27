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
  const [scrapReason, setScrapReason] = useState<string>("");

  // Define a list of scrap reasons
  const scrapReasons = [
    "Bad Edgefolding",
    "Bad Molding",
    "Carpet Waste",
    "Supplier Issue",
    "Surface Damage",
    "Surface Stain",
    "Trim Line Off",
    "Unrepairable Wrinkle",
  ];
  // Function to handle scrap confirmation
  const handleScrap = async () => {
    if (!scrapReason) return; // Ensure reason is selected
    setIsScrapping(true);
    setIsModalOpen(false);
    setScanStatus("Loading"); // disable scan

    try {
      await api.scrapContainer(serial!, scrapReason);
      setMessages(() => []); // clear messages
      setInfoStatus("Idle");
      logMessage(
        `${serial} scrapped successfully with reason: ${scrapReason}`,
        "#00CC66"
      );
    } catch (error: any) {
      logMessage(`Error: ${error.message} ❌`, "#FF6666");
      console.error("Failed to scrap the container:", error);
    } finally {
      setIsScrapping(false);
      setScanStatus("Ready"); // enable scan
      setScrapReason(""); // Reset scrap reason
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Repair Center</h1>
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/3 lg:pr-4 mb-4 lg:mb-0">
          <ContainerInfo
            status={infoStatus}
            plexServer={plexServer}
            containerInfo={containerInfo}
          />
        </div>
        <div className="w-full lg:w-2/3">
          <div className="mb-4">
            <ScanInput
              onScan={loadContainerInfo}
              placeholder="Scan barcode on the label..."
              status={scanStatus}
            />
          </div>
          {/* button group */}
          <div
            className={`flex flex-col my-5 md:flex-row space-y-4 md:space-y-0 md:space-x-4 ${
              infoStatus === "Loaded" && !isScrapping && !disableBtns
                ? ""
                : "hidden"
            }`}
          >
            <button
              className={`btn btn-lg btn-success flex-grow w-full md:w-auto`}
              onClick={async () => {
                await changeContainerStatus(serial!, "OK");
                loadContainerInfo(serial!);
              }}
            >
              OK
            </button>
            <button
              className={`btn btn-lg btn-warning flex-grow w-full md:w-auto`}
              onClick={async () => {
                await changeContainerStatus(serial!, "Hold");
                loadContainerInfo(serial!);
              }}
            >
              Hold
            </button>
            <button
              className={`btn btn-lg btn-error flex-grow w-full md:w-auto`}
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
                  {/* Dropdown menu for scrap reasons */}
                  <div className="my-2">
                    <label
                      htmlFor="scrapReason"
                      className="block font-semibold mb-2"
                    >
                      Select Scrap Reason:
                    </label>
                    <select
                      id="scrapReason"
                      className="select select-bordered w-full"
                      value={scrapReason}
                      onChange={(e) => setScrapReason(e.target.value)}
                    >
                      <option value="" disabled>
                        -- Choose a reason --
                      </option>
                      {scrapReasons.map((reason) => (
                        <option key={reason} value={reason}>
                          {reason}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Confirm Message */}
                  <p className="py-2">
                    Do you really want to scrap this container? This action
                    cannot be undone.
                  </p>

                  {/* Action Buttons */}
                  <div className="modal-action">
                    {/* Confirm Button */}
                    <button
                      className="btn btn-error"
                      onClick={handleScrap}
                      disabled={!scrapReason}
                    >
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
            className={`btn btn-lg flex-grow ${
              isScrapping ? "" : "hidden"
            } w-full md:w-auto`}
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
