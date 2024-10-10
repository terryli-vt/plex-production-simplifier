import React from "react";

interface BOMInfoProps {
  plexServer: string | null;
  status: string;
  bomInfo: { [key: string]: string | number } | null;
}

const BOMInfo: React.FC<BOMInfoProps> = ({ plexServer, status, bomInfo }) => {
  return (
    <div className="bg-gray-100 p-4 rounded shadow mb-4 w-full">
      <h2 className="text-xl font-semibold mb-2 text-center">
        Bill of Material (BOM) Information
      </h2>

      {status === "Idle" && (
        <p className="text-center">
          Please enter a part number to see the BOM information.
        </p>
      )}
      {status === "Loading" && <p className="text-center">Loading...</p>}
      {status === "Error" && (
        <p className="text-center">Failed to load data.</p>
      )}
      {status === "Loaded" && bomInfo && (
        <div className="overflow-auto">
          <table className="table-auto w-full">
            <tbody>
              {Object.entries(bomInfo).map(([key, value]) => (
                <tr key={key}>
                  <td className="border px-4 py-2 whitespace-nowrap">{key}</td>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    {value as string}
                  </td>
                </tr>
              ))}
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
    </div>
  );
};

export default BOMInfo;
