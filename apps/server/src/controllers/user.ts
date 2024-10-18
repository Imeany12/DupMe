import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import User from '../models/users';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const userList = await User.find();

    res.status(200).json({ userList });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const { password } = req.body;
    if (!password || password.length < 4) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 4 characters long' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(200).json({ error: 'Username not found' });
    }

    if (!user.password) {
      return res.status(500).json({ error: 'User password is not set' });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '24h' }
    );
    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const removeUser = async (req: Request, res: Response) => {
  try {
    const username = await User.findOneAndDelete({
      username: req.params.username,
    });

    if (!username) {
      return res.status(200).json({ message: 'Username not found' });
    }
    return res
      .status(200)
      .json({ message: 'User deleted successfully', user: username });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error deleting user' });
  }
};

export const uploadImage = async (req: Request, res: Response) => {
  const { username } = req.params;
  const image = req.file?.filename;

  if (!image) {
    return res.status(400).json({ message: 'Image is required' });
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(req.file?.mimetype || '')) {
    return res.status(400).json({
      message: 'Invalid file type. Only JPG, PNG, and GIF are allowed.',
    });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(200).json({ message: 'User not found' });
    }

    user.image = image;
    await user.save();

    return res
      .status(200)
      .json({ message: 'Image uploaded successfully', user: username });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating image', error });
  }
};
