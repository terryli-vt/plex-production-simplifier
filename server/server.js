const express = require("express");
const bodyParser = require("body-parser"); // Needed to parse form-urlencoded data
var cors = require("cors");
require("dotenv").config();
const getZplCode = require("./modules/getZpl");
const sendZplToPrinter = require("./modules/printZpl");
const {
  getPartKey,
  getOperationKey,
  getStdQty,
} = require("./modules/partInfo");

const app = express();
const port = 3300;
// const port = 8000;

// Middleware to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Plex Simplifier's Server!");
});

app.get("/about", (req, res) => {
  res.send("Author: Tianyu (Terry) Li");
});

app.post("/get-workcenter-info", async (req, res) => {
  const { plexServer, workcenterKey } = req.body;

  const prefix = plexServer === "Test" ? "test." : "";

  try {
    const url = `https://${prefix}cloud.plex.com/api/datasources/10638/execute?`;

    const data = {
      inputs: {
        Workcenter_Key: workcenterKey,
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: process.env.AUTH_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Plex API failed to get workcenter information`);
    }

    const result = await response.json();

    // Extract the desired values from the response
    const table = result.tables[0];
    const columns = table.columns;

    const rows = table.rows; // Assuming we're interested in the first row
    if (Array.isArray(rows) && rows.length === 0) {
      throw new Error(`Workcenter does not exist`);
    }

    const row = table.rows[0];

    // Desired properties
    const properties = [
      "Workcenter_Code",
      "Part_No_Op",
      "Job_No",
      "Job_Quantity",
      "Job_Produced",
    ];

    // Mapping of original property names to new names
    const propertyMap = {
      Workcenter_Code: "Workcenter Name",
      Part_No_Op: "Part Number",
      Job_No: "Job",
      Job_Quantity: "Job Quantity",
      Job_Produced: "Produced",
    };

    // Create an object to hold the extracted values
    let workcenterInfo = {};

    // Loop through the properties and find their corresponding values
    properties.forEach((prop) => {
      const index = columns.indexOf(prop);
      if (index !== -1) {
        const newPropName = propertyMap[prop];
        workcenterInfo[newPropName] = row[index];
      }
    });

    workcenterInfo["Remaining"] =
      workcenterInfo["Job Quantity"] - workcenterInfo["Produced"];

    if (!workcenterInfo["Produced"]) {
      workcenterInfo["Produced"] = 0;
    }

    res.json({
      success: true,
      message: `Get workcenter status successful✔️`,
      workcenterInfo,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/get-substrate-part-no", async (req, res) => {
  const { plexServer, fgPartNo } = req.body;

  const prefix = plexServer === "Test" ? "test." : "";

  try {
    const url = `https://${prefix}cloud.plex.com/api/datasources/561/execute?`;

    const data = {
      inputs: {
        Part_No: fgPartNo,
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: process.env.AUTH_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Plex API failed to get substrate part number`);
    }

    const result = await response.json();

    // Extract the desired values from the response
    const table = result.tables[0];
    const columns = table.columns;
    const rows = table.rows;

    if (Array.isArray(rows) && rows.length === 0) {
      throw new Error(`FG part number does not exist`);
    }

    const subComponentsIndex = columns.indexOf("Sub_Components");
    const substratePartNoIndex = columns.indexOf("Component_Part_No");
    const substrateNameIndex = columns.indexOf("Component_Part_Name");
    const partNameIndex = columns.indexOf("Name"); // if this part is already a substrate

    // Extract the Component_Part_No where Sub_Components > 0
    const targetRow = rows.filter((row) => row[subComponentsIndex] > 0);

    const substratePartNo = targetRow.map(
      (row) => row[substratePartNoIndex]
    )[0];
    const substrateName = targetRow.map((row) => row[substrateNameIndex])[0];

    if (!substratePartNo) {
      res.json({
        success: true,
        message: `This is not a finished good part number`,
        partName: rows[0][partNameIndex],
      });
    } else {
      res.json({
        success: true,
        message: `Get substrate part number successful✔️`,
        substratePartNo,
        substrateName,
        partName: rows[0][partNameIndex],
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/check-container", async (req, res) => {
  const { serialNo, plexServer } = req.body;

  const prefix = plexServer === "Test" ? "test." : "";

  try {
    const url = `https://${prefix}cloud.plex.com/api/datasources/6455/execute?`;
    const data = {
      inputs: {
        Serial_No: serialNo,
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: process.env.AUTH_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Plex API failed to check container`);
    }

    const result = await response.json();
    const columns = result.tables[0].columns;
    const rows = result.tables[0].rows;
    // Check if the response data is an empty array
    if (Array.isArray(rows) && rows.length === 0) {
      throw new Error(`Container ${serialNo} does not exist`);
    }

    const row = rows[0];

    // Desired properties
    const properties = [
      "Part_No_Revision",
      "Name",
      "Operation_Code",
      "Quantity",
      "Container_Status",
      "Location",
    ];

    // Mapping of original property names to new names
    const propertyMap = {
      Part_No_Revision: "Part Number",
      Name: "Part Name",
      Operation_Code: "Operation",
      Quantity: "Quantity",
      Container_Status: "Status",
      Location: "Location",
    };

    // Create an object to hold the extracted values
    let containerInfo = {};

    // Loop through the properties and find their corresponding values
    properties.forEach((prop) => {
      const index = columns.indexOf(prop);
      if (index !== -1) {
        const newPropName = propertyMap[prop];
        containerInfo[newPropName] = row[index];
      }
    });

    res.json({
      success: true,
      message: `Container ${serialNo} exists ✔️`,
      containerInfo,
      serialNo,
    });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/change-container-status", async (req, res) => {
  const { serialNo, plexServer, newStatus } = req.body;

  const prefix = plexServer === "Test" ? "test." : "";

  try {
    const url = `https://${prefix}cloud.plex.com/api/datasources/4964/execute?`;
    const data = {
      inputs: {
        Serial_No: serialNo,
        Status: newStatus,
        Update_By_PUN: 13236883,
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: process.env.AUTH_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Plex API failed to change container status`);
    }
    res.json({
      success: true,
      message: `Container ${serialNo} changed to ${newStatus} status ✔️`,
    });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/scrap-container", async (req, res) => {
  const { serialNo, plexServer } = req.body;

  const prefix = plexServer === "Test" ? "test." : "";

  try {
    const url = `https://${prefix}cloud.plex.com/api/datasources/21052/execute?`;
    const data = {
      inputs: {
        Serial_No: serialNo,
        Scrap_Reason: "Bad Substrate",
        Scrap_Quantity: 1,
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: process.env.AUTH_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Plex API failed to scrap container`);
    }

    const result = await response.json();
    if (result.outputs.Result_Error) {
      throw new Error(result.outputs.Result_Message);
    }

    res.json({
      success: true,
      message: `Container ${serialNo} has been scrapped ✔️`,
    });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/move-container", async (req, res) => {
  const { serialNo, plexServer, workcenterName } = req.body;

  const prefix = plexServer === "Test" ? "test." : "";

  try {
    const url = `https://${prefix}cloud.plex.com/api/datasources/8176/execute?`;
    const data = {
      inputs: {
        Location: workcenterName,
        Serial_No: serialNo,
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: process.env.AUTH_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Plex API failed to move container`);
    }

    res.json({
      success: true,
      message: `Move container ${serialNo} successfully ✔️`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/record-production", async (req, res) => {
  const { plexServer, workcenterKey, quantity, containerStatus } = req.body;
  const prefix = plexServer === "Test" ? "test." : "";

  try {
    const url = `https://${prefix}cloud.plex.com/api/datasources/20446/execute?`;

    const data = {
      inputs: {
        Container_Full_Move_Container: true,
        Quantity: quantity,
        Workcenter_Key: workcenterKey,
        Container_Status: containerStatus,
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: process.env.AUTH_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Plex API failed to record production`);
    }

    const result = await response.json();
    const newSerialNo = result.outputs.Recorded_Serial_No;
    if (!newSerialNo) {
      throw new Error("Workcenter has insufficient source");
    }
    res.json({
      success: true,
      message: `Record production successful, new serial number: ${newSerialNo}✔️`,
      newSerialNo,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/record-production-bfb", async (req, res) => {
  const { plexServer, workcenterKey, serialNo } = req.body;
  const prefix = plexServer === "Test" ? "test." : "";

  try {
    const url = `https://${prefix}cloud.plex.com/api/datasources/20446/execute?`;

    const data = {
      inputs: {
        Record_Bin_For_Bin: true,
        Workcenter_Key: workcenterKey,
        Serial_No: serialNo,
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: process.env.AUTH_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Plex API failed to record bin-for-bin production`);
    }

    const result = await response.json();
    const success = !result.outputs.Result_Error;
    if (!success) {
      throw new Error(result.outputs.Result_Message);
    }
    res.json({
      success: true,
      message: `Serial ${serialNo} has been edgefolded ✔️`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/print-label", async (req, res) => {
  const { serialNo, plexServer } = req.body;
  const prefix = plexServer === "Test" ? "test." : "";
  try {
    // Step 1: Get ZPL code
    const url = `https://${prefix}cloud.plex.com/api/datasources/230486/execute?`;

    const post_data = {
      inputs: {
        Serial_No: serialNo,
      },
    };

    const zplcode = await getZplCode(url, post_data);
    // Step 2: Send ZPL code to the printer
    await sendZplToPrinter(zplcode, req.body.printerIP);

    res.json({ success: true, message: "Print label successfully ✔️" });
  } catch (error) {
    console.error("An error message:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/get-std-pack-qty", async (req, res) => {
  const { plexServer, partNo } = req.body;
  const prefix = plexServer === "Test" ? "test." : "";
  try {
    let url = `https://${prefix}cloud.plex.com/api/datasources/1786/execute?`;
    let post_data = {
      inputs: {
        Part_No: partNo,
      },
    };
    const partKey = await getPartKey(url, post_data);

    url = `https://${prefix}cloud.plex.com/api/datasources/29200/execute?`;
    post_data = {
      inputs: {
        Operation_Code: "Pack",
        Part_Key: partKey,
      },
    };
    const partOperationKey = await getOperationKey(url, post_data);

    url = `https://${prefix}cloud.plex.com/api/datasources/4658/execute?`;
    post_data = {
      inputs: {
        Part_Key: partKey,
        Part_Operation_Key: partOperationKey,
      },
    };
    const stdPackQty = await getStdQty(url, post_data);

    res.json({
      success: true,
      message: `Get std pack qty successful ✔️`,
      stdPackQty,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/get-loaded-serial", async (req, res) => {
  const { plexServer, partNo, workcenterKey } = req.body;
  const prefix = plexServer === "Test" ? "test." : "";
  try {
    let url = `https://${prefix}cloud.plex.com/api/datasources/1786/execute?`;
    let post_data = {
      inputs: {
        Part_No: partNo,
      },
    };
    const partKey = await getPartKey(url, post_data);

    url = `https://${prefix}cloud.plex.com/api/datasources/18144/execute?`;
    post_data = {
      inputs: {
        Part_Key: partKey,
        Workcenter_Key: workcenterKey,
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: process.env.AUTH_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post_data),
    });

    if (!response.ok) {
      throw new Error(`Plex API failed to get loaded serial`);
    }

    const result = await response.json();
    const serialNumbers = result.tables[0].rows.map((row) => row[0]);

    res.json({
      success: true,
      message: `Get loaded serials successful ✔️`,
      serialNumbers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/get-component-part-no", async (req, res) => {
  const { plexServer, partNo } = req.body;

  const prefix = plexServer === "Test" ? "test." : "";

  try {
    const url = `https://${prefix}cloud.plex.com/api/datasources/561/execute?`;

    const data = {
      inputs: {
        Part_No: partNo,
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: process.env.AUTH_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Plex API failed to get component part number`);
    }

    const result = await response.json();
    let columns = result.tables[0].columns;
    let partNoIndex = columns.indexOf("Component_Part_No");
    let components = result.tables[0].rows.map((row) => row[partNoIndex]);

    res.json({
      success: true,
      message: `Get BOM successful✔️`,
      components,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/get-carpet-part-no", async (req, res) => {
  const { plexServer, partNo } = req.body;

  const prefix = plexServer === "Test" ? "test." : "";

  try {
    const url = `https://${prefix}cloud.plex.com/api/datasources/561/execute?`;

    const data = {
      inputs: {
        Part_No: partNo,
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: process.env.AUTH_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Plex API failed to get BOM`);
    }

    const result = await response.json();
    // Extract the columns and rows from the API output
    const columns = result.tables[0].columns;
    const rows = result.tables[0].rows;

    const unitIndex = columns.indexOf("Child_Unit");
    const partNoIndex = columns.indexOf("Component_Part_No");
    const nameIndex = columns.indexOf("Component_Part_Name");

    // Filter the rows to find the one with "yd" in the Unit column
    const targetRow = rows.find((row) => row[unitIndex] == "yd");
    // Get the Part_No from the matching row
    const carpetPartNo = targetRow ? targetRow[partNoIndex] : null;
    const carpetPartName = targetRow ? targetRow[nameIndex] : null;

    res.json({
      success: true,
      message: `Get carpet part number successful✔️`,
      carpetPartNo,
      carpetPartName,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/get-first-container-by-date", async (req, res) => {
  const { plexServer, partNo, operationNo } = req.body;

  const prefix = plexServer === "Test" ? "test." : "";

  try {
    const url = `https://${prefix}cloud.plex.com/api/datasources/8566/execute?`;

    const data = {
      inputs: {
        Active: 1,
        Container_Status: "OK",
        Order_By: "date",
        Part_No: partNo,
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: process.env.AUTH_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Plex API failed to get inventory`);
    }

    const result = await response.json();
    // Extract the columns and rows from the API output
    const columns = result.tables[0].columns;
    const rows = result.tables[0].rows;
    if (rows.length === 0) {
      throw new Error(`No available inventory found for part ${partNo}`);
    }

    const serialIndex = columns.indexOf("Serial_No");
    const operationNoIndex = columns.indexOf("Operation_No");

    const targetRow = rows.find(
      (row) => row[operationNoIndex] === parseInt(operationNo)
    );

    if (!targetRow) {
      throw new Error(`No available inventory found for part ${partNo}`);
    }

    const serial = targetRow[serialIndex];

    res.json({
      success: true,
      message: `Get inventory successful✔️`,
      serial,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/check-workcenter-login", async (req, res) => {
  const { plexServer, workcenterKey } = req.body;

  const prefix = plexServer === "Test" ? "test." : "";

  try {
    const url = `https://${prefix}cloud.plex.com/api/datasources/16878/execute?`;

    const data = {
      inputs: {
        Workcenter_Key: workcenterKey,
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: process.env.AUTH_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Plex API failed to get workcenter login operator`);
    }

    const result = await response.json();
    // Extract the columns and rows from the API output
    const columns = result.tables[0].columns;
    const rows = result.tables[0].rows;

    const operatorIndex = columns.indexOf("Logged_Operators");

    const targetRow = rows[0];
    const operator = targetRow[operatorIndex];
    if (operator === "") {
      throw new Error(`Operator has not logged in. Please log in on Plex. `);
    }

    res.json({
      success: true,
      message: `Operator logged in ✔️`,
      operator,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
