import React from "react";

interface ContainerInfoProps {
  plexServer: string | null;
  status: string;
  containerInfo: { [key: string]: string | number } | null;
}

const ContainerInfo: React.FC<ContainerInfoProps> = ({
  plexServer,
  status,
  containerInfo,
}) => {
  return (
    <div className="bg-gray-100 p-4 rounded shadow mb-4 w-full">
      <h2 className="text-xl font-semibold mb-2 text-center">
        Container Information
      </h2>

      {status === "Idle" && (
        <p className="text-center">
          Please scan the label to see the container information.
        </p>
      )}
      {status === "Loading" && <p className="text-center">Loading...</p>}
      {status === "Error" && (
        <p className="text-center">Failed to load data.</p>
      )}
      {status === "Loaded" && containerInfo && (
        <div className="overflow-auto">
          <table className="table-auto w-full">
            <tbody>
              {Object.entries(containerInfo).map(([key, value]) => (
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

export default ContainerInfo;
