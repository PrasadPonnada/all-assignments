import jwt from "jsonwebtoken"
import express, { Request, Response } from 'express'

import { authenticateJwt, SECRET } from "../middleware/";
import { User } from "../db";

const router = express.Router();

interface UserModel {
  username: string;
  password: string
}

router.post('/signup', async (req: Request, res: Response) => {
  const userReq: UserModel = req.body;
  const username = userReq.username;
  const user = await User.findOne({ username });
  if (user) {
    res.status(403).json({ message: 'User already exists' });
  } else {
    const newUser = new User(userReq);
    await newUser.save();
    const token: string = jwt.sign({ id: newUser._id }, SECRET, { expiresIn: '1h' });
    res.json({ message: 'User created successfully', token });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  const userReq: UserModel = req.body;
  const user = await User.findOne(userReq);
  if (user) {
    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'Invalid username or password' });
  }
});

router.get('/me', authenticateJwt, async (req: Request, res: Response) => {

  const user = await User.findOne({ _id: req.headers['id'] });
  console.log(user)
  if (user) {
    res.json({ username: user.username });
  } else {
    res.status(403).json({ message: 'User not logged in' });
  }
});

export default router

