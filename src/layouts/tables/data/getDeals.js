import Cookies from "js-cookie";

export async function getDeals(
  filter = {},
  length = 5,
  offset = 0,
  requestStage
) {
  // const data = {
  //   domain: window.MyDomain,
  //   cabinet: window.Cabinet,
  //   offset,
  //   length,
  //   filter,
  //   contactId: Cookies.get("contactid"),
  //   allIds: Cookies.get("allIds")?.split(","),
  //   token: Cookies.get("token"),
  // };
  const allIds = Cookies.get("allIds")?.split(",");
  const data = {
    page: offset,
    limit: length,
    order: "DESC",
    groupIds: requestStage,
    allIds: allIds,
    filters: filter,
  };
  try {
    const response = await fetch(
      `/restapi/certificate.getPartnerCertificates`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const jsonData = await response.json();
    return jsonData.result.error === "Certificates not found"
      ? (alert("Сертификат не найден"), null)
      : jsonData.result;
  } catch (error) {
    console.error("Ошибка получения данных:", error);
    return null;
  }
}
