import Cookies from "js-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SingOut() {
    const navigate = useNavigate();

    useEffect(() => {
        // Удаляем куки
        Cookies.remove("clientId");
        Cookies.remove("token");
        Cookies.remove("allIds");

        // Перенаправляем на страницу входа
        navigate("/authentication/sign-in");
    }, [navigate]);

    return <div>Signing out...</div>;
}

export default SingOut;
