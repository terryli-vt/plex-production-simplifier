import React, { useState, useEffect } from "react";
import * as api from "../services/apiClient";

type PackListProps = {
  stdPackQty: number;
  list: string[];
  onPack: () => void;
  onHold: (serial: string) => void;
  onUnload: (serial: string) => void;
  isPacking: boolean;
  isChangingList: boolean;
};

const PackList: React.FC<PackListProps> = ({
  stdPackQty,
  list,
  onPack,
  onHold,
  onUnload,
  isPacking,
  isChangingList,
}) => {
  const [progress, setProgress] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false); // confirmation dialog
  const [autoPrint, setAutoPrint] = useState(true); // Auto print setting

  // Fetch autoPrint setting from API
  useEffect(() => {
    const fetchAutoPrintSetting = async () => {
      try {
        setAutoPrint(await api.getAutoPrint()); // Assume api.getAutoPrint() returns a boolean
      } catch (error) {
        console.error("Error fetching auto print setting:", error);
      }
    };

    fetchAutoPrintSetting();
  }, []); // Empty dependency array means this runs only on component mount

  // Update progress when serialNumbers change
  useEffect(() => {
    const progressPercentage = (list.length / stdPackQty) * 100;
    setProgress(progressPercentage);

    // Auto trigger pack when we reach full quantity
    if (list.length === stdPackQty && autoPrint && !isPacking) {
      onPack(); // Automatically call onPack when we reach the standard pack quantity
    }
  }, [list, stdPackQty, onPack, autoPrint, isPacking]);

  // Handle the confirmation dialog for the Pack action
  const handlePackClick = () => {
    if (list.length < stdPackQty) {
      setIsModalVisible(true);
    } else {
      onPack();
    }
  };

  // Handle confirmation from modal
  const handleConfirmPack = () => {
    setIsModalVisible(false); // Hide modal
    onPack(); // Proceed with packing
  };

  return (
    <div className="p-4 bg-base-200 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2 text-center">Pack List</h2>

      {/* Progress bar */}
      <div className="mb-4">
        <progress
          className="progress progress-accent w-full transition-all"
          value={progress || 0}
          max={100}
        />
        <p className="text-3xl mt-2 text-gray-600 text-center">{`${list.length} / ${stdPackQty} packed`}</p>
      </div>

      {/* List of serial numbers */}
      <ul className="mb-4 space-y-2">
        {list.map((serial, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-2 bg-base-100 rounded-md shadow-sm"
          >
            <span>{serial}</span>
            <div>
              <button
                onClick={() => onHold(serial)}
                className="btn btn-warning btn-sm mr-3"
                disabled={isChangingList}
              >
                Hold
              </button>
              <button
                onClick={() => onUnload(serial)}
                className="btn btn-error btn-sm"
                disabled={isChangingList}
              >
                Unload
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Pack button */}
      <button
        onClick={handlePackClick}
        className="btn btn-primary w-full"
        disabled={list.length === 0 || isPacking || isChangingList}
      >
        {isPacking ? "Packing..." : "Pack and Print Shipping Label"}
      </button>

      {/* DaisyUI Modal */}
      {isModalVisible && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Packing</h3>
            <p className="py-4">
              You haven't reached the standard pack quantity. Are you sure you
              want to pack?
            </p>
            <div className="modal-action">
              <button onClick={handleConfirmPack} className="btn btn-primary">
                Yes, Pack
              </button>
              <button
                onClick={() => setIsModalVisible(false)} // Close modal without packing
                className="btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackList;
