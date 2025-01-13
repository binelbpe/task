require("dotenv").config();
const { sequelize } = require("./models");
const app = require("./app");
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Test database connection with retry
    let retries = 5;
    while (retries) {
      try {
        await sequelize.authenticate();
        console.log('Database connection established.');
        break;
      } catch (err) {
        console.log(`Database connection attempt failed. ${retries} retries left.`);
        retries -= 1;
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
