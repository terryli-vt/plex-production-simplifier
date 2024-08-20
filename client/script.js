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
  input.addEventListener("keydown", function (event) {
    if (clear) {
      input.value = "";
      clear = false;
    }

    if (event.key === "Enter") {
      const inputValue = input.value;

      if (inputValue.length >= 9) {
        const output = inputValue.slice(-9);
        moveContainer(output);
        // printLabel(output);
      } else {
        message.textContent = "Invalid QR Code.";
      }

      // Reset the input field after pressing Enter
      clear = true;
    }
  });

  // Move container using Plex API
  function moveContainer(serialNo) {
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

    fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          // console.log("POST request to back-end success:", result.data);
          //message.textContent = `Move Container Success`;
          logMsg(`Successfully moved container ${serialNo} to ${moveTo}`);
        } else {
          // console.error("POST request to back-end failed:", result.error);
          //message.textContent = result.message;
          logMsg(result.message);
        }
      })
      .catch((error) => {
        console.error("POST request error:", error);
      });
  }

  // Print label using Plex API
  function printLabel(serialNo) {
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

    fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          // console.log("POST request to back-end success:", result.data);
          message.textContent = `Get Label Success`;
        } else {
          // console.error("POST request to back-end failed:", result.error);
          message.textContent = result.message;
        }
      })
      .catch((error) => {
        console.error("POST request error:", error);
      });
  }

  // Log messages
  function logMsg(msg) {
    const p = document.createElement("p");
    p.textContent = msg;
    logBox.appendChild(p);
    logBox.scrollTop = logBox.scrollHeight;
  }
});
