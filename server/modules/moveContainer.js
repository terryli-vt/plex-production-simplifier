const fetch = require("node-fetch");
require("dotenv").config();

async function moveContainer(url, data) {
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
    return responseData;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = moveContainer;
