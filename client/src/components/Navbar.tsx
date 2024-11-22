import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for dropdown menu

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown menu when clicked outside
  const handleClickOutside = (event: MouseEvent) => {
    // check whether the clicked element (event.target) is inside the dropdown menu.
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false); // Close menu if clicked outside
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Add event listener to detect outside clicks
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      // Remove event listener when the dropdown is closed
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav className="bg-gray-800 p-4">
      <div className="w-full mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-white text-xl font-bold">
          Plex Simplifier
        </Link>

        {/* Hamburger Icon for screens below 780px */}
        <div className="block custom:hidden">
          <button
            onClick={toggleMenu}
            className="text-white hover:text-gray-300 focus:outline-none"
          >
            {/* Hamburger Icon */}
            <svg
              className="w-8 h-8 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12h18M3 6h18M3 18h18"
              />
            </svg>
          </button>
        </div>

        {/* Links for larger screens */}
        <div className="hidden custom:flex">
          <Link
            to="/waterjet"
            className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
          >
            Waterjet
          </Link>
          <Link
            to="/edgefold"
            className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium ml-4"
          >
            Edgefold
          </Link>
          <Link
            to="/assembly"
            className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium ml-4"
          >
            Assembly
          </Link>
          <Link
            to="/pack"
            className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium ml-4"
          >
            Pack
          </Link>
          <Link
            to="/repair"
            className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium ml-4"
          >
            Repair Center
          </Link>
          <Link
            to="/label"
            className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium ml-4"
          >
            Label
          </Link>
          <Link
            to="/settings"
            className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium ml-4"
          >
            Settings
          </Link>
        </div>
      </div>

      {/* Dropdown Menu (Slide-in from the right) */}
      <div
        ref={dropdownRef}
        className={`fixed top-0 right-0 h-full w-64 bg-gray-800 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 custom:hidden`}
      >
        <button
          onClick={toggleMenu}
          className="text-white p-4 focus:outline-none"
        >
          {/* Close icon */}
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex flex-col mt-10 space-y-2 px-6">
          <Link
            to="/waterjet"
            className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            onClick={() => setIsOpen(false)}
          >
            Waterjet
          </Link>
          <Link
            to="/edgefold"
            className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            onClick={() => setIsOpen(false)}
          >
            Edgefold
          </Link>
          <Link
            to="/assembly"
            className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            onClick={() => setIsOpen(false)}
          >
            Assembly
          </Link>
          <Link
            to="/pack"
            className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            onClick={() => setIsOpen(false)}
          >
            Pack
          </Link>
          <Link
            to="/repair"
            className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            onClick={() => setIsOpen(false)}
          >
            Repair Center
          </Link>
          <Link
            to="/label"
            className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            onClick={() => setIsOpen(false)}
          >
            Label
          </Link>
          <Link
            to="/settings"
            className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            onClick={() => setIsOpen(false)}
          >
            Settings
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
