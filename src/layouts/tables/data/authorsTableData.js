/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

// Images
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import GetDeal from "layouts/tables/data/getDeal";

import Cookies from "js-cookie";

export default function data() {
  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      {/* <MDAvatar src={image} name={name} size="sm" /> */}
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography
        display="block"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  const handleChangeStatus = (dealID) => {
    const data = {
      domain: window.MyDomain,
      cabinet: window.Cabinet,
      method: "changeDealStatus",
      contactId: Cookies.get("contactid"),
      token: Cookies.get("token"),
      dealId: dealID,
    };
    const response = fetch(window.BaseDir, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    window.location.reload();
  };

  const dataRows = () => {
  const deals = GetDeal();
    let obj = {};
    let arr = [];
    if (deals !== null) {
      deals.forEach((element) => {
        let formattedDate = "";
        if (element.UF_CRM_1654155455356 !== "") {
          const date = new Date(element.UF_CRM_1654155455356); // Умножаем на 1000, так как JavaScript использует миллисекунды, а не секунды
          const options = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: false, // 24-часовой формат времени
          };
          formattedDate = date.toLocaleDateString(undefined, options);
        } else {
          formattedDate = "не записан";
        }

        element.COLOR = "dark";
        element.CHECK = "Принять";
        if (element.STAGE_ID === "C2:NEW") {
          element.STAGE_ID = "Не подтвержден";
        }
        if (
          element.STAGE_ID === "C2:UC_4Q05NY" ||
          element.STAGE_ID === "C2:UC_M7SHZP"
        ) {
          element.STAGE_ID = "Подтвержден";
          element.COLOR = "success";
          element.CHECK = "";
        }

        obj = {
          author: (
            <Author
              image=""
              name={element.TITLE}
              email={"Сумма: " + element.OPPORTUNITY + " руб."}
            />
          ),
          function: <Job title={element.CONTACTS.NAME} description="" />,
          status: (
            <MDBox ml={-1}>
              <MDBadge
                badgeContent={element.STAGE_ID}
                color={element.COLOR}
                variant="gradient"
                size="sm"
              />
            </MDBox>
          ),
          employed: (
            <MDTypography
              component="a"
              href="#"
              variant="caption"
              color="text"
              fontWeight="medium"
            >
              {formattedDate}
            </MDTypography>
          ),
          action: (
            <MDTypography
              component="a"
              href="#"
              variant="caption"
              color="text"
              fontWeight="medium"
              onClick={handleChangeStatus.bind(null, element.ID)}
            >
              {element.CHECK}
            </MDTypography>
          ),
        };
        arr.push(obj);
      });
    }
    return arr;
  };

  return {
    columns: [
      { Header: "Услуга", accessor: "author", width: "45%", align: "left" },
      { Header: "Контакт", accessor: "function", align: "left" },
      { Header: "Статус", accessor: "status", align: "center" },
      { Header: "Дата записи", accessor: "employed", align: "center" },
      { Header: "", accessor: "action", align: "center" },
    ],

    rows: dataRows(),
  };
}
