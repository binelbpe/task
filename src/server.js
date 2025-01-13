require("dotenv").config();
const { sequelize } = require("./models");
const app = require("./app");
const logger = require('./utils/logger');

async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    logger.info("Database connected successfully");

    // Test User model
    const { User } = require('./models');
    const users = await User.findAll();
    logger.info(`Users in database: ${users.length}`);
  } catch (err) {
    logger.error("Database connection error:", err);
    throw err; // Rethrow to prevent server from starting with DB issues
  }
}

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await testDatabaseConnection();
    
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Rejection:', error);
  process.exit(1);
});
