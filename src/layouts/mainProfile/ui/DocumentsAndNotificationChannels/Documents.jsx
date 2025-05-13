import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import List from '@mui/material/List';
import { ListItemButton, ListItemText } from '@mui/material';
import { documentData } from '../../lib/config';

export const Documents = () => {
    // TODO не увидел данных для документов, а мб и увидел(посмотреть еще раз структуру)
    return (
        <MDBox
            bgColor="dark"
            shadow="lg"
            borderRadius="lg"
            px={2}
            py={1}
            mt={4}
            color="light"
        >
            <MDTypography color="light" variant="h3">
                Документы
            </MDTypography>
            <List>
                {documentData.map(({ name, link }) => (
                    <ListItemButton
                        key={name}
                        component="a"
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        alignItems="flex-start"
                        divider={true}
                        sx={{
                            width: '50%',
                            pl: 0,
                            pb: 0,
                            mb: 1,
                            borderBottom: '3px solid',
                            borderColor: 'light',
                        }}
                    >
                        <ListItemText primary={name} />
                    </ListItemButton>
                ))}
            </List>
        </MDBox>
    );
};
