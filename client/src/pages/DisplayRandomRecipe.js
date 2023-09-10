import { useParams } from "react-router-dom";

import DisplayRecipeDetails from "../components/DisplayRecipeDetails";

const DisplayRandom = () => {
  const { id } = useParams();

  return (
    <DisplayRecipeDetails
      RecipeDetailsURL={"http://localhost:5000/api/v1/recipes/random"}
    />
  );
};

export default DisplayRandom;
