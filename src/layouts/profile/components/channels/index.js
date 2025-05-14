import React, { useState, useEffect } from "react";
import { getNotificationChannels } from "../../data/getNotificationChannels";
import MDTypography from "../../../../components/MDTypography";
import MDBox from "../../../../components/MDBox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

export default function ChannelsCard() {
    const [channels, setChannels] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getNotificationChannels();
                setChannels(data);
            } catch (err) {
                setError("Не удалось загрузить каналы уведомлений");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

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

            {channels.map((channel) => (
                <FormControlLabel
                    key={channel.id}
                    control={<Checkbox checked={false} disabled />}
                    label={channel.name}
                />
            ))}
        </MDBox>
    );
}