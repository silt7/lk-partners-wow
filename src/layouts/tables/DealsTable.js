import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import useDeals from "./useDeals";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import DataTableHeadCell from "examples/Tables/DataTable/DataTableHeadCell";

export default function DealsTable() {
  const [isLoading, setIsLoading] = useState(true);
  const { deals, loadDeals, loading, hasMore } = useDeals();

  // Симуляция ожидания данных
  useEffect(() => {
    if (deals) {
      setIsLoading(false); // Данные загружены, устанавливаем isLoading в false
    }
  }, [deals]);

  // Обработчик прокрутки
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      loadDeals();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const Author = ({ name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ title, phone }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography
        display="block"
        variant="caption"
        color="text"
        fontWeight="medium"
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "100%",
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
            display: "block",
            marginTop: "4px", // Добавить немного отступа
            fontSize: "12px", // Меньший размер шрифта для телефона
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
    await fetch(`/api/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    window.location.reload();
  };

  const formatDate = (date) => {
    return date
      ? new Date(date).toLocaleDateString(undefined, {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: false,
        })
      : "не записан";
  };

  const getStatusInfo = (stageId) => {
    const statusMapping = {
      "C2:NEW": { statusColor: "warning", statusText: "У партнера" },
      "C2:UC_4Q05NY": { statusColor: "success", statusText: "Записан" },
      "C2:UC_M7SHZP": { statusColor: "info", statusText: "Ожидает посещения" },
      "C2:UC_6P1BHL": { statusColor: "secondary", statusText: "Отзыв" },
      "C2:UC_77OTP8": { statusColor: "warning", statusText: "Ожидает оплаты" },
      "C2:UC_8W7HSG": { statusColor: "primary", statusText: "Себес" },
      "C2:UC_RPZ7AA": { statusColor: "info", statusText: "Ждем сверку" },
      "C2:WON": { statusColor: "success", statusText: "Выполнен" },
    };

    // Возвращаем значения для найденного stageId, или default значения, если не найден
    return (
      statusMapping[stageId] || {
        statusColor: "dark",
        statusText: "Неизвестный статус",
      }
    );
  };

  const dataRows = () => {
    if (!deals || typeof deals !== "object") {
      return []; // Возвращаем пустой массив, если `deals` не объект или пуст
    }
    return Object.values(deals).map((element) => {
      const { statusColor, statusText } = getStatusInfo(element.STAGE_ID);
      const dateValue = formatDate(element.SCHEDULE_TIME);
      const checkLabel = statusColor === "success" ? "" : "Принять";

      return {
        author: (
          <Author
            name={element.TITLE}
            email={`Сумма: ${element.OPPORTUNITY} руб.`}
          />
        ),
        function: (
          <Job
            title={element.NAME ? element.NAME : "Не указан"}
            phone={
              element.CONTACTS
                ? element.CONTACTS.phones.join(", ")
                : "Не указан"
            }
          />
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge
              badgeContent={statusText}
              color={statusColor}
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
      };
    });
  };

  return (
    <MDBox>
      <table>
        <thead>
          <tr>
            <DataTableHeadCell>Услуга</DataTableHeadCell>
            <DataTableHeadCell>Контакт</DataTableHeadCell>
            <DataTableHeadCell>Статус</DataTableHeadCell>
            <DataTableHeadCell>Дата записи</DataTableHeadCell>
            <DataTableHeadCell>Действие</DataTableHeadCell>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="5">
                <MDTypography variant="h6" color="text" fontWeight="medium">
                  Данные загружаются, подождите...
                </MDTypography>
              </td>
            </tr>
          ) : (
            dataRows().map((row, index) => (
              <tr key={index}>
                <td>{row.author}</td>
                <td>{row.function}</td>
                <td>{row.status}</td>
                <td>{row.employed}</td>
                <td>{row.action}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </MDBox>
  );
}

// import React, { useEffect } from "react";
// import useDeals from "./useDeals";

// export default function DealsTable() {
//   const { deals, loadDeals, loading, hasMore } = useDeals();

//   // Обработчик прокрутки
//   const handleScroll = () => {
//     if (
//       window.innerHeight + document.documentElement.scrollTop >=
//       document.documentElement.offsetHeight - 100
//     ) {
//       loadDeals();
//     }
//   };

//   useEffect(() => {
//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, [handleScroll]);

//   return (
//     <div>
//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Название</th>
//             <th>Сумма</th>
//             <th>Имя</th>
//             <th>Дата</th>
//           </tr>
//         </thead>
//         <tbody>
//           {deals.map((deal) => (
//             <tr key={deal.ID}>
//               <td>{deal.ID}</td>
//               <td>{deal.TITLE}</td>
//               <td>{deal.OPPORTUNITY}</td>
//               <td>{deal.NAME}</td>
//               <td>{deal.SCHEDULE_TIME}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       {loading && <p>Загрузка...</p>}
//       {!hasMore && <p>Все сделки загружены.</p>}
//     </div>
//   );
// }
