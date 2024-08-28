const serverURL = "http://localhost:3300";
// Retrieve from local storage
const plexServer = localStorage.getItem("plexServer");
const printerIP = localStorage.getItem("assemblyPrinter");

const workcenterKey = "72323"; // Workcenter Key for RIVIAN

// Check if a container exists in Plex
export const checkContainerExists = async (serialNo: string): Promise<any> => {
  const url = `${serverURL}/check-container-exists`;

  const headers = {
    "Content-Type": "application/json",
  };

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

// Move container using Plex API
export const moveContainer = async (
  serialNo: string,
  workcenterName: string
): Promise<any> => {
  const url = `${serverURL}/move-container`;

  const headers = {
    "Content-Type": "application/json",
  };

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
export const recordProduction = async (): Promise<any> => {
  const url = `${serverURL}/record-production`;

  const headers = {
    "Content-Type": "application/json",
  };

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

// Print label
export const printLabel = async (serialNo: string): Promise<any> => {
  const url = `${serverURL}/print-label`;

  const headers = {
    "Content-Type": "application/json",
  };

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
