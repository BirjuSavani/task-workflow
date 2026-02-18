import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface TaskAttributes {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt?: Date;
  updatedAt?: Date;
}

class Task extends Model<TaskAttributes, Optional<TaskAttributes, 'id' | 'description' | 'status' | 'createdAt' | 'updatedAt'>> {
  declare id: string;
  declare userId: string;
  declare title: string;
  declare description: string;
  declare status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  declare priority: 'LOW' | 'MEDIUM' | 'HIGH';
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Task.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED'),
      defaultValue: 'PENDING',
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH'),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'Tasks',
    timestamps: true,
  }
);

export default Task;
