document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("scan-input");
  const logBox = document.getElementById("log-box");
  const toggleButton = document.getElementById("toggle-settings");
  const settingsPanel = document.getElementById("settings-panel");
  // const serverURL = "http://localhost:3300";
  // const serverURL = "https://plex-load-source-tool.onrender.com";
  const serverURL = "http://10.24.1.20:3300";

  toggleButton.addEventListener("click", () => {
    // Toggle the hidden class on the settings panel
    settingsPanel.classList.toggle("hidden");

    // Optionally change the button text based on the visibility state
    if (settingsPanel.classList.contains("hidden")) {
      toggleButton.textContent = "Settings ⚙️";
    } else {
      toggleButton.textContent = "Hide Settings";
    }
  });

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
      const inputValue = input.value;
      logBox.style.backgroundColor = "#f9f9f9"; // Neutral background during the process
      logBox.innerHTML = ""; // Clears all content inside the log box

      if (inputValue.length >= 9) {
        const output = inputValue.slice(-9);
        // Full Process: move container, record production, and print label
        try {
          await moveContainer(output);
          logMsg("Recording production, please wait... ⏳");
          const newSerialNo = await recordProduction();
          await printLabel(newSerialNo);
          logBox.style.backgroundColor = "#00cc66"; // Success background
        } catch (error) {
          // console.error("Error caught:", error);
          logMsg(`${error.message} ❌`);
          logBox.style.backgroundColor = "#ff6666"; // Failure background
        }
      } else {
        logMsg("Invalid QR Code ❌");
        logBox.style.backgroundColor = "#ff6666"; // Failure background
      }

      // Reset the input field after pressing Enter
      clear = true;
    }
  });

  // Move container using Plex API
  async function moveContainer(serialNo) {
    const url = `${serverURL}/move-container`;
    const plexServer = document.getElementById("plex-server").value;
    const workcenter = document.getElementById("workcenter");
    const workcenterName = workcenter.options[workcenter.selectedIndex].text;

    const headers = {
      "Content-Type": "application/json",
    };

    const body = JSON.stringify({
      serialNo,
      plexServer,
      workcenterName,
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
        logMsg(
          `Successfully moved container ${serialNo} to ${workcenterName} ✔️`
        );
      } else {
        throw new Error(result.message || "Failed to move container");
      }
    } catch (error) {
      throw error;
    }
  }

  // Record production using Plex API
  async function recordProduction() {
    const url = `${serverURL}/record-production`;
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
        throw new Error(result.message || "Failed to record production");
      }
    } catch (error) {
      throw error;
    }
  }

  // Print label
  async function printLabel(serialNo) {
    const url = `${serverURL}/print-label`;
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
        throw new Error(result.message || "Failed to print label");
      }
    } catch (error) {
      throw error;
    }
  }

  // Log messages
  function logMsg(msg) {
    const p = document.createElement("p");
    p.textContent = msg;
    logBox.appendChild(p);
    logBox.scrollTop = logBox.scrollHeight;
  }
});

// To prevent refreshing the page
window.addEventListener("beforeunload", function (event) {
  event.preventDefault();
});
