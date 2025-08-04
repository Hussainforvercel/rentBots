import DataType from 'sequelize';
import Model from '../../sequelize';

const Language = Model.define('Languages', {

  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  title: {
    type: DataType.STRING,
    allowNull: false,
  },

  code: {
    type: DataType.STRING,
    allowNull: false,
  },

  fileURL :{
    type: DataType.STRING,
    allowNull: true,
  },

  createdAt: {
    type: DataType.DATE,
    defaultValue: DataType.NOW
  },

  updatedAt: {
    type: DataType.DATE,
    defaultValue: DataType.NOW
  }

}, {
  tableName: 'Languages',
  timestamps: true
});

// Sync the model with the database
Model.sync()
  .then(() => {
    console.log('Language table created successfully');
  })
  .catch(err => {
    console.error('Error creating Language table:', err);
  });

export default Language;
