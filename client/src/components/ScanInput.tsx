import React, { useState, useRef, useEffect } from "react";

// Define the shape of the props this component expects to receive.
interface ScanInputProps {
  onScan: (parsedResult: string) => void;
  placeholder: string;
  status: string;
}

const ScanInput: React.FC<ScanInputProps> = ({
  onScan,
  placeholder,
  status,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [clearInput, setClearInput] = useState<boolean>(false); // a flag to clear the input field
  const inputRef = useRef<HTMLInputElement>(null); // accessing the input element

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
        const parsedResult = inputValue.slice(-9); // Parse the last 9 digits
        onScan(parsedResult);
      } else {
        console.log("Invalid scan input");
      }

      setClearInput(true);
    }
  };

  // Use useEffect to focus the input when loading finishes
  useEffect(() => {
    if (status === "Ready" && inputRef.current) {
      inputRef.current.focus(); // Set focus back to the input element
    }
  }, [status]); // Trigger this effect when the loading state changes

  return (
    <input
      ref={inputRef}
      type="text"
      value={inputValue}
      onChange={handleInputChange}
      onKeyDown={handleKeyPress}
      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder={placeholder}
      autoFocus
      onBlur={() => inputRef.current?.focus()}
      disabled={status !== "Ready"}
    />
  );
};

export default ScanInput;
