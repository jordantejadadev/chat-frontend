import { Client } from "@stomp/stompjs";

let stompClient = null;

export function connect(
  token,
  onMessageReceived,
  onOnlineUsersChanged,
  onStatusUpdated,
  onTypingReceived,
  onUnreadCountUpdated,
  onUsersUpdated,
  onMessageDeleted,
  onMessageEdited,
  onUserStatusChanged,
) {
  stompClient = new Client({
    brokerURL: "ws://localhost:8080/ws",

    debug: (str) => console.log(str),

    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },

    reconnectDelay: 5000,

    onConnect: () => {
      console.log("Conectado al WebSocket");

      stompClient.subscribe("/user/queue/messages", (message) => {
        const body = JSON.parse(message.body);
        onMessageReceived(body);
      });

      stompClient.subscribe("/topic/online-users", (message) => {
        const onlineUsers = JSON.parse(message.body);
        onOnlineUsersChanged(onlineUsers);
      });

      stompClient.subscribe("/user/queue/message-status", (message) => {
        const body = JSON.parse(message.body);
        onStatusUpdated(body);
      });

      stompClient.subscribe("/user/queue/typing", (message) => {
        const body = JSON.parse(message.body);
        onTypingReceived(body);
      });

      stompClient.subscribe("/user/queue/unread-count", (message) => {
        const body = JSON.parse(message.body);
        onUnreadCountUpdated(body);
      });

      stompClient.subscribe("/topic/users-updated", () => {
        console.log("Lista de usuarios actualizada");
        onUsersUpdated();
      });

      stompClient.subscribe("/user/queue/message-deleted", (message) => {
        const body = JSON.parse(message.body);
        onMessageDeleted(body);
      });

      stompClient.subscribe("/user/queue/message-edited", (message) => {
        const body = JSON.parse(message.body);
        onMessageEdited(body);
      });

      stompClient.subscribe("/topic/user-notifications", (message) => {        
        const body = JSON.parse(message.body);        
        if (onUserStatusChanged) onUserStatusChanged(body);
      });
    },

    onStompError: (frame) => {
      console.error("STOMP Error:", frame);
    },

    onWebSocketClose: (event) => {
      console.log("WebSocket cerrado", event);
    },

    onWebSocketError: (event) => {
      console.error("WebSocket error", event);
    },
  });

  stompClient.activate();
}

export function disconnect() {
  console.log("Desconectando STOMP...");

  if (stompClient) {
    stompClient.deactivate();
  }
}

export function sendMessage(receiverId, content, replyToId) {
  if (!stompClient.connected) {
    console.log("Aún no conectado");
    return;
  }

  stompClient.publish({
    destination: "/app/chat",
    body: JSON.stringify({
      receiverId,
      content,
      replyToId,
    }),
  });
}

export function sendTyping(receiver, typing) {
  if (!stompClient || !stompClient.connected) return;

  stompClient.publish({
    destination: "/app/chat/typing",
    body: JSON.stringify({
      receiver,
      typing,
    }),
  });
}
