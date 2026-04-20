import { useCallback, useEffect, useRef, useState } from "react";
import { message } from "antd";

const useAsyncList = ({ loadItems, errorMessage = "Failed to load data" }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadItemsRef = useRef(loadItems);
  const errorMessageRef = useRef(errorMessage);

  useEffect(() => {
    loadItemsRef.current = loadItems;
    errorMessageRef.current = errorMessage;
  }, [errorMessage, loadItems]);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const response = await loadItemsRef.current();
      setItems(response.data || []);
    } catch (error) {
      message.error(errorMessageRef.current);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    items,
    loading,
    reload,
    setItems,
  };
};

export default useAsyncList;
