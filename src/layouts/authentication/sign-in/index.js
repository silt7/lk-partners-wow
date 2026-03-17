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

import { useState } from "react";

// react-router-dom components

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

import { useNavigate } from "react-router-dom";

import Cookies from "js-cookie";
import YandexButton from "./YandexButton";

import InputMask from "react-input-mask";
import TextField from "@mui/material/TextField";

function Basic() {
  const [authMethod, setAuthMethod] = useState("phone"); // "phone" | "email" | "login"
  const [showButtonCode, setShowButtonCode] = useState(true);
  const [showButtonIn, setShowButtonIn] = useState(false);
  const [inputContact, setInputContact] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleChangeContact = (event) => {
    setInputContact(event.target.value);
  };
  const handleChangeCode = (event) => {
    setInputCode(event.target.value);
  };
  const handleChangeLogin = (event) => {
    setLogin(event.target.value);
  };
  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };
  // number mask clean
  const cleanNumber = "+" + inputContact.replace(/[^\d]/g, "");

  const buttonCodeClick = async () => {
    if (authMethod === "login") {
      return;
    }
    const contactValue =
      authMethod === "phone" ? cleanNumber : inputContact.trim();

    const data = {
      domain: window.MyDomain,
      cabinet: window.Cabinet,
      contact: contactValue,
      method: authMethod,
    };

    try {
      const response = await fetch(`/restapi/auth.getCode`, {
        // Добавляем auth.getCode к адресу
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const resultData = await response.json();

      if (resultData.result == null) {
        alert("Данные не отправлены");
      } else if (resultData.result === "notfound") {
        alert("Пользователь не найден");
      } else if (resultData.result === "notdomain") {
        alert("Домена нет в базе");
      } else if (resultData.result === "notauth") {
        alert("Проблема c классом авторизации");
      } else if (resultData.result === "notgetcode") {
        alert("Ошибка в функции получения кода активации");
      } else if (resultData.result === "nottokenbitrix") {
        alert("Отсутствует токен для подключения битрикс");
      } else if (resultData.result === "moreone") {
        alert("Найдено несколько контактов с этими данными");
      } else {
        setShowButtonCode(false);
        setShowButtonIn(true);
      }
    } catch (error) {
      console.error("Произошла ошибка", error);
      alert("Произошла ошибка при выполнении запроса."); // Добавляем сообщение пользователю
    }
  };

  const buttonInClick = async () => {
    try {
      let responseData;

      if (authMethod === "login") {
        const data = {
          domain: window.MyDomain,
          cabinet: window.Cabinet,
          login,
          password,
        };

        const response = await fetch(`/restapi/auth.authorization`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        responseData = await response.json();
      } else {
        const contactValue =
          authMethod === "phone"
            ? "+7" + inputContact.replace(/\D/g, "").slice(-10)
            : inputContact.trim();

        const data = {
          domain: window.MyDomain,
          cabinet: window.Cabinet,
          contact: contactValue,
          code: inputCode,
          method: authMethod,
        };

        const response = await fetch(`/restapi/auth.authentication`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        responseData = await response.json();
      }

      if (responseData.result === "notcode") {
        alert("Неправильный код");
      }
      if (responseData.result === "not3m") {
        alert("Прошло более 3 минут, получите новый код");
        setShowButtonCode(true);
        setShowButtonIn(false);
      }
      if (responseData.result === false) {
        alert("Неверный логин или пароль");
      }

      if (responseData.result.id && responseData.result.token) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);
        Cookies.set("token", responseData.result.token, {
          expires: expirationDate,
        });
        Cookies.set("contactid", responseData.result.id, {
          expires: expirationDate,
        });
        Cookies.set("allIds", responseData.result.allIds, {
          expires: expirationDate,
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Произошла ошибка", error);
      alert("Произошла ошибка при выполнении запроса.");
    }
  };
  const buttonLoginClick = async () => {
    try {
      const data = {
        domain: window.MyDomain,
        cabinet: window.Cabinet,
        method: "password",
        login,
        password,
      };
      const response = await fetch(`/restapi/auth.goPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.result === "notfound") {
        alert("Пользователь не найден");
      } else if (result.result === "empty_credentials") {
        alert("Не заполнены логин или пароль");
      } else if (result.result === "notpassword") {
        alert("Неверный пароль");
      } else if (result.result === "blocked") {
        alert("Более 3 попыток, аккаунт заблокирован на минуту");
      } else if (result.result === "inactive") {
        alert("Аккаунт не активен");
      } else if (result.result.result === "success") {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);
        Cookies.set("token", result.result.token, {
          expires: expirationDate,
        });
        Cookies.set("contactid", result.result.id, {
          expires: expirationDate,
        });
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Произошла ошибка", error);
      alert("Произошла ошибка при выполнении запроса.");
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Вход в личный кабинет
          </MDTypography>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            sx={{ mt: 1, mb: 2 }}
          >
            {/* <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid> */}
            {/* <Grid item xs={2}>
              <MDTypography
                component={YandexButton}
                variant="body1"
                color="white"
              ></MDTypography>
            </Grid> */}
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox display="flex" justifyContent="center" mb={2}>
              <MDButton
                variant={authMethod === "phone" ? "gradient" : "outlined"}
                color="info"
                onClick={() => {
                  setAuthMethod("phone");
                  setInputContact("");
                  setInputCode("");
                  setLogin("");
                  setPassword("");
                  setShowButtonCode(true);
                  setShowButtonIn(false);
                }}
                sx={{ mr: 1 }}
              >
                SMS
              </MDButton>
              <MDButton
                variant={authMethod === "email" ? "gradient" : "outlined"}
                color="info"
                onClick={() => {
                  setAuthMethod("email");
                  setInputContact("");
                  setInputCode("");
                  setLogin("");
                  setPassword("");
                  setShowButtonCode(true);
                  setShowButtonIn(false);
                }}
                sx={{ mr: 1 }}
              >
                email
              </MDButton>
              <MDButton
                variant={authMethod === "login" ? "gradient" : "outlined"}
                color="info"
                onClick={() => {
                  setAuthMethod("login");
                  setInputContact("");
                  setInputCode("");
                  setLogin("");
                  setPassword("");
                  setShowButtonCode(false);
                  setShowButtonIn(false);
                }}
              >
                Пароль
              </MDButton>
            </MDBox>
            <MDBox mb={2}>
              {authMethod === "phone" ? (
                <InputMask
                  mask="+7 (999) 999-99-99"
                  value={inputContact}
                  onChange={handleChangeContact}
                >
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      label="Телефон"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                </InputMask>
              ) : authMethod === "email" ? (
                <MDInput
                  type="email"
                  label="Email"
                  fullWidth
                  value={inputContact}
                  onChange={handleChangeContact}
                />
              ) : (
                <>
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="Логин"
                      fullWidth
                      value={login}
                      onChange={handleChangeLogin}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="password"
                      label="Пароль"
                      fullWidth
                      value={password}
                      onChange={handleChangePassword}
                    />
                  </MDBox>
                  <MDBox mt={4} mb={1}>
                    <MDButton
                      variant="gradient"
                      color="info"
                      fullWidth
                      onClick={buttonLoginClick}
                    >
                      Войти
                    </MDButton>
                  </MDBox>
                </>
              )}
            </MDBox>
            {showButtonIn && authMethod !== "login" && (
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Код"
                  fullWidth
                  value={inputCode}
                  onChange={handleChangeCode}
                />
              </MDBox>
            )}
            {/* <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox> */}
            {showButtonCode && (
              <MDBox mt={4} mb={1}>
                <MDButton
                  variant="gradient"
                  color="info"
                  fullWidth
                  onClick={buttonCodeClick}
                >
                  Получить код
                </MDButton>
              </MDBox>
            )}
            {showButtonIn && (
              <MDBox mt={4} mb={1}>
                <MDButton
                  variant="gradient"
                  color="info"
                  fullWidth
                  onClick={buttonInClick}
                >
                  Войти
                </MDButton>
              </MDBox>
            )}
            {/* <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox> */}
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
