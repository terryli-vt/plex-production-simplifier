// const serverURL = "http://localhost:3300";
const serverURL = "http://10.24.3.182:3300";
// const serverURL = "http://10.24.1.20:8000";

// Retrieve from local storage (or use default values)
export const getPlexServer = (): string => {
  return localStorage.getItem("plexServer") || "Production";
};

export const getWaterjetWorkcenterKey = (): string => {
  return localStorage.getItem("waterjetWorkcenter") || "74886";
};

export const getEdgefoldWorkcenterKey = (): string => {
  return localStorage.getItem("edgefoldWorkcenter") || "74883";
};

export const getAssemblyWorkcenterKey = (): string => {
  return localStorage.getItem("assemblyWorkcenter") || "72323";
};

export const getPackWorkcenterKey = (): string => {
  return localStorage.getItem("packWorkcenter") || "74884";
};

const getWaterjetPrinterIP = (): string => {
  return localStorage.getItem("waterjetPrinter") || "10.24.1.61";
};

const getAssemblyRivianPrinterIP = (): string => {
  return localStorage.getItem("assemblyRivianPrinter") || "10.24.3.6";
};

const getAssemblyBT1PrinterIP = (): string => {
  return localStorage.getItem("assemblyBT1Printer") || "10.24.2.138";
};

const getPackPrinterIP = (): string => {
  return localStorage.getItem("packPrinter") || "10.24.0.211";
};

export const getPackMode = (): string => {
  return localStorage.getItem("packMode") || "Rack";
};

export const getAutoPrint = (): boolean => {
  return localStorage.getItem("autoPrint") === "true";
};

// Get the latest workcenter information
export const getWorkcenterInfo = async (
  workcenterKey: string
): Promise<any> => {
  const url = `${serverURL}/get-workcenter-info`;
  const headers = {
    "Content-Type": "application/json",
  };

  const plexServer = getPlexServer();
  const body = JSON.stringify({ plexServer, workcenterKey });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "Failed to get workcenter information");
    }
    return result.workcenterInfo;
  } catch (error) {
    throw error;
  }
};

// Get the substrate part number based on the finished good part number
export const getSubstratePartNumber = async (
  fgPartNo: string
): Promise<any> => {
  const url = `${serverURL}/get-substrate-part-no`;

  const headers = {
    "Content-Type": "application/json",
  };

  const plexServer = getPlexServer();
  const body = JSON.stringify({ fgPartNo, plexServer });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "Failed to get substrate part number");
    }
    return result.substratePartNo;
  } catch (error) {
    throw error;
  }
};

// Check if a container exists in Plex
export const checkContainer = async (serialNo: string): Promise<any> => {
  const url = `${serverURL}/check-container`;

  const headers = {
    "Content-Type": "application/json",
  };

  const plexServer = getPlexServer();
  const body = JSON.stringify({ serialNo, plexServer });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "Failed to check container");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

// Change a container's status (for hold)
export const changeContainerStatus = async (
  serialNo: string,
  newStatus: string
): Promise<any> => {
  const url = `${serverURL}/change-container-status`;

  const headers = {
    "Content-Type": "application/json",
  };

  const plexServer = getPlexServer();
  const body = JSON.stringify({ serialNo, newStatus, plexServer });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "Failed to change container status");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

// Scrap container
export const scrapContainer = async (serialNo: string): Promise<any> => {
  const url = `${serverURL}/scrap-container`;

  const headers = {
    "Content-Type": "application/json",
  };

  const plexServer = getPlexServer();
  const body = JSON.stringify({ serialNo, plexServer });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "Failed to scrap container");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

// Move container using Plex API
export const moveContainer = async (
  serialNo: string,
  workcenterName: string
): Promise<any> => {
  const url = `${serverURL}/move-container`;

  const headers = {
    "Content-Type": "application/json",
  };

  const plexServer = getPlexServer();
  const body = JSON.stringify({
    serialNo,
    plexServer,
    workcenterName,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "Failed to move container");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

// Record production
export const recordProduction = async (
  workcenterKey: string,
  quantity: number = 1
): Promise<any> => {
  const url = `${serverURL}/record-production`;

  const headers = {
    "Content-Type": "application/json",
  };

  const plexServer = getPlexServer();
  const body = JSON.stringify({
    plexServer,
    workcenterKey,
    quantity,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });

    // Parse the JSON response
    const result = await response.json();

    // Check if the operation was successful
    if (!result.success) {
      throw new Error(result.message || "Failed to record production");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

// Record production Bin-for-Bin
export const recordProductionBFB = async (
  workcenterKey: string,
  serialNo: string
): Promise<any> => {
  const url = `${serverURL}/record-production-bfb`;

  const headers = {
    "Content-Type": "application/json",
  };

  const plexServer = getPlexServer();
  const body = JSON.stringify({
    plexServer,
    workcenterKey,
    serialNo,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });

    // Parse the JSON response
    const result = await response.json();

    // Check if the operation was successful
    if (!result.success) {
      throw new Error(
        result.message || "Failed to record bin-for-bin production"
      );
    }
    return result;
  } catch (error) {
    throw error;
  }
};

// Print label
export const printLabel = async (
  serialNo: string,
  workcenterName: string
): Promise<any> => {
  const url = `${serverURL}/print-label`;

  const headers = {
    "Content-Type": "application/json",
  };

  const plexServer = getPlexServer();
  let printerIP;

  if (workcenterName === "Waterjet-3") {
    printerIP = getWaterjetPrinterIP();
  } else if (workcenterName === "Assemble-1") {
    printerIP = getAssemblyRivianPrinterIP();
  } else if (workcenterName === "Assemble-2") {
    printerIP = getAssemblyBT1PrinterIP();
  } else if (workcenterName === "Pack-1") {
    printerIP = getPackPrinterIP();
  }

  const body = JSON.stringify({
    serialNo,
    plexServer,
    printerIP,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to print label");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

// Get standard pack quantity
export const getStdPackQty = async (partNo: string): Promise<any> => {
  const url = `${serverURL}/get-std-pack-qty`;

  const headers = {
    "Content-Type": "application/json",
  };

  const plexServer = getPlexServer();
  const body = JSON.stringify({ partNo, plexServer });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "Failed to get standard pack quantity");
    }
    return result.stdPackQty;
  } catch (error) {
    throw error;
  }
};

// Check containers that are loaded for a specific part number on a workcenter
export const getLoadedSerial = async (
  partNo: string,
  workcenterKey: number
): Promise<any> => {
  const url = `${serverURL}/get-loaded-serial`;

  const headers = {
    "Content-Type": "application/json",
  };

  const plexServer = getPlexServer();
  const body = JSON.stringify({ partNo, plexServer, workcenterKey });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "Failed to get loaded serials");
    }
    return result.serialNumbers;
  } catch (error) {
    throw error;
  }
};

// Check the component parts of a part number
export const getComponentPartNo = async (partNo: string): Promise<any> => {
  const url = `${serverURL}/get-component-part-no`;

  const headers = {
    "Content-Type": "application/json",
  };

  const plexServer = getPlexServer();
  const body = JSON.stringify({ partNo, plexServer });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "Failed to get component part numbers");
    }
    return result.components;
  } catch (error) {
    throw error;
  }
};

export const getBOMInfo = async (partNo: string): Promise<any> => {
  interface BOM {
    fgPartNo?: string;
    fgPartName?: string;
    substratePartNo?: string;
    substrateName?: string;
    carpetPartNo?: string;
    carpetName?: string;
  }

  const BOM: BOM = {};

  const headers = {
    "Content-Type": "application/json",
  };

  const plexServer = getPlexServer();

  try {
    let url = `${serverURL}/get-substrate-part-no`;
    let body = JSON.stringify({ fgPartNo: partNo, plexServer });
    let response = await fetch(url, {
      method: "POST",
      headers: headers,
      body,
    });

    let result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "Failed to get component part numbers");
    }
    // if this part number is finished good
    if (result.substratePartNo) {
      BOM.fgPartNo = partNo;
      BOM.fgPartName = result.partName;
      BOM.substratePartNo = result.substratePartNo;
      BOM.substrateName = result.substrateName;
    } else {
      BOM.substratePartNo = partNo;
      BOM.substrateName = result.partName;
    }

    url = `${serverURL}/get-carpet-part-no`;
    body = JSON.stringify({
      partNo: BOM.substratePartNo || partNo,
      plexServer,
    });
    response = await fetch(url, {
      method: "POST",
      headers: headers,
      body,
    });

    result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "Failed to get carpet part numbers");
    }
    BOM.carpetPartNo = result.carpetPartNo;
    BOM.carpetName = result.carpetPartName;

    // Rename the properties and return the new object
    // Each property is conditionally added using the spread operator .... It will only be added if the corresponding BOM property has a truthy value. This way, optional properties are excluded from the returned object if they are undefined or null.
    return {
      ...(BOM.fgPartNo && { "Finished Good Part Number": BOM.fgPartNo }),
      ...(BOM.fgPartName && { "Finished Good Name": BOM.fgPartName }),
      ...(BOM.substratePartNo && {
        "Substrate Part Number": BOM.substratePartNo,
      }),
      ...(BOM.substrateName && { "Substrate Name": BOM.substrateName }),
      ...(BOM.carpetPartNo && { "Carpet Part Number": BOM.carpetPartNo }),
      ...(BOM.carpetName && { "Carpet Name": BOM.carpetName }),
    };
  } catch (error) {
    throw error;
  }
};

// Borrow a container for inactive cases
export const borrowContainer = async (
  partNo: string,
  operationNo: string
): Promise<any> => {
  const url = `${serverURL}/get-first-container-by-date`;

  const headers = {
    "Content-Type": "application/json",
  };

  const plexServer = getPlexServer();
  const body = JSON.stringify({ partNo, plexServer, operationNo });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "Failed to borrow container");
    }
    return result.serial;
  } catch (error) {
    throw error;
  }
};

// Check if operator has logged in to the workcenter
export const checkWorkcenterLogin = async (
  workcenterKey: string
): Promise<any> => {
  const url = `${serverURL}/check-workcenter-login`;

  const headers = {
    "Content-Type": "application/json",
  };

  const plexServer = getPlexServer();
  const body = JSON.stringify({ plexServer, workcenterKey });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "Failed to check workcenter login");
    }
    return result.operator;
  } catch (error) {
    throw error;
  }
};
