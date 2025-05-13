import { useState, useEffect } from "react";
import { getDeals } from "./getDeals";

export default function useDeals() {
  const [deals, setDeals] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const length = 5; // Количество сделок за один запрос

  useEffect(() => {
    loadDeals();
  }, []);

  async function loadDeals(page) {
    if (loading || (total > 0 && deals.length >= total)) return;

    setLoading(true);
    if (page == undefined) {
      page = 1;
    }

    try {
      const response = await getDeals({}, length, page);
      if (response) {
        setDeals(response.data);
        setTotal(response.pagination.total_items);
        setCurrentPage(response.pagination.current_page);
        setTotalPages(response.pagination.total_pages);
      }
    } catch (error) {
      console.error(`Ошибка загрузки сделок:`, error);
    } finally {
      setLoading(false);
    }
  }

  return {
    deals,
    loadDeals,
    total,
    currentPage,
    totalPages,
    loading,
    hasMore: deals.length < total,
  };
}
