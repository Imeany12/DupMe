import { Request, Response } from 'express';

import users from '../models/users';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const userDatas = await users.find();

    res.status(200).json({ userDatas });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const createUser = async (req: Request, res: Response) => {
  const user: { name: string; age: number } = req.body;
  console.log(req);
  const newUser = new users(user);

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
