import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  TextField,
  CircularProgress,
} from "@mui/material";
import MDBadge from "components/MDBadge";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import Modal from "@mui/material/Modal";
import { fetchProfileData } from "../../../profile/data/getProfile";

const CertificateCard = ({ data }) => {
  const [openModal, setOpenModal] = useState(false);
  const [openServiceModal, setOpenServiceModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedDateTime, setSelectedDateTime] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [serviceForm, setServiceForm] = useState({
    title: "",
    date: "",
    time: "",
    phone: "",
    address: "",
    addressArray: "",
    notes: "",
    cancel: "",
  });

  // Загрузка данных профиля при монтировании компонента
  React.useEffect(() => {
    const loadProfileData = async () => {
      const profile = await fetchProfileData("partnerLow");
      setProfileData(profile);
    };
    loadProfileData();
  }, []);

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

  // Функция определения статуса
  const getStatusInfo = (stage) => {
    const statusMapping = {
      new: { statusColor: "warning", statusText: "Новый" },
      waiting: { statusColor: "warning", statusText: "Согласование времени" },
      confirmed: { statusColor: "info", statusText: "Записан" },
      visited: { statusColor: "secondary", statusText: "Посетил" },
      verification: { statusColor: "primary", statusText: "Ожидание сверки" },
      paid: { statusColor: "success", statusText: "Оплачен" },
      canceled: { statusColor: "error", statusText: "Отменен" },
    };

    return (
      statusMapping[stage.group_id] || {
        statusColor: "dark",
        statusText: "Неизвестный статус",
      }
    );
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

  const handleOpenServiceModal = async (deal, mode = "create") => {
    setModalMode(mode);
    const phone = profileData?.["0"]?.PHONE?.[0]?.VALUE || "";
    const address = profileData?.["0"]?.UF_CRM_1692176867840 || "";

    setServiceForm({
      title: deal.OPTIONS || "",
      date: deal.SCHEDULE_TIME
        ? new Date(deal.SCHEDULE_TIME).toISOString().split("T")[0]
        : "",
      time: deal.SCHEDULE_TIME
        ? new Date(deal.SCHEDULE_TIME).toTimeString().slice(0, 5)
        : "",
      phone: phone,
      address: "",
      addressArray: address,
      notes: "",
      cancel: "",
    });
    setOpenServiceModal(true);
  };

  const handleCloseServiceModal = () => {
    setOpenServiceModal(false);
    setFormError("");
    setServiceForm({
      title: "",
      date: "",
      time: "",
      phone: "",
      address: "",
      addressArray: "",
      notes: "",
      cancel: "",
    });
  };

  const handleServiceFormChange = (e) => {
    const { name, value } = e.target;
    setServiceForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServiceFormSubmit = async (stageId) => {
    if (modalMode === "edit" && !serviceForm.cancel.trim()) {
      setFormError("Пожалуйста, укажите причину");
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");
      const data = {
        dealId: ID,
        ...serviceForm,
        datetime: `${serviceForm.date}T${serviceForm.time}:00`,
        stageId: stageId,
      };
      const response = await fetch(
        "/restapi/certificate.changeCertificateStage",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при обновлении данных услуги");
      }

      handleCloseServiceModal();
      window.location.reload();
    } catch (error) {
      console.error("Ошибка при обновлении данных услуги:", error);
    } finally {
      setIsSubmitting(false);
    }
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
        {STAGE.group_id === "new" && (
          <MDBox mt={2} display="flex" gap={1} flexWrap="wrap">
            <MDButton
              variant="gradient"
              color="info"
              onClick={() => handleOpenServiceModal(data, "create")}
            >
              Записать
            </MDButton>

            <MDButton
              variant="gradient"
              color="warning"
              onClick={() => handleOpenServiceModal(data, "edit")}
            >
              Изменить время
            </MDButton>
          </MDBox>
        )}
        {STAGE.group_id === "waiting" && (
          <MDBox mt={2} display="flex" gap={1} flexWrap="wrap">
            <MDButton
              variant="gradient"
              color="info"
              onClick={() => handleOpenServiceModal(data, "create")}
            >
              Записать
            </MDButton>
          </MDBox>
        )}
        {STAGE.group_id === "confirmed" && (
          <MDBox mt={2} display="flex" gap={1} flexWrap="wrap">
            <MDButton
              variant="gradient"
              color="error"
              onClick={() => handleOpenServiceModal(data, "edit")}
            >
              Отменить/изменить
            </MDButton>
          </MDBox>
        )}
      </Card>

      {/* Модальное окно для редактирования услуги */}
      <Modal
        open={openServiceModal}
        onClose={handleCloseServiceModal}
        aria-labelledby="service-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          <MDTypography variant="h6" component="h2" mb={3}>
            {modalMode === "create"
              ? "Редактирование услуги"
              : "Изменение времени/отмена записи"}
          </MDTypography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                sx={{ width: "100%" }}
                label="Название услуги"
                name="title"
                value={serviceForm.title}
                onChange={handleServiceFormChange}
                margin="normal"
                disabled={true}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                sx={{ width: "100%" }}
                label="Дата"
                name="date"
                type="date"
                value={serviceForm.date}
                onChange={handleServiceFormChange}
                InputLabelProps={{ shrink: true }}
                margin="normal"
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                sx={{ width: "100%" }}
                label="Время"
                name="time"
                type="time"
                value={serviceForm.time}
                onChange={handleServiceFormChange}
                InputLabelProps={{ shrink: true }}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                sx={{ width: "100%" }}
                label="Телефон для связи"
                name="phone"
                value={serviceForm.phone}
                onChange={handleServiceFormChange}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                sx={{ width: "100%" }}
                label="Адрес проведения"
                name="address"
                value={serviceForm.address}
                onChange={handleServiceFormChange}
                margin="normal"
                SelectProps={{
                  native: true,
                }}
              >
                {Array.isArray(serviceForm.addressArray)
                  ? serviceForm.addressArray.map((addr, index) => (
                      <option key={index} value={addr}>
                        {addr}
                      </option>
                    ))
                  : serviceForm.address && (
                      <option value={serviceForm.addressArray}>
                        {serviceForm.addressArray}
                      </option>
                    )}
              </TextField>
            </Grid>
            {modalMode === "edit" ? (
              <>
                <Grid item xs={12}>
                  <TextField
                    sx={{ width: "100%" }}
                    label="Причина"
                    name="cancel"
                    value={serviceForm.cancel}
                    onChange={handleServiceFormChange}
                    multiline
                    rows={3}
                    margin="normal"
                    required
                    error={!!formError}
                    helperText={formError}
                  />
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <TextField
                  sx={{ width: "100%" }}
                  label="Примечание"
                  name="notes"
                  value={serviceForm.notes}
                  onChange={handleServiceFormChange}
                  multiline
                  rows={3}
                  margin="normal"
                />
              </Grid>
            )}
          </Grid>

          <MDBox display="flex" justifyContent="flex-end" gap={1} mt={3}>
            {modalMode === "edit" ? (
              <>
                <MDButton
                  variant="gradient"
                  color="secondary"
                  onClick={handleCloseServiceModal}
                  disabled={isSubmitting}
                >
                  Отмена
                </MDButton>
                <MDButton
                  variant="gradient"
                  color="error"
                  onClick={() => handleServiceFormSubmit("C2:5")}
                  disabled={isSubmitting || !serviceForm.cancel.trim()}
                >
                  {isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Отменить запись"
                  )}
                </MDButton>
                <MDButton
                  variant="gradient"
                  color="info"
                  onClick={() => handleServiceFormSubmit("C2:NEW")}
                  disabled={isSubmitting || !serviceForm.cancel.trim()}
                >
                  {isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Изменить"
                  )}
                </MDButton>
              </>
            ) : (
              <>
                <MDButton
                  variant="gradient"
                  color="secondary"
                  onClick={handleCloseServiceModal}
                  disabled={isSubmitting}
                >
                  Отмена
                </MDButton>
                <MDButton
                  variant="gradient"
                  color="info"
                  onClick={() => handleServiceFormSubmit("C2:UC_4Q05NY")}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Подтвердить"
                  )}
                </MDButton>
              </>
            )}
          </MDBox>
        </Box>
      </Modal>
    </>
  );
};

export default CertificateCard;
