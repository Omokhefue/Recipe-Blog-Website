import { useState, useEffect } from "react";

import { useHistory, useLocation, Link } from "react-router-dom";

const Navbar = () => {
  const history = useHistory();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(
      "http://localhost:5000/api/v1/recipes/search",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchTerm }),
      }
    );
    const data = await response.json();
    console.log(data);
    history.push("/api/recipes/search", { searchResults: data });
  };

  // Use useEffect to reset searchTerm when the location changes
  useEffect(() => {
    if (location.pathname !== "/api/recipes/search") {
      setSearchTerm(""); // Reset searchTerm when not on the search page
    }
  }, [location.pathname]); // Run this effect when location.pathname changes
  return (
    <nav className="flex items-center justify-between bg-gray-800 p-4">
      <header className="flex items-center text-white">
        <Link to="/api/recipes" className="flex items-center">
          <img src="logo-url" alt="logo" className="w-8 h-8 mr-2" />
          <p className="text-lg font-bold">BLOG</p>
        </Link>
      </header>

      <ul className="flex space-x-4">
        <li>
          <Link to="/api/recipes" className="text-white hover:text-gray-300">
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/api/recipes/categories"
            className="text-white hover:text-gray-300"
          >
            Category
          </Link>
        </li>
        <li>
          <Link
            to="/api/recipes/submit-recipe"
            className="text-white hover:text-gray-300"
          >
            Submit
          </Link>
        </li>
      </ul>

      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="search"
          placeholder="Search..."
          aria-label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-2 py-1 rounded bg-gray-300 focus:bg-white focus:outline-none"
        />
      </form>
    </nav>
  );
};

export default Navbar;
