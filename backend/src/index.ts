import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import userRouter from './routes/userRoute';
import adminRouter from './routes/adminRoute';
import courseRouter from './routes/courseRoute';


dotenv.config();


const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());



app.use('/api/v1/user' ,userRouter );
app.use('/api/v1/admin' , adminRouter);
app.use('/api/v1/course' , courseRouter);

async function main() {
    try {
      await mongoose.connect(process.env.MONGO_URL || '');
      console.log('Connected to MongoDB');
      
      app.listen(3000, () => {
        console.log('Server is running on port 3000');
      });
    } catch (error) {
      console.error('Failed to connect to MongoDB', error);
      process.exit(1); 
    }
  }
  
  main();


