const express = require("express");
const fetch = require("node-fetch");
var cors = require("cors");
const getZplCode = require("./modules/getZpl");
const writeZplCodeToTxt = require("./modules/zplToTxt");
const { convertZplToPdf } = require("./modules/zplToPdf");
const { printPdf } = require("./modules/printPdf");
/*
const { post } = require("request");
const { convertZplToPdf } = require("./zplToPdf");
const { printPDF } = require("./printPdf");
const fs = require("fs");
*/
require("dotenv").config();

const app = express();
const port = 3300;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello");
});

// Proxy endpoint
app.post("/proxy", async (req, res) => {
  const url = `https://test.cloud.plex.com/api/datasources/230486/execute?`;

  console.log("from front-end", req.body);
  const { Serial_No, dpi, labelSize } = req.body;

  try {
    // Step 1: Get ZPL code
    const post_data = {
      inputs: {
        Serial_No,
      },
    };
    const zplcode = await getZplCode(url, post_data);

    // Step 2: Write ZPL code to text file
    const txtpath = "./output/zplCode.txt";
    await writeZplCodeToTxt(zplcode, txtpath);

    // Step 3: Convert ZPL code to PDF
    const pdfpath = "./output/label.pdf";
    await convertZplToPdf(zplcode, pdfpath, dpi, labelSize);

    // Step 4: Print the PDF file
    await printPdf(pdfpath);

    res.json({ success: true, message: "Process completed successfully" });
  } catch (error) {
    console.error("An error message:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
