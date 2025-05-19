export function setProfileData() {
  // TODO: создании новой задачи (форма)
  // Request body required
  // {
  //     "partnerData": {
  //     "name": "Soveren",
  //         "info": "Какой-то текст для модерации"
  //      }
  // }
  const data = {
    //TODO: нужно уточнить какие данные сюда вставлять (скорей всего из формы которую нужно создать на старницы профаил для создаинии задачи)
    partnerData: {
      name: "Soveren",
      info: "Какой-то текст для модерации",
    },
  };

  const response = fetch("/restapi/profile.setPartnerProfile", {
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
