export const REQUEST_STATUS = {
  pending: 1,
  approved: 2,
  rejected: 3,
};

export const REQUEST_STATUS_META = {
  [REQUEST_STATUS.pending]: { color: "gold", text: "PENDING" },
  [REQUEST_STATUS.approved]: { color: "green", text: "APPROVED" },
  [REQUEST_STATUS.rejected]: { color: "red", text: "REJECTED" },
};
