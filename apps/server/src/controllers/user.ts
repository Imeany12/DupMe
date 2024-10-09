import { Request, Response } from 'express';

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
  const user: { username: string; password: string } = req.body;
  const newUser = new User(user);

  try {
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof Error) {
      res.status(409).json({ message: error.message });
    } else {
      res.status(409).json({ message: 'An unknown error occurred' });
    }
  }
};
