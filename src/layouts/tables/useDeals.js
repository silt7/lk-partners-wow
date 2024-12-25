import { useState, useEffect } from "react";
import { getDeals } from "./getDeals";

export default function useDeals() {
    const [deals, setDeals] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const length = 30; // Количество сделок за один запрос

    useEffect(() => {
        loadDeals();
    }, []);

    async function loadDeals() {
        if (loading || (total > 0 && deals.length >= total)) return;

        setLoading(true);

        try {
            const response = await getDeals({}, length, offset);
            if (response) {
                setDeals((prevDeals) => [...prevDeals, ...response.deals]);
                setTotal(response.total);
                setOffset((prevOffset) => prevOffset + length);
            }
        } catch (error) {
            console.error(`Ошибка загрузки сделок:`, error);
        } finally {
            setLoading(false);
        }
    }

    return { deals, loadDeals, loading, hasMore: deals.length < total };
}
