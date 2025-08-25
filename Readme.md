# Comment System - MERN Stack

A full-stack comment system built with the MERN stack (MongoDB, Express.js, React, Node.js , Socket-Io) featuring real-time updates, authentication, and interactive commenting features.

## 🛠️ Used Technologies

### Backend Technologies
- Node.js - JavaScript runtime environment
- Express.js - Web application framework
- MongoDB - NoSQL database
- Mongoose - MongoDB object modeling
- JWT (JSON Web Tokens) - Authentication
- Socket.io - Real-time bidirectional communication
- bcryptjs - Password hashing
- express-validator - Input validation
- cors - Cross-Origin Resource Sharing
- dotenv - Environment variables management

### Frontend Technologies
- React.js - Frontend library for building user interfaces
- React Router DOM - Client-side routing
- React Context API - State management
- Axios - HTTP client for API requests
- Tailwind CSS - Utility-first CSS framework
- PrimeReact - UI component library (for pagination)
- Socket.io-client - Client-side WebSocket communication
- React Icons - Icon library

### Development Tools
- Nodemon - Automatic server restarts during development
- Concurrently - Run multiple commands concurrently

       
## 🚀 Features

### Backend Features
- JWT Authentication
- RESTful API design
- Real-time updates with Socket.io
- Comment CRUD operations
- Like/Dislike system
- Pagination
- Sorting (newest, most liked, most disliked)
- Input validation

### Frontend Features
- User authentication (Login/Register)
- Create, read, update, delete comments
- Like and dislike comments
- Real-time updates
- Responsive design with Tailwind CSS
- Pagination
- Sort comments
- Input validation

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🛠️ Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URL=mongodb+srv://name:password@cluster0.qxclpw1.mongodb.net/database?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
```

4. Start the development server:
```bash
npm run dev or nodemon
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
pnpm or npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_BACKEND_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
  npm or pnpm run dev
```

The frontend will run on http://localhost:3000



## 📁 Project Structure

```
comment-system/
├── backend/
├── src/
│   ├── db/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── .env            # Environment variables
│   └── server.js       # Entry point
├── frontend/
│   ├── public/         # Static files
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── context/    # React context for state management
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   └── App.js      # Main App component
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Comments
- `GET /api/comments` - Get all comments (with pagination and sorting)
- `POST /api/comments` - Create a new comment
- `PUT /api/comments/:id` - Update a comment
- `DELETE /api/comments/:id` - Delete a comment
- `POST /api/comments/:id/like` - Like a comment
- `POST /api/comments/:id/dislike` - Dislike a comment

## 🎯 Usage

1. Register a new account or login with existing credentials
2. View all comments on the main page
3. Create new comments using the comment form
4. Like or dislike comments
5. Edit or delete your own comments
6. Sort comments by newest, most liked, or most disliked
7. Use pagination to navigate through comments




## 🧪 Testing

To test the application:
1. Start both frontend and backend servers
2. Register a new user account
3. Test all comment functionalities
4. Verify real-time updates by opening multiple browser windows



