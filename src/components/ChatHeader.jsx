export default function ChatHeader({
  selectedUser,
  search,
  setSearch,
  typingUser,
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 bg-white px-5 py-3">

      {/* Usuario */}
      <div className="flex items-center gap-3">

        {/* Avatar */}
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-semibold text-white">
            {selectedUser.username.charAt(0).toUpperCase()}
          </div>

          {/* Indicador online */}
          {selectedUser.online && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
          )}
        </div>

        {/* Nombre y estado */}
        <div>
          <h2 className="text-sm font-semibold text-gray-800">
            {selectedUser.username}
          </h2>

          {typingUser === selectedUser.email ? (
            <p className="text-xs text-blue-500">
              {selectedUser.username} está escribiendo...
            </p>
          ) : (
            <p className="text-xs text-gray-400">
              {selectedUser.online ? "En línea" : "Desconectado"}
            </p>
          )}
        </div>
      </div>

      {/* Buscar */}
      <div>
        <input
          type="text"
          placeholder="Buscar mensajes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-56 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white"
        />
      </div>

    </div>
  );
}