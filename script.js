let clear = false;

document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("scan-input");
  const message = document.getElementById("message"); // Reference to the message element

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

      if (inputValue.length >= 4) {
        const output = inputValue.slice(-4);
        message.textContent = `Last 4 digits: ${output}`;
      } else {
        message.textContent = "Invalid QR Code.";
      }

      // Reset the input field after pressing Enter
      clear = true;
    }
  });
});
