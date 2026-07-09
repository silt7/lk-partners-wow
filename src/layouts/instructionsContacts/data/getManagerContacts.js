import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export function normalizeManagerContactsContent(rawValue) {
  if (!rawValue) return "";

  if (typeof rawValue === "string") {
    return rawValue.trim();
  }

  if (Array.isArray(rawValue)) {
    return rawValue
      .map((item) => normalizeManagerContactsContent(item))
      .filter(Boolean)
      .join("");
  }

  if (typeof rawValue === "object") {
    const content =
      rawValue.html ||
      rawValue.content ||
      rawValue.DESCRIPTION ||
      rawValue.TEXT ||
      rawValue.text ||
      rawValue.value;

    if (content) {
      return normalizeManagerContactsContent(content);
    }
  }

  return "";
}

export async function fetchManagerContacts() {
  const token = Cookies.get("token");

  if (!token) {
    throw new Error("Отсутствует token в куках");
  }

  const response = await fetch("/restapi/page.getManagerContacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cabinet: "partner",
      token,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ошибка сети: ${response.status} ${response.statusText}`);
  }

  console.log(response);
  const json = await response.json();

  if (!json || json.result === undefined) {
    throw new Error("Неверная структура данных от сервера");
  }

  return normalizeManagerContactsContent(json.result);
}

export default function useGetManagerContacts() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadManagers() {
      try {
        const data = await fetchManagerContacts();
        setContent(data);
      } catch (err) {
        console.error(err);
        setError("Не удалось загрузить контакты менеджеров");
      } finally {
        setIsLoading(false);
      }
    }

    loadManagers();
  }, []);

  return { content, isLoading, error };
}
