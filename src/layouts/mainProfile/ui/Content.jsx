import Grid from '@mui/material/Grid';

import { GeneralInfoSection } from './GeneralInfoSection';
import { DocumentsAndNotificationChannels } from './DocumentsAndNotificationChannels/DocumentsAndNotificationChannels';

export const Content = ({mainInfo}) => {
    return (
        <Grid
            container
            spacing={2}
            sx={{
                justifyContent: 'center',
            }}
        >
            <Grid item xs={6}>
                <GeneralInfoSection mainInfo={mainInfo}/>
            </Grid>
            <Grid item xs={6}>
                <DocumentsAndNotificationChannels />
            </Grid>
        </Grid>
    );
};
