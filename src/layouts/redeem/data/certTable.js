import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Grid from "@mui/material/Grid";
import GetCertPosetil from "./getCertPosetil";
import DataTable from "examples/Tables/DataTable2";

const CertTable = () => {
  const [certData, setCertData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await GetCertPosetil();
      setCertData(data);
    };

    fetchData();
  }, []);

  const columns = [
    { Header: "Номер", accessor: "NUMBER" },
    { Header: "Сертификат", accessor: "TITLE" },
    { Header: "Имя Посетителя", accessor: "NAME" },
    { Header: "Цена", accessor: "OPPORTUNITY" },
    {
      Header: "Дата",
      accessor: "SCHEDULE_TIME",
      Cell: ({ value }) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <MDBox pt={6} pb={3} mx={2}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <MDBox pt={3}>
            {certData && certData.length > 0 ? (
              <DataTable
                table={{ columns, rows: certData }}
                canSearch
                entriesPerPage={{ defaultValue: 10 }}
                showTotalEntries
                noEndBorder
              />
            ) : (
              <MDBox
                display="flex"
                justifyContent="center"
                alignItems="center"
                p={3}
              >
                <MDTypography
                  variant="button"
                  color="text"
                  fontWeight="regular"
                >
                  Сертификаты на сверку отсутствуют
                </MDTypography>
              </MDBox>
            )}
          </MDBox>
        </Grid>
      </Grid>
    </MDBox>
  );
};

export default CertTable;
