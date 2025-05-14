import React, { useState, useEffect } from "react";
import { getNotificationChannels } from "../../data/getNotificationChannels";
import MDTypography from "../../../../components/MDTypography";
import MDBox from "../../../../components/MDBox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";

const AVAILABLE_CHANNELS = [
  { name: "WA" },
  { name: "TG" },
  { name: "SMS" },
  { name: "email" },
  { name: "responsible" },
];

export default function ChannelsCard() {
  const [channels, setChannels] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChannels, setActiveChannels] = useState([]);

  const updateNotificationChannels = async (channelIds) => {
    try {
      await axios.post("/restapi/profile.setNotificationChannels", {
        contactId: 56565, // Здесь нужно передать актуальный contactId
        token: "4f4ce91faafb9b44dd03b514e5b5e2b6", // Здесь нужно передать актуальный token
        channels: channelIds,
      });
    } catch (err) {
      console.error("Ошибка при обновлении каналов:", err);
      setError("Не удалось обновить каналы уведомлений");
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getNotificationChannels();
        setChannels(data);
        setActiveChannels(data.map((channel) => channel.name));
      } catch (err) {
        setError("Не удалось загрузить каналы уведомлений");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleChannelChange = async (channelName) => {
    const newActiveChannels = activeChannels.includes(channelName)
      ? activeChannels.filter((name) => name !== channelName)
      : [...activeChannels, channelName];
    console.log(newActiveChannels);
    setActiveChannels(newActiveChannels);

    await updateNotificationChannels(newActiveChannels);
  };

  if (isLoading) {
    return <MDTypography>Загрузка каналов...</MDTypography>;
  }

  if (error) {
    return <MDTypography color="error">{error}</MDTypography>;
  }

  return (
    <MDBox>
      <MDTypography variant="h6" fontWeight="medium">
        Канал связи для уведомлений
      </MDTypography>

      {AVAILABLE_CHANNELS.map((channel) => (
        <FormControlLabel
          key={channel.name}
          control={
            <Checkbox
              checked={activeChannels.includes(channel.name)}
              onChange={() => handleChannelChange(channel.name)}
            />
          }
          label={channel.name}
        />
      ))}
    </MDBox>
  );
}
