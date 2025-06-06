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
import Cookies from "js-cookie";
import CertificateModal from "./components/certificateModal";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Tables() {
  const query = useQuery();
  const [code, setCode] = useState("");
  const [number, setNumber] = useState("");
  const [certificateData, setCertificateData] = useState(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [daysLeft, setDaysLeft] = useState(14);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const contactId = Cookies.get("contactid");

  const [certData, setCertData] = useState([]);

  useEffect(() => {
    query.get("number") && setNumber(query.get("number"));
    getDaysLeft();
  }, []);

  const getDaysLeft = async () => {
    try {
      const data = {
        allIds: [contactId],
      };
      const response = await fetch(
        "/restapi/certificate.getLastVerificationDate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const jsonData = await response.json();
      if (!response.ok) {
        throw new Error("Ошибка при получении даты последней проверки");
      }
      if (jsonData.result?.error == "Verifications not found") {
        setDaysLeft(0);
      } else {
        setDaysLeft(jsonData.result.daysLeft);
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleSearch = async () => {
    try {
      const data = {
        number: number,
        code: code,
        allIds: [contactId],
      };
      const response = await fetch(
        "/restapi/certificate.getCertificateForRedeem",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const jsonData = await response.json();
      if (!response.ok || jsonData.result?.error) {
        throw new Error(jsonData.result?.error || "Сертификат не найден");
      }
      setCertificateData(jsonData);
      setError("");
      handleOpen();
    } catch (err) {
      setError(err.message);
      setCertificateData(null);
    }
  };

  const handleRedeem = async () => {
    try {
      const data = {
        certificateId: certificateData.result.ID,
      };
      const response = await fetch("/restapi/certificate.redeemCertificate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Ошибка при погашении сертификата");
      }
      const jsonData = await response.json();
      jsonData.result
        ? alert("Сертификат успешно погашен!")
        : alert("Сертификат не в статусе подтвержден!");
      handleClose();
      window.location.reload();
    } catch (err) {
      alert(err.message);
    }
  };

  const createVerification = async () => {
    try {
      const data = {
        allIds: [contactId],
      };
      const response = await fetch("/restapi/certificate.createVerification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      window.location.href = "/reconciliation";
      if (!response.ok) {
        throw new Error("Ошибка при создании сверки");
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  };

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
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Погашение сертификата
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <MDBox mx={2} mb={1}>
                  <MDTypography variant="button" color="text">
                    Введите номер сертификата для погашения
                    {/* или сканируйте QR */}
                  </MDTypography>
                </MDBox>
                <MDBox mx={2}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={2}>
                      <MDInput
                        label="Номер сертификата"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <MDInput
                        label="Код сертификата"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <MDButton
                        variant="gradient"
                        color="info"
                        size="medium"
                        onClick={handleSearch}
                        fullWidth
                      >
                        Найти
                      </MDButton>
                    </Grid>
                  </Grid>
                  {error && (
                    <MDTypography
                      variant="caption"
                      color="error"
                      display="block"
                      mt={1}
                    >
                      {error.includes("not found")
                        ? "Сертификат не найден"
                        : error}
                    </MDTypography>
                  )}
                </MDBox>
              </MDBox>
              <CertTable />
              <MDBox mx={2} mb={2}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm="auto">
                    {daysLeft != 0 ? (
                      <MDButton
                        variant="gradient"
                        color="info"
                        size="medium"
                        disabled
                      >
                        Создать сверку
                      </MDButton>
                    ) : (
                      <MDButton
                        variant="gradient"
                        color="info"
                        size="medium"
                        onClick={createVerification}
                      >
                        Создать сверку
                      </MDButton>
                    )}
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm
                    sx={{
                      paddingTop: { xs: "0 !important", sm: "16px !important" },
                    }}
                  >
                    <MDTypography variant="button" color="text">
                      {daysLeft <= 14
                        ? `Новая сверка будет доступна через ${daysLeft} дней`
                        : "Сертификаты можно отправлять раз в две недели"}
                    </MDTypography>
                  </Grid>
                </Grid>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            p: 4,
            bgcolor: "background.paper",
            borderRadius: 1,
          }}
        >
          <DashboardLayout>
            <CertificateModal
              open={open}
              onClose={handleClose}
              certificateData={certificateData}
              onRedeem={handleRedeem}
            />
          </DashboardLayout>
          {/*{certificateData ? (*/}
          {/*  <DashboardLayout>*/}
          {/*    <CertificateModal*/}
          {/*      open={open}*/}
          {/*      onClose={handleClose}*/}
          {/*      certificateData={certificateData}*/}
          {/*      onRedeem={handleRedeem}*/}
          {/*    />*/}
          {/*  </DashboardLayout>*/}
          {/*) : (*/}
          {/*  // <div>*/}
          {/*  //   <MDTypography variant="h6">Данные сертификата</MDTypography>*/}
          {/*  //   <MDTypography variant="body1">*/}
          {/*  //     {JSON.stringify(certificateData)}*/}
          {/*  //   </MDTypography>*/}
          {/*  //   <MDButton*/}
          {/*  //     variant="gradient"*/}
          {/*  //     color="info"*/}
          {/*  //     size="medium"*/}
          {/*  //     onClick={handleRedeem}*/}
          {/*  //   >*/}
          {/*  //     Погасить сертификат*/}
          {/*  //   </MDButton>*/}
          {/*  // </div>*/}
          {/*  <MDTypography variant="body1" color="error">*/}
          {/*    Сертификат не найден*/}
          {/*  </MDTypography>*/}
          {/*)}*/}
        </Box>
      </Modal>
    </DashboardLayout>
  );
}

export default Tables;
