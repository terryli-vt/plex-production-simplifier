import React, { useState, useEffect } from "react";

// Define the type for each setting's option
interface Option {
  key: string;
  value: string;
}

// Define the type for the settings object
interface SettingsState {
  plexServer: string;
  waterjetWorkcenter: string;
  edgefoldWorkcenter: string;
  assemblyWorkcenter: string;
  packWorkcenter: string;
  waterjetPrinter: string;
  assemblyPrinter: string;
  packPrinter: string;
  containerPrinter: string;
  packMode: string;
  autoPrint: boolean;
}

const Settings: React.FC = () => {
  // A central repository for all dropdown options
  const options = {
    plexServerOptions: [
      { key: "Production", value: "Production" },
      { key: "Test", value: "Test" },
    ],

    waterjetWorkcenterOptions: [
      { key: "Waterjet-1: R1T, A2LL", value: "74884" },
      { key: "Waterjet-2: A2LL Sunroof", value: "74885" },
      { key: "Waterjet-3: R1S, BT1", value: "74886" },
      { key: "Waterjet-4: BT1", value: "75091" },
      /* { key: "Waterjet-5: ", value: "75153" }, */
    ],

    edgefoldWorkcenterOptions: [
      { key: "Edgefold-R1S", value: "74883" },
      { key: "Edgefold-R1T", value: "75207" },
      { key: "Edgefold-A2LL", value: "75141" },
      { key: "Edgefold-BT1", value: "75462" },
      { key: "Edgefold-U725", value: "74887" },
    ],

    assemblyWorkcenterOptions: [
      {
        key: "Assemble-1: Assembly for RIVIAN R1T/R1S Headliner",
        value: "72323",
      },
      {
        key: "Assemble-2: Assembly for A2LL, BT1 Sunroof / Hybrid",
        value: "75077",
      },
      {
        key: "Assemble-3: Assembly for U725",
        value: "72543",
      },
    ],

    packWorkcenterOptions: [
      { key: "Pack-1: Pack for Rivian", value: "74895" },
      { key: "Pack-2: Pack for A2LL, BT1 Sunroof / Hybrid", value: "74916" },
      { key: "Pack-3: Pack for U725", value: "75078" },
      { key: "Pack-4: Pack for BT1 Fullroof", value: "75079" },
    ],

    waterjetPrinterOptions: [
      { key: "Waterjet 1 Printer", value: "10.24.2.48" },
      { key: "Waterjet 2 Printer", value: "10.24.2.128" },
      { key: "Waterjet 3 Printer", value: "10.24.1.61" },
      { key: "Waterjet 4 Printer", value: "10.24.2.40" },
      { key: "Test", value: "10.24.2.7" },
      //{ key: "Invalid Printer IP", value: "10.24.2.111" },
    ],

    assemblyPrinterOptions: [
      { key: "Assembly - Rivian", value: "10.24.2.63" },
      { key: "Assembly - A2&BT1", value: "10.24.2.45" },
      { key: "Test", value: "10.24.2.7" },
      //{ key: "Invalid Printer IP", value: "10.24.2.111" },
    ],

    packPrinterOptions: [
      { key: "Pack - Rivian", value: "10.24.2.47" },
      { key: "Pack - A2&BT1", value: "10.24.2.46" },
      { key: "Pack - BT1 Fullroof", value: "10.24.2.44" },
      { key: "Test", value: "10.24.2.7" },
      //{ key: "Invalid Printer IP", value: "10.24.2.111" },
    ],

    containerPrinterOptions: [
      { key: "Waterjet 1 Printer", value: "10.24.2.48" },
      { key: "Waterjet 2 Printer", value: "10.24.2.128" },
      { key: "Waterjet 3 Printer", value: "10.24.1.61" },
      { key: "Waterjet 4 Printer", value: "10.24.2.40" },
      { key: "Assembly - Rivian", value: "10.24.2.63" },
      { key: "Assembly - A2&BT1", value: "10.24.2.45" },
      { key: "Assembly - U725", value: "10.24.3.222" },
      { key: "Pack - Rivian", value: "10.24.2.47" },
      { key: "Pack - A2&BT1", value: "10.24.2.46" },
      { key: "Pack - BT1 Fullroof", value: "10.24.2.44" },
      { key: "Pack - U725", value: "10.24.2.39" },
      { key: "Pack - Other Programs (Big Printer)", value: "10.24.0.211" },
      { key: "Test", value: "10.24.2.7" },
    ],

    packModeOptions: [
      { key: "Rack", value: "Rack" },
      { key: "Box", value: "Box" },
    ],
  };

  // Retrieves a boolean setting from localStorage or defaults to true
  const getBooleanDefaultValue = (storageKey: string): boolean => {
    const storedValue = localStorage.getItem(storageKey);
    return storedValue ? storedValue === "true" : true;
  };

  // Function to get the default value for a dropdown
  // If a value exists in localStorage, it uses that; otherwise, it falls back to the first option.
  const getDefaultValue = (options: Option[], storageKey: string): string => {
    const storedValue = localStorage.getItem(storageKey);
    if (storedValue && options.some((option) => option.value === storedValue)) {
      return storedValue;
    }
    return options[0].value; // return 1st option if no localStorage
  };

  // Centralized state for all dropdowns
  // Initialize state with values from localStorage or default to the first option
  // Uses the SettingsState interface for type safety.
  const [settings, setSettings] = useState<SettingsState>(() => ({
    plexServer: getDefaultValue(options.plexServerOptions, "plexServer"),
    waterjetWorkcenter: getDefaultValue(
      options.waterjetWorkcenterOptions,
      "waterjetWorkcenter"
    ),
    edgefoldWorkcenter: getDefaultValue(
      options.edgefoldWorkcenterOptions,
      "edgefoldWorkcenter"
    ),
    assemblyWorkcenter: getDefaultValue(
      options.assemblyWorkcenterOptions,
      "assemblyWorkcenter"
    ),
    packWorkcenter: getDefaultValue(
      options.packWorkcenterOptions,
      "packWorkcenter"
    ),
    waterjetPrinter: getDefaultValue(
      options.waterjetPrinterOptions,
      "waterjetPrinter"
    ),
    assemblyPrinter: getDefaultValue(
      options.assemblyPrinterOptions,
      "assemblyPrinter"
    ),
    packPrinter: getDefaultValue(options.packPrinterOptions, "packPrinter"),
    containerPrinter: getDefaultValue(
      options.containerPrinterOptions,
      "containerPrinter"
    ),
    packMode: getDefaultValue(options.packModeOptions, "packMode"),
    autoPrint: getBooleanDefaultValue("autoPrint"),
  }));

  // Automatically saves any changes to settings back to localStorage
  // It runs whenever 'settings' changes
  useEffect(() => {
    Object.keys(settings).forEach((key) => {
      const value = settings[key as keyof SettingsState];
      localStorage.setItem(
        key,
        typeof value === "boolean" ? String(value) : value
      );
    });
  }, [settings]);

  // When user changes the settings, update the state
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
      <div className="mb-9">
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
      <hr className="border-t-2 border-dashed border-gray-400 my-4" />
      <h1 className="text-lg font-bold mb-2">Workcenters:</h1>
      <div className="mb-6">
        <label
          htmlFor="waterjetWorkcenter"
          className="block text-sm font-medium text-gray-700"
        >
          Select Workcenter for Waterjet:
        </label>
        <select
          id="waterjetWorkcenter"
          value={settings.waterjetWorkcenter}
          onChange={(e) =>
            handleSettingChange("waterjetWorkcenter", e.target.value)
          }
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          {options.waterjetWorkcenterOptions.map((option) => (
            <option key={option.key} value={option.value}>
              {option.key}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-6">
        <label
          htmlFor="edgefoldWorkcenter"
          className="block text-sm font-medium text-gray-700"
        >
          Select Workcenter for Edgefold:
        </label>
        <select
          id="edgefoldWorkcenter"
          value={settings.edgefoldWorkcenter}
          onChange={(e) =>
            handleSettingChange("edgefoldWorkcenter", e.target.value)
          }
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          {options.edgefoldWorkcenterOptions.map((option) => (
            <option key={option.key} value={option.value}>
              {option.key}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-6">
        <label
          htmlFor="assemblyWorkcenter"
          className="block text-sm font-medium text-gray-700"
        >
          Select Workcenter for Assembly:
        </label>
        <select
          id="assemblyWorkcenter"
          value={settings.assemblyWorkcenter}
          onChange={(e) =>
            handleSettingChange("assemblyWorkcenter", e.target.value)
          }
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          {options.assemblyWorkcenterOptions.map((option) => (
            <option key={option.key} value={option.value}>
              {option.key}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-9">
        <label
          htmlFor="packWorkcenter"
          className="block text-sm font-medium text-gray-700"
        >
          Select Workcenter for Pack:
        </label>
        <select
          id="packWorkcenter"
          value={settings.packWorkcenter}
          onChange={(e) =>
            handleSettingChange("packWorkcenter", e.target.value)
          }
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          {options.packWorkcenterOptions.map((option) => (
            <option key={option.key} value={option.value}>
              {option.key}
            </option>
          ))}
        </select>
      </div>
      <hr className="border-t-2 border-dashed border-gray-400 my-4" />
      <h1 className="text-lg font-bold mb-2">Printers:</h1>
      <div className="mb-6">
        <label
          htmlFor="waterjetPrinter"
          className="block text-sm font-medium text-gray-700"
        >
          Select Printer for Waterjet Line:
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
          Select Printer for Assembly Line:
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
          Select Printer for Pack Line:
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
      <div className="mb-9">
        <label
          htmlFor="containerPrinter"
          className="block text-sm font-medium text-gray-700"
        >
          Select Printer for Container Printing Page:
        </label>
        <select
          id="containerPrinter"
          value={settings.containerPrinter}
          onChange={(e) =>
            handleSettingChange("containerPrinter", e.target.value)
          }
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          {options.containerPrinterOptions.map((option) => (
            <option key={option.key} value={option.value}>
              {option.key}
            </option>
          ))}
        </select>
      </div>
      <hr className="border-t-2 border-dashed border-gray-400 my-4" />
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
