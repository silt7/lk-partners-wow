/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Custom styles for the SidenavCollapse
import {
  collapseItem,
  collapseIconBox,
  collapseIcon,
  collapseText,
} from "examples/Sidenav/styles/sidenavCollapse";

// Material Dashboard 2 React context
import { useMaterialUIController } from "context";

function SidenavCollapse({ icon, name, active, badge, ...rest }) {
  const [controller] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;

  return (
    <ListItem component="li">
      <MDBox
        {...rest}
        sx={(theme) =>
          collapseItem(theme, {
            active,
            transparentSidenav,
            whiteSidenav,
            darkMode,
            sidenavColor,
          })
        }
      >
        <ListItemIcon
          sx={(theme) =>
            collapseIconBox(theme, { transparentSidenav, whiteSidenav, darkMode, active })
          }
        >
          {typeof icon === "string" ? (
            <Icon sx={(theme) => collapseIcon(theme, { active })}>{icon}</Icon>
          ) : (
            icon
          )}
        </ListItemIcon>

        <ListItemText
          primary={
            <MDBox
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
            >
              <MDTypography
                component="span"
                variant="button"
                fontWeight="medium"
                color="inherit"
              >
                {name}
              </MDTypography>
              {badge > 0 && (
                <MDBox
                  component="span"
                  minWidth="1.25rem"
                  height="1.25rem"
                  borderRadius="50%"
                  bgColor="error"
                  color="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="0.65rem"
                  fontWeight="bold"
                  px={0.5}
                  ml={1}
                >
                  {badge > 99 ? "99+" : badge}
                </MDBox>
              )}
            </MDBox>
          }
          sx={(theme) =>
            collapseText(theme, {
              miniSidenav,
              transparentSidenav,
              whiteSidenav,
              active,
            })
          }
        />
      </MDBox>
    </ListItem>
  );
}

// Setting default values for the props of SidenavCollapse
SidenavCollapse.defaultProps = {
  active: false,
  badge: 0,
};

// Typechecking props for the SidenavCollapse
SidenavCollapse.propTypes = {
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  active: PropTypes.bool,
  badge: PropTypes.number,
};

export default SidenavCollapse;
