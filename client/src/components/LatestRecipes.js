// might change to random popular recipes later. Probably by reviews or by likes or both.
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
const LatestRecipes = ({ url }) => {
  const { error, isPending, data: recipes } = useFetch(url);
  return (
    <section className="p-4">
      <h2 className="text-2xl font-bold mb-4">Latest Recipes</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes &&
          recipes.map((recipe) => (
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
                <p className="text-gray-700">{`${recipe.title}`}</p>
              </div>
            </Link>
          ))}
      </div>

      {isPending && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </section>
  );
};

export default LatestRecipes;
