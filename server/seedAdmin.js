const User = require("./models/User");
const { hashPassword } = require("./utils/password");

const seedAdmin = async () => {
  const adminEmail = "admin@park.local";

  const existingAdmin = await User.findOne({
    where: {
      email: adminEmail,
    },
  });

  if (existingAdmin) {
    return;
  }

  await User.create({
    first_name: "System",
    last_name: "Admin",
    phone_number: "09170000001",
    email: adminEmail,
    password: hashPassword("admin123"),
    user_type_id: 1,
    is_verified: true,
  });
};

module.exports = seedAdmin;
