const serverURL = "http://localhost:3300";

// Move container using Plex API
export const moveContainer = async (
  serialNo: string,
  workcenterName: string
): Promise<any> => {
  const url = `${serverURL}/move-container`;

  const headers = {
    "Content-Type": "application/json",
  };

  const plexServer = localStorage.getItem("plexServer"); // Retrieve from local storage
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
      throw new Error(result.message || "Failed to print label");
    }
    return result;
  } catch (error: any) {
    throw error;
  }
};
