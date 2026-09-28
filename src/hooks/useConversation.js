import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { getConversation } from "../services/messageService";

export function useConversation(selectedUser) {
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const messagesContainerRef = useRef(null);
  const previousScrollHeightRef = useRef(0);
  const restoringScrollRef = useRef(false);
  const shouldScrollToBottomRef = useRef(false);
  const isNearBottomRef = useRef(true);

  async function loadMoreMessages() {
    if (!selectedUser) return;

    if (!hasMore) return;

    if (loadingMore) return;    

    setLoadingMore(true);

    const container = messagesContainerRef.current;

    previousScrollHeightRef.current = container.scrollHeight;

    restoringScrollRef.current = true;

    const response = await getConversation(selectedUser.id, page, 20);

    setMessages((previous) => [...response.content.reverse(), ...previous]);

    setPage((previous) => previous + 1);

    setHasMore(!response.last);

    setLoadingMore(false);
  }

  useEffect(() => {
      const container = messagesContainerRef.current;
  
      if (!container) return;
  
      function handleScroll() {
        if (container.scrollTop === 0) {
          loadMoreMessages();
        }

        const distanceToBottom =
          container.scrollHeight -
          container.scrollTop -
          container.clientHeight;

        isNearBottomRef.current = distanceToBottom < 150;
      }
  
      container.addEventListener("scroll", handleScroll);
  
      return () => container.removeEventListener("scroll", handleScroll);
    }, [page, hasMore, loadingMore, selectedUser]);

  useLayoutEffect(() => {
    const container = messagesContainerRef.current;

    if (!container) return;

    if (restoringScrollRef.current) {
      // Venimos de paginar hacia arriba: mantener la posición de lectura
      const newHeight = container.scrollHeight;

      container.scrollTop += newHeight - previousScrollHeightRef.current;

      restoringScrollRef.current = false;
      return;
    }

    if (shouldScrollToBottomRef.current) {
      // Venimos de cargar la conversación desde cero: ir al último mensaje
      container.scrollTop = container.scrollHeight;

      shouldScrollToBottomRef.current = false;
      return;
    }

    if (isNearBottomRef.current) {
      // Llegó un mensaje nuevo y ya estabas leyendo cerca del final: seguirlo
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!selectedUser) return;

    async function loadConversation() {
      try {
        const conversation = await getConversation(selectedUser.id, 0, 20);

        shouldScrollToBottomRef.current = true;
        setMessages(conversation.content.reverse());
        setPage(1);
        setHasMore(!conversation.last);
      } catch (error) {
        console.error(error);
      }
    }

    loadConversation();
  }, [selectedUser]);

  return {
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
  };
}