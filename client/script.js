document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("scan-input");
  const message = document.getElementById("message"); // Reference to the message element
  const logBox = document.getElementById("log-box");

  let clear = false; // Flag to clear the input

  // Keep the input focused
  input.focus();

  // When the input loses focus, refocus it
  input.addEventListener("blur", function () {
    input.focus();
  });

  // Listen for input changes
  input.addEventListener("keydown", async function (event) {
    if (clear) {
      input.value = "";
      clear = false;
    }

    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the default form submission behavior

      const inputValue = input.value;

      if (inputValue.length >= 9) {
        const output = inputValue.slice(-9);
        await moveContainer(output);
        const newSerialNo = await recordProduction();
        // console.log("newSerialNo = ", newSerialNo);
        await printLabel(newSerialNo);
      } else {
        // message.textContent = "Invalid QR Code.";
        logMsg("Invalid QR Code.");
      }

      // Reset the input field after pressing Enter
      clear = true;
    }
  });

  // Move container using Plex API
  async function moveContainer(serialNo) {
    const url = "http://localhost:3300/move-container";
    const plexServer = document.getElementById("plex-server").value;
    const moveTo = document.getElementById("move-to").value;

    const headers = {
      "Content-Type": "application/json",
    };

    const body = JSON.stringify({
      serialNo,
      plexServer,
      moveTo,
    });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: body,
      });

      // Parse the JSON response
      const result = await response.json();

      // Check if the operation was successful
      if (result.success) {
        logMsg(`Successfully moved container ${serialNo} to ${moveTo} ✔️`);
      } else {
        logMsg(`${result.message} \u{274C}`);
      }
    } catch (error) {
      logMsg(`${error} \u{274C}`);
      console.error("POST request error:", error);
    }
  }

  // Record production using Plex API
  async function recordProduction() {
    const url = "http://localhost:3300/record-production";
    const plexServer = document.getElementById("plex-server").value;

    const workcenter = document.getElementById("workcenter");
    const workcenterName = workcenter.options[workcenter.selectedIndex].text;
    const workcenterKey = workcenter.value;

    const headers = {
      "Content-Type": "application/json",
    };

    const body = JSON.stringify({
      plexServer,
      workcenterKey,
    });

    try {
      // Send POST request
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: body,
      });

      // Parse the JSON response
      const result = await response.json();

      // Check if the operation was successful
      if (result.success) {
        logMsg(`Production recorded at ${workcenterName} ✔️`);
        return result.newSerialNo;
      } else {
        logMsg(`${result.message} \u{274C}`);
      }
    } catch (error) {
      logMsg(`${error} \u{274C}`);
      console.error("POST request error:", error);
    }
  }

  // Print label
  async function printLabel(serialNo) {
    const url = "http://localhost:3300/print-label";
    const plexServer = document.getElementById("plex-server").value;
    const printerIP = document.getElementById("printer").value;

    const headers = {
      "Content-Type": "application/json",
    };

    const body = JSON.stringify({
      serialNo,
      plexServer,
      printerIP,
    });

    try {
      // Send POST request
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: body,
      });

      // Parse the JSON response
      const result = await response.json();

      // Check if the operation was successful
      if (result.success) {
        logMsg(`Label printed ✔️`);
      } else {
        logMsg(`${result.message} \u{274C}`);
      }
    } catch (error) {
      console.error("POST request error:", error);
      logMsg(`${error} \u{274C}`);
    }
  }

  // Log messages
  function logMsg(msg) {
    const p = document.createElement("p");
    // console.log("msg = ", msg);
    p.textContent = msg;
    logBox.appendChild(p);
    logBox.scrollTop = logBox.scrollHeight;
  }
});

window.addEventListener("beforeunload", function (event) {
  // Display a confirmation dialog
  event.preventDefault();
});
