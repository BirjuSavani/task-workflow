import express from 'express';
import { generateReport, getLatestReport } from '../controllers/reportController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.get('/latest', getLatestReport);
router.post('/generate', generateReport);

export default router;
