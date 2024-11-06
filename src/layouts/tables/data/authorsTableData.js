import React from "react";
import Cookies from "js-cookie";
import useDeals from "layouts/tables/data/getDeal";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";

export default function DataComponent() {
    const deals = useDeals();

    const Author = ({name, email}) => (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
            <MDBox ml={2} lineHeight={1}>
                <MDTypography display="block" variant="button" fontWeight="medium">
                    {name}
                </MDTypography>
                <MDTypography variant="caption">{email}</MDTypography>
            </MDBox>
        </MDBox>
    );

    const Job = ({title, phone}) => (
        <MDBox lineHeight={1} textAlign="left">
            <MDTypography
                display="block"
                variant="caption"
                color="text"
                fontWeight="medium"
                style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%',
                }}
            >
                {title}
            </MDTypography>
            {phone && (
                <MDTypography
                    variant="caption"
                    color="text"
                    fontWeight="light"
                    style={{
                        display: 'block',
                        marginTop: '4px', // Добавить немного отступа
                        fontSize: '12px', // Меньший размер шрифта для телефона
                    }}
                >
                    {phone}
                </MDTypography>
            )}
        </MDBox>
    );


    const handleChangeStatus = async (dealID) => {
        const data = {
            domain: window.MyDomain,
            cabinet: window.Cabinet,
            method: "changeDealStatus",
            contactId: Cookies.get("contactid"),
            token: Cookies.get("token"),
            dealId: dealID,
        };
        await fetch(window.BaseDir, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        window.location.reload();
    };

    const dataRows = () => {
        const rows = [];
        if (!deals || typeof deals !== 'object') {
            return rows; // Возвращаем пустой массив, если `deals` не объект или пуст
        }

        Object.values(deals).map((element) => {
            const dateValue = element.SCHEDULE_TIME
                ? new Date(element.SCHEDULE_TIME).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: false,
                })
                : "не записан";

            const statusColor = element.STAGE_ID === "C2:UC_4Q05NY" || element.STAGE_ID === "C2:UC_M7SHZP" ? "success" : "dark";
            const checkLabel = statusColor === "success" ? "" : "Принять";
            const statusText = element.STAGE_ID === "C2:NEW" ? "Не подтвержден" : "Подтвержден";

            rows.push({
                author: <Author name={element.TITLE} email={`Сумма: ${element.OPPORTUNITY} руб.`}/>,
                function: <Job title={element.CONTACT_INFO ? element.CONTACT_INFO.NAME : "Не указан"}
                               phone={element.CONTACT_INFO ? element.CONTACT_INFO.PHONE : "Не указан"}/>,
                status: (
                    <MDBox ml={-1}>
                        <MDBadge badgeContent={statusText} color={statusColor} variant="gradient" size="sm"/>
                    </MDBox>
                ),
                employed: (
                    <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                        {dateValue}
                    </MDTypography>
                ),
                action: (
                    <MDTypography
                        component="a"
                        href="#"
                        variant="caption"
                        color="text"
                        fontWeight="medium"
                        onClick={() => handleChangeStatus(element.ID)}
                    >
                        {checkLabel}
                    </MDTypography>
                ),
            });
        });

        return rows;
    };

    return {
        columns: [
            {Header: "Услуга", accessor: "author", width: "45%", align: "left"},
            {Header: "Контакт", accessor: "function", align: "left"},
            {Header: "Статус", accessor: "status", align: "center"},
            {Header: "Дата записи", accessor: "employed", align: "center"},
            {Header: "", accessor: "action", align: "center"},
        ],
        rows: dataRows(),
    };
}
