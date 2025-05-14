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
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)(\d{3}|\(\d{3}\))[-.\s]?\d{3}[-.\s]?\d{2}[-.\s]?\d{2}/;

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
  console.log(profile);

  const { name, email, phone } = parseContactDetails(profile?.UF_CRM_1684102732248);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      {profile?.result !== null && (
        <Header profile={profile}>
          <MDBox mt={5} mb={3}>
            <Grid container spacing={1}>
                {/*Контактные данные*/}
                <Grid item xs={12} md={6}>
                  <ProfileInfoCard
                      title="Контактные данные"
                      description="Основная информация о контакте"
                      info={{
                          Контакт: name || "Не указан",
                          Почта: email || "Не указана",
                          Телефон: phone || "Не указан",
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
                            'Адреса проведения услуг (может быть несколько)': "", // profile?.UF_CRM_1684102732248 || "",
                            'График работы (часы работы для каждого дня недели)': "",
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
                            'Прикрепленный договор (PDF, DOCX)': profile?.UF_CRM_1684102807864 || "",
                            'Дополнительные соглашения (может быть несколько)': ""
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
                            'Название юридического лица': "", //profile?.UF_CRM_1684102732248 || "",
                            'ИНН': "",
                            'КПП': "",
                            'ОГРН': "",
                            'Банковские реквизиты (БИК, расчетный счет)': "",
                            'Юридический адрес': ""
                        }}
                    />
                    {/*<Divider orientation="vertical" sx={{ mx: 0 }} />*/}
                </Grid>
                {/*Дополнительная информация*/}
                <Grid item xs={12} xl={6}>
                    <ProfileInfoCard
                        title="Дополнительная информация"
                        info={{
                            'Поле "Важно знать" (текст, который партнер хочет передавать клиенту при подтверждении записи)': '', //profile?.UF_CRM_1684102732248 || "",
                        }}
                    />
                    {/*<Divider orientation="vertical" sx={{ mx: 0 }} />*/}
                </Grid>
            </Grid>
          </MDBox>
        </Header>
      )}
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
