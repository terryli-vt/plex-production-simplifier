import React, { useState } from "react";

// Define the shape of the props this component expects to receive.
interface TextInputProps {
  onSubmit: (input: string) => void;
  placeholder: string;
  status: string;
}

const TextInput: React.FC<TextInputProps> = ({
  onSubmit,
  placeholder,
  status,
}) => {
  const [inputValue, setInputValue] = useState<string>("");

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit(inputValue.replace(/\s+/g, ""));
    }
  };

  return (
    <input
      type="text"
      value={inputValue}
      onChange={handleInputChange}
      onKeyDown={handleKeyPress}
      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder={placeholder}
      disabled={status !== "Ready"}
    />
  );
};

export default TextInput;
