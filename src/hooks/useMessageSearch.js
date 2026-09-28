import { useEffect, useState } from "react";
import { searchConversation } from "../services/messageService";

export function useMessageSearch(selectedUser, search) {

  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {

    if (!selectedUser) return;

    if (search.trim() === "") {
      setSearchResults([]);
      return;
    }

    const timeout = setTimeout(async () => {

      const results = await searchConversation(
        selectedUser.id,
        search
      );

      setSearchResults(results);

    }, 400);

    return () => clearTimeout(timeout);

  }, [search, selectedUser]);

  return {
    searchResults,
  };

}