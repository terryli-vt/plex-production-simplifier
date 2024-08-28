import React, { useState, useEffect } from "react";

const Settings: React.FC = () => {
  const plexServerOptions = [
    { key: "Production", value: "" },
    { key: "Test", value: "test." },
  ];

  const assemblyPrinterOptions = [
    { key: "Assembly", value: "10.24.2.141" },
    { key: "Zebra S6 (2nd floor)", value: "10.24.3.19" },
    { key: "Test", value: "10.24.3.239" },
    { key: "Waterjet", value: "10.24.1.61" },
    { key: "Line 3 Packing", value: "10.24.3.112" },
    { key: "Toyota Backup", value: "10.24.3.159" },
  ];

  // Function to get the default value for a dropdown
  const getDefaultValue = (
    options: { key: string; value: string }[],
    storageKey: string
  ): string => {
    const storedValue = localStorage.getItem(storageKey);
    if (storedValue && options.some((option) => option.value === storedValue)) {
      return storedValue;
    }
    return options[0].value; // return 1st option if no localStorage
  };

  // Initialize state with values from localStorage or default to the first option
  const [plexServer, setPlexServer] = useState<string>(
    () => getDefaultValue(plexServerOptions, "plexServer") // option, storageKey
  );
  const [assemblyPrinter, setAssemblyPrinter] = useState<string>(() =>
    getDefaultValue(assemblyPrinterOptions, "assemblyPrinter")
  );

  // Save values to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("plexServer", plexServer);
  }, [plexServer]);

  useEffect(() => {
    localStorage.setItem("assemblyPrinter", assemblyPrinter);
  }, [assemblyPrinter]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="mb-4">
        <label
          htmlFor="server"
          className="block text-sm font-medium text-gray-700"
        >
          Select Plex Server:
        </label>
        <select
          id="plexServer"
          value={plexServer}
          onChange={(e) => setPlexServer(e.target.value)}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          {plexServerOptions.map((option) => (
            <option key={option.key} value={option.value}>
              {option.key}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="printer"
          className="block text-sm font-medium text-gray-700"
        >
          Select Printer for RIVIAN Assembly Line:
        </label>
        <select
          id="assemblyPrinter"
          value={assemblyPrinter}
          onChange={(e) => setAssemblyPrinter(e.target.value)}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          {assemblyPrinterOptions.map((option) => (
            <option key={option.key} value={option.value}>
              {option.key}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Settings;