import Category from "../components/Category";

const Categories = () => {
  return (
    <div>
      <p className="text-blue-500 no">Browse Categories By Country</p>;
      <Category url="http://localhost:5000/api/v1/categories/categories" />;
    </div>
  );
};

export default Categories;
