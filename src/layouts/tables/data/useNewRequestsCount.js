import { useState, useEffect, useCallback } from "react";
import { getDeals } from "./getDeals";
import { NEW_REQUEST_STAGES } from "./newRequestStages";

const REFRESH_INTERVAL = 60000;

export default function useNewRequestsCount(autoRefresh = true) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCount = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getDeals({}, 1, 1, NEW_REQUEST_STAGES);
      if (response) {
        setCount(response.pagination?.total_items ?? 0);
      }
    } catch (error) {
      console.error("Ошибка загрузки количества новых заявок:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCount();

    if (!autoRefresh) {
      return undefined;
    }

    const interval = setInterval(fetchCount, REFRESH_INTERVAL);
    const handleUpdate = () => fetchCount();
    window.addEventListener("new-requests-updated", handleUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener("new-requests-updated", handleUpdate);
    };
  }, [fetchCount, autoRefresh]);

  return { count, loading, refresh: fetchCount };
}
