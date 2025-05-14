import Grid from "@mui/material/Grid";

import { GeneralInfoSection } from "./GeneralInfoSection";
import { DocumentsAndNotificationChannels } from "./DocumentsAndNotificationChannels/DocumentsAndNotificationChannels";

export const Content = ({ mainInfo, schedule, requisites, additionalInfo }) => {
  return (
    <Grid
      container
      spacing={2}
      sx={{
        justifyContent: "center",
      }}
    >
      <Grid item xs={6}>
        <GeneralInfoSection
          mainInfo={mainInfo}
          schedule={schedule}
          requisites={requisites}
          additionalInfo={additionalInfo}
        />
      </Grid>
      <Grid item xs={6}>
        <DocumentsAndNotificationChannels />
      </Grid>
    </Grid>
  );
};
