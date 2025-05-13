import MDBox from 'components/MDBox';

import { NotificationChannels } from './NotificationChannels';
import { Documents } from './Documents';

export const DocumentsAndNotificationChannels = () => {
    return (
        <MDBox
            bgColor="light"
            shadow="xl"
            borderRadius="lg"
            px={2}
            py={1}
            mt={2}
            color="light"
        >
           <NotificationChannels/>
           <Documents/>
        </MDBox>
    );
};
