const fetch = require("node-fetch");

async function pingPrinter(printerIP) {
  try {
    const response = await fetch(`http://${printerIP}/pstprnt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "",
    });

    if (!response.ok) {
      throw new Error(`External request failed with status ${response.status}`);
    }
  } catch (error) {
    throw new Error(`Failed to send ZPL code: ${error.message}`);
  }
}

async function sendZplToPrinter(zplcode, printerIP) {
  if (!zplcode) {
    throw new Error("ZPL code is required");
  }

  try {
    const response = await fetch(`http://${printerIP}/pstprnt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: zplcode.toString(),
    });

    if (!response.ok) {
      throw new Error(`External request failed with status ${response.status}`);
    }

    // const responseData = await response.text(); // Assuming the response is text
    // return responseData;
  } catch (error) {
    throw new Error(`Failed to send ZPL code: ${error.message}`);
  }
}

// module.exports = sendZplToPrinter;

module.exports = {
  pingPrinter,
  sendZplToPrinter,
};
