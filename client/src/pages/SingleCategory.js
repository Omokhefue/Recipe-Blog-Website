// <!-- might change the name to categoryDetails.js -->
import { useParams, Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faUser } from "@fortawesome/free-solid-svg-icons";

const SingleCategory = () => {
  const { id } = useParams();
  const {
    error,
    isPending,
    data: RecipesByCategory,
  } = useFetch("http://localhost:5000/api/v1/categories/" + id);
  return (
    <section className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(RecipesByCategory) &&
          RecipesByCategory.map((recipe) => (
            <Link
              to={`/api/recipes/${recipe._id}`}
              key={recipe._id}
              className="block overflow-hidden bg-white border border-gray-200 rounded shadow-lg hover:shadow-xl transition duration-300"
            >
              <img
                src={`${recipe.image}`}
                alt={`${recipe.title}`}
                className="w-full h-40 object-cover rounded-t"
              />
              <div className="p-4">
                <p className="text-gray-700 text-lg font-semibold">
                  {`${recipe.title}`}
                </p>
                <div className="flex items-center mt-2">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="text-gray-500 text-sm"
                  />
                  <p className="text-gray-500 text-sm ml-1">{recipe.user}</p>
                </div>
              </div>
            </Link>
          ))}
      </div>

      {isPending && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </section>
  );
};

export default SingleCategory;
