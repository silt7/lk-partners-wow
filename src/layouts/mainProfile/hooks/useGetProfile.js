import { useState, useEffect } from "react";
import { getProfileData } from "../api/getProfileData";
import { normalizeProfileData } from "../lib/utils";

export default function useGetProfile() {
  // TODO пытаюсь преобразовать данные к более удобному виду.
  // TODO пока не понятно, что делать с исходными данными.
  // TODO еще один вариант возвращать исощдные данные, а уже выше в Profile вызывать функцию, которая верент конкретные данные для конкретного блока
  const [profile, setProfile] = useState(null);
  const [formatedDataProfile, setFormatedDataProfile] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getProfileData();
        if (response !== null) {
          const normalizeData = normalizeProfileData(response.result);
          setFormatedDataProfile(normalizeData);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  return formatedDataProfile;
}
