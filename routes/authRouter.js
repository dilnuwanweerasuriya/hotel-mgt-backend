import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { changePassword, getCurrentUser, login, logout, register } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/me', authenticate, getCurrentUser);
authRouter.post('/logout', authenticate, logout);
authRouter.post('/change-password', authenticate, changePassword);

export default authRouter;