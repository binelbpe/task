require("dotenv").config();

const { sequelize, User } = require("./models");
const app = require("./app");

async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    // Test User model
    const users = await User.findAll();
    console.log("Users in database:", users.length);
  } catch (err) {
    console.error("Database connection error:", err);
  }
}

testDatabaseConnection();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
