import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DealsTable from "layouts/tables/DealsTable";
import { NEW_REQUEST_STAGES } from "layouts/tables/data/newRequestStages";

function NewRequests() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={{ xs: 2, md: 5 }} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="warning"
                borderRadius="lg"
                coloredShadow="warning"
              >
                <MDTypography variant="h6" color="white">
                  Новые заявки
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DealsTable
                  fixedGroupIds={NEW_REQUEST_STAGES}
                  hideFilters
                  emptyStateText="Новых заявок пока нет"
                  autoRefreshInterval={60000}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default NewRequests;
