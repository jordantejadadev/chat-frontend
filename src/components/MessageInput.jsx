import { sendTyping } from "../services/websocketService";

export default function MessageInput({
  selectedUser,
  replyingTo,
  setReplyingTo,
  content,
  setContent,
  handleSendMessage,
  typingTimeoutRef,
}) {
  return (
    <footer className="border-t border-gray-200 bg-white px-4 py-3">

      {/* Reply */}
      {replyingTo && (
        <div className="mb-3 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">

          {/* Barra lateral */}
          <div className="h-10 w-1 rounded-full bg-blue-500" />

          {/* Información del mensaje */}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-blue-600">
              Respondiendo a {replyingTo.sender}
            </p>

            <p className="truncate text-sm text-gray-500">
              {replyingTo.content}
            </p>
          </div>

          {/* Cancelar reply */}
          <button
            onClick={() => setReplyingTo(null)}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-200 hover:text-gray-700"
            title="Cancelar respuesta"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-2 py-2 transition focus-within:border-blue-400 focus-within:bg-white">

        <input
          type="text"
          placeholder={
            selectedUser
              ? "Escribe un mensaje..."
              : "Selecciona una conversación..."
          }
          value={content}
          disabled={!selectedUser}
          onChange={(e) => {
            setContent(e.target.value);

            if (!selectedUser) return;

            sendTyping(selectedUser.email, true);

            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current);
            }

            typingTimeoutRef.current = setTimeout(() => {
              sendTyping(selectedUser.email, false);
            }, 1000);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          className="flex-1 bg-transparent px-3 py-2 text-sm text-gray-800 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
        />

        {/* Enviar */}
        <button
          onClick={handleSendMessage}
          disabled={!selectedUser || !content.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-300"
          title="Enviar mensaje"
        >
          ➤
        </button>
      </div>
    </footer>
  );
}