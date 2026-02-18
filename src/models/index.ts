import JobLog from './JobLog';
import Report from './Report';
import Task from './Task';
import User from './User';

// Associations
User.hasMany(Task, { foreignKey: 'userId', as: 'tasks' });
Task.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Report, { foreignKey: 'userId', as: 'reports' });
Report.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Task.hasMany(Report, { foreignKey: 'taskId', as: 'reports' });
Report.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

export { JobLog, Report, Task, User };
