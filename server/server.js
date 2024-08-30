const express = require("express");
const bodyParser = require("body-parser"); // Needed to parse form-urlencoded data
var cors = require("cors");
require("dotenv").config();
const getZplCode = require("./modules/getZpl");
const sendZplToPrinter = require("./modules/printZpl");

const app = express();
const port = 3300;

// Middleware to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Plex Simplifier's Server!");
});

app.get("/about", (req, res) => {
  res.send("Author: Tianyu Li");
});

app.post("/get-workcenter-status", async (req, res) => {
  const { plexServer, workcenterKey } = req.body;

  try {
    const url = `https://${plexServer}cloud.plex.com/api/datasources/10638/execute?`;

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
      throw new Error(`Plex API failed to get workcenter status`);
    }

    const result = await response.json();

    // Extract the desired values from the response
    const table = result.tables[0];
    const columns = table.columns;
    const rows = table.rows[0]; // Assuming we're interested in the first row

    if (Array.isArray(rows) && rows.length === 0) {
      throw new Error(`Workcenter does not exist`);
    }

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
    let workcenterStatus = {};

    // Loop through the properties and find their corresponding values
    properties.forEach((prop) => {
      const index = columns.indexOf(prop);
      if (index !== -1) {
        const newPropName = propertyMap[prop];
        workcenterStatus[newPropName] = rows[index];
      }
    });

    workcenterStatus["Remaining"] =
      workcenterStatus["Job Quantity"] - workcenterStatus["Produced"];

    res.json({
      success: true,
      message: `Get workcenter status successful✔️`,
      workcenterStatus,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/check-container-exists", async (req, res) => {
  const { serialNo, plexServer } = req.body;

  try {
    const url = `https://${plexServer}cloud.plex.com/api/datasources/6455/execute?`;
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
    const rows = result.tables[0].rows;
    // Check if the response data is an empty array
    if (Array.isArray(rows) && rows.length === 0) {
      throw new Error(`Container ${serialNo} does not exist`);
    }

    // await checkContainerExists(url, data);
    res.json({ success: true, message: `Container ${serialNo} exists ✔️` });
  } catch (error) {
    console.log("error = ", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/move-container", async (req, res) => {
  const { serialNo, plexServer, workcenterName } = req.body;

  try {
    const url = `https://${plexServer}cloud.plex.com/api/datasources/8176/execute?`;
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
  const { plexServer, workcenterKey } = req.body;

  try {
    const url = `https://${plexServer}cloud.plex.com/api/datasources/20446/execute?`;

    const data = {
      inputs: {
        Container_Full_Move_Container: true,
        Quantity: 1,
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
      throw new Error(`Plex API failed to record production`);
    }

    const result = await response.json();
    const newSerialNo = result.outputs.Recorded_Serial_No;
    if (!newSerialNo) {
      throw new Error("Workcenter lacking other materials");
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

// Print label given a serial number
app.post("/print-label", async (req, res) => {
  const { serialNo, plexServer } = req.body;

  try {
    // Step 1: Get ZPL code
    const url = `https://${plexServer}cloud.plex.com/api/datasources/230486/execute?`;

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

// Start the server
app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
