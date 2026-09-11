import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ReportIcon from "@mui/icons-material/Report";
import InventoryIcon from "@mui/icons-material/Inventory";
import EventNoteIcon from "@mui/icons-material/EventNote";
import DescriptionIcon from "@mui/icons-material/Description";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const drawerWidth = 280;

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const menuItems = [
    { text: "Dashboard", icon: <ReportIcon />, path: "/dashboard" },
    { text: "Kelola Pengaduan", icon: <ReportIcon />, path: "/dashboard/pengaduan" },
    { text: "Manajemen Inventori", icon: <InventoryIcon />, path: "/dashboard/inventori" },
    { text: "Informasi Kegiatan", icon: <EventNoteIcon />, path: "/dashboard/kegiatan" },

    // ===== SURAT =====
    { text: "Surat Domisili", icon: <DescriptionIcon />, path: "/dashboard/surat" },
    { text: "Template Surat", icon: <DescriptionIcon />, path: "/dashboard/template-surat" }, // ✅ BARU
  ];

  const drawerContent = (
    <>
      <Toolbar sx={{ justifyContent: "center", mt: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "white",
            letterSpacing: 1,
            textAlign: "center",
            fontSize: "1.3rem",
          }}
        >
          Padukuhan V Admin
        </Typography>
      </Toolbar>

      <List sx={{ mt: 2 }}>
        {menuItems.map(({ text, icon, path }) => (
          <ListItemButton
            key={text}
            component={Link}
            to={path}
            selected={location.pathname === path}
            onClick={isMobile ? handleDrawerToggle : undefined}
            sx={{
              py: 2,
              px: 3,
              mx: 1,
              borderRadius: "12px",
              color: "white",
              "&.Mui-selected": {
                backgroundColor: "#1976d2",
                color: "white",
              },
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: "white",
                minWidth: 48,
              }}
            >
              {icon}
            </ListItemIcon>
            <ListItemText
              primary={text}
              primaryTypographyProps={{
                fontSize: "1.05rem",
                fontWeight: 600,
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </>
  );

  return (
    <>
      {/* MOBILE */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            backgroundColor: "#0d47a1",
            color: "white",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* DESKTOP */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            backgroundColor: "#0d47a1",
            color: "white",
            boxSizing: "border-box",
            borderRight: "none",
            paddingTop: "8px",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
