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
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Billing page components
import Invoice from "layouts/billing/components/Invoice";

function Invoices() {
  return (
    <Card sx={{ height: "100%" }}>
      <MDBox
        pt={2}
        px={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <MDTypography variant="h6" fontWeight="medium">
          Выплаты
        </MDTypography>
        <MDButton variant="outlined" color="info" size="small">
          Показать все
        </MDButton>
      </MDBox>
      <MDBox p={2}>
        <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          <Invoice date="Май, 01, 2023" id="#MS-415646" price="₽18000" />
          <Invoice date="Март, 10, 2023" id="#RV-126749" price="₽25000" />
          <Invoice date="Апрель, 05, 2023" id="#QW-103578" price="₽1200" />
          <Invoice date="Январь, 25, 2023" id="#MS-415646" price="₽18000" />
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default Invoices;
