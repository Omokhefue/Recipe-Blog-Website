const sanitizeFilename = require("sanitize-filename");
const ErrorResponse = require("../utils/errorResponse");
const fs = require("fs/promises");

async function processImageFile(req, res, next, resource, oldImageFile) {
  let sanitizedImageName;

  let imageFile = req.files.image;

  const fileExtension = imageFile.name.split(".").pop(); // getting the image extension
  const allowedExtensions = ["jpg", "jpeg", "png", "gif"]; // types of allowed image types

  // checking if uploaded image file was of the correct format
  if (!allowedExtensions.includes(fileExtension)) {
    next(
      new ErrorResponse(
        "Invalid file type. Please upload a valid image file (.jpg, .jpeg, .png, .gif).",
        422
      )
    );
  } else {
    // generate a unique file name by adding the date beforehand
    sanitizedImageName = `${Date.now()}_${sanitizeFilename(imageFile.name)}`;
  }

  let uploadPath = `${__dirname}/../public/images/${resource}/${sanitizedImageName}`;

  if (oldImageFile) {
    let oldImageFilePath = `${__dirname}/../public/images/${resource}/${oldImageFile}`;
    await fs.unlink(oldImageFilePath);
  }
  // Move the new image file to the specified folder
  await imageFile.mv(uploadPath);

  return sanitizedImageName;
}

async function deleteImage(resource, imageFile) {
  if (!imageFile) {
    return; // No image file to delete
  }

  const imagePath = `${__dirname}/../public/images/${resource}/${imageFile}`;

  try {
    await fs.unlink(imagePath);
  } catch (error) {
    console.error("Error deleting image file:", error);
  }
}
module.exports = { processImageFile, deleteImage };
