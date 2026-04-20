const sanitizeUser = (user) => {
  if (!user) {
    return null;
  }

  const plainUser = typeof user.toJSON === "function" ? user.toJSON() : user;
  const { password, ...safeUser } = plainUser;

  return safeUser;
};

module.exports = sanitizeUser;
