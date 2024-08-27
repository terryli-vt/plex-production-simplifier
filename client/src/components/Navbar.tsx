import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">
          Plex Simplifier
        </Link>
        <div>
          <Link
            to="/waterjet"
            className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
          >
            Waterjet
          </Link>
          <Link
            to="/assembly"
            className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium ml-4"
          >
            Assembly
          </Link>
          <Link
            to="/settings"
            className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium ml-4"
          >
            Settings
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
