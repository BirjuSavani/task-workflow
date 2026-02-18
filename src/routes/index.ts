import express from 'express';
import authRoutes from './auth';
import reportRoutes from './reports';
import taskRoutes from './tasks';
import userRoutes from './users';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/tasks', taskRoutes);
router.use('/reports', reportRoutes);

export default router;
