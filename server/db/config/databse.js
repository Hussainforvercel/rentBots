const sequelize = new Sequelize(
  'RentBot',
  'rentbot_user',
  'your_strong_password',
  {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: console.log
  }
);
