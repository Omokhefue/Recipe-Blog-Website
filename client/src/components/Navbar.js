import React, { useState, useEffect } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUser } from "@fortawesome/free-solid-svg-icons"; // Replace with your desired Font Awesome icon

const Navbar = () => {
  const history = useHistory();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, setIsPending] = useState(false); // Initialize isPending state
  const [error, setError] = useState(null); // Initialize error state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true); // Set isPending to true when the search starts
    setError(null); // Clear any previous errors

    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/recipes/search",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ searchTerm }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setIsPending(false);
      setError(null);
      history.push("/api/recipes/search", {
        searchResults: data,
        isPending,
        error,
      });
    } catch (error) {
      setError(error.message); // Set error message if there's an error
      setIsPending(false); // Set isPending to false when there's an error
    }
  };

  // Use useEffect to reset searchTerm when the location changes
  useEffect(() => {
    if (location.pathname !== "/api/recipes/search") {
      setSearchTerm(""); // Reset searchTerm when not on the search page
    }
  }, [location.pathname]); // Run this effect when location.pathname changes

  return (
    <nav className="bg-green-600 p-4 hover:bg-green-700 transition-colors">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/api/recipes" className="text-white text-2xl font-bold">
          BLOG
        </Link>

        <ul className="flex space-x-4 text-white">
          <li>
            <Link to="/api/recipes" className="hover:text-gray-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/api/recipes/categories" className="hover:text-gray-300">
              Category
            </Link>
          </li>
          <li>
            <Link
              to="/api/recipes/submit-recipe"
              className="hover:text-gray-300"
            >
              Submit
            </Link>
          </li>
        </ul>

        <form onSubmit={handleSubmit} className="flex items-center">
          <div className="relative">
            <input
              type="search"
              placeholder="Search..."
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded bg-gray-100 focus:bg-white focus:outline-none text-black"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute text-gray-500 top-2 left-3"
            />
          </div>
        </form>

        <FontAwesomeIcon
          icon={faUser}
          className="text-2xl text-white opacity-50 hover:opacity-100 transition-opacity"
        />
      </div>
    </nav>
  );
};

export default Navbar;
