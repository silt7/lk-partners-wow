import Cookies from "js-cookie";

/**
 * Сохранение полей блока «Отчет агента»
 * @param {{ UF_CRM_1756729018221: string, UF_CRM_1684102807864: string }} fields
 */
export async function setAgentReport(fields) {
  const contactId = Cookies.get("contactid");
  const token = Cookies.get("token");

  if (!contactId || !token) {
    throw new Error("Отсутствуют данные авторизации");
  }

  const requestData = {
    contactId,
    token,
    UF_CRM_1756729018221: fields.UF_CRM_1756729018221,
    UF_CRM_1684102807864: fields.UF_CRM_1684102807864,
  };

  const response = await fetch("/restapi/profile.setAgentReport", {
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
