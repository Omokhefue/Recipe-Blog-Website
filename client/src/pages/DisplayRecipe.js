import { useParams} from "react-router-dom";
import useFetch from "../hooks/useFetch";
import DisplayRecipeDetails from "../components/DisplayRecipeDetails";

const SingleRecipeDetails = () => {
  const { id } = useParams();

  return <DisplayRecipeDetails RecipeDetailsURL={'http://localhost:5000/api/v1/recipes/' + id} />;
};

export default SingleRecipeDetails;
