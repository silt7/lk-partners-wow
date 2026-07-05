import React, { useState, useEffect } from "react";
import { getNotificationChannels } from "../../data/getNotificationChannels";
import MDTypography from "../../../../components/MDTypography";
import MDBox from "../../../../components/MDBox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Cookies from "js-cookie";

const AVAILABLE_CHANNELS = [
  { name: "Max" },
  { name: "WA" },
  { name: "TG" },
  { name: "SMS" },
  { name: "email" },
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

      <MDTypography variant="body2" color="text" sx={{ mt: 1, mb: 1 }}>
        Если вы хотите получать оповещения по заявкам — выберите один или
        несколько пунктов ниже:
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
              </MDBox>
            ) : channel.name === "TG" ? (
              <MDBox sx={{ display: "flex", flexDirection: "column" }}>
                {channel.name}
                <MDTypography variant="caption" color="text">
                  Чтобы оповещения заработали, нужно написать в{" "}
                  <a
                    href="https://t.me/wowlifepartner_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    бот
                  </a>{" "}
                  название вашей компании, менеджер подключит вас
                </MDTypography>
              </MDBox>
            ) : channel.name === "Max" ? (
              <MDBox sx={{ display: "flex", flexDirection: "column" }}>
                {channel.name}
                <MDTypography variant="caption" color="text">
                  Чтобы оповещения заработали, нужно написать в{" "}
                  <a
                    href="https://max.ru/id471610095635_1_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    бот
                  </a>{" "}
                  название вашей компании, менеджер подключит вас
                </MDTypography>
              </MDBox>
            ) : channel.name === "email" ? (
              <MDBox sx={{ display: "flex", flexDirection: "column" }}>
                {channel.name}
                <MDTypography variant="caption" color="text">
                  Пришлите адрес почты для получения оповещений нашему менеджеру
                  в тг{" "}
                  <a
                    href="https://t.me/wowlifepartners"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @wowlifepartners
                  </a>{" "}
                  или на почту{" "}
                  <a href="mailto:oplata@wowlife.club">oplata@wowlife.club</a>
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
