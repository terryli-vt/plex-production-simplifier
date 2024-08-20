const fetch = require("node-fetch");
require("dotenv").config();

async function getZplCode(url, data) {
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
        `Get Label Request failed with status ${response.status}`
      );
    }

    const responseData = await response.json();
    if (!responseData.outputs.Label_Code) {
      throw new Error("No ZPL code received in response");
    }

    return responseData.outputs.Label_Code;
  } catch (error) {
    throw new Error(`Failed to fetch ZPL code: ${error.message}`);
  }
}

module.exports = getZplCode;
