import { IMatch } from '@repo/shared-types';
import { Request, Response } from 'express';

import User from '../models/users';

export const addScoreAndMatch = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const { score, match }: { score: number; match: IMatch } = req.body;

    if (typeof score !== 'number' || score <= 0) {
      return res.status(400).json({ message: 'Invalid Score' });
    }
    if (!match.opponent || !match.outcome) {
      return res.status(400).json({ message: 'Invalid opponent or outcome' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { username: username },
      {
        $inc: {
          total_score: score,
          games_won: match.outcome === 'win' ? 1 : 0,
          games_lost: match.outcome === 'lose' ? 1 : 0,
          games_draw: match.outcome === 'draw' ? 1 : 0,
        },
        $push: { matchHistory: match },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(200).json({ message: 'User not found.' });
    }

    return res.status(201).json({
      message:
        'Score of "${score}" and match "${match.outcome}" against "${match.opponent}" have been added to "${username}" successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating score and match' });
  }
};

export const addMatch = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const { match }: { match: IMatch } = req.body;

    if (!match.opponent || !match.outcome) {
      return res.status(400).json({ message: 'Invalid opponent or outcome' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { username: username },
      {
        $push: { matchHistory: match },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(200).json({ message: 'User not found.' });
    }

    return res.status(201).json({
      message:
        'Match "${match.outcome}" against "${match.opponent}" have been added to "${username}"',
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error adding match' });
  }
};

export const addScore = async (req: Request, res: Response) => {
  try {
    const username = req.params;
    const score = req.body.score;

    if (typeof score !== 'number' || score <= 0) {
      return res.status(400).json({ message: 'Invalid Score' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { username: username },
      {
        $inc: {
          total_score: score,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(200).json({ message: 'User not found.' });
    }

    return res.status(201).json({
      message: 'Score of "${score}" has been added to "${username}"',
      user: updatedUser,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: 'An unexpected error occured while adding score.' });
    }
  }
};

export const setScore = async (req: Request, res: Response) => {
  try {
    const username = req.params;
    const score = req.body.score;

    if (typeof score !== 'number' || score <= 0) {
      return res.status(400).json({ message: 'Invalid Score' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { username: username },
      {
        $set: {
          total_score: score,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(200).json({ message: 'User not found.' });
    }

    return res.status(201).json({
      message: 'Score of "${score}" has been set to "${username}"',
      user: updatedUser,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: 'An unexpected error occured while adding score.' });
    }
  }
};

export const resetScore = async (req: Request, res: Response) => {
  try {
    const username = req.params;
    const score = req.body.score;

    if (typeof score !== 'number' || score <= 0) {
      return res.status(400).json({ message: 'Invalid Score' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { username: username },
      {
        $set: {
          total_score: 0,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(200).json({ message: 'User not found.' });
    }

    return res.status(201).json({
      message: 'Score of "${username}" has been reset to 0',
      user: updatedUser,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({
        message: 'An unexpected error occured while resetting score.',
      });
    }
  }
};
