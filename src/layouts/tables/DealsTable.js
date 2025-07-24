// это новый вариант переиспользовал как на странице DashBoard (добавил пагинацию, сортировку)

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import useDeals from "./data/useDeals";
import { TextField } from "@mui/material";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { fetchProfileData } from "../profile/data/getProfile";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDBadge from "components/MDBadge";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDPagination from "components/MDPagination";
import Icon from "@mui/material/Icon";
import MDInput from "components/MDInput";
import Grid from "@mui/material/Grid";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

// DataTable
import DataTable from "examples/Tables/DataTable";
import { CircularProgress } from "@mui/material";

export default function DealsTable() {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openServiceModal, setOpenServiceModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' или 'edit'
  const [selectedDealId, setSelectedDealId] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState("");
  const [profileData, setProfileData] = useState(null);
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
  const [filters, setFilters] = useState({
    phone: "",
    certificateNumber: "",
    status: "",
    dateFrom: "",
    dateTo: "",
  });

  const options = [
    { value: "none", label: "Без фильтра" },
    { value: "today", label: "Сегодня" },
    { value: "tomorrow", label: "Завтра" },
    { value: "currentWeek", label: "Текущая неделя" },
    { value: "nextWeek", label: "Следующая неделя" },
    { value: "currentMonth", label: "Текущий месяц" },
    { value: "nextMonth", label: "Следующий месяц" },
    { value: "currentYear", label: "Текущий год" },
    { value: "custom", label: "Указать период" },
  ];
  const options2 = [
    { value: "new", label: "Новая заявка" },
    { value: "waiting", label: "Согласование времени" },
    { value: "confirmed", label: "Записан" },
    { value: "visited", label: "Посетил" },
    { value: "verification", label: "Ожидание оплаты" },
    { value: "paid", label: "Оплачен" },
    { value: "canceled", label: "Отменен" },
  ];
  const { deals, loadDeals, total, totalPages, currentPage, loading } =
    useDeals(1, {});
  const [formError, setFormError] = useState("");

  const [dateFilterType, setDateFilterType] = useState("none");
  const [showCustomRange, setShowCustomRange] = useState(false);

  // фильтр дат
  const handleDateFilterTypeChange = (type) => {
    setDateFilterType(type);
    setShowCustomRange(type === "custom");

    // даты в зависимости от выбранного типа
    let dateFrom = "";
    let dateTo = "";
    const now = new Date();

    const getLocalISODateString = (date) => {
      const offset = date.getTimezoneOffset() * 60000;
      const localDate = new Date(date - offset);
      return localDate.toISOString().slice(0, 16);
    };

    const getLocalISODateTimeString = (date) => {
      const offset = date.getTimezoneOffset() * 60000;
      const localDate = new Date(date - offset);
      return localDate.toISOString().slice(0, 19).replace("T", " ");
    };

    switch (type) {
      case "today": {
        const todayStart = new Date();
        todayStart.setDate(todayStart.getDate());
        dateFrom = getLocalISODateTimeString(todayStart);
        dateTo = getLocalISODateTimeString(todayStart);
        break;
      }
      case "tomorrow": {
        const tomorrowStart = new Date();
        tomorrowStart.setDate(tomorrowStart.getDate() + 1);
        dateFrom = getLocalISODateTimeString(tomorrowStart);
        dateTo = getLocalISODateTimeString(tomorrowStart);
        break;
      }
      case "currentWeek": {
        const now = new Date();

        // Получаем день недели (0-6, где 0 - воскресенье)
        const day = now.getDay();
        const daysToMonday = day === 0 ? -6 : 1 - day;

        // Получаем понедельник текущей недели
        const monday = new Date(now);
        monday.setDate(monday.getDate() + daysToMonday);

        // Получаем воскресенье текущей недели
        const sunday = new Date(monday);
        sunday.setDate(sunday.getDate() + 6);

        dateFrom = getLocalISODateTimeString(monday);
        dateTo = getLocalISODateTimeString(sunday);
        break;
      }
      case "nextWeek": {
        const now = new Date(); // Убрано +1 день

        const day = now.getDay();
        const diff = day === 0 ? -6 : 1 - day;
        const currentMonday = new Date(now);
        currentMonday.setDate(currentMonday.getDate() + diff);

        const nextMonday = new Date(currentMonday);
        nextMonday.setDate(nextMonday.getDate() + 7); // Чистый переход на следующую неделю

        const nextSunday = new Date(nextMonday);
        nextSunday.setDate(nextSunday.getDate() + 6);

        dateFrom = getLocalISODateTimeString(nextMonday);
        dateTo = getLocalISODateTimeString(nextSunday);
        break;
      }
      case "currentMonth": {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        lastDay.setHours(23, 59, 59, 999);
        const nextDay = new Date(firstDay);
        nextDay.setDate(nextDay.getDate() + 1);
        dateFrom = getLocalISODateTimeString(nextDay);
        dateTo = getLocalISODateTimeString(lastDay);
        break;
      }
      case "nextMonth": {
        const now = new Date();
        const firstDayNextMonth = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          1
        );
        const lastDayNextMonth = new Date(
          now.getFullYear(),
          now.getMonth() + 2,
          0
        );
        lastDayNextMonth.setHours(23, 59, 59, 999);
        const nextDay = new Date(firstDayNextMonth);
        nextDay.setDate(nextDay.getDate() + 1);
        dateFrom = getLocalISODateTimeString(nextDay);
        dateTo = getLocalISODateTimeString(lastDayNextMonth);
        break;
      }
      case "currentYear": {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), 0, 1);
        const lastDay = new Date(now.getFullYear(), 11, 31);
        lastDay.setHours(23, 59, 59, 999);
        dateFrom = getLocalISODateTimeString(firstDay);
        dateTo = getLocalISODateTimeString(lastDay);
        break;
      }
      case "custom":
        break;
      case "none":
      default:
        dateFrom = "";
        dateTo = "";
        break;
    }

    setFilters({
      ...filters,
      dateFrom,
      dateTo,
    });
  };

  // Симуляция ожидания данных
  useEffect(() => {
    const loadData = async () => {
      const profile = await fetchProfileData("partnerLow");
      setProfileData(profile);

      if (deals && Object.keys(deals).length > 0) {
        setIsLoading(false);
      }
    };

    loadData();
  }, [deals]);

  useEffect(() => {
    loadDeals(page, filters);
  }, [page]);

  const getStatusInfo = (stage) => {
    const statusMapping = {
      new: { statusColor: "error", statusText: "Новая заявка" },
      waiting: { statusColor: "warning", statusText: "Согласование времени" },
      confirmed: { statusColor: "info", statusText: "Записан" },
      visited: { statusColor: "secondary", statusText: "Посетил" },
      verification: { statusColor: "primary", statusText: "Ожидает оплаты" },
      paid: { statusColor: "success", statusText: "Оплачен" },
      canceled: { statusColor: "error", statusText: "Отменен" },
      notcome: { statusColor: "error", statusText: "Не посетил" },
      notrepaid: { statusColor: "error", statusText: "Не погашен" },
    };

    return (
      statusMapping[stage.group_id] || {
        statusColor: "dark",
        statusText: "Неизвестный статус",
      }
    );
  };

  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleDateString(undefined, {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        })
      : "не записан";
  };

  const handleChangeStatus = async (dealID, stageId) => {
    const data = {
      dealId: dealID,
      stageId: stageId,
    };
    try {
      fetch(`/restapi/certificate.changeCertificateStage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      window.location.reload();
    } catch (error) {
      console.error("Ошибка при изменении статуса:", error);
    }
  };

  const handleChangeDateModal = (dealID, dateValue) => {
    setSelectedDealId(dealID);

    if (dateValue && dateValue !== "не записан") {
      // Разбиваем строку на части
      const [datePart, timePart] = dateValue.split(", ");
      const [day, month, year] = datePart.split(".");
      const [hours, minutes] = timePart.split(":");

      // Создаем дату в формате YYYY-MM-DDThh:mm
      const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
      setSelectedDateTime(formattedDate);
    } else {
      setSelectedDateTime("");
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedDateTime("");
  };

  const handleSaveDate = async () => {
    if (!selectedDateTime) {
      alert("Пожалуйста, выберите дату и время");
      return;
    }
    // Преобразуем дату в нужный формат
    const date = new Date(selectedDateTime);
    date.setHours(date.getHours() + 3);

    const formattedDateTime = date.toISOString().slice(0, 19).replace("T", " ");
    try {
      const data = {
        certificateId: selectedDealId,
        datetime: formattedDateTime,
      };
      const response = await fetch("/restapi/certificate.updateScheduleTime", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Ошибка при изменении даты");
      }
      handleCloseModal();
      window.location.reload();
    } catch (error) {
      console.error("Ошибка при изменении даты:", error);
    }
  };

  const handleOpenServiceModal = async (deal, mode = "create") => {
    setModalMode(mode);
    setSelectedDealId(deal.ID);

    const phone = profileData?.["0"]?.PHONE?.[0]?.VALUE || "";
    const address = profileData?.["0"]?.UF_CRM_1692176867840 || "";

    // Определяем начальный адрес
    let initialAddress = "";
    if (Array.isArray(address)) {
      initialAddress = address[0] || "";
    } else if (address) {
      initialAddress = address;
    }

    setServiceForm({
      title: deal.OPTIONS || "",
      date: deal.SCHEDULE_TIME
        ? new Date(deal.SCHEDULE_TIME).toISOString().split("T")[0]
        : "",
      time: deal.SCHEDULE_TIME
        ? new Date(deal.SCHEDULE_TIME).toTimeString().slice(0, 5)
        : "",
      phone: phone,
      address: initialAddress,
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

  const handleServiceFormSubmit = async (stageId, dealId) => {
    // Проверяем поле "Причина" в режиме редактирования
    if (modalMode === "edit" && !serviceForm.cancel.trim()) {
      setFormError("Пожалуйста, укажите причину");
      return;
    }
    try {
      setIsSubmitting(true);
      setFormError("");
      let data;
      if (stageId === "C2:NEW") {
        data = {
          dealId: dealId,
          stageId: stageId,
        };
      } else {
        data = {
          dealId: dealId,
          ...serviceForm,
          datetime: `${serviceForm.date}T${serviceForm.time}:00`,
          stageId: stageId,
        };
      }
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

  // Преобразование `deals` в формат для DataTable
  const tableData = {
    columns: [
      { Header: "Номер", accessor: "NUMBER" },
      { Header: "Услуга", accessor: "TITLE" },
      { Header: "Контакт", accessor: "NAME" },
      { Header: "Статус", accessor: "STAGE_ID" },
      { Header: "Дата записи", accessor: "SCHEDULE_TIME" },
      { Header: "Сумма", accessor: "OPPORTUNITY" },
      { Header: "Комментарии", accessor: "ADDITIONAL_INFO" },
      { Header: "Действие", accessor: "action" },
    ],

    rows: deals
      ? Object.values(deals).map((element) => {
          const { statusColor, statusText } = getStatusInfo(element.STAGE);
          const dateValue = formatDate(element.SCHEDULE_TIME);
          const name = (
            <>
              <Box>
                <Box>{element.NAME || "-"}</Box>
                <Box>
                  {element.CONTACTS?.PHONES &&
                  Array.isArray(element.CONTACTS.PHONES)
                    ? element.CONTACTS.PHONES.map((phone, index) => (
                        <Box key={`phone-${element.ID}-${index}`}>
                          <a href={`tel:${phone}`}>{phone}</a>
                        </Box>
                      ))
                    : "-"}
                </Box>
              </Box>
            </>
          );
          const number = (
            <MDTypography
              component="a"
              href={`/tables/${element.ID}`}
              style={{ fontSize: "14px", color: "#727cf5" }}
            >
              {element.NUMBER}
            </MDTypography>
          );
          return {
            NUMBER: number,
            TITLE: element.OPTIONS ? element.OPTIONS : element.ID,
            NAME: name,
            STAGE_ID: (
              <MDBadge
                badgeContent={statusText}
                color={statusColor}
                variant="gradient"
                size="sm"
              />
            ),
            SCHEDULE_TIME: dateValue,
            OPPORTUNITY: `${element.OPPORTUNITY}`.replace("|RUB", "₽"),
            ADDITIONAL_INFO: (
              <Box sx={{ whiteSpace: "pre-line" }}>
                {[
                  element?.COMMENT_CLIENT_ACTIVATION && (
                    <Box key={`client-${element.ID}`} mb={1}>
                      Клиент: {element.COMMENT_CLIENT_ACTIVATION}
                    </Box>
                  ),

                  element?.COMMENT_PARTNER_ACTIVATION && (
                    <Box key={`partner-${element.ID}`} mb={1}>
                      Партнер: {element.COMMENT_PARTNER_ACTIVATION}
                    </Box>
                  ),

                  element?.ADDITIONAL_INFO && (
                    <Box key={`manager-${element.ID}`} mb={1}>
                      Менеджер: {element.ADDITIONAL_INFO}
                    </Box>
                  ),
                ].filter(Boolean)}
              </Box>
            ),
            action:
              element.STAGE.group_id === "new" ? (
                <>
                  <MDButton
                    sx={{ width: "100%" }}
                    variant="gradient"
                    color="info"
                    onClick={() => handleOpenServiceModal(element, "create")}
                  >
                    Записать
                  </MDButton>

                  <MDButton
                    sx={{ width: "100%" }}
                    variant="gradient"
                    color="warning"
                    style={{ marginTop: "10px" }}
                    onClick={() => {
                      setModalMode("create");
                      handleServiceFormSubmit("C2:NEW", element.ID);
                    }}
                  >
                    Согласовать время
                  </MDButton>
                </>
              ) : element.STAGE.group_id === "waiting" ? (
                <>
                  <MDButton
                    sx={{ width: "100%" }}
                    variant="gradient"
                    color="info"
                    onClick={() => handleOpenServiceModal(element, "create")}
                  >
                    Записать
                  </MDButton>
                  {/* <MDTypography
                    component="a"
                    variant="caption"
                    color="text"
                    fontWeight="medium"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      handleChangeStatus(element.ID, "C2:UC_4Q05NY")
                    }
                  >
                    Записать
                  </MDTypography>
                  <br />
                  <MDTypography
                    component="a"
                    variant="caption"
                    color="text"
                    fontWeight="medium"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleChangeDateModal(element.ID, dateValue)}
                  >
                    Изменить время
                  </MDTypography> */}
                </>
              ) : element.STAGE.group_id === "confirmed" ? (
                <>
                  <MDButton
                    sx={{ width: "100%" }}
                    variant="gradient"
                    color="secondary"
                    onClick={() =>
                      (window.location.href = `/redeem?number=${element.NUMBER}`)
                    }
                  >
                    Погасить
                  </MDButton>
                  {new Date(
                    new Date(element.SCHEDULE_TIME).getTime() +
                      24 * 60 * 60 * 1000
                  ) > new Date() && (
                    <MDButton
                      sx={{ width: "100%" }}
                      variant="gradient"
                      color="error"
                      style={{ marginTop: "10px" }}
                      onClick={() => handleOpenServiceModal(element, "edit")}
                    >
                      Отменить/изменить
                    </MDButton>
                  )}
                  {new Date(
                    new Date(element.SCHEDULE_TIME).getTime() +
                      24 * 60 * 60 * 1000
                  ) < new Date() && (
                    <MDButton
                      sx={{ width: "100%" }}
                      variant="gradient"
                      color="error"
                      style={{ marginTop: "10px" }}
                      onClick={() =>
                        handleServiceFormSubmit("C2:7", element.ID)
                      }
                    >
                      Не посетил
                    </MDButton>
                  )}
                </>
              ) : element.STAGE.group_id === "notrepaid" ? (
                <>
                  <MDButton
                    sx={{ width: "100%" }}
                    variant="gradient"
                    color="error"
                    style={{ marginTop: "10px" }}
                    onClick={() => handleServiceFormSubmit("C2:7", element.ID)}
                  >
                    Не посетил
                  </MDButton>
                </>
              ) : null,
          };
        })
      : [],
  };

  return (
    <MDBox>
      {isLoading ? (
        <MDBox
          display="flex"
          flexDirection="column"
          alignItems="center"
          mt={3}
          pb={3}
        >
          <CircularProgress color="info" />
          {/*<MDTypography>Загрузка...</MDTypography>*/}
        </MDBox>
      ) : (
        <>
          <MDBox mx={2}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={2}>
                <MDInput
                  sx={{ width: "100%" }}
                  label="Номер телефона"
                  value={filters.phone}
                  onChange={(e) =>
                    setFilters({ ...filters, phone: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <MDInput
                  sx={{ width: "100%" }}
                  label="Номер сертификата"
                  value={filters.certificateNumber}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      certificateNumber: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Dropdown
                  options={options2}
                  value={filters.status}
                  onChange={(selected) =>
                    setFilters({ ...filters, status: selected.value })
                  }
                  placeholder="Статус"
                  className="custom-dropdown"
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Dropdown
                  options={options}
                  onChange={(selected) =>
                    handleDateFilterTypeChange(selected.value)
                  }
                  value={dateFilterType}
                  placeholder="Выберите период"
                  className="custom-dropdown"
                />
                <style>
                  {`
                    .custom-dropdown {
                      width: 100%;
                    }
                    .custom-dropdown .Dropdown-control {
                      height: 43px;
                      border-radius: 4px;
                      border: 1px solid #ccc;
                      font-size: 14px;
                      display: flex;
                      align-items: center;
                    }
                    .custom-dropdown .Dropdown-menu {
                      font-size: 14px;
                    }
                  `}
                </style>
                {/* <select
                  value={dateFilterType}
                  onChange={(e) => handleDateFilterTypeChange(e.target.value)}
                  style={{
                    width: "100%",
                    height: "43px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                ></select> */}
              </Grid>

              {showCustomRange && (
                <>
                  <Grid item xs={12} md={2}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <MDTypography variant="caption" color="text">
                        С
                      </MDTypography>
                      <TextField
                        sx={{ width: "100%" }}
                        type="datetime-local"
                        value={filters.dateFrom}
                        onChange={(e) =>
                          setFilters({ ...filters, dateFrom: e.target.value })
                        }
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <MDTypography variant="caption" color="text">
                        По
                      </MDTypography>
                      <TextField
                        sx={{ width: "100%" }}
                        type="datetime-local"
                        value={filters.dateTo}
                        onChange={(e) =>
                          setFilters({ ...filters, dateTo: e.target.value })
                        }
                      />
                    </Box>
                  </Grid>
                </>
              )}
              {/*<Grid item xs={12} md={2}>*/}
              {/*  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>*/}
              {/*    <MDTypography variant="caption" color="text">*/}
              {/*      С*/}
              {/*    </MDTypography>*/}
              {/*    <TextField*/}
              {/*      sx={{ width: "100%" }}*/}
              {/*      type="datetime-local"*/}
              {/*      value={filters.dateFrom}*/}
              {/*      onChange={(e) =>*/}
              {/*        setFilters({ ...filters, dateFrom: e.target.value })*/}
              {/*      }*/}
              {/*    />*/}
              {/*  </Box>*/}
              {/*</Grid>*/}
              {/*<Grid item xs={12} md={2}>*/}
              {/*  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>*/}
              {/*    <MDTypography variant="caption" color="text">*/}
              {/*      По*/}
              {/*    </MDTypography>*/}
              {/*    <TextField*/}
              {/*      sx={{ width: "100%" }}*/}
              {/*      type="datetime-local"*/}
              {/*      value={filters.dateTo}*/}
              {/*      onChange={(e) =>*/}
              {/*        setFilters({ ...filters, dateTo: e.target.value })*/}
              {/*      }*/}
              {/*    />*/}
              {/*  </Box>*/}
              {/*</Grid>*/}
            </Grid>
            <Grid container spacing={2} mt={2}>
              <Grid item xs={12} md={2}>
                <MDButton
                  sx={{ width: "100%" }}
                  variant="gradient"
                  color="info"
                  onClick={() => loadDeals(1, filters)}
                >
                  Найти
                </MDButton>
              </Grid>
              <Grid item xs={12} md={2}>
                <MDButton
                  sx={{ width: "100%" }}
                  variant="gradient"
                  color="error"
                  onClick={() => window.location.reload()}
                >
                  Сбросить фильтры
                </MDButton>
              </Grid>
            </Grid>
          </MDBox>

          <DataTable
            table={tableData}
            canSearch
            showTotalEntries
            entriesPerPage={{ defaultValue: 5, entries: [5] }}
            isSorted={false}
            noEndBorder
          />
          <MDPagination>
            {currentPage > 1 && (
              <MDPagination item onClick={() => setPage(page - 1)}>
                <Icon>keyboard_arrow_left</Icon>
              </MDPagination>
            )}
            {(() => {
              const pages = [];
              if (totalPages <= 7) {
                // Если страниц мало, показываем все
                for (let i = 0; i < totalPages; i++) {
                  pages.push(
                    <MDPagination
                      item
                      key={i + 1}
                      active={currentPage === i + 1}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </MDPagination>
                  );
                }
              } else {
                // Первые две страницы
                pages.push(
                  <MDPagination
                    item
                    key={1}
                    active={currentPage === 1}
                    onClick={() => setPage(1)}
                  >
                    1
                  </MDPagination>
                );
                pages.push(
                  <MDPagination
                    item
                    key={2}
                    active={currentPage === 2}
                    onClick={() => setPage(2)}
                  >
                    2
                  </MDPagination>
                );

                // Точки если текущая страница далеко от начала
                if (currentPage > 4) {
                  pages.push(
                    <MDPagination item key="dots1">
                      ...
                    </MDPagination>
                  );
                }

                // Три страницы вокруг текущей
                for (
                  let i = Math.max(3, currentPage - 1);
                  i <= Math.min(totalPages - 2, currentPage + 1);
                  i++
                ) {
                  pages.push(
                    <MDPagination
                      item
                      key={i}
                      active={currentPage === i}
                      onClick={() => setPage(i)}
                    >
                      {i}
                    </MDPagination>
                  );
                }

                // Точки если текущая страница далеко от конца
                if (currentPage < totalPages - 3) {
                  pages.push(
                    <MDPagination item key="dots2">
                      ...
                    </MDPagination>
                  );
                }

                // Последние две страницы
                pages.push(
                  <MDPagination
                    item
                    key={totalPages - 1}
                    active={currentPage === totalPages - 1}
                    onClick={() => setPage(totalPages - 1)}
                  >
                    {totalPages - 1}
                  </MDPagination>
                );
                pages.push(
                  <MDPagination
                    item
                    key={totalPages}
                    active={currentPage === totalPages}
                    onClick={() => setPage(totalPages)}
                  >
                    {totalPages}
                  </MDPagination>
                );
              }
              return pages;
            })()}
            {currentPage < totalPages && (
              <MDPagination item onClick={() => setPage(page + 1)}>
                <Icon>keyboard_arrow_right</Icon>
              </MDPagination>
            )}
          </MDPagination>
        </>
      )}

      {/* Индикатор подгрузки при скролле */}
      {/* {loading && !isLoading && (
        <MDBox display="flex" justifyContent="center" mt={2}>
          <MDTypography color="text">Подгружается...</MDTypography>
        </MDBox>
      )} */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="datetime-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          <MDTypography variant="h6" component="h2" mb={2}>
            Изменить дату и время
          </MDTypography>
          <TextField
            type="datetime-local"
            value={selectedDateTime}
            onChange={(e) => setSelectedDateTime(e.target.value)}
            sx={{ width: "100%", mb: 2 }}
            inputProps={{
              min: new Date().toISOString().slice(0, 16), // UTC, с точностью до минут
            }}
          />
          <MDBox display="flex" justifyContent="flex-end" gap={1}>
            <MDButton
              variant="gradient"
              color="secondary"
              onClick={handleCloseModal}
            >
              Отмена
            </MDButton>
            <MDButton variant="gradient" color="info" onClick={handleSaveDate}>
              Сохранить
            </MDButton>
          </MDBox>
        </Box>
      </Modal>

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
            width: {
              xs: "100%",
              md: "500px",
            },
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
                  color="info"
                  onClick={() =>
                    handleServiceFormSubmit("C2:6", selectedDealId)
                  }
                  disabled={isSubmitting || !serviceForm.cancel.trim()}
                >
                  {isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Изменить"
                  )}
                </MDButton>
                <MDButton
                  variant="gradient"
                  color="error"
                  onClick={() =>
                    handleServiceFormSubmit("C2:5", selectedDealId)
                  }
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
                  color="secondary"
                  onClick={handleCloseServiceModal}
                  disabled={isSubmitting}
                >
                  Отмена
                </MDButton>
              </>
            ) : (
              <>
                <MDButton
                  variant="gradient"
                  color="info"
                  onClick={() =>
                    handleServiceFormSubmit("C2:UC_4Q05NY", selectedDealId)
                  }
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Подтвердить"
                  )}
                </MDButton>
                <MDButton
                  variant="gradient"
                  color="secondary"
                  onClick={handleCloseServiceModal}
                  disabled={isSubmitting}
                >
                  Отмена
                </MDButton>
              </>
            )}
          </MDBox>
        </Box>
      </Modal>
    </MDBox>
  );
}
