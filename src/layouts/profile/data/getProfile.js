import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function GetProfile() {
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getData();
        if (response !== null) {
          setProfile(response);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  return profile;
}

function getData() {
  const data = {
    cabinet: window.Cabinet,
    contactId: Cookies.get("contactid"),
    token: Cookies.get("token"),
  };
  const response = fetch("/restapi/profile.getProfile", {
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
  //

  return response;
}
