const DisplayRecipeDetails = ({ recipe, error, isPending }) => {

  return (
    <section className="p-4">
      {recipe && (
        <>
          <img
            src={recipe.image}
            alt={recipe.title}
            className="mx-auto mb-4 rounded-md"
          />
          <h2 className="text-2xl font-bold mb-2">{recipe.title}</h2>
          <p className="text-gray-600 mb-2">Email: {recipe.email}</p>
          <p className="text-gray-600 mb-2">Category: {recipe.category}</p>
          <h3 className="text-lg font-semibold mb-1">Ingredients:</h3>
          <ul className="list-disc pl-6 mb-4">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="text-gray-700">
                {ingredient}
              </li>
            ))}
          </ul>
          <h3 className="text-lg font-semibold mb-1">Instructions:</h3>
          <ol className="list-decimal pl-6 mb-4">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="text-gray-700">
                {instruction}
              </li>
            ))}
          </ol>
          <p className="text-gray-600">
            Created At: {new Date(recipe.createdAt).toLocaleString()}
          </p>
        </>
      )}
      {isPending && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </section>
  );
};

export default DisplayRecipeDetails;
