# Clothes369 E-commerce Platform

<div align="center">

[![Live Demo](https://img.shields.io/badge/demo-live-green.svg)](https://clothes369.com)
[![Documentation](https://img.shields.io/badge/docs-wiki-blue.svg)](https://docs.clothes369.com)
[![License](https://img.shields.io/badge/license-MIT-purple.svg)](LICENSE)

[Features](#-key-features) •
[Quick Start](#-quick-start-guide) •
[API Docs](#-api-documentation) •
[Frontend](#-frontend-features) •
[Tech Stack](#-tech-stack) •
[Support](#-support)

</div>

---

<div align="center">

👔 👗 👕 👚 👖

**CLOTHES369**

🛍️ Modern Clothing E-commerce Platform | 👗 Fashion Made Easy | 🛒 Smart Shopping

</div>

---

### Quick Links

| Development                           | Documentation                               |
| ------------------------------------- | ------------------------------------------- |
| [🚀 Overview](#-quick-overview)       | [📚 API Documentation](#-api-documentation) |
| [🛠️ Setup Guide](#-quick-start-guide) | [📁 Project Structure](#-project-structure) |
| [🔒 Security](#-security-features)    | [🖥️ Frontend Features](#-frontend-features) |
| [💻 Tech Stack](#-tech-stack)         | [🤝 Contributing](#-contributing)           |

## 🚀 Quick Overview

Clothes369 provides a powerful interface for:

- Shopping for trendy clothing items
- Managing user accounts and roles
- Handling product collections
- Processing orders
- Managing promotions
- Overseeing shopping carts

## 🎯 Key Features

### 👥 User Experience

- Browse clothing collections
- Easy shopping cart management
- Secure user accounts
- Order tracking
- Promotion applications

### 📦 Collections

- Browse latest fashion collections
- View detailed product information
- Filter by categories
- Search functionality

### 🛒 Orders & Cart

- Seamless checkout process
- Real-time order tracking
- Shopping cart management
- Order history

### 🏷️ Promotions

- Seasonal discounts
- Special offers
- Promotional codes
- Member benefits

## 🛠️ Quick Start Guide

### 1. Prerequisites

```bash
# Make sure you have installed:
- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn
```

### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Start the server
npm run dev
```

### 3. Frontend Setup

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm run serve
```

## 📁 Project Structure

```
project/
├── frontend/              # Vue.js frontend
│   └── src/
│       └── views/admin/  # Admin components
│           ├── AddCollection.vue
│           ├── ManageUser.vue
│           └── ...
└── backend/              # Node.js backend
    └── src/
        ├── controllers/  # Business logic
        ├── middleware/   # Auth & validation
        └── routes/      # API endpoints
```

## 🔒 Security Features

- JWT authentication
- Password encryption
- Role-based access control
- Protected admin routes

## 📚 API Documentation

### Authentication

```
POST   /api/auth/login          # User login
POST   /api/auth/register       # User registration
GET    /api/auth/logout         # User logout
```

### User Management

```
GET    /api/users               # List users with pagination
GET    /api/users/:id          # Get specific user
POST   /api/users              # Create new user
PUT    /api/users/:id          # Update user
DELETE /api/users/:id          # Delete user
```

### Collections

```
GET    /api/collections         # List all collections
GET    /api/collections/:id    # Get collection details
POST   /api/collections        # Create collection
PUT    /api/collections/:id    # Update collection
DELETE /api/collections/:id    # Delete collection
```

### Orders

```
GET    /api/orders             # List all orders
GET    /api/orders/:id        # Get order details
PUT    /api/orders/:id        # Update order status
DELETE /api/orders/:id        # Cancel order
```

### Cart

```
GET    /api/carts             # Get user's cart
POST   /api/carts             # Add item to cart
PUT    /api/carts/:id        # Update cart item
DELETE /api/carts/:id        # Remove from cart
```

### Promotions

```
GET    /api/promotions         # List all promotions
GET    /api/promotions/:id    # Get promotion details
POST   /api/promotions        # Create promotion
PUT    /api/promotions/:id    # Update promotion
DELETE /api/promotions/:id    # Delete promotion
```

## 🖥️ Frontend Features

### Client Interface

```
/                   # Home page with product listings
/products           # Product catalog with filters
/cart              # Shopping cart management
/checkout          # Order checkout process
/profile           # User profile management
/orders            # Order history
```

### Admin Dashboard

```
/admin/users        # User management
/admin/collections  # Collection management
/admin/orders      # Order processing
/admin/promotions  # Promotion management
/admin/carts       # Cart oversight
```

### Key Components

- **Navigation**

  - Responsive header
  - Category navigation
  - User menu
  - Admin menu (for admin users)

- **Product Display**

  - Grid and list views
  - Search functionality
  - Filter by category
  - Sort options

- **Shopping Features**

  - Add to cart
  - Quantity management
  - Price calculation
  - Promotion application

- **User Features**
  - Profile management
  - Order tracking
  - Address management
  - Payment methods

## 💻 Tech Stack

### Frontend

- Vue.js
- Vue Router
- Axios
- Modern CSS

### Backend

- Node.js
- Express
- MySQL
- JWT

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use and modify for your needs!
