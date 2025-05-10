import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';

import { Header } from './Header';
import { Content } from './Content';

import useGetProfile from '../hooks/useGetProfile';
import Typography from "../../../assets/theme/base/typography";
import Box from "@mui/material/Box";
import {CircularProgress} from "@mui/material";


export const Profile = () => {
    const data = useGetProfile();

    const isLoading = !data || !data.headerData;

    return (
        <DashboardLayout>
            <DashboardNavbar />

            {isLoading ? (
                <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
                    <CircularProgress color="info" />
                    <Typography variant="body2" color="textSecondary" mt={2}>
                        Загрузка...
                    </Typography>
                </Box>
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
