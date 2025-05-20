import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
};

const CertificateModal = ({ open, onClose, certificateData, onRedeem }) => {
    if (!certificateData) return null;

    const { result } = certificateData;
    const { CONTACTS, SERVICE, OPPORTUNITY, SCHEDULE_TIME, NUMBER, NAME } = result;

    // Extract currency and amount
    const [amount, currency] = OPPORTUNITY ? OPPORTUNITY.split("|") : ["", ""];
    const formattedAmount = amount ? parseInt(amount).toLocaleString() : "";

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <MDBox mb={3}>
                    <MDTypography variant="h5" fontWeight="medium">
                        Данные сертификата
                    </MDTypography>
                    <Divider sx={{ my: 2 }} />
                </MDBox>

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <MDTypography variant="caption" fontWeight="medium" color="text">
                            Номер сертификата:
                        </MDTypography>
                    </Grid>
                    <Grid item xs={6}>
                        <MDTypography variant="caption" fontWeight="regular">
                            {NUMBER}
                        </MDTypography>
                    </Grid>

                    <Grid item xs={6}>
                        <MDTypography variant="caption" fontWeight="medium" color="text">
                            Имя получателя:
                        </MDTypography>
                    </Grid>
                    <Grid item xs={6}>
                        <MDTypography variant="caption" fontWeight="regular">
                            {NAME}
                        </MDTypography>
                    </Grid>

                    <Grid item xs={6}>
                        <MDTypography variant="caption" fontWeight="medium" color="text">
                            Услуга:
                        </MDTypography>
                    </Grid>
                    <Grid item xs={6}>
                        <MDTypography variant="caption" fontWeight="regular">
                            {SERVICE}
                        </MDTypography>
                    </Grid>

                    <Grid item xs={6}>
                        <MDTypography variant="caption" fontWeight="medium" color="text">
                            Сумма:
                        </MDTypography>
                    </Grid>
                    <Grid item xs={6}>
                        <MDTypography variant="caption" fontWeight="regular">
                            {formattedAmount} {currency}
                        </MDTypography>
                    </Grid>

                    <Grid item xs={6}>
                        <MDTypography variant="caption" fontWeight="medium" color="text">
                            Дата:
                        </MDTypography>
                    </Grid>
                    <Grid item xs={6}>
                        <MDTypography variant="caption" fontWeight="regular">
                            {new Date(SCHEDULE_TIME).toLocaleDateString()}
                        </MDTypography>
                    </Grid>

                    {CONTACTS?.EMAILS?.length > 0 && (
                        <>
                            <Grid item xs={6}>
                                <MDTypography variant="caption" fontWeight="medium" color="text">
                                    Email:
                                </MDTypography>
                            </Grid>
                            <Grid item xs={6}>
                                <MDTypography variant="caption" fontWeight="regular">
                                    {CONTACTS.EMAILS[0]}
                                </MDTypography>
                            </Grid>
                        </>
                    )}

                    {CONTACTS?.PHONES?.length > 0 && (
                        <>
                            <Grid item xs={6}>
                                <MDTypography variant="caption" fontWeight="medium" color="text">
                                    Телефон:
                                </MDTypography>
                            </Grid>
                            <Grid item xs={6}>
                                <MDTypography variant="caption" fontWeight="regular">
                                    {CONTACTS.PHONES[0]}
                                </MDTypography>
                            </Grid>
                        </>
                    )}
                </Grid>

                <MDBox mt={4} display="flex" justifyContent="flex-start">
                    <MDButton variant="outlined" color="secondary" onClick={onClose} sx={{ mr: 2 }}>
                        Закрыть
                    </MDButton>
                    <MDButton variant="gradient" color="info" onClick={onRedeem}>
                        Погасить сертификат
                    </MDButton>
                </MDBox>
            </Box>
        </Modal>
    );
};

export default CertificateModal;