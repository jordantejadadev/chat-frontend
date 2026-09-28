import { useContext, useEffect } from "react";
import { connect, disconnect } from "../services/websocketService";
import { markAsRead } from "../services/messageService";
import toast from "react-hot-toast";

export function useChatWebSocket({
  user,
  selectedUser,
  setMessages,
  setUsers,
  setTypingUser,
  loadUsers,
}) {
  const handleMessageReceived = (message) => {
    console.log("LLEGÓ MENSAJE");
    console.log(message);

    setMessages((previous) => {
      const exists = previous.some((m) => m.id === message.id);

      if (exists) return previous;

      return [...previous, message];
    });

    // Si ya tenés esa conversación abierta, se marca como leído al toque
    if (message.senderId === selectedUser?.id) {
      markAsRead(message.senderId);
    }
  };

  const handleOnlineUsersChanged = (onlineUsers) => {
    console.log("Online:", onlineUsers);

    setUsers((previousUsers) =>
      previousUsers.map((u) => ({
        ...u,
        online: onlineUsers.includes(u.email),
      })),
    );
  };

  const handleStatusUpdated = (statusUpdate) => {
    console.log("Status recibido:", statusUpdate);

    setMessages((previous) =>
      previous.map((message) =>
        message.id === statusUpdate.messageId
          ? {
              ...message,
              status: statusUpdate.status,
            }
          : message,
      ),
    );
  };

  const handleTypingReceived = (typingNotification) => {
    if (typingNotification.sender === selectedUser?.email) {
      setTypingUser(
        typingNotification.typing ? typingNotification.sender : null,
      );
    }
  };

  const handleUnreadUpdated = (unreadUpdate) => {
    setUsers((previousUsers) =>
      previousUsers.map((u) =>
        u.id === unreadUpdate.senderId
          ? {
              ...u,
              unreadCount:
                unreadUpdate.senderId === selectedUser?.id
                  ? 0
                  : unreadUpdate.unreadCount,
            }
          : u,
      ),
    );
  };

  const handleUsersUpdated = async () => {
    await loadUsers();
  };

  const handleMessageDeleted = (deleted) => {
    setMessages((previous) =>
      previous.map((message) =>
        message.id === deleted.messageId
          ? {
              ...message,
              deleted: true,
            }
          : message,
      ),
    );
  };

  const handleMessageEdited = (edited) => {
    setMessages((previous) =>
      previous.map((message) =>
        message.id === edited.messageId
          ? {
              ...message,
              content: edited.content,
              edited: edited.edited,
            }
          : message,
      ),
    );
  };

  const handleUserStatusChanged = (notification) => {
    if (notification.email === user.email) return;

    const icon = notification.type === "LOGOUT" ? "👋" : "🔔";

    toast(notification.message, {
      duration: 4000,
      position: "top-right",
      icon,
    });
  };

  useEffect(() => {
    if (!user) return;

    connect(
      user.token,
      handleMessageReceived,
      handleOnlineUsersChanged,
      handleStatusUpdated,
      handleTypingReceived,
      handleUnreadUpdated,
      handleUsersUpdated,
      handleMessageDeleted,
      handleMessageEdited,
      handleUserStatusChanged,
    );

    return () => disconnect();
  }, [user, selectedUser, setMessages, setUsers, setTypingUser]);
}