import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import multer from 'multer';

import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import classRoutes from './routes/classRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import testimonyRoutes from './routes/testimonialRoutes.js';

const app = express();

dotenv.config();

//const PORT = 5000;

app.use(express.json());

// Database Connection
mongoose.connect('mongodb://localhost:27017/bakery_shop')
  .then(() => console.log("Connected to MongoDB (bakery_shop)"))
  .catch(err => console.error("Database connection error:", err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/testimony', testimonyRoutes);

// Start Server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`);
});


