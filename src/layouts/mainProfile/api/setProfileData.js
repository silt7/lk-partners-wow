import Cookies from "js-cookie";

export function setProfileData() {
  // TODO отправляем данные для изменения из хедера и контента
  // Request body required
  // {
  //     "contactId": 56565,
  //     "token": "4f4ce91faafb9b44dd03b514e5b5e2b6",
  //     "cabinet": "client",

  // "address": "Люберцы, Калараш д. 2",
  // "phone": "+79509504545",
  // "email": "some@mail.ru",
  // "name": "Vasya",
  // "namelast": "Pupkin",
  // "photo": "images/avatar.svg"
  // }
  const data = {
    cabinet: window.Cabinet,
    contactId: Cookies.get("contactid"),
    token: Cookies.get("token"),

    address: "Люберцы, Калараш д. 2",
    phone: "+79509504545",
    email: "some@mail.ru",
    name: "Vasya",
    namelast: "Pupkin",
    photo: "images/avatar.svg",
  };

  const response = fetch("/restapi/profile.setprofile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((jsonData) => {
      return jsonData.result;
    })
    .catch((error) => console.error("Ошибка получения данных:", error));

  return response;
}
