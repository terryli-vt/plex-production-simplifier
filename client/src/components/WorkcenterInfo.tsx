import React, { useState } from "react";
import { getWorkcenterStatus } from "../services/apiClient";

const WorkcenterInfo: React.FC = () => {
  const [info, setInfo] = useState(null);
  const [status, setStatus] = useState<"Idle" | "Loading" | "Loaded" | "Error">(
    "Idle"
  );

  const handleInfoUpdate = async () => {
    setStatus("Loading");
    try {
      setInfo(await getWorkcenterStatus());
      setStatus("Loaded");
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setStatus("Error");
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow mb-4 w-full">
      <h2 className="text-xl font-semibold mb-2 text-center">
        Assembly Workcenter Information
      </h2>

      {status === "Idle" && (
        <p className="text-center">
          Click the button below to get workcenter information.
        </p>
      )}
      {status === "Loading" && <p className="text-center">Loading...</p>}
      {status === "Error" && (
        <p className="text-center">Failed to load data.</p>
      )}
      {status === "Loaded" && info && (
        <div className="overflow-auto">
          <table className="table-auto w-full">
            <tbody>
              {Object.entries(info).map(([key, value]) => (
                <tr key={key}>
                  <td className="border px-4 py-2 whitespace-nowrap">{key}</td>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    {value as string}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-center">
        <button
          onClick={handleInfoUpdate}
          className="mt-4 bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600"
        >
          Get Workcenter Information
        </button>
      </div>
    </div>
  );
};

export default WorkcenterInfo;
