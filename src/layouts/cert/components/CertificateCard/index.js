import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import MDBadge from "components/MDBadge";
import MDBox from "components/MDBox";

const CertificateCard = ({ data }) => {
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
    } = data || {};


    console.log('data', data)

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

    // Email и телефон
    const email = CONTACTS?.EMAILS?.[0] ?? "не указан";
    const phone = CONTACTS?.PHONES?.[0] ?? "не указан";

    // Статус
    const statusText = STAGE?.group_title || "Неизвестный статус";
    const statusColor =
        statusText === "подтверждён"
            ? "success"
            : statusText === "ожидает оплаты"
                ? "warning"
                : "secondary";

    return (
        <Card sx={{ boxShadow: 3, borderRadius: 2, p: 2 }}>
            <CardContent>
                {/* Заголовок */}
                <Typography variant="h6" gutterBottom>
                    {TITLE ? `Сертификат: ${TITLE}` : "Без названия"}
                </Typography>

                {/* Номер */}
                <MDBox mb={1}>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Номер:</strong> {NUMBER || "не указан"}
                    </Typography>
                </MDBox>

                {/* ID */}
                <MDBox mb={1}>
                    <Typography variant="body2" color="text.secondary">
                        <strong>ID:</strong> {ID != null ? ID : "не указан"}
                    </Typography>
                </MDBox>

                {/* Клиент */}
                <MDBox mb={1}>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Клиент:</strong> {NAME || "не указан"}
                    </Typography>
                </MDBox>

                {/* Email */}
                <MDBox mb={1}>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Email:</strong> {email}
                    </Typography>
                </MDBox>

                {/* Телефон */}
                <MDBox mb={1}>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Телефон:</strong> {phone}
                    </Typography>
                </MDBox>

                {/* Дата записи */}
                <MDBox mb={1}>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Дата записи:</strong> {formatDate(SCHEDULE_TIME)}
                    </Typography>
                </MDBox>

                {/* Сумма */}
                <MDBox mb={1}>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Сумма:</strong> {formatPrice(OPPORTUNITY)}
                    </Typography>
                </MDBox>

                {/* Статус */}
                <MDBox mb={1}>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Статус:</strong>{" "}
                        <MDBadge badgeContent={statusText} color={statusColor} variant="gradient" size="sm" />
                    </Typography>
                </MDBox>
            </CardContent>
        </Card>
    );
};

export default CertificateCard;