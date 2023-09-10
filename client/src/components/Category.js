import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
const Category = ({ url }) => {
  const { error, isPending, data: categories } = useFetch(url);
  return (
    <section className="p-4">
      <p className="text-2xl font-bold mb-4 text-green-700">Categories:</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories &&
          categories.map((category) => (
            <Link
              to={`/api/recipes/categories/${category._id}`}
              key={category._id}
              className="flex flex-col items-center text-center border p-2 rounded-lg hover:border-gray-300 transition duration-300"
            >
              <img
                src={`${category.image}`}
                alt={`${category.name} food`}
                className="w-20 h-20 object-cover rounded-full mb-2 shadow-lg"
              />
              <div className="text-lg font-semibold text-green-700">{`${category.name} food`}</div>
            </Link>
          ))}
      </div>
      {isPending && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </section>
  );
};

export default Category;
