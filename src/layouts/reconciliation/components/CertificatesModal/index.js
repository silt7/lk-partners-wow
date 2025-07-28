import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
  maxHeight: "80vh",
  overflow: "auto",
};

const CertificatesModal = ({ open, onClose, certificates }) => {
  if (!certificates || certificates.length === 0) {
    return (
      <Modal open={open} onClose={onClose}>
        <Box sx={{ ...style, width: { xs: "90%", md: "600px" } }}>
          <MDBox mb={3}>
            <MDTypography variant="h5" fontWeight="medium">
              Сертификаты
            </MDTypography>
            <Divider sx={{ my: 2 }} />
          </MDBox>
          <MDTypography variant="body2" color="text" textAlign="center">
            Сертификаты отсутствуют
          </MDTypography>
          <MDBox mt={3} display="flex" justifyContent="center">
            <MDButton variant="outlined" color="secondary" onClick={onClose}>
              Закрыть
            </MDButton>
          </MDBox>
        </Box>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...style, width: "95%" }}>
        <MDBox mb={3}>
          <MDTypography variant="h5" fontWeight="medium">
            Сертификаты
          </MDTypography>
          <Divider sx={{ my: 2 }} />
        </MDBox>

        <MDBox>
          {certificates.map((certificate, index) => (
            <Card key={certificate.ID || index} sx={{ mb: 2, p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={2}>
                  <MDTypography
                    variant="caption"
                    fontWeight="medium"
                    color="text"
                  >
                    Номер:
                  </MDTypography>
                  <MDTypography variant="body2" fontWeight="regular">
                    <a href={`/tables/${certificate.ID}`}>
                      {certificate.NUMBER || certificate.ID || "Не указано"}
                    </a>
                  </MDTypography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDTypography
                    variant="caption"
                    fontWeight="medium"
                    color="text"
                  >
                    Название:
                  </MDTypography>
                  <MDTypography variant="body2" fontWeight="regular">
                    {certificate.OPTIONS || certificate.ID || "Не указано"}
                  </MDTypography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <MDTypography
                    variant="caption"
                    fontWeight="medium"
                    color="text"
                  >
                    Сумма:
                  </MDTypography>
                  <MDTypography variant="body2" fontWeight="regular">
                    {certificate.OPPORTUNITY || "Не указано"}
                  </MDTypography>
                </Grid>
              </Grid>
            </Card>
          ))}
        </MDBox>

        <MDBox mt={3} display="flex" justifyContent="center">
          <MDButton variant="outlined" color="secondary" onClick={onClose}>
            Закрыть
          </MDButton>
        </MDBox>
      </Box>
    </Modal>
  );
};

export default CertificatesModal;
