/**
 =========================================================
 * Material Dashboard 2 React - v2.1.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/material-dashboard-react
 * Copyright 2022 Creative Tim (https://www.creative-tim.com)

 Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MasterCard from "../../examples/Cards/MasterCard";
import DefaultInfoCard from "../../examples/Cards/InfoCards/DefaultInfoCard";
import PaymentMethod from "../billing/components/PaymentMethod";
import Invoices from "../billing/components/Invoices";

function Tables() {
  return (
    <DashboardLayout>
        <DashboardNavbar absolute isMini />
        <MDBox mt={8}>
            <MDBox mb={3}>
                <Grid container spacing={3}>
                    <Grid item xs={12} lg={8}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} xl={6}>
                                <MasterCard
                                    number={5555555555555555}
                                    holder="ILIA VIKTOROV"
                                    expires="11/23"
                                />
                            </Grid>
                            <Grid item xs={12} md={6} xl={3}>
                                <DefaultInfoCard
                                    icon="account_balance"
                                    title="Карта"
                                    description="Всего зачислено"
                                    value="₽70 000"
                                />
                            </Grid>
                            <Grid item xs={12} md={6} xl={3}>
                                <DefaultInfoCard
                                    icon="account_balance"
                                    title="Счет"
                                    description="Всего зачислено"
                                    value="₽30 000"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <PaymentMethod />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <Invoices />
                    </Grid>
                </Grid>
            </MDBox>
            {/* <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <BillingInformation />
            </Grid>
            <Grid item xs={12} md={5}>
              <Transactions />
            </Grid>
          </Grid>
        </MDBox> */}
        </MDBox>
      {/*<DashboardNavbar />*/}
      {/*<MDBox pt={6} pb={3}>*/}
      {/*  <Grid container spacing={6}>*/}
      {/*    <Grid item xs={12}>*/}
      {/*      <Card>*/}
      {/*        <MDBox*/}
      {/*          mx={2}*/}
      {/*          mt={-3}*/}
      {/*          py={3}*/}
      {/*          px={2}*/}
      {/*          variant="gradient"*/}
      {/*          bgColor="info"*/}
      {/*          borderRadius="lg"*/}
      {/*          coloredShadow="info"*/}
      {/*        >*/}
      {/*          <MDTypography variant="h6" color="white">*/}
      {/*            Сверки*/}
      {/*          </MDTypography>*/}
      {/*        </MDBox>*/}
      {/*        <MDBox pt={3}></MDBox>*/}
      {/*      </Card>*/}
      {/*    </Grid>*/}
      {/*  </Grid>*/}
      {/*</MDBox>*/}
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
