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
import { useEffect, useState } from "react";
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
import Cookies from "js-cookie";

function Tables() {
  const contactId = Cookies.get("contactid");
  const [reconcilation, setReconcilation] = useState([]);

  useEffect(() => {
    getReconcilation();
  }, []);
  const getReconcilation = async () => {
    try {
      const data = {
        allIds: [contactId],
      };
      const response = await fetch("/restapi/certificate.getVerifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const jsonData = await response.json();
      setReconcilation(jsonData.result);
      if (!response.ok) {
        throw new Error("Ошибка при получении сверок");
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Сверки
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <table>
                  <thead>
                    <tr>
                      <th>Номер Сертификата</th>
                      <th>Имя Посетителя</th>
                      <th>Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reconcilation?.map((cert) => (
                      <tr key={cert.ID}>
                        <td>{cert.ID}</td>
                        <td>{cert.OPPORTUNITY}</td>
                        <td>{cert.STAGE}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
