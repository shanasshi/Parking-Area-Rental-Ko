const User = require("../models/User");
const { comparePassword, hashPassword } = require("../utils/password");
const sanitizeUser = require("../utils/sanitizeUser");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user || !comparePassword(password, user.password)) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    return res.json({
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const register = async (req, res) => {
  const { first_name, last_name, phone_number, email, password } = req.body;

  try {
    if (!first_name || !last_name || !phone_number || !email || !password) {
      return res.status(400).json({
        error: "First name, last name, phone number, email, and password are required",
      });
    }

    const existingUser = await User.findOne({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    const user = await User.create({
      first_name,
      last_name,
      phone_number,
      email,
      password: hashPassword(password),
      user_type_id: 3,
      is_verified: false,
    });

    return res.status(201).json({
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  login,
  register,
};
