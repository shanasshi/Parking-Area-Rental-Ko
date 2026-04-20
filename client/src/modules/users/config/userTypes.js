export const USER_TYPES = {
  admin: 1,
  provider: 2,
  normal: 3,
};

export const USER_TYPE_META = {
  [USER_TYPES.admin]: {
    color: "volcano",
    label: "ADMIN",
  },
  [USER_TYPES.provider]: {
    color: "green",
    label: "PROVIDER",
  },
  [USER_TYPES.normal]: {
    color: "blue",
    label: "NORMAL USER",
  },
};
