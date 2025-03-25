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

/**
  This file is used for controlling the global states of the components,
  you can customize the states for the different components here.
*/

import { createContext, useContext, useReducer, useMemo } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

import Cookies from "js-cookie";

// Material Dashboard 2 React main context
const MaterialUI = createContext();
const Context = createContext();

// Setting custom name for the context which is visible on react dev tools
MaterialUI.displayName = "MaterialUIContext";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// Material Dashboard 2 React reducer
function reducer(state, action) {
  switch (action.type) {
    case "MINI_SIDENAV": {
      return { ...state, miniSidenav: action.value };
    }
    case "TRANSPARENT_SIDENAV": {
      return { ...state, transparentSidenav: action.value };
    }
    case "WHITE_SIDENAV": {
      return { ...state, whiteSidenav: action.value };
    }
    case "SIDENAV_COLOR": {
      return { ...state, sidenavColor: action.value };
    }
    case "TRANSPARENT_NAVBAR": {
      return { ...state, transparentNavbar: action.value };
    }
    case "FIXED_NAVBAR": {
      return { ...state, fixedNavbar: action.value };
    }
    case "OPEN_CONFIGURATOR": {
      return { ...state, openConfigurator: action.value };
    }
    case "DIRECTION": {
      return { ...state, direction: action.value };
    }
    case "LAYOUT": {
      return { ...state, layout: action.value };
    }
    case "DARKMODE": {
      return { ...state, darkMode: action.value };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

// Material Dashboard 2 React context provider
function MaterialUIControllerProvider({ children }) {
  const initialState = {
    miniSidenav: false,
    transparentSidenav: false,
    whiteSidenav: false,
    sidenavColor: "info",
    transparentNavbar: true,
    fixedNavbar: true,
    openConfigurator: false,
    direction: "ltr",
    layout: "dashboard",
    darkMode: false,
  };

  const [controller, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);

  return <MaterialUI.Provider value={value}>{children}</MaterialUI.Provider>;
}

// Material Dashboard 2 React custom hook for using context
function useMaterialUIController() {
  const context = useContext(MaterialUI);

  if (!context) {
    throw new Error(
      "useMaterialUIController should be used inside the MaterialUIControllerProvider."
    );
  }

  return context;
}

// Typechecking props for the MaterialUIControllerProvider
MaterialUIControllerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Context module functions
const setMiniSidenav = (dispatch, value) =>
  dispatch({ type: "MINI_SIDENAV", value });
const setTransparentSidenav = (dispatch, value) =>
  dispatch({ type: "TRANSPARENT_SIDENAV", value });
const setWhiteSidenav = (dispatch, value) =>
  dispatch({ type: "WHITE_SIDENAV", value });
const setSidenavColor = (dispatch, value) =>
  dispatch({ type: "SIDENAV_COLOR", value });
const setTransparentNavbar = (dispatch, value) =>
  dispatch({ type: "TRANSPARENT_NAVBAR", value });
const setFixedNavbar = (dispatch, value) =>
  dispatch({ type: "FIXED_NAVBAR", value });
const setOpenConfigurator = (dispatch, value) =>
  dispatch({ type: "OPEN_CONFIGURATOR", value });
const setDirection = (dispatch, value) =>
  dispatch({ type: "DIRECTION", value });
const setLayout = (dispatch, value) => dispatch({ type: "LAYOUT", value });
const setDarkMode = (dispatch, value) => dispatch({ type: "DARKMODE", value });

export {
  MaterialUIControllerProvider,
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
  setSidenavColor,
  setTransparentNavbar,
  setFixedNavbar,
  setOpenConfigurator,
  setDirection,
  setLayout,
  setDarkMode,
};
const domain = process.env.REACT_APP_DOMAIN;
const endPoint = process.env.REACT_APP_BASE_URL;

export const ApiProvider = ({ children }) => {
  const client_id = process.env.REACT_APP_YANDEX_CLIENT_ID;

  // const makeRequest = async (method, data) => {
  //   console.log(method);
  //   data.domain = domain;
  //   try {
  //     if (endPoint !== undefined) {
  //       const response = await fetch(`/api/` + method, {
  //         method: "POST",
  //         headers: {
  //           Accept: "application/json",
  //         },
  //         body: JSON.stringify(data),
  //       });

  //       if (!response.ok) {
  //         throw new Error(
  //           `Ошибка запроса - fetch: ${response.status} ${response.statusText}`
  //         );
  //       }

  //       return await response.json();
  //     }
  //   } catch (error) {
  //     console.error("Ошибка запроса:", error);
  //     throw error;
  //   }
  // };
  const makeRequest = async (method, data) => {
    data.domain = domain;
    if (!data.city) {
      data.city = "msk";
    }
    //data.t = new Date().getTime(); проверка кешируется ли запрос
    try {
      if (endPoint !== undefined) {
        // const response = await axios.post(endPoint + method, data, {
        //   headers: {
        //     Accept: "application/json",
        //   },
        // });
        const response = await fetch("/restapi/secure-handler", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-API-Key": process.env.SECURE_API_KEY,
          },
          body: JSON.stringify({
            endpoint: endPoint,
            method: method,
            fields: data,
          }),
        });

        if (!response.ok) {
          throw new Error(
            `Ошибка запроса - fetch: ${response.status} ${response.statusText}`
          );
        }

        return await response.json();
      }
    } catch (error) {
      console.error("Ошибка запроса:", error);
      throw error;
    }
  };

  return (
    <Context.Provider
      value={{
        makeRequest,
        endPoint,
        domain,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useApi = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useApi должен использоваться внутри ApiProvider");
  }
  return context;
};
