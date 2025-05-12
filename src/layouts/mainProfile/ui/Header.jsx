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

//
// import React, { useState } from "react";
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import MDInput from "components/MDInput";
// import MDButton from "components/MDButton";
// import IconButton from "@mui/material/IconButton";
// import EditIcon from "@mui/icons-material/Edit";
//
// export const Header = ({ companyName, companyDescription }) => {
//     console.log('companyName', companyName)
//     console.log('companyDescription', companyDescription)
//     const [isEditing, setIsEditing] = useState(false);
//     const [formData, setFormData] = useState({
//         name: companyName || "",
//         description: companyDescription || "",
//     });
//
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };
//
//     const handleSave = () => {
//         // Здесь можно вызвать API или обновить состояние родителя
//         console.log("Сохранено:", formData);
//         setIsEditing(false);
//     };
//
//     return (
//         <MDBox
//             bgColor="secondary"
//             shadow="lg"
//             borderRadius="lg"
//             px={2}
//             py={1}
//             mt={2}
//             color="light"
//         >
//             {isEditing ? (
//                 <MDBox component="form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
//                     <MDInput
//                         name="name"
//                         label="Название компании"
//                         fullWidth
//                         value={formData.name}
//                         onChange={handleInputChange}
//                         margin="normal"
//                         sx={{ mb: 2 }}
//                     />
//                     <MDInput
//                         name="description"
//                         label="Описание компании"
//                         multiline
//                         rows={3}
//                         fullWidth
//                         value={formData.description}
//                         onChange={handleInputChange}
//                         sx={{ mb: 2 }}
//                     />
//                     <MDButton type="submit" variant="gradient" color="info">
//                         Отправить на модерацию
//                     </MDButton>
//                 </MDBox>
//             ) : (
//                 <MDBox display="flex" justifyContent="space-between" alignItems="center">
//                     <div>
//                         <MDTypography fontWeight="medium">{formData.name}</MDTypography>
//                         <MDTypography fontSize="small" color="text" noWrap>
//                             {formData.description}
//                         </MDTypography>
//                     </div>
//                     <IconButton size="small" onClick={() => setIsEditing(true)} sx={{ ml: 1, color: "white" }}>
//                         <EditIcon fontSize="small" />
//                     </IconButton>
//                 </MDBox>
//             )}
//         </MDBox>
//     );
// };