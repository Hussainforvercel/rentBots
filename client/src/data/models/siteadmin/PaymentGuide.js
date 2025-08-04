import DataTypes from 'sequelize';

export default function (sequelize) {
  if (sequelize.models.PaymentGuide) {
    return sequelize.models.PaymentGuide;
  }
  const PaymentGuide = sequelize.define('PaymentGuide', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tableName: 'PaymentGuide',
    timestamps: false,
  });

  return PaymentGuide;
}
