require("dotenv").config({
  path: `${__dirname}/../../.env`,
});

const { DATABASE_URL } = process.env;

module.exports = {
  development: {
    url: DATABASE_URL,
    dialect: 'mysql',
    username: 'root',
    password: 'RentBotIsThePass',
    database: 'RentBot',
    host: '127.0.0.1',
    port: 3306
  }
};
