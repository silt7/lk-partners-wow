import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { useParams } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import useDeals from "../tables/data/useDeals";
import { useState, useEffect, useCallback } from "react";
import CertificateCard from "./components/CertificateCard";

function Cert() {
  const { id } = useParams();
  //   const [certificate, setCertificate] = useState(null);
  const { deals, loadDeals } = useDeals(1, {});
  useEffect(() => {
    loadDeals(1, { certificate_id: id });
  }, [id]);

  console.log('deals', deals)

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Сертификат {id}
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <MDBox p={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      {/*<MDBox>*/}
                      {/*  <pre style={{ whiteSpace: "pre-wrap" }}>*/}
                      {/*    {JSON.stringify(deals, null, 2)}*/}
                      {/*  </pre>*/}
                      {/*</MDBox>*/}
                      <MDBox pt={3} px={3}>
                        {deals && deals.length > 0 ? (
                            <CertificateCard data={deals[0]} />
                        ) : (
                            <MDTypography>Сертификат не найден</MDTypography>
                        )}
                      </MDBox>
                    </Grid>
                  </Grid>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Cert;
