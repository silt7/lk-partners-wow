import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';

import { Header } from './Header';
import { Content } from './Content';

import useGetProfile from '../hooks/useGetProfile';
import {CircularProgress} from "@mui/material";
import React from "react";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";


export const Profile = () => {
    const data = useGetProfile();

    const isLoading = !data || !data.headerData;

    return (
        <DashboardLayout>
            <DashboardNavbar />

            {isLoading ? (
                <MDBox display="flex" flexDirection="column" alignItems="center" mt={4}>
                    <CircularProgress color="info" />
                    <MDTypography>Загрузка...</MDTypography>
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
        </DashboardLayout>
    );
};
