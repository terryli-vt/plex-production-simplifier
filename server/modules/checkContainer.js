const fetch = require("node-fetch");
require("dotenv").config();

// Function to check if a container exists
async function checkContainerExists(url, data) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: process.env.AUTH_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(
        `Check container request failed with status ${response.status}`
      );
    }

    const responseData = await response.json();
    const rows = responseData.tables[0].rows;
    // Check if the response data is an empty array
    if (Array.isArray(rows) && rows.length === 0) {
      throw new Error(`Container ${data.inputs.Serial_No} does not exist.`);
    }

    return responseData; // Container exists
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = checkContainerExists;
