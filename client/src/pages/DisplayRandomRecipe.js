import useFetch from "../hooks/useFetch";
import DisplayRecipeDetails from "../components/DisplayRecipeDetails";

const DisplayRandom = () => {
  const {
    error,
    isPending,
    data: recipe,
  } = useFetch("http://localhost:5000/api/v1/recipes/random");
  return (
    <DisplayRecipeDetails recipe={recipe} error={error} isPending={isPending} />
  );
};

export default DisplayRandom;
