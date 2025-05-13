// это новый вариант переиспользовал как на странице DashBoard (добавил пагинацию, сортировку)

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import useDeals from "./data/useDeals";
import { TextField } from "@mui/material";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDBadge from "components/MDBadge";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDPagination from "components/MDPagination";
import Icon from "@mui/material/Icon";
import MDInput from "components/MDInput";

// DataTable
import DataTable from "examples/Tables/DataTable";
import { CircularProgress } from "@mui/material";

export default function DealsTable() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDealId, setSelectedDealId] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState("");
  const { deals, loadDeals, total, totalPages, currentPage, loading } =
    useDeals(1);

  // Симуляция ожидания данных
  useEffect(() => {
    if (deals && Object.keys(deals).length > 0) {
      setIsLoading(false);
    }
  }, [deals]);

  useEffect(() => {
    loadDeals(page);
  }, [page]);

  const getStatusInfo = (stage) => {
    const statusMapping = {
      new: { statusColor: "warning", statusText: "Новый" },
      waiting: { statusColor: "warning", statusText: "Принят" },
      confirmed: { statusColor: "info", statusText: "Записан" },
      visited: { statusColor: "secondary", statusText: "Посетил" },
      verification: { statusColor: "primary", statusText: "Ожидание сверки" },
      paid: { statusColor: "success", statusText: "Оплачен" },
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
    console.log(dealID);
    console.log(stageId);
    const data = {
      dealId: dealID,
      stageId: stageId,
    };

    try {
      const resp = await fetch(`/restapi/certificate.changeCertificateStage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log(resp);
      //window.location.reload();
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
            <MDTypography component="a" href={`/tables/${element.ID}`}>
              {element.NUMBER}
            </MDTypography>
          );
          return {
            NUMBER: number,
            TITLE: element.TITLE,
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
            OPPORTUNITY: `${element.OPPORTUNITY}`,
            action:
              element.STAGE.group_id === "new" ? (
                <>
                  <MDTypography
                    component="a"
                    variant="caption"
                    color="text"
                    fontWeight="medium"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleChangeStatus(element.ID, "C2:NEW")}
                  >
                    Принять
                  </MDTypography>
                  <br />
                  <MDTypography
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
                  </MDTypography>
                  <br />
                  <MDTypography
                    component="a"
                    variant="caption"
                    color="text"
                    fontWeight="medium"
                    onClick={() => handleChangeStatus(element.ID, "C2:LOSE")}
                  >
                    Отменить
                  </MDTypography>
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
          <MDBox>
            <MDInput label="Номер телефона" />
            <MDInput label="Номер сертификата" />
            <select
              value={statusFilter || ""}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: "300px",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">Все статусы</option>
              {Object.entries({
                new: "Новый",
                waiting: "Принят",
                confirmed: "Записан",
                visited: "Посетил",
                verification: "Ожидание сверки",
                paid: "Оплачен",
              }).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
            С
            <TextField type="datetime-local" value="" sx={{ mb: 2 }} />
            По
            <TextField type="datetime-local" value="" sx={{ mb: 2 }} />
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
            {Array.from({ length: totalPages }, (_, i) => (
              <MDPagination
                item
                key={i + 1}
                active={currentPage === i + 1}
                onClick={() => {
                  setPage(i + 1);
                }}
              >
                {i + 1}
              </MDPagination>
            ))}
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
            fullWidth
            sx={{ mb: 2 }}
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
    </MDBox>
  );
}
