import { useState } from 'react';

import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import Checkbox from '@mui/material/Checkbox';
import { FormControlLabel, FormGroup } from '@mui/material';

import { notificationChannelsConfig } from '../../lib/config';

export const NotificationChannels = () => {
    // TODO ПО ЧЕКБОКСАМ
    // TODO СОСТОЯНИЕ ЧЕКБОКСОВ БУДЕТ ПРИХОДИТЬ С БЭКА?
    const [notificationChannels, setNotificationChannels] = useState(
        notificationChannelsConfig
    );

    const handleCheckboxClick = (key, value) => {
        setNotificationChannels((prev) => ({ ...prev, [key]: !value }));
    };

    return (
        <MDBox
            bgColor="dark"
            shadow="lg"
            borderRadius="lg"
            px={2}
            py={1}
            color="light"
        >
            <MDTypography color="light" variant="h3">
                Канал связи для уведоблений
            </MDTypography>
            <FormGroup>
                {Object.entries(notificationChannels).map(([key, value]) => (
                    <FormControlLabel
                        key={key}
                        control={
                            <Checkbox
                                checked={value}
                                onChange={() => handleCheckboxClick(key, value)}
                            />
                        }
                        label={
                            <MDTypography variant="body1" color="light">
                                {key}
                            </MDTypography>
                        }
                    />
                ))}
            </FormGroup>
        </MDBox>
    );
};
