import Cookies from "js-cookie";

export async function getDeals(filter = {}, length = 5, offset = 0) {
    const data = {
        domain: window.MyDomain,
        cabinet: window.Cabinet,
        offset,
        length,
        filter,
        contactId: Cookies.get("contactid"),
        allIds: Cookies.get("allIds")?.split(","),
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
        return jsonData.result; // Возвращаем объект с total и deals
    } catch (error) {
        console.error("Ошибка получения данных:", error);
        return null;
    }
}
