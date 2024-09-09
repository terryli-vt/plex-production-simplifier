const fetch = require("node-fetch");
require("dotenv").config();

async function getPartKey(url, data) {
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
        `Get Part Key Request failed with status ${response.status}`
      );
    }

    const result = await response.json();
    const rows = result.tables[0].rows;
    if (rows.length === 0) {
      throw new Error("No Part Key");
    }
    const partKey = rows[0][0];

    return partKey;
  } catch (error) {
    throw new Error(`Failed to fetch Part Key: ${error.message}`);
  }
}

async function getOperationKey(url, data) {
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
        `Get Operation Key Request failed with status ${response.status}`
      );
    }

    const result = await response.json();
    const rows = result.tables[0].rows;

    if (rows.length === 0) {
      throw new Error("No Operation Key");
    }
    const operationKey = rows[0][0];

    return operationKey;
  } catch (error) {
    throw new Error(`Failed to fetch Operation Key: ${error.message}`);
  }
}

async function getStdQty(url, data) {
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
        `Get Std Qty Request failed with status ${response.status}`
      );
    }

    const result = await response.json();
    const stdQty = parseInt(result.outputs["Standard_Quantity"]);
    if (!stdQty) {
      throw new Error("No Std Qty");
    }

    return stdQty;
  } catch (error) {
    throw new Error(`Failed to fetch Std Qty: ${error.message}`);
  }
}

module.exports = {
  getPartKey,
  getOperationKey,
  getStdQty,
};
