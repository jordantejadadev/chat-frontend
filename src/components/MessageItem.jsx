export default function MessageItem({
  message,
  user,
  replying,
  editing,
  actions,
  ui,
}) {
  const { replyingTo, setReplyingTo } = replying;

  const {
    editingMessageId,
    editingContent,
    setEditingContent,
    handleSaveEdit,
    handleEditClick,
  } = editing;

  const { handleDeleteMessage } = actions;
  const { getStatusIcon } = ui;

  const isOwnMessage = message.senderId === user.id;

  return (
    <div
      className={`flex w-full mb-3 ${
        isOwnMessage ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`group relative max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${
          isOwnMessage
            ? "bg-blue-600 text-white rounded-br-md"
            : "bg-white text-gray-800 rounded-bl-md border border-gray-200"
        }`}
      >
        {/* Remitente */}
        {!isOwnMessage && (
          <div className="mb-1 text-xs font-semibold text-blue-600">
            {message.sender}
          </div>
        )}

        {/* Mensaje eliminado */}
        {message.deleted ? (
          <p className="text-sm italic opacity-60">
            🗑️ Este mensaje fue eliminado
          </p>
        ) : editingMessageId === message.id ? (
          /* Edición */
          <div className="flex gap-2">
            <input
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              className="rounded-lg border px-2 py-1 text-sm text-gray-800 outline-none"
              autoFocus
            />

            <button
              onClick={handleSaveEdit}
              className="rounded-lg bg-white/20 px-2 py-1 text-sm hover:bg-white/30"
            >
              Guardar
            </button>
          </div>
        ) : (
          <>
            {/* Reply */}
            {message.replyTo && (
              <div
                className={`mb-2 rounded-lg border-l-4 px-3 py-2 text-sm ${
                  isOwnMessage
                    ? "border-white/60 bg-white/10"
                    : "border-blue-500 bg-gray-100"
                }`}
              >
                <div className="font-semibold">
                  {message.replyTo.sender}
                </div>

                <div className="truncate opacity-75">
                  {message.replyTo.content}
                </div>
              </div>
            )}

            {/* Contenido */}
            <p className="whitespace-pre-wrap break-words text-sm">
              {message.content}
            </p>

            {/* Footer */}
            <div
              className={`mt-1 flex items-center justify-end gap-1 text-[11px] ${
                isOwnMessage
                  ? "text-blue-100"
                  : "text-gray-400"
              }`}
            >
              {message.edited && <span>editado</span>}

              <span>
                {new Date(message.sentAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>

              {isOwnMessage && (
                <span>
                  {getStatusIcon(message.status)}
                </span>
              )}
            </div>

            {/* Acciones */}
            <div
              className={`absolute -top-8 hidden gap-1 rounded-lg border bg-white p-1 shadow-md group-hover:flex ${
                isOwnMessage ? "right-0" : "left-0"
              }`}
            >
              <button
                onClick={() => setReplyingTo(message)}
                className="rounded px-2 py-1 text-sm hover:bg-gray-100"
                title="Responder"
              >
                ↩️
              </button>

              {isOwnMessage && (
                <>
                  <button
                    onClick={() => handleEditClick(message)}
                    className="rounded px-2 py-1 text-sm hover:bg-gray-100"
                    title="Editar"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => handleDeleteMessage(message.id)}
                    className="rounded px-2 py-1 text-sm hover:bg-gray-100"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}