import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import List from '@mui/material/List';

export const GeneralInfoSection = ({mainInfo, schedule, requisites, additionalInfo}) => {
    console.log('GeneralInfoSection mainInfo', mainInfo);
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
                {/*============*/}
                <MDTypography color="light" variant="h3">
                    Контактные данные
                </MDTypography>
                {/*<List>*/}
                {/*    */}
                {/*</List>*/}
                <MDTypography variant="body2" component="div" style={{ whiteSpace: 'pre-wrap', color: 'white' }}>
                    {typeof mainInfo === 'object'
                        ? JSON.stringify(mainInfo, null, 2)
                        : String(mainInfo)}
                </MDTypography>
                {/*============*/}
                <MDTypography color="light" variant="h3">
                    Локация и рабочее время
                </MDTypography>
                <MDTypography variant="body2" component="div" style={{ whiteSpace: 'pre-wrap', color: 'white' }}>
                    {typeof schedule === 'object'
                        ? JSON.stringify(schedule, null, 2)
                        : String(schedule)}
                </MDTypography>
                {/*============*/}
                <MDTypography color="light" variant="h3">
                    Финансовые реквизиты
                </MDTypography>
                <MDTypography variant="body2" component="div" style={{ whiteSpace: 'pre-wrap', color: 'white' }}>
                    {typeof requisites === 'object'
                        ? JSON.stringify(requisites, null, 2)
                        : String(requisites)}
                </MDTypography>
                {/*============*/}
                <MDTypography color="light" variant="h3">
                    Дополнительная информация
                </MDTypography>
                <MDTypography variant="body2" component="div" style={{ whiteSpace: 'pre-wrap', color: 'white' }}>
                    {typeof additionalInfo === 'object'
                        ? JSON.stringify(additionalInfo, null, 2)
                        : String(additionalInfo)}
                </MDTypography>
            </MDBox>

        </MDBox>
    );
};
