import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ImageWithBasePath from "../../imageWithBasePath";
import { all_routes } from "../../../feature-module/routes/all_routes";
import { useDispatch, useSelector } from "react-redux";
import { updateTheme } from "../../redux/themeSlice";
import { setExpandMenu, setMobileSidebar } from "../../redux/sidebarSlice";

const Sidebarthree = () => {
  const location = useLocation();
  const routes = all_routes;

  // State for open submenus
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({
    settings: false,
    doctors: false,
    appointments: false,
    patients: false,
  });

  // Auto-open submenus if current route belongs to that menu
  useEffect(() => {
    const settingsRoutes = [
      routes.patientprofilesettings,
      routes.patientpasswordsettings,
      routes.patientnotificationssettings,
    ];

    setOpenSubmenus((prev) => ({
      ...prev,
      settings: settingsRoutes.includes(location.pathname) ? true : prev.settings,
    }));
  }, [location.pathname, routes]);

  const isActive = (path: string) => location.pathname === path;

  const handleToggle = (menu: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const dispatch = useDispatch();

  const handleMiniSidebar = () => {
    const rootElement = document.documentElement;
    const isMini = rootElement.getAttribute("data-layout") === "mini";
    const updatedLayout = isMini ? "default" : "mini";
    dispatch(
      updateTheme({
        "data-layout": updatedLayout,
      })
    );
    if (isMini) {
      rootElement.classList.remove("mini-sidebar");
    } else {
      rootElement.classList.add("mini-sidebar");
    }
  };

  const onMouseEnter = () => dispatch(setExpandMenu(true));
  const onMouseLeave = () => dispatch(setExpandMenu(false));

  const mobileSidebar = useSelector((state: any) => state.sidebarSlice.mobileSidebar);
  const toggleMobileSidebar = () => dispatch(setMobileSidebar(!mobileSidebar));

  return (
    <>
      {/* Sidenav Menu Start */}
      <div
        className="sidebar doctor-sidebar"
        id="sidebar"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Sidebar Logo */}
        <div className="sidebar-logo">
          <div>
            <Link to={routes.dashboard} className="logo logo-normal">
              <ImageWithBasePath src="assets/img/logo.svg" alt="Logo" />
            </Link>
            <Link to={routes.dashboard} className="logo-small">
              <ImageWithBasePath src="assets/img/logo-small.svg" alt="Logo" />
            </Link>
            <Link to={routes.dashboard} className="dark-logo">
              <ImageWithBasePath src="assets/img/logo-white.svg" alt="Logo" />
            </Link>
          </div>
          <button
            className="sidenav-toggle-btn btn border-0 p-0 active"
            id="toggle_btn"
            onClick={handleMiniSidebar}
          >
            <i className="ti ti-arrow-left" />
          </button>
          <button className="sidebar-close" onClick={toggleMobileSidebar}>
            <i className="ti ti-x align-middle" />
          </button>
        </div>
        {/* Sidebar Menu */}
        <div id="sidebar-menu" className="sidebar-menu">
          <ul>
            <li className="menu-title">
              <span>Main Menu</span>
            </li>
            <li>
              <ul>
                {/* Dashboard */}
                <li className={isActive(routes.clinicdashboard) ? "active" : ""}>
                  <Link to={routes.clinicdashboard}>
                    <i className="ti ti-layout-dashboard" />
                    <span>Dashboard</span>
                  </Link>
                </li>

                {/* Doctors Submenu */}
                <li className={`submenu${openSubmenus.doctors ? " active" : ""}`}>
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleToggle("doctors");
                    }}
                  >
                    <i className="ti ti-stethoscope" />
                    <span>Doctors</span>
                    <span className="menu-arrow">
                      <i className={openSubmenus.doctors ? "ti ti-chevron-down" : "ti ti-chevron-right"} />
                    </span>
                  </Link>
                  <ul style={{ display: openSubmenus.doctors ? "block" : "none" }}>
                    <li>
                      <Link
                        to={routes.clinicallDoctors}
                        className={isActive(routes.clinicallDoctors) ? "active" : ""}
                      >
                        Doctor List
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={routes.clinicadddoctor}
                        className={isActive(routes.clinicadddoctor) ? "active" : ""}
                      >
                        Add Doctor
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* Patients Submenu */}
                <li className={`submenu${openSubmenus.patients ? " active" : ""}`}>
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleToggle("patients");
                    }}
                  >
                    <i className="ti ti-user" />
                    <span>Patients</span>
                    <span className="menu-arrow">
                      <i className={openSubmenus.patients ? "ti ti-chevron-down" : "ti ti-chevron-right"} />
                    </span>
                  </Link>
                  <ul style={{ display: openSubmenus.patients ? "block" : "none" }}>
                    <li>
                      <Link
                        to={routes.clinicpatients}
                        className={isActive(routes.clinicpatients) ? "active" : ""}
                      >
                        Patients List
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={routes.cliniccreatePatient}
                        className={isActive(routes.cliniccreatePatient) ? "active" : ""}
                      >
                        Add Patient
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* Appointments Submenu */}
                <li className={`submenu${openSubmenus.appointments ? " active" : ""}`}>
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleToggle("appointments");
                    }}
                  >
                    <i className="ti ti-calendar-check" />
                    <span>Appointments</span>
                    <span className="menu-arrow">
                      <i className={openSubmenus.appointments ? "ti ti-chevron-down" : "ti ti-chevron-right"} />
                    </span>
                  </Link>
                  <ul style={{ display: openSubmenus.appointments ? "block" : "none" }}>
                    <li>
                      <Link
                        to={routes.clinicappointments}
                        className={isActive(routes.clinicappointments) ? "active" : ""}
                      >
                        Appointment List
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={routes.clinicnewAppointments}
                        className={isActive(routes.clinicnewAppointments) ? "active" : ""}
                      >
                        Add Appointment
                      </Link>
                    </li>

                  </ul>
                </li>

                {/* Medicine Submenu */}
                <li className={`submenu${openSubmenus.medicine ? " active" : ""}`}>
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleToggle("medicine");
                    }}
                  >
                    <i className="ti ti-pill" />
                    <span>Medicine</span>
                    <span className="menu-arrow">
                      <i className={openSubmenus.medicine ? "ti ti-chevron-down" : "ti ti-chevron-right"} />
                    </span>
                  </Link>
                  <ul style={{ display: openSubmenus.medicine ? "block" : "none" }}>
                    <li>
                      <Link
                        to={routes.MedicineList}
                        className={isActive(routes.MedicineList) ? "active" : ""}
                      >
                        Medicine List
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={routes.addMedicine}
                        className={isActive(routes.addMedicine) ? "active" : ""}
                      >
                        Add Medicine
                      </Link>
                    </li>

                  </ul>
                </li>

                {/* Procedure Submenu */}
                <li className={`submenu${openSubmenus.Procedure ? " active" : ""}`}>
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleToggle("Procedure");
                    }}
                  >
                    <i className="ti ti-hospital" />
                    <span>Procedure</span>
                    <span className="menu-arrow">
                      <i className={openSubmenus.Procedure ? "ti ti-chevron-down" : "ti ti-chevron-right"} />
                    </span>
                  </Link>
                  <ul style={{ display: openSubmenus.Procedure ? "block" : "none" }}>
                    <li>
                      <Link
                        to={routes.ProcedureList}
                        className={isActive(routes.ProcedureList) ? "active" : ""}
                      >
                        Procedure List
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={routes.addProcedure}
                        className={isActive(routes.addProcedure) ? "active" : ""}
                      >
                        Add Procedure
                      </Link>
                    </li>

                  </ul>
                </li>


                {/* Prescriptions */}
                <li>
                  <Link
                    to="/clinic-dashboard/prescriptions"
                  >
                    <i className="ti ti-prescription" />
                    <span>Prescriptions</span>
                    {/* <span className="menu-arrow">
                      <i className={openSubmenus.Prescriptions ? "ti ti-chevron-down" : "ti ti-chevron-right"} />
                    </span> */}
                  </Link>
                </li>


                {/* Billing */}
                <li className={`submenu${openSubmenus.Billing ? " active" : ""}`}>
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleToggle("Billing");
                    }}
                  >
                    <i className="ti ti-file-invoice" />
                    <span>Billing</span>
                    <span className="menu-arrow">
                      <i className={openSubmenus.Billing ? "ti ti-chevron-down" : "ti ti-chevron-right"} />
                    </span>
                  </Link>
                  <ul style={{ display: openSubmenus.Billing ? "block" : "none" }}>
                    <li>
                      <Link
                        to={routes.clinicpanelclinicbillList}
                        className={isActive(routes.clinicpanelclinicbillList) ? "active" : ""}
                      >
                        Clinic Bills
                      </Link>
                    </li>
                     <li>
                      <Link
                        to={routes.clinicpanellabbillList}
                        className={isActive(routes.clinicpanellabbillList) ? "active" : ""}
                      >
                        Lab Bills
                      </Link>
                      <Link
                        to={routes.clinicmaterialpurchasebillList}
                        className={isActive(routes.clinicmaterialpurchasebillList) ? "active" : ""}
                      >
                       Material Purchase Bills
                      </Link>

                      <Link
                        to={routes.clinicpharmacybillList}
                        className={isActive(routes.clinicpharmacybillList) ? "active" : ""}
                      >
                       Pharmacy Bills
                      </Link>
                    </li>


                  </ul>
                </li>


              </ul>
            </li>
          </ul>
        </div>
      </div>
      {/* Sidenav Menu End */}
    </>
  );
};

export default Sidebarthree;
