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

    switch (type) {
      case "today":
        dateFrom = new Date(now.setHours(0, 0, 0, 0))
          .toISOString()
          .slice(0, 16);
        dateTo = new Date(now.setHours(23, 59, 59, 999))
          .toISOString()
          .slice(0, 16);
        break;
      case "tomorrow":
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateFrom = new Date(tomorrow.setHours(0, 0, 0, 0))
          .toISOString()
          .slice(0, 16);
        dateTo = new Date(tomorrow.setHours(23, 59, 59, 999))
          .toISOString()
          .slice(0, 16);
        break;
      case "currentWeek":
        const firstDayOfWeek = new Date(now);
        firstDayOfWeek.setDate(
          firstDayOfWeek.getDate() - firstDayOfWeek.getDay()
        );
        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
        dateFrom = new Date(firstDayOfWeek.setHours(0, 0, 0, 0))
          .toISOString()
          .slice(0, 16);
        dateTo = new Date(lastDayOfWeek.setHours(23, 59, 59, 999))
          .toISOString()
          .slice(0, 16);
        break;
      case "nextWeek":
        const nextWeekStart = new Date(now);
        nextWeekStart.setDate(
          nextWeekStart.getDate() + (7 - nextWeekStart.getDay())
        );
        const nextWeekEnd = new Date(nextWeekStart);
        nextWeekEnd.setDate(nextWeekEnd.getDate() + 6);
        dateFrom = new Date(nextWeekStart.setHours(0, 0, 0, 0))
          .toISOString()
          .slice(0, 16);
        dateTo = new Date(nextWeekEnd.setHours(23, 59, 59, 999))
          .toISOString()
          .slice(0, 16);
        break;
      case "currentMonth":
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0
        );
        dateFrom = new Date(firstDayOfMonth.setHours(0, 0, 0, 0))
          .toISOString()
          .slice(0, 16);
        dateTo = new Date(lastDayOfMonth.setHours(23, 59, 59, 999))
          .toISOString()
          .slice(0, 16);
        break;
      case "nextMonth":
        const nextMonthStart = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          1
        );
        const nextMonthEnd = new Date(now.getFullYear(), now.getMonth() + 2, 0);
        dateFrom = new Date(nextMonthStart.setHours(0, 0, 0, 0))
          .toISOString()
          .slice(0, 16);
        dateTo = new Date(nextMonthEnd.setHours(23, 59, 59, 999))
          .toISOString()
          .slice(0, 16);
        break;
      case "currentYear":
        const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
        const lastDayOfYear = new Date(now.getFullYear(), 11, 31);
        dateFrom = new Date(firstDayOfYear.setHours(0, 0, 0, 0))
          .toISOString()
          .slice(0, 16);
        dateTo = new Date(lastDayOfYear.setHours(23, 59, 59, 999))
          .toISOString()
          .slice(0, 16);
        break;
      case "custom":
        // Для пользовательского диапазона не устанавливаем значения по умолчанию
        break;
      case "none":
      default:
        // Сброс фильтра
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

  const handleServiceFormSubmit = async (stageId) => {
    // Проверяем поле "Причина" в режиме редактирования
    if (modalMode === "edit" && !serviceForm.cancel.trim()) {
      setFormError("Пожалуйста, укажите причину");
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");
      const data = {
        dealId: selectedDealId,
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

  // Преобразование `deals` в формат для DataTable
  const tableData = {
    columns: [
      { Header: "Номер", accessor: "NUMBER" },
      { Header: "Услуга", accessor: "TITLE" },
      { Header: "Контакт", accessor: "NAME" },
      { Header: "Статус", accessor: "STAGE_ID" },
      { Header: "Дата записи", accessor: "SCHEDULE_TIME" },
      { Header: "Сумма", accessor: "OPPORTUNITY" },
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
                        <Box key={index}>
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
                    onClick={() => handleOpenServiceModal(element, "edit")}
                  >
                    На согласование
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
                  <MDButton
                    sx={{ width: "100%" }}
                    variant="gradient"
                    color="error"
                    style={{ marginTop: "10px" }}
                    onClick={() => handleOpenServiceModal(element, "edit")}
                  >
                    Отменить/изменить
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
          <MDBox ml={2}>
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
                <select
                  sx={{ width: "100%" }}
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  style={{
                    width: "100%",
                    height: "43px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="">Все статусы</option>
                  {Object.entries({
                    new: "Новая заявка",
                    waiting: "Согласование времени",
                    confirmed: "Записан",
                    visited: "Посетил",
                    verification: "Ожидание оплаты",
                    paid: "Оплачен",
                  }).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </Grid>
              <Grid item xs={12} md={2}>
                <select
                  value={dateFilterType}
                  onChange={(e) => handleDateFilterTypeChange(e.target.value)}
                  style={{
                    width: "100%",
                    height: "43px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="none">Без фильтра даты</option>
                  <option value="today">Сегодня</option>
                  <option value="tomorrow">Завтра</option>
                  <option value="currentWeek">Текущая неделя</option>
                  <option value="nextWeek">Следующая неделя</option>
                  <option value="currentMonth">Текущий месяц</option>
                  <option value="nextMonth">Следующий месяц</option>
                  <option value="currentYear">Текущий год</option>
                  <option value="custom">Указать период</option>
                </select>
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
    </MDBox>
  );
}
