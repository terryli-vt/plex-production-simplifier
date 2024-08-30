import React, { useState, useRef } from "react";

// Define the shape of the props this component expects to receive.
interface ScanInputProps {
  onScan: (parsedResult: string) => void;
}

const ScanInput: React.FC<ScanInputProps> = ({ onScan }) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [clearInput, setClearInput] = useState<boolean>(false); // a flag to clear the input field
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (clearInput) {
      setInputValue("");
      setClearInput(false);
    }
    if (e.key === "Enter") {
      if (inputValue.length >= 9) {
        // Parse the last 9 digits
        const parsedResult = inputValue.slice(-9);
        onScan(parsedResult);
      } else {
        console.log("Invalid scan input");
      }

      setClearInput(true);
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={inputValue}
      onChange={handleInputChange}
      onKeyPress={handleKeyPress}
      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Scan Code on the Label..."
      autoFocus
      onBlur={() => inputRef.current?.focus()}
    />
  );
};

export default ScanInput;
