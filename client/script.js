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
    const url = "http://localhost:3000/proxy";

    const headers = {
      "Content-Type": "application/json",
    };

    const body = JSON.stringify({
      loadFIFO: true,
      serialNo: serialNo,
    });

    fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          console.log("POST request success:", result.data);
          message.textContent = `Successfully loaded container ${result.serial}`;
        } else {
          console.error("POST request failed:", result.error);
          message.textContent = `Failed to Load Source.`;
        }
      })
      .catch((error) => {
        console.error("POST request error:", error);
      });
  }
});
