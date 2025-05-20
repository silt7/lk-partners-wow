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

const STATUS_DICTIONARY = {
  "DT1032_11:NEW": "Новый",
  "DT1032_11:PREPARATION": "Подтвержден",
  "DT1032_11:CLIENT": "Подтвержден",
  "DT1032_11:UC_5IFDUQ": "Ожидает оплаты",
  "DT1032_11:UC_YLGUCX": "Оплачен",
  "DT1032_11:SUCCESS": "Оплачен",
};

function Tables() {
  const contactId = Cookies.get("contactid");
  const [reconcilation, setReconcilation] = useState([]);

  const getStatusLabel = (statusCode) => {
    return STATUS_DICTIONARY[statusCode] || statusCode;
  };

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

      if (!response.ok) {
        throw new Error("Ошибка при получении сверок");
      }

      const jsonData = await response.json();
      // проверка на null/undefined
      setReconcilation(Array.isArray(jsonData.result) ? jsonData.result : []);

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
                      <th>Номер</th>
                      <th>Дата создания</th>
                      <th>Дата оплаты</th>
                      <th>Акт</th>
                      <th>Сумма</th>
                      <th>Статус</th>
                      <th>Сертификаты</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reconcilation?.map((cert) => (
                      <tr key={cert.ID}>
                        <td>{cert.ID}</td>
                        <td>{cert.CREATED_TIME}</td>
                        <td></td>
                        <td>
                          {cert.DOC_LINK ? <a href={cert.DOC_LINK}>Акт</a> : ""}
                        </td>
                        <td>{cert.OPPORTUNITY}</td>
                        <td>{getStatusLabel(cert.STAGE)}</td>
                        <td>
                          {cert.CERTIFICATES?.map((certificate) => (
                            <div key={certificate.ID}>
                              {certificate.ID} - {certificate.OPPORTUNITY}₽
                            </div>
                          ))}
                        </td>
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
