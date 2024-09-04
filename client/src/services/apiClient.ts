const serverURL = "http://localhost:3300";
// const serverURL = "http://10.24.3.182:3300";

// Retrieve from local storage (or use default values)
export const getPlexServer = (): string => {
  return localStorage.getItem("plexServer") || "Test";
};

const getPrinterIP = (): string => {
  return localStorage.getItem("assemblyPrinter") || "10.24.3.239";
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
export const checkContainerExists = async (serialNo: string): Promise<any> => {
  const url = `${serverURL}/check-container-exists`;

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
export const recordProduction = async (workcenterKey: string): Promise<any> => {
  const url = `${serverURL}/record-production`;

  const headers = {
    "Content-Type": "application/json",
  };

  const plexServer = getPlexServer();
  const body = JSON.stringify({
    plexServer,
    workcenterKey,
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
export const printLabel = async (serialNo: string): Promise<any> => {
  const url = `${serverURL}/print-label`;

  const headers = {
    "Content-Type": "application/json",
  };

  const plexServer = getPlexServer();
  const printerIP = getPrinterIP();
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
