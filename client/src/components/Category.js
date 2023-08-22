import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
const Category = ({ url }) => {
  const { error, isPending, data: categories } = useFetch(url);
  return (
    <section className="p-4">
      <p className="text-lg font-bold mb-4">Categories:</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories &&
          categories.map((category) => (
            <Link
              to={`/api/recipes/categories/${category.name}`}
              key={category._id}
              className="flex flex-col items-center text-center border p-2 rounded hover:border-gray-300 transition duration-300"
            >
              <img
                src={`${category.image}`}
                alt={`${category.name} food`}
                className="w-16 h-16 object-cover rounded-full mb-2"
              />
              <div className="text-sm font-semibold">{`${category.name} food`}</div>
            </Link>
          ))}
      </div>
      {isPending && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </section>
  );
};

export default Category;
