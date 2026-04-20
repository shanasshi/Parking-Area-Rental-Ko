const User = require("../models/User");
const { createProviderRequest } = require("./requestController");
const { hashPassword } = require("../utils/password");
const sanitizeUser = require("../utils/sanitizeUser");

const getUsers = async (_req, res) => {
  try {
    const users = await User.findAll();
    res.json(users.map(sanitizeUser));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(sanitizeUser(user));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      phone_number,
      email,
      password,
      user_type_id,
      is_verified,
    } = req.body;

    if (!first_name || !last_name || !phone_number || !email || !password) {
      return res.status(400).json({
        error: "First name, last name, phone number, email, and password are required",
      });
    }

    const newUser = await User.create({
      first_name,
      last_name,
      phone_number,
      email,
      password: hashPassword(password),
      user_type_id: user_type_id || 3,
      is_verified: is_verified === true || is_verified === "true",
    });
    res.json(sanitizeUser(newUser));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  createProviderRequest,
};
