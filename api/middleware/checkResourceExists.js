const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse"); // Import your ErrorResponse class

const getResourceModel = (resourceType) => {
  switch (resourceType) {
    case "Recipe":
      return require("../models/Recipe"); // Replace with your Recipe model
    case "Category":
      return require("../models/Category"); // Replace with your Category model
    case "Likes":
      return require("../models/Likes"); // Replace with your Category model
    case "Comment":
      return require("../models/Comment"); // Replace with your Category model
    case "User":
      return require("../models/User"); // Replace with your Category model
    // Add cases for other resource types as needed
    default:
      return null;
  }
};

// Middleware to check if the resource exists
exports.checkResourceExists = (resourceType) => {
  return asyncHandler(async (req, res, next) => {
    const resourceId = req.params[`${resourceType}Id`]; // Extract the resource identifier from the request
    // Dynamically determine the model to use based on the resourceType
    const Model = getResourceModel(resourceType);
    if (!Model) {
      return next(
        new ErrorResponse(`Invalid resource type: ${resourceType}`, 400)
      );
    }
    const resource = await Model.findOne({ _id: resourceId }); // Replace with your resource lookup logic
    if (!resource) {
      return next(new ErrorResponse(`${resourceType} not found`, 404));
    }

    // Attach the resource to the request for later middleware to use if needed
    req.resource = resource;

    next();
  });
};
