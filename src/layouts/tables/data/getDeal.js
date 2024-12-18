import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function useDeals() {
  const [deals, setDeals] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getData();
        if (response) {
          setDeals(response);
        }
      } catch (error) {
        console.error(`Ошибка загрузки сделок:`, error);
      }
    }
    fetchData();
  }, []);

  return deals;
}

async function getData(filter={}, length=30, offset=0) {
  const data = {
    domain: window.MyDomain,
    cabinet: window.Cabinet,
    offset,
    length,
    filter,
    contactId: Cookies.get("contactid"),
    allIds: Cookies.get("allIds").split(','),
    token: Cookies.get("token"),
  };

  try {
    const response = await fetch(`/api/deal.getPartnerDeals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error("Ошибка получения данных:", error);
    return null;
  }
}
