import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';

import { Header } from './Header';
import { Content } from './Content';

import useGetProfile from '../hooks/useGetProfile';
import {CircularProgress} from "@mui/material";
import React from "react";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";


export const Profile = () => {
    const data = useGetProfile();

    const isLoading = !data || !data.headerData;

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
                                    Профиль
                                </MDTypography>
                            </MDBox>

                            {isLoading ? (
                                <MDBox display="flex" flexDirection="column" alignItems="center" mt={4} p={3}>
                                    <CircularProgress color="info" />
                                    {/*<MDTypography>Загрузка...</MDTypography>*/}
                                </MDBox>
                            ) : (
                                <>
                                    <Header {...data.headerData} />
                                    <Content
                                        mainInfo={data.mainInfo}
                                        schedule={data.schedule}
                                        requisites={data.requisites}
                                        additionalInfo={data.additionalInfo}
                                    />
                                </>
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>



        </DashboardLayout>
    );
};
