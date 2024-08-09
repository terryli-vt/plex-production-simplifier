const express = require("express");
const fetch = require("node-fetch");
var cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello");
});

// Proxy endpoint
app.post("/proxy", (req, res) => {
  const resource_id = process.env.RESOURCE_ID;

  const url = `https://test.connect.plex.com/production/v1-beta1/control/workcenters/${resource_id}/loaded-source-inventory`;

  const headers = {
    "X-Plex-Connect-Api-Key": process.env.API_KEY,
    "X-Plex-Connect-Api-Secret": process.env.API_SECRET,
    "X-Plex-Connect-Tenant-Id": process.env.TENANT_ID,
    "Content-Type": "application/json",
  };

  const body = JSON.stringify({
    loadFIFO: true,
    serialNo: req.body.serialNo,
  });

  fetch(url, {
    method: "POST",
    headers: headers,
    body: body,
  })
    .then((response) => response.json())
    .then((data) => {
      if ("errors" in data) {
        console.log("POST request error", data);
        res.status(500).json({
          success: false,
          message: "Request failed",
          // error: error.message
        });
      } else {
        console.error("POST request success", data);
        res.status(200).json({
          success: true,
          message: "Request was successful",
          serial: req.body.serialNo,
        });
      }
    })
    .catch((error) => {
      console.error("POST request error:", error);
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
