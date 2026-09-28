import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  deleteMessage,
  editMessage,
  getConversation,
  markAsRead,
  searchConversation,
} from "../services/messageService";
import { getAllUsers } from "../services/userService";
import {
  connect,
  disconnect,
  sendMessage,
  sendTyping,
} from "../services/websocketService";
import ContactsList from "../components/ContactsList";
import ChatHeader from "../components/ChatHeader";
import MessageItem from "../components/MessageItem";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import { useConversation } from "../hooks/useConversation";
import { useChatWebSocket } from "../hooks/useChatWebSocket";
import { useMessageSearch } from "../hooks/useMessageSearch";
import { logoutRequest } from "../services/authService";

const ChatPage = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [content, setContent] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [search, setSearch] = useState("");
  const {
    messages,
    setMessages,
    page,
    setPage,
    hasMore,
    setHasMore,
    loadingMore,
    setLoadingMore,
    loadMoreMessages,
    messagesContainerRef,
  } = useConversation(selectedUser);
  const { searchResults } = useMessageSearch(selectedUser, search);

  // Ref para que el callback siempre vea el selectedUser actual
  const selectedUserRef = useRef(selectedUser);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  const loadUsers = async () => {
    const allUsers = await getAllUsers();
    setUsers(allUsers);
  };

  // Carga la lista de contactos
  useEffect(() => {
    loadUsers();
  }, []);

  useChatWebSocket({
    user,
    selectedUser,
    setMessages,
    setUsers,
    setTypingUser,
    loadUsers,
  });

  async function handleSendMessage() {
    if (content.trim() === "" || !selectedUser) return;

    console.log("replyingTo:", replyingTo);

    await sendMessage(selectedUser.id, content, replyingTo?.id ?? null);

    setContent("");
    setReplyingTo(null);
  }

  function getStatusIcon(status) {
    switch (status) {
      case "SENT":
        return <span>✓</span>;
      case "DELIVERED":
        return <span>✓✓</span>;
      case "READ":
        return <span style={{ color: "blue" }}>✓✓</span>;
      default:
        return "";
    }
  }

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId);
    } catch (error) {
      console.error("Error eliminando mensaje: ", error);
    }
  };

  const handleEditClick = (message) => {
    setEditingMessageId(message.id);
    setEditingContent(message.content);
  };

  const handleSaveEdit = async () => {
    try {
      await editMessage(editingMessageId, editingContent);

      setEditingMessageId(null);
      setEditingContent("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutRequest();
      disconnect();
    } finally {
      logout();
    }
  };

  const editing = {
    editingMessageId,
    editingContent,
    setEditingContent,
    handleSaveEdit,
    handleEditClick,
  };

  const replying = {
    replyingTo,
    setReplyingTo,
  };

  const actions = {
    handleDeleteMessage,
  };

  const ui = {
    getStatusIcon,
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <ContactsList
        users={users}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />

      {/* Área principal */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header del usuario actual */}
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-5 py-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {user.username}
            </h2>

            <p className="text-xs text-gray-400">{user.email}</p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg px-3 py-2 text-sm text-gray-500 transition hover:bg-red-50 hover:text-red-500"
          >
            Cerrar sesión
          </button>
        </header>

        {/* Conversación */}
        {selectedUser ? (
          <div className="flex min-h-0 flex-1 flex-col">
            {/* Header del contacto */}
            <ChatHeader
              selectedUser={selectedUser}
              search={search}
              setSearch={setSearch}
              typingUser={typingUser}
            />

            {/* Mensajes */}            
              <MessageList
                messages={messages}
                search={search}
                searchResults={searchResults}
                messagesContainerRef={messagesContainerRef}
                user={user}
                editing={editing}
                replying={replying}
                actions={actions}
                ui={ui}
              />            

            {/* Input */}
            <MessageInput
              selectedUser={selectedUser}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              content={content}
              setContent={setContent}
              handleSendMessage={handleSendMessage}
              typingTimeoutRef={typingTimeoutRef}
            />
          </div>
        ) : (
          /* Estado inicial */
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="mb-3 text-5xl">💬</div>

              <h2 className="text-lg font-semibold text-gray-700">
                Bienvenido al chat
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Selecciona un contacto para empezar a chatear
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
