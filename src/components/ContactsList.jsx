export default function ContactsList({
  users,
  selectedUser,
  setSelectedUser,
}) {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">

      {/* Título */}
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Contactos
        </h2>
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto p-2">
        {users.map((u) => {
          const isSelected = selectedUser?.id === u.id;

          return (
            <div
              key={u.id}
              onClick={() => setSelectedUser(u)}
              className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition ${
                isSelected
                  ? "bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-semibold text-white">
                  {u.username.charAt(0).toUpperCase()}
                </div>

                {/* Estado online */}
                <span
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                    u.online
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
              </div>

              {/* Nombre */}
              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-sm ${
                    isSelected
                      ? "font-semibold text-blue-700"
                      : "font-medium text-gray-800"
                  }`}
                >
                  {u.username}
                </p>

                <p className="text-xs text-gray-400">
                  {u.online ? "En línea" : "Desconectado"}
                </p>
              </div>

              {/* Mensajes no leídos */}
              {u.unreadCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-semibold text-white">
                  {u.unreadCount}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}