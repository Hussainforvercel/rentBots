import DataType from 'sequelize';
import Model from '../sequelize';

const EmailTemplate = Model.define('EmailTemplate', {
  id: {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataType.STRING,
    allowNull: false,
    unique: true
  },
  subject: {
    type: DataType.STRING,
    allowNull: false
  },
  content: {
    type: DataType.TEXT,
    allowNull: false
  },
  createdAt: {
    type: DataType.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataType.DATE,
    allowNull: false
  }
}, {
  tableName: 'EmailTemplates',
  timestamps: true
});

export default EmailTemplate;
