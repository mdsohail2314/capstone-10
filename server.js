import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import typeDefs from './graphql/typeDefs.js';
import resolvers from './graphql/resolvers.js';
import mongooseConnection from './config/dbconnection.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
dotenv.config();

// MongoDB connection
mongooseConnection();

// Express setup
const app = express();
app.use(cors());


// Set storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Define upload folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate unique filename
  }
});

const upload = multer({ storage });

// Route for image upload
app.post('/admin/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }
  
  const filePath = `/uploads/${req.file.filename}`; // Return the file path
  res.status(200).json({ success: true, filePath });
});


app.post('/admin/event/upload', upload.single('eventimage'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }
  
  const filePath = `/uploads/${req.file.filename}`; // Return the file path
  res.status(200).json({ success: true, filePath });
});


// Serve uploaded images (for development purposes)
app.use('/uploads', express.static(path.resolve('uploads')));


const getUser = (token) => {
  try {
    if (token) {
      return jwt.verify(token, process.env.JWT_SECRET);
    }
    return null;
  } catch (err) {
    return null;
  }
};


// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context:({req})=>{
    const token = req.headers.authorization || "";
    const user = getUser(token.replace("Bearer ", ""));
    return { user };
  },
  cors: {
    origin: "*", // Allow all origins or specify a list of trusted origins
    credentials: true,
  }
});

server.start().then(() => {
  server.applyMiddleware({ app, path: '/graphql' });
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/graphql`);
  });
});
