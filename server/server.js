const express = require("express");
const bodyParser = require("body-parser"); // Needed to parse form-urlencoded data
var cors = require("cors");
const getZplCode = require("./modules/getZpl");
const moveContainer = require("./modules/moveContainer");
const checkContainerExists = require("./modules/checkContainer");
const recordProduction = require("./modules/recordProduction");
const sendZplToPrinter = require("./modules/printZpl");
require("dotenv").config();
const path = require("path");

const app = express();
const port = 3300;

// Middleware to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Serve static files from the 'client' directory
// app.use(express.static(path.join(__dirname, "../client")));
app.use(express.static(path.join(__dirname, "../client")));

app.get("/", (req, res) => {
  res.send("Welcome to the Plex Simplifier's Server!");
});

app.get("/page", (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "index.html"));
});

app.get("/about", (req, res) => {
  res.send("Author: Tianyu Li");
});

app.post("/move-container", async (req, res) => {
  const { serialNo, plexServer, workcenterName } = req.body;

  try {
    // check if container exist
    const url_check_container = `https://${plexServer}cloud.plex.com/api/datasources/6455/execute?`;
    const data_check_container = {
      inputs: {
        Serial_No: serialNo,
      },
    };
    await checkContainerExists(url_check_container, data_check_container);

    // move container
    const url_move_container = `https://${plexServer}cloud.plex.com/api/datasources/8176/execute?`;
    const data_move_container = {
      inputs: {
        Location: workcenterName,
        Serial_No: serialNo,
      },
    };
    await moveContainer(url_move_container, data_move_container);
    res.json({ success: true, message: "Move container successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/record-production", async (req, res) => {
  const { plexServer, workcenterKey } = req.body;

  try {
    const url = `https://${plexServer}cloud.plex.com/api/datasources/20446/execute?`;

    const post_data = {
      inputs: {
        Container_Full_Move_Container: true,
        Quantity: 1,
        Workcenter_Key: workcenterKey,
      },
    };

    const response = await recordProduction(url, post_data);
    const newSerialNo = response.outputs.Recorded_Serial_No;
    if (!newSerialNo) {
      throw new Error("Workcenter lacking other materials");
    }
    res.json({
      success: true,
      message: "Record production successfully",
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

    res.json({ success: true, message: "Print label successfully" });
  } catch (error) {
    console.error("An error message:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
