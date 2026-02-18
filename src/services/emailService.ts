import ejs from 'ejs';
import nodemailer from 'nodemailer';
import path from 'path';
import env from '../config/env';
import logger from '../utils/logger';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

const renderTemplate = async (templateName: string, data: Record<string, unknown>): Promise<string> => {
  const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.ejs`);
  return ejs.renderFile(templatePath, data);
};

export const sendTaskEmail = async (
  user: { name: string; email: string },
  task: { title: string; status: string; priority: string; updatedAt?: Date }
) => {
  const templateName = task.status === 'COMPLETED' ? 'task-completed' : 'task-failed';
  const html = await renderTemplate(templateName, {
    userName: user.name,
    taskTitle: task.title,
    status: task.status,
    priority: task.priority,
    timestamp: new Date().toISOString(),
  });

  await transporter.sendMail({
    from: env.SMTP_FROM,
    to: user.email,
    subject: `Task ${task.status}: ${task.title}`,
    html,
  });

  logger.info('Task email sent', { email: user.email, taskTitle: task.title, status: task.status });
};

export const sendReportEmail = async (
  user: { name: string; email: string },
  report: { type: string; content: Record<string, unknown> }
) => {
  const html = await renderTemplate('report-generated', {
    userName: user.name,
    reportType: report.type,
    content: report.content,
    timestamp: new Date().toISOString(),
  });

  await transporter.sendMail({
    from: env.SMTP_FROM,
    to: user.email,
    subject: `Report Generated: ${report.type}`,
    html,
  });

  logger.info('Report email sent', { email: user.email, reportType: report.type });
};
