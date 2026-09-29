import { useEffect } from "react";
import { connect, disconnect } from "../services/websocketService";
import { markAsRead } from "../services/messageService";
import toast from "react-hot-toast";

export function useChatWebSocket({
  user,
  selectedUserRef,
  setMessages,
  setUsers,
  setTypingUser,
  loadUsers,
}) {
  const handleMessageReceived = (message) => {
    console.log("LLEGÓ MENSAJE", message);

    setMessages((previous) => {
      const exists = previous.some((m) => m.id === message.id);
      if (exists) return previous;
      return [...previous, message];
    });

    const activeUser = selectedUserRef?.current;
    if (activeUser && message.senderId === activeUser.id) {
      markAsRead(message.senderId).catch((err) =>
        console.error("Error al marcar como leído:", err)
      );
    }
  };

  const handleOnlineUsersChanged = (onlineUsers) => {
    console.log("Online:", onlineUsers);

    setUsers((previousUsers) =>
      previousUsers.map((u) => ({
        ...u,
        online: onlineUsers.includes(u.email),
      }))
    );
  };

  const handleStatusUpdated = (statusUpdate) => {
    console.log("Status recibido:", statusUpdate);

    setMessages((previous) =>
      previous.map((message) =>
        message.id === statusUpdate.messageId || message.id === statusUpdate.id
          ? {
              ...message,
              status: statusUpdate.status,
            }
          : message
      )
    );
  };

  const handleTypingReceived = (typingNotification) => {
    const activeUser = selectedUserRef?.current;
    if (activeUser && typingNotification.sender === activeUser.email) {
      setTypingUser(
        typingNotification.typing ? typingNotification.sender : null
      );
    }
  };

  const handleUnreadUpdated = (unreadUpdate) => {
    const activeUser = selectedUserRef?.current;
    setUsers((previousUsers) =>
      previousUsers.map((u) =>
        u.id === unreadUpdate.senderId
          ? {
              ...u,
              unreadCount:
                activeUser && unreadUpdate.senderId === activeUser.id
                  ? 0
                  : unreadUpdate.unreadCount,
            }
          : u
      )
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
          : message
      )
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
          : message
      )
    );
  };

  const handleUserStatusChanged = (notification) => {
    if (notification.email === user?.email) return;

    const icon = notification.type === "LOGOUT" ? "👋" : "🔔";

    toast(notification.message, {
      duration: 4000,
      position: "top-right",
      icon,
    });
  };

  useEffect(() => {
    if (!user?.token) return;

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
      handleUserStatusChanged
    );

    return () => disconnect();
  }, [user?.token]);
}