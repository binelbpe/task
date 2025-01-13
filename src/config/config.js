require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres"
  },
  production: {
    dialect: "postgres",
    host: 'dpg-cu2fkr52ng1s7381l84g-a.singapore-postgres.render.com',
    port: 5432,
    database: 'project_management_1u0f',
    username: 'project_management_1u0f_user',
    password: 'en1hTRzQBhOUmY1fJ2OfO0DmvvsMJxVL',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
