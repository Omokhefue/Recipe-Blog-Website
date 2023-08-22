import { useParams} from "react-router-dom";
import useFetch from "../hooks/useFetch";
import DisplayRecipeDetails from "../components/DisplayRecipeDetails";

const SingleRecipeDetails = () => {
  const { id } = useParams();
  const {
    error,
    isPending,
    data: recipe,
  } = useFetch("http://localhost:5000/api/v1/recipes/" + id);
  return <DisplayRecipeDetails recipe={recipe} error={error} isPending={isPending} />;
};

export default SingleRecipeDetails;
