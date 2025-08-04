import DataType from 'sequelize';
import Model from '../../sequelize';

const AdminModel = Model.define('MarketingBanner', {
  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  title: {
    type: DataType.STRING,
    allowNull: false,
  },
  image: {
    type: DataType.STRING,
  },
  link: {
    type: DataType.STRING,
    allowNull: false,
  },
  buttonText: {
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'Learn More'
  },
  createdAt: {
    type: DataType.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataType.DATE,
    allowNull: false
  },
  isEnable: {
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
});

export default AdminModel;
