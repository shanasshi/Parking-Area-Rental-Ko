const matchesTerm = (value, term) => value?.toLowerCase().includes(term);

export const filterUsers = (users, searchTerm) => {
  const term = searchTerm.trim().toLowerCase();

  if (!term) {
    return users;
  }

  return users.filter((user) => {
    const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();

    return (
      matchesTerm(user.first_name, term) ||
      matchesTerm(user.last_name, term) ||
      matchesTerm(fullName, term) ||
      matchesTerm(user.email, term)
    );
  });
};
