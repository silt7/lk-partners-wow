import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

export const Header = ({ companyName, companyDescription }) => {
    return (
        <MDBox
            bgColor="secondary"
            shadow="lg"
            borderRadius="lg"
            px={2}
            py={1}
            mt={2}
            color="light"
        >
            <MDTypography>{companyName}</MDTypography>
            <MDTypography>{companyDescription}</MDTypography>
        </MDBox>
    );
};
