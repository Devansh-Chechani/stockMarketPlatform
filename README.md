# Stock Discussion Platform Backend
This project is the backend for a stock discussion platform where users can discuss various stocks, manage posts, comment, and like posts. It is built using the MERN stack (MongoDB, Express.js, Node.js and Mongodb aggregation pipelines).

# Features
User authentication (JWT-based) <br/>
Stock post creation and management <br/>
Commenting and liking system for posts <br/>
Post filtering and sorting <br/>
Postman API documentation  

# Prerequisites
To run this project, ensure that you have the following installed on your machine:

Node.js (v14.x or later)
MongoDB (or you can use MongoDB Atlas for a cloud-based solution)
Git

# ENVIRONMENT VARIABLES SETUP
# Server
PORT=8000  <br/>
CORS_ORIGIN=*

# MongoDB
MONGO_URI=mongodb://localhost:27017/stockdiscussion

# JWT Secrets
ACCESS_TOKEN_SECRET=yourAccessTokenSecret <br/>
REFRESH_TOKEN_SECRET=yourRefreshTokenSecret

# Cloudinary
CLOUDINARY_CLOUD_NAME=yourCloudName <br/>
CLOUDINARY_API_KEY=yourApiKey <br/>
CLOUDINARY_API_SECRET=yourApiSecret


nom run dev : This will start the server with Nodemon

API Documentation
You can interact with the API via Postman . Postman collection files are provided .

# API Endpoints
# Authentication
Register User: POST /api/auth/register <br/>
Login User: POST /api/auth/login <br/>
Logout User: POST /api/auth/logout <br/>


# User Management 
Get User Profile: GET /api/user/profile/:userId <br/>
Update User Profile: PUT /api/user/profile (requires Authorization: Bearer <token>) <br/>

# Post Management
Create Post: POST /api/posts (requires Authorization: Bearer <token>) <br/>
Get All Posts (with filters and sorting): GET /api/posts <br/>
Get Single Post with Comments: GET /api/posts/:postId <br/>
Delete Post: DELETE /api/posts/:postId (requires Authorization: Bearer <token>)

# Comment Management
Add Comment to Post: POST /api/posts/:postId/comments (requires Authorization: Bearer <token>) <br/>
Delete Comment: DELETE /api/posts/:postId/comments/:commentId (requires Authorization: Bearer <token>)

# Like System
Like a Post: POST /api/posts/:postId/like (requires Authorization: Bearer <token>)

#Paginated Post Retrieval: GET /api/posts?page=1&limit=10


