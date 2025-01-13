require("dotenv").config();
const { sequelize } = require("./models");
const app = require("./app");
const logger = require('./utils/logger');

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

async function startServer() {
  try {
    await sequelize.authenticate();
    logger.info("Database connected successfully");

    app.listen(process.env.PORT || 3000, () => {
      logger.info(`Server running on port ${process.env.PORT || 3000}`);
    });
  } catch (error) {
    logger.error('Server startup error:', error);
    process.exit(1);
  }
}

startServer().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});
