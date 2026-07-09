import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import GetProfile from "layouts/profile/data/getProfile";

const INSTRUCTIONS_FIELDS = [
  "UF_CRM_PARTNER_INSTRUCTIONS",
  "INSTRUCTIONS",
  "UF_CRM_1692620240676",
];

const MANAGERS_FIELDS = [
  "UF_CRM_PARTNER_MANAGERS",
  "MANAGERS",
  "UF_CRM_1684102732248",
];

const MANAGERS_FALLBACK = {
  telegram: "https://t.me/wowlifepartners",
  email: "oplata@wowlife.club",
};

function firstNotEmpty(profile, fields) {
  if (!profile) return null;
  return fields.reduce((result, field) => {
    if (result) return result;
    const value = profile[field];
    if (Array.isArray(value)) return value.length > 0 ? value : null;
    if (typeof value === "string") return value.trim() ? value : null;
    if (value && typeof value === "object") return value;
    return null;
  }, null);
}

function normalizeInstructionDocs(rawValue) {
  if (!rawValue) return [];

  if (Array.isArray(rawValue)) {
    return rawValue
      .map((item, index) => {
        if (typeof item === "string") {
          return {
            title: `Документ ${index + 1}`,
            url: item.trim(),
          };
        }

        if (item && typeof item === "object") {
          return {
            title: item.originalName || item.name || item.title || `Документ ${index + 1}`,
            url: item.downloadUrl || item.url || item.link || "",
          };
        }

        return null;
      })
      .filter((item) => item?.url);
  }

  if (typeof rawValue === "string") {
    const trimmed = rawValue.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      return normalizeInstructionDocs(parsed);
    } catch (error) {
      return trimmed
        .split("\n")
        .map((line, index) => {
          const [titlePart, urlPart] = line.split("|");
          const title = (titlePart || "").trim() || `Документ ${index + 1}`;
          const url = (urlPart || titlePart || "").trim();
          return { title, url };
        })
        .filter((doc) => doc.url);
    }
  }

  return [];
}

function parseManagerLine(line) {
  const [namePart, emailPart, phonePart, telegramPart] = line
    .split("|")
    .map((part) => part.trim());

  return {
    name: namePart || "",
    email: emailPart || "",
    phone: phonePart || "",
    telegram: telegramPart || "",
  };
}

function normalizeManagers(rawValue) {
  if (!rawValue) return [];

  if (Array.isArray(rawValue)) {
    return rawValue
      .map((item) => {
        if (typeof item === "string") {
          return parseManagerLine(item);
        }

        if (item && typeof item === "object") {
          return {
            name: item.name || item.fullName || "",
            email: item.email || "",
            phone: item.phone || "",
            telegram: item.telegram || item.tg || "",
          };
        }

        return null;
      })
      .filter((manager) => manager && (manager.name || manager.email || manager.phone));
  }

  if (typeof rawValue === "string") {
    const trimmed = rawValue.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      return normalizeManagers(parsed);
    } catch (error) {
      return trimmed
        .split("\n")
        .map((line) => parseManagerLine(line))
        .filter((manager) => manager.name || manager.email || manager.phone);
    }
  }

  if (typeof rawValue === "object") {
    return normalizeManagers([rawValue]);
  }

  return [];
}

function InstructionsAndContacts() {
  const profile = GetProfile();

  const documents = normalizeInstructionDocs(firstNotEmpty(profile, INSTRUCTIONS_FIELDS));
  const managers = normalizeManagers(firstNotEmpty(profile, MANAGERS_FIELDS));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h5" fontWeight="medium" mb={1}>
                  Инструкции по работе с ЛК
                </MDTypography>
                <MDTypography variant="button" color="text" mb={2} display="block">
                  Здесь размещаются документы по работе в личном кабинете.
                </MDTypography>
                <Divider sx={{ mb: 2 }} />

                {documents.length > 0 ? (
                  <MDBox component="ol" sx={{ m: 0, pl: 2.5 }}>
                    {documents.map((doc) => (
                      <MDBox component="li" key={doc.url} sx={{ mb: 1 }}>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          {doc.title}
                        </a>
                      </MDBox>
                    ))}
                  </MDBox>
                ) : (
                  <MDTypography variant="button" color="text">
                    Инструкции пока не добавлены. Контент можно заполнить в админ-панели WOWlife.
                  </MDTypography>
                )}
              </MDBox>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h5" fontWeight="medium" mb={1}>
                  Контакты менеджеров WOWlife
                </MDTypography>
                <MDTypography variant="button" color="text" mb={2} display="block">
                  Для оперативной связи используйте контакты ниже.
                </MDTypography>
                <Divider sx={{ mb: 2 }} />

                {managers.length > 0 ? (
                  <Grid container spacing={2}>
                    {managers.map((manager, index) => (
                      <Grid item xs={12} md={6} key={`${manager.name}-${index}`}>
                        <Card variant="outlined">
                          <MDBox p={2}>
                            <MDTypography variant="h6" fontWeight="regular" mb={1}>
                              {manager.name || `Менеджер ${index + 1}`}
                            </MDTypography>
                            {manager.phone && (
                              <MDTypography variant="button" color="text" display="block">
                                Телефон: {manager.phone}
                              </MDTypography>
                            )}
                            {manager.email && (
                              <MDTypography variant="button" color="text" display="block">
                                Почта: <a href={`mailto:${manager.email}`}>{manager.email}</a>
                              </MDTypography>
                            )}
                            {manager.telegram && (
                              <MDTypography variant="button" color="text" display="block">
                                Telegram:{" "}
                                <a
                                  href={
                                    manager.telegram.startsWith("http")
                                      ? manager.telegram
                                      : `https://t.me/${manager.telegram.replace("@", "")}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {manager.telegram}
                                </a>
                              </MDTypography>
                            )}
                          </MDBox>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <MDTypography variant="button" color="text">
                    Контакты менеджеров пока не заполнены. Для связи:{" "}
                    <a href={MANAGERS_FALLBACK.telegram} target="_blank" rel="noopener noreferrer">
                      @wowlifepartners
                    </a>{" "}
                    или{" "}
                    <a href={`mailto:${MANAGERS_FALLBACK.email}`}>{MANAGERS_FALLBACK.email}</a>.
                  </MDTypography>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default InstructionsAndContacts;
