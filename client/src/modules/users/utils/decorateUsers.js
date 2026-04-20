import { REQUEST_STATUS_META } from "../../requests/config/requestStatus";

const getLatestRequestByUserId = (requests) => {
  return requests.reduce((accumulator, request) => {
    const current = accumulator[request.user_id];

    if (!current) {
      accumulator[request.user_id] = request;
      return accumulator;
    }

    const currentTime = new Date(current.updatedAt || current.createdAt).getTime();
    const nextTime = new Date(request.updatedAt || request.createdAt).getTime();

    if (nextTime >= currentTime) {
      accumulator[request.user_id] = request;
    }

    return accumulator;
  }, {});
};

export const decorateUsers = (users, requests) => {
  const latestRequests = getLatestRequestByUserId(requests);

  return users.map((user) => {
    const latestRequest = latestRequests[user.id];

    return {
      ...user,
      providerRequest: latestRequest || null,
      providerRequestStatus: latestRequest?.status || null,
      providerRequestLabel: latestRequest
        ? REQUEST_STATUS_META[latestRequest.status]?.text || "UNKNOWN"
        : "NOT REQUESTED",
    };
  });
};
