import express from 'express';
import {
    createTask,
    getTasks,
    updateTask,
    updateTaskStatus,
} from '../controllers/taskController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.post('/', createTask);
router.get('/', getTasks);
router.put('/:taskId', updateTask);
router.patch('/:taskId/status', updateTaskStatus);

export default router;
