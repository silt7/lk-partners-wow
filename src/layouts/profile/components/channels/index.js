import React, { useState, useEffect } from "react";
import { getNotificationChannels } from "../../data/getNotificationChannels";
import MDTypography from "../../../../components/MDTypography";
import MDBox from "../../../../components/MDBox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Cookies from "js-cookie";

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
      await fetch("/restapi/profile.setNotificationChannels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contactId: Cookies.get("contactid") || "",
          channels: channelIds,
          token: Cookies.get("token") || "",
        }),
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
          sx={{
            display: "flex",
            alignItems: "flex-start",
            margin: 0,
            "& .MuiFormControlLabel-label": {
              marginTop: "12px",
            },
          }}
          control={
            <Checkbox
              checked={activeChannels.includes(channel.name)}
              onChange={() => handleChannelChange(channel.name)}
            />
          }
          label={
            channel.name === "WA" ? (
              <MDBox sx={{ display: "flex", flexDirection: "column" }}>
                {channel.name}
                <MDTypography variant="caption" color="text">
                  Чтобы оповещения заработали нужно подписаться{" "}
                  <a
                    href="https://api.whatsapp.com/send/?phone=79291580047&text=start&type=phone_number&app_absent=0"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WOWlife WB
                  </a>{" "}
                  отправив start в первом сообщении
                </MDTypography>
              </MDBox>
            ) : channel.name === "TG" ? (
              <MDBox sx={{ display: "flex", flexDirection: "column" }}>
                {channel.name}
                <MDTypography variant="caption" color="text">
                  Чтобы оповещения заработали нужно подписаться{" "}
                  <a
                    href="https://t.me/wowlifepartner_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WOWlife Bot
                  </a>{" "}
                </MDTypography>
              </MDBox>
            ) : (
              channel.name
            )
          }
        />
      ))}
    </MDBox>
  );
}
