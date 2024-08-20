const express = require("express");
const bodyParser = require("body-parser"); // Needed to parse form-urlencoded data
var cors = require("cors");
const getZplCode = require("./modules/getZpl");
const writeZplCodeToTxt = require("./modules/zplToTxt");
const sendZplToPrinter = require("./modules/printZpl");
require("dotenv").config();

const app = express();
const port = 3300;

// Middleware to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello");
});

// Proxy endpoint
app.post("/proxy", async (req, res) => {
  const { Serial_No } = req.body;

  try {
    // Step 1: Get ZPL code
    const url = `https://test.cloud.plex.com/api/datasources/230486/execute?`;
    const post_data = {
      inputs: {
        Serial_No,
      },
    };
    const zplcode = await getZplCode(url, post_data);

    // Step 2: Write ZPL code to text file
    const txtpath = "./output/zplCode.txt";
    await writeZplCodeToTxt(zplcode, txtpath);

    // Step 3: Send ZPL code to the printer
    await sendZplToPrinter(zplcode, req.body.printerIP);

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
