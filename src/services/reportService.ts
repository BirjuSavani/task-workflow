import { AppError } from '../middleware/errorHandler';
import { Report, Task, User } from '../models';
import { addReportJob } from '../queues/reportQueue';

export const getLatestReport = async (userId: string) => {
  const report = await Report.findOne({
    where: { userId },
    order: [['createdAt', 'DESC']],
    include: [{ model: Task, as: 'task', attributes: ['id', 'title', 'status', 'priority'] }],
  });
  if (!report) throw new AppError('No reports found', 404);
  return report;
};

export const generateReport = async (userId: string, sendEmail: boolean) => {
  const user = await User.findByPk(userId, { attributes: ['id', 'name', 'email'] });
  if (!user) throw new AppError('User not found', 404);

  await addReportJob('generate-report', { userId, sendEmail });
  return { message: 'Report generation started' };
};
