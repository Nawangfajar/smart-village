import React, { useState } from "react";
import {
  FaClipboardList,
  FaBoxes,
  FaCalendarAlt,
  FaHome,
  FaBars,
  FaTimes,
  FaFileAlt,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import DashboardBeranda from "./DashboardBeranda";
import Pengaduan from "./Pengaduan";
import Inventaris from "./Inventaris";
import Kegiatan from "./Kegiatan";
import Surat from "./Surat";
import TemplateSurat from "./TemplateSurat";
import "../App.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo Padukuhan.png";

const Dashboard = () => {
  const [menu, setMenu] = useState("beranda");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSurat, setOpenSurat] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleSurat = () => setOpenSurat(!openSurat);

  const renderPage = () => {
    switch (menu) {
      case "beranda":
        return <DashboardBeranda />;
      case "pengaduan":
        return <Pengaduan />;
      case "inventaris":
        return <Inventaris />;
      case "kegiatan":
        return <Kegiatan />;
      case "surat":
        return <Surat />;
      case "template-surat":
        return <TemplateSurat />;
      default:
        return <DashboardBeranda />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* HAMBURGER */}
      <button className="hamburger" onClick={toggleSidebar}>
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* SIDEBAR */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <img src={logo} alt="Logo Padukuhan V" className="sidebar-logo" />
          <h2 className="sidebar-title">PADUKUHAN V ADMIN</h2>
        </div>

        <div className="sidebar-divider"></div>

        <nav className="nav">
          {/* DASHBOARD */}
          <button
            onClick={() => setMenu("beranda")}
            className={`nav-item ${menu === "beranda" ? "active" : ""}`}
          >
            <FaHome className="icon" /> Dashboard
          </button>

          <button
            onClick={() => setMenu("pengaduan")}
            className={`nav-item ${menu === "pengaduan" ? "active" : ""}`}
          >
            <FaClipboardList className="icon" /> Kelola Pengaduan
          </button>

          <button
            onClick={() => setMenu("inventaris")}
            className={`nav-item ${menu === "inventaris" ? "active" : ""}`}
          >
            <FaBoxes className="icon" /> Manajemen Inventori
          </button>

          <button
            onClick={() => setMenu("kegiatan")}
            className={`nav-item ${menu === "kegiatan" ? "active" : ""}`}
          >
            <FaCalendarAlt className="icon" /> Informasi Kegiatan
          </button>

          {/* ===== SURAT DROPDOWN ===== */}
          <button
            onClick={toggleSurat}
            className={`nav-item ${menu.includes("surat") ? "active" : ""}`}
          >
            <FaFileAlt className="icon" />
            Surat
            <span className="chevron">
              {openSurat ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </button>

          {openSurat && (
            <div className="submenu">
              <button
                onClick={() => setMenu("surat")}
                className={`submenu-item ${menu === "surat" ? "active" : ""}`}
              >
                Surat Domisili
              </button>

              <button
                onClick={() => setMenu("template-surat")}
                className={`submenu-item ${
                  menu === "template-surat" ? "active" : ""
                }`}
              >
                Template Surat
              </button>
            </div>
          )}

          {/* LOGOUT */}
          <button onClick={handleLogout} className="nav-item logout-button">
            <FaSignOutAlt className="icon" /> Logout
          </button>
        </nav>

        <div className="sidebar-footer">&copy; 2025 Padukuhan V</div>
      </aside>

      {/* CONTENT */}
      <main className="main-content">
        <header className="topbar">
          <h1 className="page-title">
            {menu === "beranda"
              ? "Dashboard Admin"
              : menu === "pengaduan"
              ? "Kelola Pengaduan"
              : menu === "inventaris"
              ? "Manajemen Inventori"
              : menu === "kegiatan"
              ? "Informasi Kegiatan"
              : menu === "surat"
              ? "Surat Domisili"
              : "Template Surat"}
          </h1>
          <div className="admin-label">Admin</div>
        </header>

        <section className="page-content">{renderPage()}</section>
      </main>
    </div>
  );
};

export default Dashboard;
