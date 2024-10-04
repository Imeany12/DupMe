import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;
const MONGOURL = process.env.MONGO_URL || 'default_connection_string'; // Use environment variable for MongoDB URL

// Mongodb
mongoose
  .connect(MONGOURL, { dbName: 'dbconnect' })
  .then(() => console.log('Database connection established'))
  .catch((error) => console.error('Error connecting to database:', error));

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'DupMe server is up!' });
});

app.get('/login', (req: Request, res: Response) => {
  res.json({ message: 'mistertime saygex' });
});

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gpa: Number,
  fullTime: Boolean,
});

const UserModel = mongoose.model('users', userSchema);

app.get('/getUsers', async (req, res) => {
  const userData = await UserModel.find();
  res.json(userData);
});

app.listen(port, () => {
  console.log(`[🎉DupMe] app listening on port ${port}`);
});
