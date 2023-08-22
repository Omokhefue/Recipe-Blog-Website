import { Link, useLocation } from "react-router-dom";

const SearchResultsPage = () => {
  console.log(3)
  // Assuming you receive the search results from the location state
  const { searchResults } = useLocation().state;
  console.log(2, searchResults);

  return (
    <div>
      <section className="p-4">
        <h2 className="text-2xl font-bold mb-4">Search Results</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults && searchResults.length > 0 ? (
            searchResults.map((search) => (
              <Link
                to={`/api/recipes/${search._id}`}
                key={search._id}
                className="block overflow-hidden bg-white border border-gray-200 rounded shadow hover:shadow-lg transition duration-300"
              >
                <img
                  src={`${search.image}`}
                  alt={`${search.title}`}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <p className="text-gray-700">{`${search.title}`}</p>
                </div>
              </Link>
            ))
          ) : (
            <p>No search results found.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default SearchResultsPage;
