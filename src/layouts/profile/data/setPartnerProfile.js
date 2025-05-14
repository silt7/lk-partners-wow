import Cookies from "js-cookie";

/**
 * Функция для отправки данных партнера на сервер
 * @param {Object} formData - Данные формы (TITLE, DESCRIPTION, file)
 */
export async function setPartnerProfile(formData) {
    const contactId = Cookies.get("contactid");
    const token = Cookies.get("token");

    if (!contactId || !token) {
        throw new Error("Отсутствуют данные авторизации");
    }

    // Чтение файла как base64
    let fileData = null;
    if (formData.file) {
        const file = formData.file;
        const reader = new FileReader();

        fileData = {
            fileName: file.name,
            fileContent: await new Promise((resolve, reject) => {
                reader.onload = () => resolve(reader.result.split(",")[1]); // Получаем только base64
                reader.onerror = error => reject(error);
                reader.readAsDataURL(file);
            }),
        };
    }

    const partnerData = {
        name: formData.TITLE,
        info: formData.DESCRIPTION,
        ...(fileData && { file: fileData }), // Добавляем файл, если он есть
    };

    const requestData = {
        contactId,
        token,
        partnerData,
    };

    const response = await fetch("/restapi/profile.setPartnerProfile", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка сети: ${response.status} — ${errorText}`);
    }

    const json = await response.json();
    return json;
}