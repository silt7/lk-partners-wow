import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import useGetManagerContacts from "layouts/instructionsContacts/data/getManagerContacts";

const MANAGERS_FALLBACK = {
  telegram: "https://t.me/wowlifepartners",
  email: "oplata@wowlife.club",
};

const DEFAULT_INSTRUCTION_DOCUMENTS = [
  {
    title: "Инструкция по работе в ЛК партнера WOWlife",
    url: `${process.env.PUBLIC_URL}/instructions/instruction-lk-work.pdf`,
  },
  {
    title: "Инструкция по погашению и оплатам в ЛК партнера WOWlife",
    url: `${process.env.PUBLIC_URL}/instructions/instruction-redeem-payments.pdf`,
  },
];

function InstructionsAndContacts() {
  const { content, isLoading, error } = useGetManagerContacts();

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h5" fontWeight="medium" mb={1}>
                  Инструкции по работе с ЛК
                </MDTypography>
                <MDTypography variant="button" color="text" mb={2} display="block">
                  Здесь размещаются документы по работе в личном кабинете.
                </MDTypography>
                <Divider sx={{ mb: 2 }} />

                <MDBox component="ol" sx={{ m: 0, pl: 2.5 }}>
                  {DEFAULT_INSTRUCTION_DOCUMENTS.map((doc) => (
                    <MDBox component="li" key={doc.url} sx={{ mb: 1 }}>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer">
                        {doc.title}
                      </a>
                    </MDBox>
                  ))}
                </MDBox>
              </MDBox>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h5" fontWeight="medium" mb={1}>
                  Контакты менеджеров WOWlife
                </MDTypography>
                <MDTypography variant="button" color="text" mb={2} display="block">
                  Для оперативной связи используйте контакты ниже.
                </MDTypography>
                <Divider sx={{ mb: 2 }} />

                {isLoading ? (
                  <MDTypography variant="button" color="text">
                    Загрузка контактов...
                  </MDTypography>
                ) : error ? (
                  <MDTypography variant="button" color="error">
                    {error}
                  </MDTypography>
                ) : content ? (
                  <MDBox
                    sx={{
                      color: "text.main",
                      fontSize: "0.875rem",
                      lineHeight: 1.75,
                      "& a": {
                        color: "info.main",
                        textDecoration: "none",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      },
                      "& b": {
                        fontWeight: 600,
                      },
                      "& i": {
                        fontStyle: "italic",
                      },
                    }}
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                ) : (
                  <MDTypography variant="button" color="text">
                    Контакты менеджеров пока не заполнены. Для связи:{" "}
                    <a href={MANAGERS_FALLBACK.telegram} target="_blank" rel="noopener noreferrer">
                      @wowlifepartners
                    </a>{" "}
                    или{" "}
                    <a href={`mailto:${MANAGERS_FALLBACK.email}`}>{MANAGERS_FALLBACK.email}</a>.
                  </MDTypography>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default InstructionsAndContacts;
