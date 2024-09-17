import React, { useState, useEffect } from "react";

// Define the type for each setting's option
interface Option {
  key: string;
  value: string;
}

// Define the type for the settings object
interface SettingsState {
  plexServer: string;
  waterjetPrinter: string;
  assemblyPrinter: string;
  packPrinter: string;
  packMode: string;
  autoPrint: boolean;
}

const Settings: React.FC = () => {
  const options = {
    plexServerOptions: [
      { key: "Production", value: "Production" },
      { key: "Test", value: "Test" },
    ],

    waterjetPrinterOptions: [
      { key: "Waterjet", value: "10.24.1.61" },
      { key: "Zebra S4 Backup (1st floor)", value: "10.24.2.134" },
      { key: "Zebra S5 (1st floor)", value: "10.24.2.1" },
      { key: "Zebra S6 (2nd floor)", value: "10.24.3.19" },
      { key: "Test", value: "10.24.3.239" },
      { key: "Assembly", value: "10.24.2.141" },
      { key: "Line 3 Packing", value: "10.24.3.112" },
      { key: "Toyota Backup", value: "10.24.3.159" },
    ],

    assemblyPrinterOptions: [
      { key: "Assembly", value: "10.24.2.141" },
      { key: "Zebra S4 Backup (1st floor)", value: "10.24.2.134" },
      { key: "Zebra S5 (1st floor)", value: "10.24.2.1" },
      { key: "Zebra S6 (2nd floor)", value: "10.24.3.19" },
      { key: "Test", value: "10.24.3.239" },
      { key: "Waterjet", value: "10.24.1.61" },
      { key: "Line 3 Packing", value: "10.24.3.112" },
      { key: "Toyota Backup", value: "10.24.3.159" },
    ],

    packPrinterOptions: [
      { key: "Pack", value: "10.24.0.211" },
      { key: "Assembly", value: "10.24.2.141" },
      { key: "Zebra S4 Backup (1st floor)", value: "10.24.2.134" },
      { key: "Zebra S5 (1st floor)", value: "10.24.2.1" },
      { key: "Zebra S6 (2nd floor)", value: "10.24.3.19" },
      { key: "Test", value: "10.24.3.239" },
      { key: "Waterjet", value: "10.24.1.61" },
      { key: "Line 3 Packing", value: "10.24.3.112" },
      { key: "Toyota Backup", value: "10.24.3.159" },
    ],

    packModeOptions: [
      { key: "Rack", value: "Rack" },
      { key: "Box", value: "Box" },
    ],
  };

  const getBooleanDefaultValue = (storageKey: string): boolean => {
    const storedValue = localStorage.getItem(storageKey);
    return storedValue ? storedValue === "true" : true;
  };

  // Function to get the default value for a dropdown
  const getDefaultValue = (options: Option[], storageKey: string): string => {
    const storedValue = localStorage.getItem(storageKey);
    if (storedValue && options.some((option) => option.value === storedValue)) {
      return storedValue;
    }
    return options[0].value; // return 1st option if no localStorage
  };

  // Centralized state for all dropdowns
  // Initialize state with values from localStorage or default to the first option
  const [settings, setSettings] = useState<SettingsState>(() => ({
    plexServer: getDefaultValue(options.plexServerOptions, "plexServer"),
    waterjetPrinter: getDefaultValue(
      options.waterjetPrinterOptions,
      "waterjetPrinter"
    ),
    assemblyPrinter: getDefaultValue(
      options.assemblyPrinterOptions,
      "assemblyPrinter"
    ),
    packPrinter: getDefaultValue(options.packPrinterOptions, "packPrinter"),
    packMode: getDefaultValue(options.packModeOptions, "packMode"),
    autoPrint: getBooleanDefaultValue("autoPrint"),
  }));

  // Generic effect for saving changes
  useEffect(() => {
    Object.keys(settings).forEach((key) => {
      const value = settings[key as keyof SettingsState];
      localStorage.setItem(
        key,
        typeof value === "boolean" ? String(value) : value
      );
    });
  }, [settings]);

  const handleSettingChange = (
    key: keyof SettingsState,
    value: string | boolean
  ) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Settings</h1>
      <div className="mb-6">
        <label
          htmlFor="plexServer"
          className="block text-sm font-medium text-gray-700"
        >
          Select Plex Server:
        </label>
        <select
          id="plexServer"
          value={settings.plexServer}
          onChange={(e) => handleSettingChange("plexServer", e.target.value)}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          {options.plexServerOptions.map((option) => (
            <option key={option.key} value={option.value}>
              {option.key}
            </option>
          ))}
        </select>
      </div>
      <h1 className="text-lg font-bold mb-2">Printers:</h1>
      <div className="mb-6">
        <label
          htmlFor="waterjetPrinter"
          className="block text-sm font-medium text-gray-700"
        >
          Select Printer for RIVIAN Waterjet Line:
        </label>
        <select
          id="waterjetPrinter"
          value={settings.waterjetPrinter}
          onChange={(e) =>
            handleSettingChange("waterjetPrinter", e.target.value)
          }
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          {options.waterjetPrinterOptions.map((option) => (
            <option key={option.key} value={option.value}>
              {option.key}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-6">
        <label
          htmlFor="assemblyPrinter"
          className="block text-sm font-medium text-gray-700"
        >
          Select Printer for RIVIAN Assembly Line:
        </label>
        <select
          id="assemblyPrinter"
          value={settings.assemblyPrinter}
          onChange={(e) =>
            handleSettingChange("assemblyPrinter", e.target.value)
          }
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          {options.assemblyPrinterOptions.map((option) => (
            <option key={option.key} value={option.value}>
              {option.key}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-6">
        <label
          htmlFor="packPrinter"
          className="block text-sm font-medium text-gray-700"
        >
          Select Printer for RIVIAN Pack Line:
        </label>
        <select
          id="packPrinter"
          value={settings.packPrinter}
          onChange={(e) => handleSettingChange("packPrinter", e.target.value)}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          {options.packPrinterOptions.map((option) => (
            <option key={option.key} value={option.value}>
              {option.key}
            </option>
          ))}
        </select>
      </div>
      <h1 className="text-lg font-bold mb-2">Pack:</h1>
      <div className="mb-6">
        <label
          htmlFor="packMode"
          className="block text-sm font-medium text-gray-700"
        >
          Select Pack Mode:
        </label>
        <select
          id="packMode"
          value={settings.packMode}
          onChange={(e) => handleSettingChange("packMode", e.target.value)}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          {options.packModeOptions.map((option) => (
            <option key={option.key} value={option.value}>
              {option.key}
            </option>
          ))}
        </select>
      </div>
      {/* Toggle for Auto-Print */}
      <div className="mb-6">
        <label htmlFor="autoPrint" className="block text-sm font-medium">
          Auto Print Label on Standard Pack Quantity:
        </label>
        <input
          type="checkbox"
          className="toggle toggle-primary mt-2"
          checked={settings.autoPrint}
          onChange={(e) => handleSettingChange("autoPrint", e.target.checked)}
        />
      </div>
    </div>
  );
};

export default Settings;
