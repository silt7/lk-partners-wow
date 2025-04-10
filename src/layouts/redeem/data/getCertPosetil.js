export default function GetCertPosetil() {
  return getSampleCerts();

  async function getData() {
    const data = {
      stage: "posetil",
    };
    const response = fetch("/restapi/getCert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((jsonData) => {
        return jsonData.result;
      })
      .catch((error) => console.error("Ошибка получения данных:", error));

    return response;
  }

  function getSampleCerts() {
    return [
      {
        number: "001",
        name: "Полет на воздушном шаре",
        amount: "5000",
        redemptionDate: "2023-01-01",
      },
      {
        number: "002",
        name: "Уроки верховой езды",
        amount: "3000",
        redemptionDate: "2023-02-15",
      },
      {
        number: "003",
        name: "Мастер-класс по кулинарии",
        amount: "4000",
        redemptionDate: "2023-03-10",
      },
      {
        number: "004",
        name: "Прыжок с парашютом",
        amount: "7000",
        redemptionDate: "2023-04-20",
      },
      {
        number: "005",
        name: "СПА-процедуры",
        amount: "6000",
        redemptionDate: "2023-05-05",
      },
    ];
  }
}
