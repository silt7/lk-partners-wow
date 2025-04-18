import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Grid from "@mui/material/Grid";
import GetCertPosetil from "./getCertPosetil";

const CertTable = () => {
  const [certData, setCertData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await GetCertPosetil();
      setCertData(data);
    };

    fetchData();
  }, []);

  return (
    <MDBox pt={6} pb={3} mx={2}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <MDTypography variant="h6">Таблица Сертификатов</MDTypography>
          <MDBox pt={3}>
            <table>
              <thead>
                <tr>
                  <th>Номер Сертификата</th>
                  <th>Имя Посетителя</th>
                  <th>Статус</th>
                  <th>Дата</th>
                </tr>
              </thead>
              <tbody>
                {certData?.map((cert) => (
                  <tr key={cert.ID}>
                    <td>{cert.ID}</td>
                    <td>{cert.NAME}</td>
                    <td>{cert.STAGE_ID}</td>
                    <td>{new Date(cert.SCHEDULE_TIME).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </MDBox>
        </Grid>
      </Grid>
    </MDBox>
  );
};

export default CertTable;
