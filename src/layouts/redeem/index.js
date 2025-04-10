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
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import CertTable from "./data/certTable";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Tables() {
  const query = useQuery();
  const [code, setCode] = useState("");
  const [certificateData, setCertificateData] = useState(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearch = async () => {
    try {
      const data = {
        code: code,
      };
      const response = fetch("/restapi/certificates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((jsonData) => {
          return jsonData.result;
        })
        .catch((error) => console.error("Ошибка получения данных:", error));
      if (!response.ok) {
        const sampleData = {
          number: "000",
          name: "Пример сертификата",
          amount: "0",
          redemptionDate: "2023-01-01",
        };
        setCertificateData(sampleData);
        //throw new Error("Сертификат не найден");
      }
      setCertificateData(response);
      setError("");
      handleOpen();
    } catch (err) {
      setError(err.message);
      setCertificateData(null);
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
                  Погашение сертификата
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <MDBox mx={2}>
                  <MDInput
                    label="Номер сертификата"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <MDButton
                    variant="gradient"
                    color="info"
                    size="medium"
                    onClick={handleSearch}
                  >
                    Найти
                  </MDButton>
                  {error && (
                    <MDTypography variant="caption" color="error">
                      {error}
                    </MDTypography>
                  )}
                </MDBox>
                <MDBox mx={2}>
                  <MDTypography variant="overline" color="text">
                    Введите номер сертификата для погашения или сканируйте QR
                  </MDTypography>
                </MDBox>
              </MDBox>
              <CertTable />
              <MDBox mx={2}>
                <MDButton variant="gradient" color="info" size="medium">
                  Создать сверку
                </MDButton>
                <MDTypography variant="overline" color="text">
                  Сертификаты можно отправлять раз в две недели
                </MDTypography>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ p: 4, bgcolor: "background.paper", borderRadius: 1 }}>
          {certificateData ? (
            <div>
              <MDTypography variant="h6">Данные сертификата</MDTypography>
              <MDTypography variant="body1">
                {JSON.stringify(certificateData)}
              </MDTypography>
              <MDButton
                variant="gradient"
                color="info"
                size="medium"
                onClick={() => alert("Сертификат погашен!")}
              >
                Погасить сертификат
              </MDButton>
            </div>
          ) : (
            <MDTypography variant="body1" color="error">
              Сертификат не найден
            </MDTypography>
          )}
        </Box>
      </Modal>
    </DashboardLayout>
  );
}

export default Tables;
