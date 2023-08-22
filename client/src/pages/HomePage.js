import { Link } from "react-router-dom";
import Category from "../components/Category";
import LatestRecipes from "../components/LatestRecipes";
const HomePage = () => {
  return (
    <div className="p-4">
      <section className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="md:w-1/2 md:pr-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome to Our Recipe Collection!
          </h1>
          <p className="text-gray-700 mb-4">
            Explore a world of culinary delights with our diverse collection of
            recipes from around the globe. Whether you're a seasoned chef or
            just starting out in the kitchen, you'll find something to tantalize
            your taste buds. Get ready to embark on a culinary adventure as you
            explore the flavors, techniques, and stories behind each recipe.
            Feel free to experiment, modify, and make these recipes your own.
            Let's turn your kitchen into a global culinary haven!
          </p>
          <div>
            <Link
              to="/api/recipes/random-recipe"
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-300"
            >
              Random recipe
            </Link>
          </div>
        </div>
        <img
          src="image-url"
          alt="Recipes with Node js and React"
          className="md:w-1/2 mt-4 md:mt-0 rounded"
        />
      </section>

      <Category url="http://localhost:5000/api/v1/categories" />

      <Link
        to={`/api/recipes/categories/`}
        className="inline-block text-blue-500 hover:underline mb-4"
      >
        View More
      </Link>

      <LatestRecipes url="http://localhost:5000/api/v1/recipes/latest" />

      <section className="text-center mt-8">
        <h1 className="text-3xl font-bold mb-2">
          Publish your recipe for FREE today
        </h1>
        <p className="text-gray-700 mb-4">
          Publish in front of thousands today.
        </p>
        <Link to="/api/recipes/submit-recipe">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-300">
            Submit Recipe
          </button>
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
