/* eslint-disable */
import { Link, useNavigate } from "react-router-dom";
import ImageWithBasePath from "../../imageWithBasePath";
import { useEffect, useState } from "react";
import { updateTheme } from "../../redux/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import { setMobileSidebar } from "../../redux/sidebarSlice";
import { all_routes } from "../../../feature-module/routes/all_routes";
import axios from "axios";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const themeSettings = useSelector((state: any) => state.theme.themeSettings);
  const [isHiddenLayoutActive, setIsHiddenLayoutActive] = useState(() => {
    const saved = localStorage.getItem("hiddenLayoutActive");
    return saved ? JSON.parse(saved) : false;
  });

  const [user, setUser] = useState<{ username: string; role: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");
    if (!token || !role) return;

    const fetchUserData = async () => {
      try {
        let apiUrl = "";
        if (role === "admin") apiUrl = "http://3.109.62.26/api/admin-panel/dashboard/";
        else if (role === "clinic") apiUrl = "http://3.109.62.26/api/clinic/dashboard/";
        else if (role === "doctor") apiUrl = "http://3.109.62.26/api/doctor/dashboard/";

        const res = await fetch(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Failed to fetch user info:", res.status);
          return;
        }

        const data = await res.json();
        setUser({
          username: data.user.username,
          role: role.toUpperCase(),
        });
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateTheme = (key: string, value: string) => {
    if (themeSettings["dir"] === "rtl" && key !== "dir") {
      dispatch(updateTheme({ dir: "ltr" }));
    }
    dispatch(updateTheme({ [key]: value }));
  };

  const mobileSidebar = useSelector(
    (state: any) => state.sidebarSlice.mobileSidebar
  );

  const toggleMobileSidebar = () => {
    dispatch(setMobileSidebar(!mobileSidebar));
  };

  const handleToggleHiddenLayout = () => {
    if (themeSettings["data-layout"] === "hidden") {
      const newState = !isHiddenLayoutActive;
      setIsHiddenLayoutActive(newState);
      localStorage.setItem("hiddenLayoutActive", JSON.stringify(newState));
    }
  };

  useEffect(() => {
    const bodyElement = document.body;
    if (themeSettings["data-layout"] === "hidden") {
      if (isHiddenLayoutActive) {
        bodyElement.classList.add("hidden-layout");
      } else {
        bodyElement.classList.remove("hidden-layout");
      }
    } else {
      bodyElement.classList.remove("hidden-layout");
      setIsHiddenLayoutActive(false);
      localStorage.removeItem("hiddenLayoutActive");
    }
  }, [isHiddenLayoutActive, themeSettings["data-layout"]]);

  // ✅ Proper logout handler
  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem("refresh");
      if (refresh) {
        await axios.post("http://3.109.62.26/api/logout/", { refresh });
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // ✅ Clear ALL data from localStorage
      localStorage.clear();

      // Prevent browser back navigation
      window.history.pushState(null, "", window.location.href);
      window.onpopstate = () => {
        window.history.go(1);
      };

      // Redirect to login page
      navigate(all_routes.loginCover);
    }
  };

  return (
    <>
      {/* Topbar Start */}
      <header className="navbar-header">
        <div className="page-container topbar-menu">
          <div className="d-flex align-items-center gap-2">
            {/* Logo */}
            <Link to={all_routes.dashboard} className="logo">
              <span className="logo-light">
                <span className="logo-lg">
                  <ImageWithBasePath src="assets/img/logo.svg" alt="logo" />
                </span>
                <span className="logo-sm">
                  <ImageWithBasePath
                    src="assets/img/logo-small.svg"
                    alt="small logo"
                  />
                </span>
              </span>
              <span className="logo-dark">
                <span className="logo-lg">
                  <ImageWithBasePath
                    src="assets/img/logo-white.svg"
                    alt="dark logo"
                  />
                </span>
              </span>
            </Link>

            {/* Sidebar Mobile Button */}
            <Link
              id="mobile_btn"
              className="mobile-btn"
              to="#"
              onClick={toggleMobileSidebar}
            >
              <i className="ti ti-menu-deep fs-24" />
            </Link>

            <button
              className="sidenav-toggle-btn btn border-0 p-0 active"
              id="toggle_btn2"
              onClick={handleToggleHiddenLayout}
            >
              <i className="ti ti-arrow-right" />
            </button>
          </div>

          <div className="d-flex align-items-center">
            {/* User Dropdown */}
            <div className="dropdown profile-dropdown d-flex align-items-center justify-content-center">
              <Link
                to="#"
                className="topbar-link dropdown-toggle drop-arrow-none position-relative"
                data-bs-toggle="dropdown"
                data-bs-offset="0,22"
                aria-haspopup="false"
                aria-expanded="false"
              >
                <ImageWithBasePath
                  src="assets/img/users/user-01.jpg"
                  width={32}
                  className="rounded-circle d-flex"
                  alt="user-image"
                />
                <span className="online text-success">
                  <i className="ti ti-circle-filled d-flex bg-white rounded-circle border border-1 border-white" />
                </span>
              </Link>

              <div className="dropdown-menu dropdown-menu-end dropdown-menu-md p-2">
                <div className="d-flex align-items-center bg-light rounded-3 p-2 mb-2">
                  <ImageWithBasePath
                    src="assets/img/users/user-01.jpg"
                    className="rounded-circle"
                    width={42}
                    height={42}
                    alt=""
                  />
                  <div className="ms-2">
                    {user ? (
                      <>
                        <p className="fw-medium text-dark mb-0">{user.username}</p>
                        <span className="d-block fs-13 text-uppercase">
                          {user.role}
                        </span>
                      </>
                    ) : (
                      <>
                        <p className="fw-medium text-dark mb-0">Loading...</p>
                        <span className="d-block fs-13">Fetching user...</span>
                      </>
                    )}
                  </div>
                </div>

                {/* ✅ Proper logout button */}
                <div className="pt-2 mt-2 border-top">
                  <button
                    onClick={handleLogout}
                    className="dropdown-item text-danger"
                    style={{ cursor: "pointer" }}
                  >
                    <i className="ti ti-logout me-1 fs-17 align-middle" />
                    <span className="align-middle">Log Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
