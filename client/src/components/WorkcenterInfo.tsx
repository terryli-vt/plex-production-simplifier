import React from "react";

interface WorkcenterInfoProps {
  workcenterName: string;
  status: string;
  plexServer: string | null;
  workcenterInfo: { [key: string]: string | number } | null;
  onUpdate: () => void;
  substratePartNo?: string | null;
  stdPackQty?: number | null;
}

const WorkcenterInfo: React.FC<WorkcenterInfoProps> = ({
  workcenterName,
  status,
  plexServer,
  workcenterInfo,
  onUpdate,
  substratePartNo,
  stdPackQty,
}) => {
  return (
    <div className="bg-gray-100 p-4 rounded shadow mb-4 w-full">
      <h2 className="text-xl font-semibold mb-2 text-center">
        {workcenterName} Workcenter Information
      </h2>

      {status === "Idle" && (
        <p className="text-center">
          Click the button below to be ready for scanning.
        </p>
      )}
      {status === "Loading" && <p className="text-center">Loading...</p>}
      {status === "Error" && (
        <p className="text-center">Failed to load data.</p>
      )}
      {status === "Loaded" && workcenterInfo && (
        <div className="overflow-auto">
          <table className="table-auto w-full">
            <tbody>
              {Object.entries(workcenterInfo).map(([key, value]) => (
                <tr key={key}>
                  <td className="border px-4 py-2 whitespace-nowrap">{key}</td>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    {value as string}
                  </td>
                </tr>
              ))}
              {substratePartNo && (
                <tr>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    Substrate
                  </td>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    {substratePartNo}
                  </td>
                </tr>
              )}
              {stdPackQty && (
                <tr>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    Standard Pack Qty
                  </td>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    {stdPackQty}
                  </td>
                </tr>
              )}
              {plexServer && (
                <tr>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    Plex Server
                  </td>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    {plexServer}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-center">
        <button
          onClick={onUpdate}
          className="mt-4 bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600"
        >
          Get Workcenter Information
        </button>
      </div>
    </div>
  );
};

export default WorkcenterInfo;
