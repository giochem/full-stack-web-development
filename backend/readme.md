# Backend Application with Node.js, Express, and SQL Server

This is a backend application built using **Node.js**, **Express.js**, and **SQL Server**. It includes core functionalities such as authentication, API pagination, and CRUD operations for managing users, products, promotions, and orders. The application is structured using the MVC pattern, with validation applied to incoming requests.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Setup](#setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

This backend provides essential features for a web application, focusing on handling user authentication, product management, and order processing. The API supports features like pagination, data validation, and secure session management.

## Features

### Features Implemented (V0.0.0):

- **Base MVC Structure**: Organized using Model-View-Controller (MVC) architecture.
- **Authentication**: User login and registration implemented using **sessions**.
- **API Pagination**: API responses include offset-based pagination for efficient data retrieval.
- **Data Validation**: Input validation is handled using `express-validator` middleware.
- **Completed Endpoints**:
  - **Authentication**
  - **User Management**
  - **Product Management**
  - **Collection Management**
  - **Promotion Management**
  - **Cart Management**
  - **Order Management**
  - **Order Item Management**

> Note : Each feature is designed to ensure that data is validated, API responses are paginated, and sessions are securely managed.

## Technologies Used

- **Node.js**: JavaScript runtime for building scalable network applications.
- **Express.js**: Web framework for Node.js to simplify routing and middleware management.
- **MSSQL (SQL Server)**: Database management system for storing user, product, and order data.
- **dotenv**: Loads environment variables from a `.env` file for configuration.
- **multer**: Middleware for handling file uploads (e.g., images, documents).
- **express-session**: Session middleware to manage user authentication.
- **express-validator**: Validation and sanitization middleware for Express.js.
- **CORS**: Middleware for enabling Cross-Origin Resource Sharing.
- **Nodemon** (dev): Automatically restarts the server during development whenever file changes are detected.

## Installation

To get the backend running on your local machine, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/giochem/full-stack-web-development.git
   ```

2. **Navigate into the project directory**:

   ```bash
   cd backend
   ```

3. **Install the required dependencies**:

   ```bash
   npm install
   ```

   This will install all the necessary packages defined in package.json.

4. **Set up the database**: Ensure that SQL Server database is set up and accessible. Using file v0.sql to gen table and procedure.
5. **Create a .env file in the root of the project to store environment variables. Add the following**:

   ```makefile
    PORT=5000
    SESSION_SECRET=your_session_secret
    SQL_SERVER_USER=admin
    SQL_SERVER_PASSWORD=admin
    SQL_SERVER_SERVER=localhost
    SQL_SERVER_DATABASE=mydatabase
   ```

## Setup

Before running the application, ensure that you have:

- Installed all dependencies with `npm install`.
- Set up your SQL Server database and configured it in the `.env` file.
- Configured your environment variables (e.g., `PORT`, `SQL_SERVER_USER`, `SQL_SERVER_PASSWORD`, `SQL_SERVER_SERVER`,`SQL_SERVER_DATABASE`, and `SESSION_SECRET`).

## Running the Application

To start the application, use the following command:

1. **Start the development server**:

   ```bash
   npm run dev
   ```

   This will use `nodemon` to automatically restart the server whenever you make changes to the code.

2. **Run the app in production mode**:
   ```bash
   npm start
   ```
   This will start the server without auto-reloading (for production environments).

## API Endpoints

### Authentication:

- POST /api/auth/login
  - Logs in a user and returns a session.
  ```json
  {
    "email": "user@example.com",
    "password": "password"
  }
  ```
  - Response: session ID.
- POST /api/auth/register
  - Registers a new user.
  ```json
  {
    "email": "user@example.com",
    "password": "password"
  }
  ```

### User Management:

    GET /api/users?page=0&size=10
    Fetches a list of users (with pagination support).

    POST /api/users
    Creates a new user.

    GET /api/users/:id
    Fetches details for a specific user.

    PUT /api/users/:id
    Updates a specific user's information.

    DELETE /api/users/:id
    Deletes a specific user.

### Product Management:

    GET /api/products?page=0&size=10
    Fetches a list of products (with pagination support).

    POST /api/products
    Creates a new product.

    GET /api/products/:id
    Fetches details for a specific product.

    PUT /api/products/:id
    Updates a specific product.

    DELETE /api/products/:id
    Deletes a specific product.

### Order Management:

    POST /api/orders/:userID
    Creates a new order.

    GET /api/orders?page=0&size=10
    Fetches a list of orders (with pagination support).

    GET /api/orders/:orderID
    Fetches details for a specific order.

### Cart Management:

    GET /api/carts?page=0&size=10
    Fetches a list of carts (with pagination support).

    GET /api/carts/:userID
    Fetches a list of user's carts (with pagination support).

    PUT /api/carts
    Updates a specific cart.

### Promotion Management:

    GET /api/promotions?page=0&size=10
    Fetches active promotions.

    POST /api/promotions
    Creates a new promotion.

### Collection Management:

    GET /api/collections?page=0&size=10
    Fetches product collections.(with pagination support).

    POST /api/collections
    Creates a new product collection.

## Testing

Not implement

## Contributing

We welcome contributions to this project! To contribute:

1. Fork the repository.
2. Create a new branch (git checkout -b feature-branch).
3. Make your changes.
4. Commit your changes (git commit -m 'Add new feature').
5. Push your branch (git push origin feature-branch).
6. Open a pull request.

Please ensure your code adheres to the project's code style and includes appropriate tests.

## License

This project is licensed under the ISC License.
