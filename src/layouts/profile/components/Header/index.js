// /**
// =========================================================
// * Material Dashboard 2 React - v2.1.0
// =========================================================
//
// * Product Page: https://www.creative-tim.com/product/material-dashboard-react
// * Copyright 2022 Creative Tim (https://www.creative-tim.com)
//
// Coded by www.creative-tim.com
//
//  =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// */
//
// import { useState, useEffect } from "react";
//
// // prop-types is a library for typechecking of props.
// import PropTypes from "prop-types";
//
// // @mui material components
// import Card from "@mui/material/Card";
// import Grid from "@mui/material/Grid";
// // import Tooltip from "@mui/material/Tooltip";
// import Icon from "@mui/material/Icon";
//
// // Material Dashboard 2 React components
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import MDAvatar from "components/MDAvatar";
//
// // Material Dashboard 2 React base styles
// import breakpoints from "assets/theme/base/breakpoints";
//
// // Images
// import burceMars from "assets/images/bg-sign-up-cover.jpeg";
// import backgroundImage from "assets/images/bg-profile.jpeg";
//
//
// function Header({ profile, children }) {
//   const [tabsOrientation, setTabsOrientation] = useState("horizontal");
//   const [tabValue, setTabValue] = useState(0);
//
//   useEffect(() => {
//     // A function that sets the orientation state of the tabs.
//     function handleTabsOrientation() {
//       return window.innerWidth < breakpoints.values.sm
//         ? setTabsOrientation("vertical")
//         : setTabsOrientation("horizontal");
//     }
//
//     /**
//      The event listener that's calling the handleTabsOrientation function when resizing the window.
//     */
//     window.addEventListener("resize", handleTabsOrientation);
//
//     // Call the handleTabsOrientation function to set the state with the initial value.
//     handleTabsOrientation();
//
//     // Remove event listener on cleanup
//     return () => window.removeEventListener("resize", handleTabsOrientation);
//   }, [tabsOrientation]);
//
//   const handleSetTabValue = (event, newValue) => setTabValue(newValue);
//
//   return (
//     <MDBox position="relative" mb={5}>
//       <MDBox
//         display="flex"
//         alignItems="center"
//         position="relative"
//         minHeight="18.75rem"
//         borderRadius="xl"
//         sx={{
//           backgroundImage: ({
//             functions: { rgba, linearGradient },
//             palette: { gradients },
//           }) =>
//             `${linearGradient(
//               rgba(gradients.info.main, 0.6),
//               rgba(gradients.info.state, 0.6)
//             )}, url(${backgroundImage})`,
//           backgroundSize: "cover",
//           backgroundPosition: "50%",
//           overflow: "hidden",
//         }}
//       />
//       <Card
//         sx={{
//           position: "relative",
//           mt: -8,
//           mx: 3,
//           py: 2,
//           px: 2,
//         }}
//       >
//         <Grid container spacing={3} alignItems="center">
//           <Grid item>
//             {/* TODO: узнать путь для картинки  LOGO */}
//             <MDAvatar
//               src={burceMars}
//               alt="profile-image"
//               size="xl"
//               shadow="sm"
//               height="100%"
//             />
//           </Grid>
//             <Grid item>
//                 <MDBox height="100%" mt={0.5} lineHeight={1}>
//                     <MDTypography variant="h5" fontWeight="medium">
//                         {profile?.TITLE}
//                     </MDTypography>
//                     <MDTypography variant="button" color="text" fontWeight="regular">
//                         {profile?.result?.DESCRIPTION ? profile.result.DESCRIPTION : 'описание компании'}
//                         {/*{profile?.INDUSTRY}*/}
//                     </MDTypography>
//                 </MDBox>
//                 <MDBox height="100%" mt={0.5} lineHeight={1}>
//                     {/*<Tooltip>*/}
//                         <Icon>edit</Icon>
//                     {/*</Tooltip>*/}
//                 </MDBox>
//             </Grid>
//         </Grid>
//         {children}
//       </Card>
//     </MDBox>
//   );
// }
//
// // Setting default props for the Header
// Header.defaultProps = {
//   children: "",
// };
//
// // Typechecking props for the Header
// Header.propTypes = {
//   children: PropTypes.node,
// };
//
// export default Header;


//
// import { useState } from "react";
// import PropTypes from "prop-types";
// import Card from "@mui/material/Card";
// import Grid from "@mui/material/Grid";
// import Icon from "@mui/material/Icon";
// import Tooltip from "@mui/material/Tooltip";
// import Modal from "@mui/material/Modal";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import AttachFileIcon from "@mui/icons-material/AttachFile";
//
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import MDAvatar from "components/MDAvatar";
//
// import burceMars from "assets/images/bg-sign-up-cover.jpeg";
// import backgroundImage from "assets/images/bg-profile.jpeg";
//
// function Header({ profile, children }) {
//     const [isModalOpen, setIsModalOpen] = useState(false);
//
//     return (
//         <>
//             <MDBox position="relative" mb={5}>
//                 <MDBox
//                     display="flex"
//                     alignItems="center"
//                     position="relative"
//                     minHeight="18.75rem"
//                     borderRadius="xl"
//                     sx={{
//                         backgroundImage: ({
//                                               functions: { rgba, linearGradient },
//                                               palette: { gradients },
//                                           }) =>
//                             `${linearGradient(
//                                 rgba(gradients.info.main, 0.6),
//                                 rgba(gradients.info.state, 0.6)
//                             )}, url(${backgroundImage})`,
//                         backgroundSize: "cover",
//                         backgroundPosition: "50%",
//                         overflow: "hidden",
//                     }}
//                 />
//                 <Card
//                     sx={{
//                         position: "relative",
//                         mt: -8,
//                         mx: 3,
//                         py: 2,
//                         px: 2,
//                     }}
//                 >
//                     <Grid container spacing={3} alignItems="center" justifyContent="space-between">
//                         {/* Левая часть: аватар, заголовок, описание */}
//                         <Grid item container xs={12} md={8} spacing={2} alignItems="center">
//                             <Grid item>
//                                 <MDAvatar src={burceMars} alt="profile-image" size="xl" shadow="sm" />
//                             </Grid>
//                             <Grid item xs>
//                                 <MDBox height="100%" mt={0.5} lineHeight={1}>
//                                     <MDTypography variant="h5" fontWeight="medium">
//                                         {profile?.TITLE || "Название компании"}
//                                     </MDTypography>
//                                     <MDTypography variant="button" color="text" fontWeight="regular">
//                                         {profile?.result?.DESCRIPTION || "Описание компании"}
//                                     </MDTypography>
//                                 </MDBox>
//                             </Grid>
//                         </Grid>
//
//                         {/* Правая часть: кнопка редактирования */}
//                         <Grid item xs={12} md={3} container justifyContent="flex-end">
//                             <Tooltip title="Создать новую информацию">
//                                 <Icon
//                                     fontSize="medium"
//                                     color="info"
//                                     onClick={() => setIsModalOpen(true)}
//                                     sx={{ cursor: "pointer" }}
//                                 >
//                                     edit
//                                 </Icon>
//                             </Tooltip>
//                         </Grid>
//                     </Grid>
//
//                     {children}
//                 </Card>
//             </MDBox>
//
//             {/* Модальное окно */}
//             <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
//                 <MDBox
//                     sx={{
//                         position: "absolute",
//                         top: "50%",
//                         left: "50%",
//                         transform: "translate(-50%, -50%)",
//                         width: { xs: "90%", sm: 400 },
//                         bgcolor: "background.paper",
//                         boxShadow: 24,
//                         p: 3,
//                         borderRadius: 2,
//                     }}
//                 >
//                     <MDTypography variant="h6" gutterBottom>
//                         Создать новую информацию
//                     </MDTypography>
//                     <TextField fullWidth label="Заголовок" name="TITLE" margin="normal" />
//                     <TextField
//                         fullWidth
//                         label="Описание"
//                         name="DESCRIPTION"
//                         multiline
//                         rows={3}
//                         margin="normal"
//                     />
//                     <Button
//                         component="label"
//                         variant="outlined"
//                         startIcon={<AttachFileIcon />}
//                         fullWidth
//                         sx={{ mt: 2 }}
//                     >
//                         Прикрепить файл
//                         <input type="file" hidden />
//                     </Button>
//                 </MDBox>
//             </Modal>
//         </>
//     );
// }
//
// // Setting default props for the Header
// Header.defaultProps = {
//     children: "",
// };
//
// // Typechecking props for the Header
// Header.propTypes = {
//     profile: PropTypes.object.isRequired,
//     children: PropTypes.node,
// };
//
// export default Header;



import { useState } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AttachFileIcon from "@mui/icons-material/AttachFile";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

import burceMars from "assets/images/bg-sign-up-cover.jpeg";
import backgroundImage from "assets/images/bg-profile.jpeg";

function Header({ profile, children }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        TITLE: "",
        DESCRIPTION: "",
        file: null,
    });

    // Обработчик изменения полей формы
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Обработчик выбора файла
    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
    };

    // Обработчик отправки формы
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Данные формы:", formData);

        // Здесь можно выполнить запрос к API

        console('Данные отправлены! Проверь консоль.');
        setIsModalOpen(false); // Закрытие модалки
        setFormData({ TITLE: "", DESCRIPTION: "", file: null }); // Очистка формы
    };

    return (
        <>
            <MDBox position="relative" mb={5}>
                <MDBox
                    display="flex"
                    alignItems="center"
                    position="relative"
                    minHeight="18.75rem"
                    borderRadius="xl"
                    sx={{
                        backgroundImage: ({
                                              functions: { rgba, linearGradient },
                                              palette: { gradients },
                                          }) =>
                            `${linearGradient(
                                rgba(gradients.info.main, 0.6),
                                rgba(gradients.info.state, 0.6)
                            )}, url(${backgroundImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "50%",
                        overflow: "hidden",
                    }}
                />
                <Card
                    sx={{
                        position: "relative",
                        mt: -8,
                        mx: 3,
                        py: 2,
                        px: 2,
                    }}
                >
                    <Grid container spacing={3} alignItems="center" justifyContent="space-between">
                        {/* Левая часть: аватар, заголовок, описание */}
                        <Grid item container xs={12} md={8} spacing={2} alignItems="center">
                            <Grid item>
                                <MDAvatar src={burceMars} alt="profile-image" size="xl" shadow="sm" />
                            </Grid>
                            <Grid item xs>
                                <MDBox height="100%" mt={0.5} lineHeight={1}>
                                    <MDTypography variant="h5" fontWeight="medium">
                                        {profile?.TITLE || "Название компании"}
                                    </MDTypography>
                                    <MDTypography variant="button" color="text" fontWeight="regular">
                                        {profile?.result?.DESCRIPTION || "Описание компании"}
                                    </MDTypography>
                                </MDBox>
                            </Grid>
                        </Grid>

                        {/* Правая часть: кнопка редактирования */}
                        <Grid item xs={12} md={3} container justifyContent="flex-end">
                            <Tooltip title="Создать новую информацию">
                                <Icon
                                    fontSize="medium"
                                    color="info"
                                    onClick={() => setIsModalOpen(true)}
                                    sx={{ cursor: "pointer" }}
                                >
                                    edit
                                </Icon>
                            </Tooltip>
                        </Grid>
                    </Grid>

                    {children}
                </Card>
            </MDBox>

            {/* Модальное окно */}
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <MDBox
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: { xs: "90%", sm: 400 },
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 3,
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: "column",
                        outline: "none"
                    }}
                >
                    <MDTypography variant="h6" gutterBottom>
                        Создать новую информацию
                    </MDTypography>

                    <TextField
                        fullWidth
                        label="Заголовок"
                        name="TITLE"
                        value={formData.TITLE}
                        onChange={handleChange}
                        margin="normal"
                    />

                    <TextField
                        fullWidth
                        label="Описание"
                        name="DESCRIPTION"
                        value={formData.DESCRIPTION}
                        onChange={handleChange}
                        multiline
                        rows={3}
                        margin="normal"
                    />

                    <Button
                        component="label"
                        variant="outlined"
                        startIcon={<AttachFileIcon />}
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Прикрепить файл
                        <input type="file" hidden onChange={handleFileChange} />
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3 }}
                    >
                        Отправить
                    </Button>
                </MDBox>
            </Modal>
        </>
    );
}

// Setting default props for the Header
Header.defaultProps = {
    children: "",
};

// Typechecking props for the Header
Header.propTypes = {
    profile: PropTypes.object.isRequired,
    children: PropTypes.node,
};

export default Header;