import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
// import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import classRoutes from './routes/classRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import testimonyRoutes from './routes/testimonialRoutes.js';

const app = express();
app.use(cors());

dotenv.config();

//const PORT = 5000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// console.log(__dirname,909)

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "../public/images")));

app.set('view engine', 'ejs');

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


