// <!-- might change the name to categoryDetails.js -->
import { useParams, Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";

const SingleCategory = () => {
  const { category } = useParams();
  const {
    error,
    isPending,
    data: RecipesByCategory,
  } = useFetch("http://localhost:5000/api/v1/categories/" + category);
  return (
    <section className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {RecipesByCategory &&
          RecipesByCategory.map((recipe) => (
            <Link
              to={`/api/recipes/${recipe._id}`}
              key={recipe._id}
              className="block overflow-hidden bg-white border border-gray-200 rounded shadow hover:shadow-lg transition duration-300"
            >
              <img
                src={`${recipe.image}`}
                alt={`${recipe.title}`}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <p className="text-gray-700">{`${recipe.title} food`}</p>
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
