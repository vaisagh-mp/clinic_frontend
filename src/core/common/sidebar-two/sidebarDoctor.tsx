import { Link, useLocation } from "react-router-dom";
import ImageWithBasePath from "../../imageWithBasePath";
import { all_routes } from "../../../feature-module/routes/all_routes";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTheme } from "../../redux/themeSlice";
import { setExpandMenu, setMobileSidebar } from "../../redux/sidebarSlice";
import SidebarTop from "../sidebar/SidebarTop";

const SidebarTwo = () => {
  const location = useLocation();
  const routes = all_routes;
  const dispatch = useDispatch();

  // ✅ Decode JWT token from localStorage (added when superadmin switches user)
  const token = localStorage.getItem("access_token");
  const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : null;

  const actingAsRole = decodedToken?.acting_as_role; // role you're switched into
  const originalRole = decodedToken?.role || decodedToken?.user_role; // actual user role

  // ✅ Show SidebarTop if:
  // - Superadmin switched into doctor/clinic
  // - OR logged in as doctor/clinic
  const showSidebarTop =
    (originalRole === "superadmin" && actingAsRole !== undefined) ||
    actingAsRole === "doctor" ||
    actingAsRole === "clinic" ||
    originalRole === "doctor" ||
    originalRole === "clinic";

  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({
    appointments: false,
  });

  const isActive = (path: string) => location.pathname === path;
  const isAnyActive = (paths: string[]) => paths.some(isActive);

  // Auto-open submenus if child routes are active
  useEffect(() => {
    setOpenSubmenus((prev) => ({
      ...prev,
      appointments: isAnyActive([
        routes.doctorsappointments,
        routes.onlineconsultations,
      ]),
    }));
  }, [location.pathname]);

  const handleToggle = (submenu: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [submenu]: !prev[submenu],
    }));
  };

  const handleMiniSidebar = () => {
    const root = document.documentElement;
    const isMini = root.getAttribute("data-layout") === "mini";
    const newLayout = isMini ? "default" : "mini";

    dispatch(updateTheme({ "data-layout": newLayout }));

    if (isMini) root.classList.remove("mini-sidebar");
    else root.classList.add("mini-sidebar");
  };

  const onMouseEnter = () => dispatch(setExpandMenu(true));
  const onMouseLeave = () => dispatch(setExpandMenu(false));

  const mobileSidebar = useSelector(
    (state: any) => state.sidebarSlice.mobileSidebar
  );

  const toggleMobileSidebar = () =>
    dispatch(setMobileSidebar(!mobileSidebar));

  return (
    <>
      {/* Sidebar Start */}
      <div
        className="sidebar doctor-sidebar"
        id="sidebar"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Sidebar Logo */}
        <div className="sidebar-logo">
          <div>
            <Link to={routes.doctordashboard} className="logo logo-normal">
              <ImageWithBasePath src="assets/img/logo.svg" alt="Logo" />
            </Link>
            <Link to={routes.doctordashboard} className="logo-small">
              <ImageWithBasePath src="assets/img/logo-small.svg" alt="Logo" />
            </Link>
            <Link to={routes.doctordashboard} className="dark-logo">
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
        <div className="sidebar-inner" data-simplebar="">
          <div id="sidebar-menu" className="sidebar-menu">
            {/* ✅ Conditionally Render SidebarTop */}
            {showSidebarTop && <SidebarTop />}

            <ul>
              <li className="menu-title">
                <span>Main Menu</span>
              </li>

              <li>
                <ul>
                  {/* Dashboard */}
                  <li
                    className={
                      isActive(routes.doctordashboard) ? "active" : ""
                    }
                  >
                    <Link to={routes.doctordashboard}>
                      <i className="ti ti-layout-dashboard" />
                      <span>Dashboard</span>
                    </Link>
                  </li>

                  {/* Appointments Submenu */}
                  <li
                    className={`submenu${
                      openSubmenus.appointments ? " active" : ""
                    }`}
                  >
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
                        <i
                          className={
                            openSubmenus.appointments
                              ? "ti ti-chevron-down"
                              : "ti ti-chevron-right"
                          }
                        />
                      </span>
                    </Link>
                    <ul
                      style={{
                        display: openSubmenus.appointments ? "block" : "none",
                      }}
                    >
                      <li>
                        <Link
                          to={routes.doctorsappointments}
                          className={
                            isActive(routes.doctorsappointments)
                              ? "active"
                              : ""
                          }
                        >
                          Appointments
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={routes.doctorsconsultation}
                          className={
                            isActive(routes.doctorsconsultation)
                              ? "active"
                              : ""
                          }
                        >
                          Consultations
                        </Link>
                      </li>
                    </ul>
                  </li>

                  {/* Prescriptions */}
                  <li
                    className={
                      isActive(routes.doctorsprescriptions) ? "active" : ""
                    }
                  >
                    <Link to={routes.doctorsprescriptions}>
                      <i className="ti ti-prescription" />
                      <span>Prescriptions</span>
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Sidebar End */}
    </>
  );
};

export default SidebarTwo;
