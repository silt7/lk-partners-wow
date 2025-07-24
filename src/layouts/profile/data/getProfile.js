import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

// Общая функция для получения данных профиля
export const fetchProfileData = async (cabinet = "partner") => {
  const data = {
    cabinet: cabinet,
    contactId: Cookies.get("contactid"),
    token: Cookies.get("token"),
  };
  try {
    const response = await fetch("/restapi/profile.getProfile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const jsonData = await response.json();
    return jsonData.result;
  } catch (error) {
    console.error("Ошибка получения данных:", error);
    return null;
  }
};

// Хук для использования в компонентах
export default function GetProfile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetchProfileData();
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
