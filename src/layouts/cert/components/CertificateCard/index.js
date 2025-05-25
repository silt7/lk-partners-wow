// import React from "react";
// import { Card, CardContent, Typography } from "@mui/material";
// import MDBadge from "components/MDBadge";
// import MDBox from "components/MDBox";
//
// const CertificateCard = ({ data }) => {
//     if (!data) return null;
//
//     const {
//         ID,
//         TITLE,
//         OPPORTUNITY,
//         NAME,
//         SCHEDULE_TIME,
//         NUMBER,
//         CONTACTS,
//         STAGE,
//     } = data || {};
//
//
//     console.log('data', data)
//
//     // Форматирование суммы
//     const formatPrice = (priceStr) => {
//         if (!priceStr || typeof priceStr !== "string") return "Не указана";
//         const [amount, currency] = priceStr.split("|");
//         return `${amount || "0"} ${currency === "RUB" ? "руб." : currency || ""}`;
//     };
//
//     // Форматирование даты
//     const formatDate = (dateString) => {
//         if (!dateString) return "не указано";
//         try {
//             const date = new Date(dateString);
//             return date.toLocaleString("ru-RU", {
//                 year: "numeric",
//                 month: "2-digit",
//                 day: "2-digit",
//                 hour: "2-digit",
//                 minute: "2-digit",
//             });
//         } catch {
//             return "некорректная дата";
//         }
//     };
//
//     // Email и телефон
//     const email = CONTACTS?.EMAILS?.[0] ?? "не указан";
//     const phone = CONTACTS?.PHONES?.[0] ?? "не указан";
//
//     // Статус
//     const statusText = STAGE?.group_title || "Неизвестный статус";
//     const statusColor =
//         statusText === "подтверждён"
//             ? "success"
//             : statusText === "ожидает оплаты"
//                 ? "warning"
//                 : "secondary";
//
//     return (
//         <Card sx={{ boxShadow: 3, borderRadius: 2, p: 2 }}>
//             <CardContent>
//                 {/* Заголовок */}
//                 <Typography variant="h6" gutterBottom>
//                     {TITLE ? `Сертификат: ${TITLE}` : "Без названия"}
//                 </Typography>
//
//                 {/* Номер */}
//                 <MDBox mb={1}>
//                     <Typography variant="body2" color="text.secondary">
//                         <strong>Номер:</strong> {NUMBER || "не указан"}
//                     </Typography>
//                 </MDBox>
//
//                 {/* ID */}
//                 <MDBox mb={1}>
//                     <Typography variant="body2" color="text.secondary">
//                         <strong>ID:</strong> {ID != null ? ID : "не указан"}
//                     </Typography>
//                 </MDBox>
//
//                 {/* Клиент */}
//                 <MDBox mb={1}>
//                     <Typography variant="body2" color="text.secondary">
//                         <strong>Клиент:</strong> {NAME || "не указан"}
//                     </Typography>
//                 </MDBox>
//
//                 {/* Email */}
//                 <MDBox mb={1}>
//                     <Typography variant="body2" color="text.secondary">
//                         <strong>Email:</strong> {email}
//                     </Typography>
//                 </MDBox>
//
//                 {/* Телефон */}
//                 <MDBox mb={1}>
//                     <Typography variant="body2" color="text.secondary">
//                         <strong>Телефон:</strong> {phone}
//                     </Typography>
//                 </MDBox>
//
//                 {/* Дата записи */}
//                 <MDBox mb={1}>
//                     <Typography variant="body2" color="text.secondary">
//                         <strong>Дата записи:</strong> {formatDate(SCHEDULE_TIME)}
//                     </Typography>
//                 </MDBox>
//
//                 {/* Сумма */}
//                 <MDBox mb={1}>
//                     <Typography variant="body2" color="text.secondary">
//                         <strong>Сумма:</strong> {formatPrice(OPPORTUNITY)}
//                     </Typography>
//                 </MDBox>
//
//                 {/* Статус */}
//                 <MDBox mb={1}>
//                     <Typography variant="body2" color="text.secondary">
//                         <strong>Статус:</strong>{" "}
//                         <MDBadge badgeContent={statusText} color={statusColor} variant="gradient" size="sm" />
//                     </Typography>
//                 </MDBox>
//             </CardContent>
//         </Card>
//     );
// };
//
// export default CertificateCard;


import React, { useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import MDBadge from "components/MDBadge";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

const CertificateCard = ({ data }) => {
    const [openModal, setOpenModal] = useState(false);
    const [selectedDateTime, setSelectedDateTime] = useState("");

    if (!data) return null;

    const {
        ID,
        TITLE,
        OPPORTUNITY,
        NAME,
        SCHEDULE_TIME,
        NUMBER,
        CONTACTS,
        STAGE,
    } = data;

    // Функция определения статуса как в DealsTable
    const getStatusInfo = (stage) => {
        const statusMapping = {
            new: { statusColor: "warning", statusText: "Новый" },
            waiting: { statusColor: "warning", statusText: "Принят" },
            confirmed: { statusColor: "info", statusText: "Записан" },
            visited: { statusColor: "secondary", statusText: "Посетил" },
            verification: { statusColor: "primary", statusText: "Ожидание сверки" },
            paid: { statusColor: "success", statusText: "Оплачен" },
        };

        return statusMapping[stage.group_id] || {
            statusColor: "dark",
            statusText: "Неизвестный статус"
        };
    };

    // Получаем информацию о статусе
    const { statusColor, statusText } = getStatusInfo(STAGE);

    // Форматирование суммы
    const formatPrice = (priceStr) => {
        if (!priceStr || typeof priceStr !== "string") return "Не указана";
        const [amount, currency] = priceStr.split("|");
        return `${amount || "0"} ${currency === "RUB" ? "руб." : currency || ""}`;
    };

    // Форматирование даты
    const formatDate = (dateString) => {
        if (!dateString) return "не указано";
        try {
            const date = new Date(dateString);
            return date.toLocaleString("ru-RU", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return "некорректная дата";
        }
    };

    // Обработчики действий и модального окна остаются без изменений
    const handleChangeStatus = async (stageId) => {
        const data = { dealId: ID, stageId };
        try {
            await fetch(`/restapi/certificate.changeCertificateStage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            window.location.reload();
        } catch (error) {
            console.error("Ошибка при изменении статуса:", error);
        }
    };

    const handleChangeDate = async () => {
        if (!selectedDateTime) return;

        const date = new Date(selectedDateTime);
        date.setHours(date.getHours() + 3);
        const formattedDateTime = date.toISOString().slice(0, 19).replace("T", " ");

        try {
            await fetch("/restapi/certificate.updateScheduleTime", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    certificateId: ID,
                    datetime: formattedDateTime,
                }),
            });
            setOpenModal(false);
            window.location.reload();
        } catch (error) {
            console.error("Ошибка при изменении даты:", error);
        }
    };

    // Рендер кнопок действий (без изменений)
    const renderActions = () => {
        const statusGroup = STAGE?.group_id;

        if (statusGroup === "new") {
            return (
                <MDBox mt={2} display="flex" gap={1} flexWrap="wrap">
                    <MDButton
                        variant="gradient"
                        color="info"
                        onClick={() => handleChangeStatus("C2:NEW")}
                    >
                        Принять
                    </MDButton>
                    <MDButton
                        variant="gradient"
                        color="success"
                        onClick={() => handleChangeStatus("C2:UC_4Q05NY")}
                    >
                        Записать
                    </MDButton>
                    <MDButton
                        variant="gradient"
                        color="warning"
                        onClick={() => {
                            const formattedDate = SCHEDULE_TIME
                                ? new Date(SCHEDULE_TIME).toISOString().slice(0, 16)
                                : "";
                            setSelectedDateTime(formattedDate);
                            setOpenModal(true);
                        }}
                    >
                        Изменить время
                    </MDButton>
                    <MDButton
                        variant="gradient"
                        color="error"
                        onClick={() => handleChangeStatus("C2:LOSE")}
                    >
                        Отменить
                    </MDButton>
                </MDBox>
            );
        }

        if (statusGroup === "waiting") {
            return (
                <MDBox mt={2} display="flex" gap={1} flexWrap="wrap">
                    <MDButton
                        variant="gradient"
                        color="success"
                        onClick={() => handleChangeStatus("C2:UC_4Q05NY")}
                    >
                        Записать
                    </MDButton>
                    <MDButton
                        variant="gradient"
                        color="warning"
                        onClick={() => {
                            const formattedDate = SCHEDULE_TIME
                                ? new Date(SCHEDULE_TIME).toISOString().slice(0, 16)
                                : "";
                            setSelectedDateTime(formattedDate);
                            setOpenModal(true);
                        }}
                    >
                        Изменить время
                    </MDButton>
                </MDBox>
            );
        }

        return null;
    };

    // Контактная информация
    const email = CONTACTS?.EMAILS?.[0] ?? "не указан";
    const phone = CONTACTS?.PHONES?.[0] ?? "не указан";

    return (
        <>
            <Card sx={{ boxShadow: 3, borderRadius: 2, p: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        {TITLE ? `Сертификат: ${TITLE}` : "Без названия"}
                    </Typography>

                    <MDBox mb={1}>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Номер:</strong> {NUMBER || "не указан"}
                        </Typography>
                    </MDBox>

                    <MDBox mb={1}>
                        <Typography variant="body2" color="text.secondary">
                            <strong>ID:</strong> {ID != null ? ID : "не указан"}
                        </Typography>
                    </MDBox>

                    <MDBox mb={1}>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Клиент:</strong> {NAME || "не указан"}
                        </Typography>
                    </MDBox>

                    <MDBox mb={1}>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Email:</strong> {email}
                        </Typography>
                    </MDBox>

                    <MDBox mb={1}>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Телефон:</strong> {phone}
                        </Typography>
                    </MDBox>

                    <MDBox mb={1}>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Дата записи:</strong> {formatDate(SCHEDULE_TIME)}
                        </Typography>
                    </MDBox>

                    <MDBox mb={1}>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Сумма:</strong> {formatPrice(OPPORTUNITY)}
                        </Typography>
                    </MDBox>

                    <MDBox mb={1}>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Статус:</strong>{" "}
                            <MDBadge
                                badgeContent={statusText}
                                color={statusColor}
                                variant="gradient"
                                size="sm"
                            />
                        </Typography>
                    </MDBox>
                </CardContent>
                {renderActions()}
            </Card>

            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Box sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 1,
                }}>
                    <MDTypography variant="h6" mb={2}>
                        Изменить дату и время
                    </MDTypography>
                    <TextField
                        type="datetime-local"
                        value={selectedDateTime}
                        onChange={(e) => setSelectedDateTime(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                            min: new Date().toISOString().slice(0, 16),
                        }}
                    />
                    <MDBox display="flex" justifyContent="flex-end" gap={1}>
                        <MDButton
                            color="secondary"
                            onClick={() => setOpenModal(false)}
                        >
                            Отмена
                        </MDButton>
                        <MDButton
                            color="info"
                            onClick={handleChangeDate}
                        >
                            Сохранить
                        </MDButton>
                    </MDBox>
                </Box>
            </Modal>
        </>
    );
};

export default CertificateCard;