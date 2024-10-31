"use client";

import { useEffect } from "react";
import useHash from "./useHash";
import { useApi } from "context";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
    const { makeRequest } = useApi();
    const hash = useHash();
    const navigate = useNavigate();
    window.Cabinet = process.env.REACT_APP_CABINET;

    useEffect(() => {
        const sendYaToken = async () => {
            let fields = {
                provider: "yandex",
                cabinet: window.Cabinet,
                access_token: hash
                    ?.split("&")
                    .find((param) => param.startsWith("access_token="))
                    .split("=")[1],
                domain: process.env.REACT_APP_DOMAIN,
            };
            const data = await makeRequest("auth.oauth", fields);
            if (data.result.token !== undefined) {
                const expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + 1);
                Cookies.set("token", data.result.token, {
                    expires: expirationDate,
                });
                Cookies.set("contactid", data.result.id, {
                    expires: expirationDate,
                });
                Cookies.set("allIds", data.result.allIds, {
                    expires: expirationDate,
                });

                // window.close();
                navigate("/dashboard");
            }
        };

        if (hash && hash.includes("access_token")) {
            sendYaToken();
        }
    }, []);

    return <p>Авторизация...</p>;
};

export default OAuth;
