import { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { useHistory } from "react-router-dom";

const DisplayRecipeDetails = ({ RecipeDetailsURL }) => {
  const { error, isPending, data: recipe } = useFetch(RecipeDetailsURL);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [likeId, setLikeId] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentLikes, setCommentLikes] = useState({});
  const history = useHistory();

  useEffect(() => {
    if (recipe) {
      setLikes(recipe.likesCount);
      setComments(recipe.comments);
    }
  }, [recipe]);

  useEffect(() => {
    if (comments) {
      const initialCommentLikes = {};
      comments.forEach((comment) => {
        initialCommentLikes[comment._id] = comment.liked;
      });
      setCommentLikes(initialCommentLikes);
    }
  }, [comments]);

  // Function to delete a comment
  const handleDeleteComment = async (commentId) => {
    console.log(1);
    const response = await fetch(
      `http://localhost:5000/api/v1/comments/${commentId}`,
      {
        method: "DELETE",
      }
    );
    console.log(response);
    if (response.ok) {
      // Remove the deleted comment from the state
      const updatedComments = comments.filter(
        (comment) => comment._id !== commentId
      );
      setComments(updatedComments);
    } else {
      // Handle errors
      console.error("Failed to delete comment:", response.status);
    }
  };

  const handleDeleteRecipe = async () => {
    const response = await fetch(
      `http://localhost:5000/api/v1/recipes/${recipe._id}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      // Handle the redirection to the recipe list or other actions as needed
      // For example, you can navigate the user back to the recipe list
      // using React Router: history.push("/recipes");
      history.push("/api/recipes");
    } else {
      // Handle errors
      console.error("Failed to delete recipe:", response.status);
    }
  };

  const handleLikeRecipe = async () => {
    setLiked(!liked);
    const like = {
      like: !liked,
      parentType: "Recipe",
      parent: recipe._id,
      author: recipe.user, // change later to the id of the user that is currently signed in
    };

    const baseUrl = "http://localhost:5000/api/v1/likes/recipe";
    const method = liked ? "DELETE" : "POST";
    console.log(likeId);
    const url = method === "DELETE" ? `${baseUrl}/${likeId}` : baseUrl;

    const response = await fetch(url, {
      method,
      body: liked ? null : JSON.stringify(like), // Include the body for POST, set to null for DELETE
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      setLikes(data.likes);
      setLikeId(data.likeId);
    } else {
      // Handle errors
      console.error("Request failed:", response.status);
    }
  };

  const handleLikeComment = async (commentId) => {
    // Calculate the new liked state for the comment
    const newLikedState = !commentLikes[commentId];
    // Prepare the like object
    const like = {
      like: newLikedState,
      parentType: "Comment",
      parent: commentId,
      author: recipe.user, // change later to the id of the user that is currently signed in
    };

    // Determine the HTTP method based on the liked state
    const method = newLikedState ? "POST" : "DELETE";

    // Prepare the URL
    const baseUrl = "http://localhost:5000/api/v1/likes/comment";
    const url = method === "DELETE" ? `${baseUrl}/${likeId}` : baseUrl;

    // Send the request
    const response = await fetch(url, {
      method,
      body: newLikedState ? JSON.stringify(like) : null, // Include the body for POST, set to null for DELETE
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();

      // Update the liked state in the commentLikes state object
      setCommentLikes({
        ...commentLikes,
        [commentId]: newLikedState,
      });

      // Update the likesCount in the comments state
      const updatedComments = comments.map((c) =>
        c._id === commentId
          ? { ...c, liked: newLikedState, likesCount: data.likes }
          : c
      );
      setComments(updatedComments);
      setLikeId(data.likeId);
      console.log(data);
    } else {
      // Handle errors
      console.error("Request failed:", response.status);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (comment === "") return;
    const commentBody = {
      text: comment,
      author: recipe.user,
      recipe: recipe._id,
      likesCount: 0,
    };

    const response = await fetch("http://localhost:5000/api/v1/comments", {
      method: "POST",
      body: JSON.stringify(commentBody),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const newComment = await response.json();
    setComments([...comments, newComment.comment]);
    setComment("");
  };
  const handleViewComments = async () => {};
  return (
    <section className="p-4 flex items-center">
      {recipe && (
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 pr-4">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="mx-auto mb-4 rounded-md shadow-lg"
              style={{ maxWidth: "100%", maxHeight: "400px" }}
            />
          </div>
          <div className="md:w-2/3">
            <button onClick={() => handleDeleteRecipe(recipe._id)}>
              Delete Recipe
            </button>
            <Link to="/api/recipes/edit-recipe">Edit Recipe</Link>
            <h2 className="text-2xl font-bold mb-2 text-green-700">
              {recipe.title}
              <button
                onClick={handleLikeRecipe}
                className={`${
                  liked
                    ? "text-red-500 border-red-500"
                    : "text-black-500 border-black-500"
                } border-2 rounded-full p-2 flex items-center`}
              >
                {liked ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 inline-block mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 21.35l-1.45-1.32C5.4 16.88 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 8.38-8.55 11.54L12 21.35z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 inline-block mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 21.35l-1.45-1.32C5.4 16.88 2 12.28 2 8.5c0-2.19 1.23-4.19 3.18-5.19A5.978 5.978 0 0112 2a5.978 5.978 0 016.82 1.31C20.77 4.31 22 6.31 22 8.5c0 3.78-3.4 8.38-8.55 11.54L12 21.35z"
                    />
                  </svg>
                )}
              </button>
              <p>{likes}</p>
            </h2>
            <p className="text-gray-600 mb-2">Email: {recipe.email}</p>
            <p className="text-gray-600 mb-2">
              Category: {recipe.category.name}
            </p>
            <h3 className="text-lg font-semibold mb-1 text-green-700">
              Ingredients:
            </h3>
            <ul className="list-disc pl-6 mb-4">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="text-gray-700">
                  {ingredient}
                </li>
              ))}
            </ul>
            <h3 className="text-lg font-semibold mb-1 text-green-700">
              Instructions:
            </h3>
            <ol className="list-decimal pl-6 mb-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="text-gray-700">
                  {instruction}
                </li>
              ))}
            </ol>

            <p className="text-gray-600">Created At: {recipe.createdAt}</p>
          </div>

          {/* Display Comments */}
          <div className="md:w-2/3">
            <h3 className="text-lg font-semibold mb-1 text-green-700">
              Comments - ({comments.length})
            </h3>
            <form onSubmit={handleAddComment}>
              <label>Say something...</label>
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button type="submit">Add Comment</button>
            </form>
            <button onSubmit={handleViewComments}>View Comments</button>

            <ul className="list-decimal pl-6 mb-4">
              {comments?.map((comment, index) => (
                <li key={comment._id} className="text-gray-700">
                  {comment.text} - {comment.author.name} <br />
                  Likes: {comment.likesCount}
                  <button
                    onClick={() => handleLikeComment(comment._id)}
                    className={`${
                      commentLikes[comment._id] // Check the liked status from commentLikes
                        ? "text-red-500 border-red-500"
                        : "text-black-500 border-black-500"
                    } border-2 rounded-full p-2 flex items-center`}
                  >
                    {commentLikes[comment._id] ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 inline-block mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        {/* SVG path for the liked state */}
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 inline-block mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        {/* SVG path for the not liked state */}
                      </svg>
                    )}
                  </button>
                  <button onClick={() => handleDeleteComment(comment._id)}>
                    Delete Comment
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {isPending && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </section>
  );
};

export default DisplayRecipeDetails;
