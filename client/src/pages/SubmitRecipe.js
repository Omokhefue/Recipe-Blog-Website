import { useState } from "react";
import { useHistory } from "react-router-dom";

const SubmitRecipe = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const history = useHistory();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [email, setEmail] = useState("");
  const [instructionsArray, setInstructionArray] = useState([""]);
  const [ingredientsArray, setIngredientsArray] = useState([""]);
  const [category, setCategory] = useState("default-value");

  const handleAddInput = (field) => {
    if (field === "instructions") {
      setInstructionArray([...instructionsArray, ""]);
    } else if (field === "ingredients") {
      setIngredientsArray([...ingredientsArray, ""]);
    }
  };

  const handleInputChange = (field, index, value) => {
    if (field === "instructions") {
      const updatedArray = [...instructionsArray];
      updatedArray[index] = value;

      setInstructionArray(updatedArray);
    } else if (field === "ingredients") {
      const updatedArray = [...ingredientsArray];
      updatedArray[index] = value;

      setIngredientsArray(updatedArray);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("email", email);
    formData.append("category", category);
    instructionsArray.forEach((instruction, index) => {
      formData.append(`instructionsArray[${index}]`, instruction);
    });
    ingredientsArray.forEach((ingredient, index) => {
      formData.append(`ingredientsArray[${index}]`, ingredient);
    });
    formData.append("image", image);
    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/recipes/add-recipe",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (data.error) {
        setIsPending(false);
        setError(data.error);
      }
      console.log(data)
      if (data.recipe) history.push("/api/recipes");
      setIsPending(false);
    } catch (error) {
      setError(error.message);
    }
  };
  const handleChange = () => {
    setIsPending(false);
    setError(null);
  };
  return (
    <section className="p-4">
      <h1 className="text-3xl font-bold mb-4">
        Publish your recipe for FREE today
      </h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Recipe Title */}
        <div className="mb-4" onChange={handleChange}>
          <label className="block font-semibold mb-1">Recipe Title</label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Email */}
        <div className="mb-4" onChange={handleChange}>
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Ingredients */}
        <div className="mb-4" onChange={handleChange}>
          {ingredientsArray.map((ingredient, index) => (
            <input
              key={index}
              type="text"
              value={ingredient}
              onChange={(e) =>
                handleInputChange("ingredients", index, e.target.value)
              }
              className="w-full border border-gray-300 rounded py-2 px-3 mb-2 focus:outline-none focus:border-blue-500"
            />
          ))}
          <button
            type="button"
            onClick={() => handleAddInput("ingredients")}
            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Add Ingredient
          </button>
        </div>
        {/* Instructions */}
        <div className="mb-4" onChange={handleChange}>
          {instructionsArray.map((instruction, index) => (
            <input
              key={index}
              type="text"
              value={instruction}
              onChange={(e) =>
                handleInputChange("instructions", index, e.target.value)
              }
              className="w-full border border-gray-300 rounded py-2 px-3 mb-2 focus:outline-none focus:border-blue-500"
            />
          ))}
          <button
            type="button"
            onClick={() => handleAddInput("instructions")}
            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Add Instruction
          </button>
        </div>

        {/* Image */}
        <div className="mb-4" onChange={handleChange}>
          <label className="block font-semibold mb-1">Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category */}
        <div className="mb-4" onChange={handleChange}>
          <label className="block font-semibold mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500"
          >
            <option value="default-value">Select Category</option>
            <option value="Nigerian">Nigerian</option>
            <option value="Ghanaian">Ghanaian</option>
            <option value="Thai">Thai</option>
            <option value="Chinese">Chinese</option>
            <option value="Kenyan">Kenyan</option>
            <option value="Italian">Italian</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="mb-4">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            Add Recipe
          </button>
        </div>
      </form>
      {isPending && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </section>
  );
};

export default SubmitRecipe;
