
//
// export default function GetNotificationChannels() {
//     const [channels, setChannels] = useState(null);
//     useEffect(() => {
//         async function fetchData() {
//             try {
//                 const response = await getData();
//                 console.log('channels response', response)
//                 if (response !== null) {
//                     setChannels(response);
//                 }
//             } catch (error) {
//                 console.error(error);
//             }
//         }
//         fetchData();
//         // console.log('channels', channels)
//     }, []);
//
//     return channels;
// }
//
// function getData() {
//     const data = {
//         contactId: Cookies.get("contactid"),
//         token: Cookies.get("token"),
//     };
//     console.log('contactId', Cookies.get("contactid"))
//     console.log('token', Cookies.get("token"))
//     const response = fetch("/restapi/profile.getNotificationChannels", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//     })
//         .then((response) => response.json())
//         .then((jsonData) => {
//             return jsonData.result;
//         })
//         .catch((error) => console.error("Ошибка получения данных:", error));
//     return response;
// }


import Cookies from "js-cookie";

export async function getNotificationChannels() {
    const contactId = Cookies.get("contactid");
    const token = Cookies.get("token");

    if (!contactId || !token) {
        throw new Error("Отсутствуют contactid или token в куках");
    }

    const data = { contactId, token };

    const response = await fetch("/restapi/profile.getNotificationChannels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    console.log('response', response)

    if (!response.ok) {
        throw new Error(`Ошибка сети: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();

    console.log("Ответ от сервера:", json); // 👈 Отладка

    if (!json || !json.result || !Array.isArray(json.result.channels)) {
        throw new Error("Неверная структура данных от сервера");
    }

    return json.result.channels;
}

