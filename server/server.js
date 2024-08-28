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
