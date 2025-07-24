import { useState, useEffect } from "react";
import { getDeals } from "./getDeals";

export default function useDeals(autoLoad = true) {
  const [deals, setDeals] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const length = 5; // Количество сделок за один запрос

  useEffect(() => {
    if (autoLoad) {
      loadDeals();
    }
  }, [autoLoad]);

  async function loadDeals(page, filters) {
    //if (loading || (total > 0 && deals.length >= total)) return;

    setLoading(true);
    if (page == undefined) {
      page = 1;
    }

    const requestFilters = {};

    if (filters?.certificateNumber) {
      requestFilters.certificate_number = {
        LIKE: `%${filters.certificateNumber}%`,
      };
    }

    if (filters?.phone) {
      requestFilters.contact_value = {
        LIKE: `%${filters.phone}%`,
      };
    }

    if (filters?.certificate_id) {
      requestFilters.certificate_id = {
        "=": filters.certificate_id,
      };
    }

    if (filters?.dateFrom && filters?.dateTo) {
      const formattedDateFrom = new Date(filters.dateFrom)
        .toISOString()
        .split("T")[0];
      const formattedDateTo = new Date(filters.dateTo)
        .toISOString()
        .split("T")[0];
      requestFilters.schedule_time = {
        BETWEEN: [formattedDateFrom, formattedDateTo],
      };
    }

    if (filters?.status) {
      requestFilters.stage_id = {
        EQUAL: filters.status,
      };
    }

    const requestStage = filters?.status
      ? [filters.status]
      : [
          "new",
          "waiting",
          "confirmed",
          "visited",
          "verification",
          "paid",
          "canceled",
          "notcome",
          "notrepaid",
        ];

    try {
      const response = await getDeals(
        requestFilters,
        length,
        page,
        requestStage
      );
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
