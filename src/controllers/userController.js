const jwt = require("jsonwebtoken");
const { User } = require("../models");

const generateToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

const userController = {
//register new user
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({
          error: "all fields are required",
        });
      }
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "existing user" });
      }

      const user = await User.create({
        name,
        email,
        password,
      });

      const token = generateToken(user);

      res.status(201).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  
  //login new user
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: "All fields are required",
        });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({
          error: "Invalid credentials",
        });
      }

      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          error: "Invalid credentials",
        });
      }

      const token = generateToken(user);

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      console.error("Login error:", error); 
      res.status(400).json({
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },

  // Get user profile
  async getProfile(req, res) {
    try {
      res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Update user profile
  async updateProfile(req, res) {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).json({ error: "Invalid updates" });
    }

    try {
      updates.forEach((update) => (req.user[update] = req.body[update]));
      await req.user.save();

      res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = userController;
