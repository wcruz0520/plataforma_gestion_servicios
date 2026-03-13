import axiosClient from "../api/axiosClient";

function unwrapPayload(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data;
  }

  return payload;
}

function normalizeExternalUser(user) {
  if (!user || typeof user !== "object") {
    return user;
  }

  return {
    ...user,
    profile: user.profile ?? user.profile__name,
  };
}

export async function getExternalUsers() {
  const response = await axiosClient.get("/api/external-users");
  const users = unwrapPayload(response.data);

  if (!Array.isArray(users)) {
    return [];
  }

  return users.map(normalizeExternalUser);
}

export async function createExternalUser(data) {
  const response = await axiosClient.post("/api/external-users", data);
  return response.data;
}

export async function updateExternalUser(id, data) {
  const response = await axiosClient.put(`/api/external-users/${id}`, data);
  return response.data;
}

export async function updateExternalUserBilling(id, data) {
  const response = await axiosClient.put(`/api/external-users/${id}/data_factura`, data);
  return response.data;
}
