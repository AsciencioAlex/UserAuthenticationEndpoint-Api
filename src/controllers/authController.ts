import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Organisation from '../models/Organisation';

export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, phone } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(422).json({
      errors: [{ field: 'input', message: 'Missing required fields' }],
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
    });

    const organisation = await Organisation.create({
      name: `${firstName}'s Organisation`,
      owner_id: user.userId,
    });

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    res.status(400).json({ status: 'Bad request', message: 'Registration unsuccessful', statusCode: 400 });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({ status: 'Bad request', message: 'Authentication failed', statusCode: 401 });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ status: 'Bad request', message: 'Authentication failed', statusCode: 401 });
    }

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    res.status(400).json({ status: 'Bad request', message: 'Authentication failed', statusCode: 401 });
  }
};
