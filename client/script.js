document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("scan-input");
  const message = document.getElementById("message"); // Reference to the message element

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

        sendToPlex(output); // Send the POST request
      } else {
        message.textContent = "Invalid QR Code.";
      }

      // Reset the input field after pressing Enter
      clear = true;
    }
  });

  // Function to send POST request
  function sendToPlex(serialNo) {
    const url = "http://localhost:3300/proxy";

    const headers = {
      "Content-Type": "application/json",
    };

    const dpi = document.getElementById("dpi").value;
    const labelSize = document.getElementById("label-size").value;

    const body = JSON.stringify({
      Serial_No: serialNo,
      dpi,
      labelSize,
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
});
