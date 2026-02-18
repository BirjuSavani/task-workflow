import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ReportAttributes {
  id: string;
  userId: string;
  taskId?: string;
  type: string;
  content: object;
  createdAt?: Date;
}

class Report extends Model<ReportAttributes, Optional<ReportAttributes, 'id' | 'taskId' | 'createdAt'>> {
  declare id: string;
  declare userId: string;
  declare taskId: string;
  declare type: string;
  declare content: object;
  declare readonly createdAt: Date;
}

Report.init(
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
    taskId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'Tasks', key: 'id' },
      onDelete: 'SET NULL',
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'Reports',
    timestamps: true,
    updatedAt: false,
  }
);

export default Report;
