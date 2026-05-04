# Saksham Printers

## Project Overview

Saksham Printers is a web application for a printing business. It includes a customer-facing storefront with product categories, product details, and order workflows, plus an admin panel for managing orders, products, and categories.

The project is split into two main parts:
- `frontend/` — a Next.js application for the public website and admin dashboard UI.
- `backend/` — an Express API server with MongoDB for data storage, authentication, and file uploads.

## Author

- Name: Jayesh Phale
- LinkedIn: https://linkedin.com/in/jayeshphale

## Tech Stack

### Frontend
- Next.js 16
- React 18
- TypeScript
- Tailwind CSS v4
- Axios
- lucide-react
- react-icons
- clsx
- Tailwind Merge

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication (`jsonwebtoken`)
- Password hashing with `bcryptjs`
- CORS
- Helmet for security headers
- Multer and Cloudinary for file uploads
- Morgan for request logging
- dotenv for environment configuration

## Project Structure

### Root
- `README.md` — project description and setup instructions
- `optimize-images.js` — image optimization script

### Backend
- `backend/server.js` — main Express server entrypoint
- `backend/controllers/` — request handlers for auth, products, categories, orders, analytics
- `backend/models/` — Mongoose models for Admin, Category, Product, Order
- `backend/routes/` — API route definitions for auth, products, categories, orders, uploads
- `backend/config/` — database and Cloudinary configuration
- `backend/middleware/` — authentication, caching, and upload middleware
- `backend/seeder.js` and `backend/seedDb.js` — configured to seed sample data and create the initial admin

### Frontend
- `frontend/src/app/` — Next.js app routes and page components
- `frontend/src/components/` — reusable UI components
- `frontend/src/services/api.ts` — shared Axios API client

## Admin Panel

### Admin Panel Access
- Admin login route: `/admin/login`
- After successful login, admin is redirected to the admin dashboard at `/admin`

### Default Admin Credentials
- Email: `admin@printingpress.com`
- Password: `admin123`

### Admin API Seed Endpoint
If you need to create the initial admin user, use the backend seed endpoint:
- `POST /api/admin/seed`

This endpoint creates the admin account only if no admin exists yet.

## Setup Instructions

### Backend Setup
1. Navigate to `backend/`
2. Install dependencies: `npm install`
3. Create a `.env` file with the required environment variables (MongoDB URI, JWT secret, Cloudinary keys, etc.)
4. Start the backend server: `npm run dev` or `node server.js`

### Frontend Setup
1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Start the Next.js app: `npm run dev`
4. Open the app in the browser at `http://localhost:3000`

## Notes

- The admin login is authenticated via the backend using JWT.
- Product and category data can be seeded using the backend seeder.
- The backend stores admin password securely using bcrypt hashing.
- Cloudinary is used for image uploads, so Cloudinary credentials are required for upload functionality.
