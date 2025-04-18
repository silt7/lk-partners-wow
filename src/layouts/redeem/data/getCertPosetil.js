export default async function GetCertPosetil() {
  try {
    const data = {
      page: 1,
      limit: 10,
      groupIds: ["visited"],
      allIds: [21],
    };
    const response = await fetch(
      "/restapi/certificate.getPartnerCertificates",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const jsonData = await response.json();
    if (jsonData.result?.error) {
      return [];
    } else {
      return jsonData.result[0];
    }
  } catch (err) {
    console.error(err);
    return [];
  }
}
