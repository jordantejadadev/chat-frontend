import MessageItem from "./MessageItem";

export default function MessageList({
  messages,
  search,
  searchResults,
  messagesContainerRef,
  user,
  replying,
  editing,
  actions,
  ui,
}) {
  const messagesToShow = search.trim() === "" ? messages : searchResults;

  return (
    <div
      ref={messagesContainerRef}
      className="min-h-0 flex-1 overflow-y-auto bg-gray-50 px-4 py-4"
    >
      {messagesToShow.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          user={user}
          replying={replying}
          editing={editing}
          actions={actions}
          ui={ui}
        />
      ))}
    </div>
  );
}
