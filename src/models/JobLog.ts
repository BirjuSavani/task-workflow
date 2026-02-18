import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface JobLogAttributes {
  id: string;
  jobId: string;
  queueName: string;
  jobName: string;
  status: 'started' | 'completed' | 'failed';
  data?: object;
  error?: string;
  createdAt?: Date;
}

class JobLog extends Model<JobLogAttributes, Optional<JobLogAttributes, 'id' | 'data' | 'error' | 'createdAt'>> {
  declare id: string;
  declare jobId: string;
  declare queueName: string;
  declare jobName: string;
  declare status: 'started' | 'completed' | 'failed';
  declare data: object;
  declare error: string;
  declare readonly createdAt: Date;
}

JobLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    jobId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    queueName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jobName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('started', 'completed', 'failed'),
      allowNull: false,
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    error: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'JobLogs',
    timestamps: true,
    updatedAt: false,
  }
);

export default JobLog;
