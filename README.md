# Recipe-Blog-Website API

Welcome to the Recipe Website project! This website allows users to discover and share their favorite recipes.

## Features

- Browse a wide variety of recipes.
- Create an account to discover your favorite recipes.
- Share your own recipes with the community.
- Sort and Search for recipes by name, ingredients, or categories.
- Add your comments to help others find the best recipes

## Installation

1. Clone this repository to your local machine.
2. Install project dependencies using `npm install`.
3. Configure environment variables as described in the `.env.example` file.
4. Start the server using `npm start`.

## Usage

1. Visit the website at `http://localhost:5000`.
2. Browse recipes, create an account, and start sharing and saving your favorite recipes.

## API Documentation

This project includes a RESTful API. For API documentation, refer to the [API Documentation](/docs/api.md) file.

## Technologies Used

- **Backend**: Node.js (v18.17.1), Express.js (v4)
- **Database**: MongoDB (v5)
- **Database ORM**: mongoose (v7)
- **Authentication**: JWT (JSON Web Tokens), Bcrypt, Crypto, otp-generator
- **Image Upload**: express-fileupload
- **Email**: nodemailer (v6)

### Version Information

- Node.js: [Official Documentation](https://nodejs.org/en/docs/)
- Express.js: [Official Documentation](https://expressjs.com/en/4x/api.html)
- MongoDB: [Official Documentation](https://docs.mongodb.com/)
- mongoose: [Official Documentation](https://mongoosejs.com/docs/)
- JWT: [Official Documentation](https://jwt.io/introduction/)
- Bcrypt: [GitHub Repository](https://github.com/kelektiv/node.bcrypt.js)
- Crypto: [Node.js Crypto Module](https://nodejs.org/api/crypto.html)
- otp-generator: [GitHub Repository](https://github.com/yeojz/otp-generator)
- express-fileupload: [GitHub Repository](https://github.com/richardgirges/express-fileupload)
- nodemailer: [Official Documentation](https://nodemailer.com/about/)

## Contributing

I would appreciate contribution from the community! I will not be implemeting any frontend features myself so any help is much welcome as regards to that.
Also, any contibution through bug reports, feature requests, or code contributions is highly appreciated

## Authors

- **Adejumo Temitope** (Myself)

## Contact Information

If you have any questions or suggestions, please contact me at [mokhefue@gmail.com].

## Known Issues

- Issue 1: When updating any resputce, the requirements to be met as stated in the models are not followed. For now, this can be handled by the frontend.

## Future Enhancements

I have plans to improve the website in the following ways:

- Feature 1: Adding a privacy feature.
- Feature 2: Including a bookmarking feature.

## Changelog

- Version 1.0.0 (2023-09-17): Initial release.
