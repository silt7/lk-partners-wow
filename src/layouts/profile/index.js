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

// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfilesList from "examples/Lists/ProfilesList";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

// Data
import profilesListData from "layouts/profile/data/profilesListData";
import GetProfile from "layouts/profile/data/getProfile";

// Images
// import homeDecor1 from "assets/images/home-decor-1.jpg";
// import homeDecor2 from "assets/images/home-decor-2.jpg";
// import homeDecor3 from "assets/images/home-decor-3.jpg";
// import homeDecor4 from "assets/images/home-decor-4.jpeg";
// import team1 from "assets/images/team-1.jpg";
// import team2 from "assets/images/team-2.jpg";
// import team3 from "assets/images/team-3.jpg";
// import team4 from "assets/images/team-4.jpg";

import React, { useState, useEffect } from "react";
import ProfileInfoCard from "./components/ProfileInfoCard";
import ChannelsCard from "./components/channels";

function parseContactDetails(data) {
  if (typeof data !== "string") return { name: "", email: "", phone: "" };

  // Регулярное выражение для поиска email и телефона
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRegex =
    /(\+?\d{1,3}[-.\s]?)(\d{3}|\(\d{3}\))[-.\s]?\d{3}[-.\s]?\d{2}[-.\s]?\d{2}/;

  const emailMatch = data.match(emailRegex);
  const phoneMatch = data.match(phoneRegex);

  let name = "";
  let email = "";
  let phone = "";

  if (emailMatch) {
    email = emailMatch[0];
    data = data.replace(email, "").trim();
  }

  if (phoneMatch) {
    phone = phoneMatch[0];
    data = data.replace(phone, "").trim();
  }

  name = data.trim();

  return { name, email, phone };
}

function Overview() {
  const profile = GetProfile();

  const { name, email, phone } = parseContactDetails(
    profile?.UF_CRM_1684102732248
  );

  // Добавляем объект профиля по умолчанию
  const defaultProfile = {
    TITLE: "Название компании",
    result: {
      DESCRIPTION: "Описание компании",
    },
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Header profile={profile || defaultProfile}>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <ProfileInfoCard
                title="Контакты"
                description="Основная информация о контакте"
                info={{
                  Сайты:
                    profile?.WEB?.map((item, index) => (
                      <div key={index}>
                        {index + 1}) {item.VALUE}
                      </div>
                    )) || "Не указаны",
                  Почта: profile?.EMAIL || "Не указана",
                  Телефон: profile?.PHONE || "Не указан",
                  "Контакт ОЛ": name || "Не указан",
                  "Почта ОЛ": email || "Не указана",
                  "Телефон ОЛ": phone || "Не указан",
                  Локация: profile?.UF_CRM_1684102866982 || "Не указана",
                }}
              />
              {/*<Divider orientation="vertical" sx={{ mx: 0 }} />*/}
            </Grid>
            {/*Канал связи для уведомлений*/}
            <Grid item xs={12} xl={6}>
              <ChannelsCard />
              {/*<Divider orientation="vertical" sx={{ mx: 0 }} />*/}
            </Grid>
            {/*Локация и рабочее время*/}
            <Grid item xs={12} xl={6}>
              <ProfileInfoCard
                title="Локация и рабочее время"
                description="Основная информация о контакте"
                info={{
                  "Адреса проведения услуг (может быть несколько)":
                    profile?.UF_CRM_1692176867840?.map((address, index) => (
                      <div key={index}>
                        {index + 1}) {address}
                      </div>
                    )) || "Не указаны",
                }}
              />
              {/*<Divider orientation="vertical" sx={{ mx: 0 }} />*/}
            </Grid>
            {/*Документы*/}
            <Grid item xs={12} xl={6}>
              <ProfileInfoCard
                title="Документы"
                description="Основная информация о контакте"
                info={{
                  "Прикрепленный договор (PDF, DOCX)": profile
                    ?.UF_CRM_1692620240676?.[0] ? (
                    <a
                      href={profile.UF_CRM_1692620240676[0].downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {profile.UF_CRM_1692620240676[0].originalName || "ссылка"}
                    </a>
                  ) : (
                    ""
                  ),
                  // "Дополнительные соглашения (может быть несколько)": "",
                }}
              />
              {/*<Divider orientation="vertical" sx={{ mx: 0 }} />*/}
            </Grid>
            {/*Финансовые реквизиты*/}
            <Grid item xs={12} xl={6}>
              <ProfileInfoCard
                title="Финансовые реквизиты"
                description="Основная информация о контакте"
                info={{
                  "Название юридического лица":
                    profile?.REQUISITES[0]?.RQ_COMPANY_FULL_NAME || "",
                  ИНН: profile?.REQUISITES[0]?.RQ_INN || "",
                  ОГРНИП: profile?.REQUISITES[0]?.RQ_OGRNIP || "",
                  КПП: profile?.REQUISITES[0]?.RQ_KPP || "",
                  ОГРН: profile?.REQUISITES[0]?.RQ_OGRN || "",
                  // "Банковские реквизиты (БИК, расчетный счет)":
                  //   profile?.REQUISITES[0].RQ_BANK_DETAILS || "",
                  // "Юридический адрес":
                  //   profile?.REQUISITES[0].RQ_COMPANY_ADDRESS || "",
                }}
              />
              {/*<Divider orientation="vertical" sx={{ mx: 0 }} />*/}
            </Grid>
            {/*Дополнительная информация*/}
            <Grid item xs={12} xl={6}>
              <ProfileInfoCard
                title="Дополнительная информация"
                info={{
                  "Важно знать": profile?.UF_CRM_1684102959619 || "",
                }}
              />
              {/*<Divider orientation="vertical" sx={{ mx: 0 }} />*/}
            </Grid>
          </Grid>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
