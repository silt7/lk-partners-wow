import Cookies from 'js-cookie';

export function getProfileData() {
    const data = {
        cabinet: window.Cabinet,
        contactId: Cookies.get('contactid'),
        token: Cookies.get('token'),
    };
    const response = fetch('/restapi/profile.getProfile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((jsonData) => {
            return jsonData.result;
        })
        .catch((error) => console.error('Ошибка получения данных:', error));

    return response;
}
