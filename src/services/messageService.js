import api from "../api/axios";

export async function getConversation(receiverId, page = 0, size = 20) {
  const response = await api.get(`/messages/conversation/${receiverId}`, {
    params: {
      page,
      size,
    },
  });

  return response.data;
}

export async function sendMessage(request) {
  const response = await api.post("/messages", request);

  return response.data;
}

export async function markAsRead(senderId) {
  await api.post(`/messages/read/${senderId}`);
}

export async function deleteMessage(messageId) {
  const response = await api.delete(`/messages/${messageId}`);
  return response.data;
}

export async function editMessage(messageId, content) {
  const response = await api.patch(`/messages/${messageId}`, {
    content,
  });

  return response.data;
}

export async function searchConversation(contactId, query) {
  const response = await api.get("/messages/search", {
    params: {
      contactId,
      query,
    },
  });

  return response.data;
}
