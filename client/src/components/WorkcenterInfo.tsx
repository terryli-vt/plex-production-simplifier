import React, { useEffect, useState } from "react";

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
  const [cachedWorkcenterInfo, setCachedWorkcenterInfo] = useState<{
    [key: string]: string | number;
  } | null>(null);

  const [cachedSubstratePartNo, setCachedSubstratePartNo] = useState<
    string | null
  >(null);
  const [cachedStdPackQty, setCachedStdPackQty] = useState<number | null>(null);
  const [cachedPlexServer, setCachedPlexServer] = useState<string | null>(null);

  // Update cache when new workcenterInfo arrives
  useEffect(() => {
    if (status === "Loaded" && workcenterInfo) {
      setCachedWorkcenterInfo(workcenterInfo);
      setCachedSubstratePartNo(substratePartNo || null);
      setCachedStdPackQty(stdPackQty || null);
      setCachedPlexServer(plexServer || null);
    }
  }, [status, workcenterInfo, substratePartNo, stdPackQty, plexServer]);

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

      {status === "Error" && (
        <p className="text-center">
          Error fetching workcenter information. Please try again.
        </p>
      )}

      <div className="overflow-auto">
        <table className="table-auto w-full">
          <tbody>
            {cachedWorkcenterInfo &&
              Object.entries(cachedWorkcenterInfo).map(([key, value]) => (
                <tr key={key}>
                  <td className="border px-4 py-2 whitespace-nowrap">{key}</td>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    {/* Show loader if still loading, else show the cached value */}
                    {status === "Loading" ? (
                      <span className="text-gray-500">Loading...</span>
                    ) : (
                      value
                    )}
                  </td>
                </tr>
              ))}

            {cachedSubstratePartNo && (
              <tr>
                <td className="border px-4 py-2 whitespace-nowrap">
                  Substrate
                </td>
                <td className="border px-4 py-2 whitespace-nowrap">
                  {status === "Loading" ? (
                    <span className="text-gray-500">Loading...</span>
                  ) : (
                    cachedSubstratePartNo
                  )}
                </td>
              </tr>
            )}

            {cachedStdPackQty && (
              <tr>
                <td className="border px-4 py-2 whitespace-nowrap">
                  Standard Pack Qty
                </td>
                <td className="border px-4 py-2 whitespace-nowrap">
                  {status === "Loading" ? (
                    <span className="text-gray-500">Loading...</span>
                  ) : (
                    cachedStdPackQty
                  )}
                </td>
              </tr>
            )}

            {cachedPlexServer && (
              <tr>
                <td className="border px-4 py-2 whitespace-nowrap">
                  Plex Server
                </td>
                <td className="border px-4 py-2 whitespace-nowrap">
                  {status === "Loading" ? (
                    <span className="text-gray-500">Loading...</span>
                  ) : (
                    cachedPlexServer
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onUpdate}
          className="btn w-full mt-4 bg-blue-500 text-white hover:bg-blue-600"
          disabled={status === "Loading"}
        >
          Get Workcenter Information
        </button>
      </div>
    </div>
  );
};

export default WorkcenterInfo;
