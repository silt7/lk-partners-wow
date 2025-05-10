import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import List from '@mui/material/List';

export const GeneralInfoSection = ({mainInfo}) => {
    console.log(mainInfo);
    return (
        <MDBox
            bgColor="light"
            shadow="xl"
            borderRadius="lg"
            px={2}
            py={1}
            mt={2}
            color="light"
        >
            <MDBox
                bgColor="dark"
                shadow="lg"
                borderRadius="lg"
                px={2}
                py={1}
                color="light"
            >
                <MDTypography color="light" variant="h3">
                    Контактные данные
                </MDTypography>
                <List>
                    
                </List>
            </MDBox>
        </MDBox>
    );
};
