import { Link, useNavigate } from "react-router";
import { all_routes } from "../../../routes/all_routes";
import ImageWithBasePath from "../../../../core/imageWithBasePath";
import { useState } from "react";

type PasswordField = "password" | "confirmPassword";

const LoginCover = () => {
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = (field: PasswordField) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle login submit
  // Handle login submit
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await fetch("http://3.109.62.26/api/accounts/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Invalid login credentials");
    }

    const data = await response.json();
    console.log("Login success:", data);

    // Save tokens
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);

    // ✅ Identify role based on redirect_to
    let role = "";
    if (data.redirect_to?.includes("admin_panel")) role = "admin";
    else if (data.redirect_to?.includes("clinic_panel")) role = "clinic";
    else if (data.redirect_to?.includes("doctor_panel")) role = "doctor";

    // ✅ Save role to localStorage
    localStorage.setItem("role", role);

    // ✅ (Optional) Save username if backend sends it
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    // ✅ Map Django redirect namespace → frontend route
    const redirectMap: Record<string, string> = {
        "admin_panel:dashboard": all_routes.dashboard, // map to your React route
        "clinic_panel:dashboard": "/clinic-dashboard/",
        "doctor_panel:dashboard": "/doctor-dashboard/",
      };

    if (data.redirect_to && redirectMap[data.redirect_to]) {
      navigate(redirectMap[data.redirect_to]);
    } else {
      alert("No dashboard assigned for this role.");
    }
  } catch (error: any) {
    alert(error.message || "Login failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <div className="container-fuild position-relative z-1">
        <div className="w-100 overflow-hidden position-relative flex-wrap d-block vh-100 bg-white">
          <div className="row">
            <div className="col-lg-6 p-0">
              {/* Left side cover image and text */}
              <div className="login-backgrounds login-covers bg-primary d-lg-flex align-items-center justify-content-center d-none flex-wrap p-4 position-relative h-100 z-0">
                <div className="authentication-card w-100">
                  <div className="authen-overlay-item w-100">
                    <div className="authen-head text-center">
                      <h1 className="text-white fs-32 fw-bold mb-2">
                        Seamless healthcare access <br /> with smart, modern
                        clinic
                      </h1>
                      <p className="text-light fw-normal">
                        Experience efficient, secure, and user-friendly
                        healthcare management designed for modern clinics and
                        growing practices.
                      </p>
                    </div>
                    <div className="mt-4 mx-auto authen-overlay-img">
                      <ImageWithBasePath
                        src="assets/img/auth/cover-imgs-1.png"
                        alt="Img"
                      />
                    </div>
                  </div>
                </div>
                <ImageWithBasePath
                  src="assets/img/auth/cover-imgs-2.png"
                  alt="cover-imgs-2"
                  className="img-fluid cover-img"
                />
              </div>
            </div>

            {/* Login form section */}
            <div className="col-lg-6 col-md-12 col-sm-12">
              <div className="row justify-content-center align-items-center overflow-auto flex-wrap vh-100">
                <div className="col-md-8 mx-auto">
                  <form
                    className="d-flex justify-content-center align-items-center"
                    onSubmit={handleSubmit}
                  >
                    <div className="d-flex flex-column justify-content-lg-center p-4 p-lg-0 pb-0 flex-fill">
                      <div className="mx-auto mb-4 text-center">
                        <ImageWithBasePath
                          src="assets/img/logo.svg"
                          className="img-fluid"
                          alt="Logo"
                        />
                      </div>
                      <div className="card border-1 p-lg-3 shadow-md rounded-3 m-0">
                        <div className="card-body">
                          <div className="text-center mb-3">
                            <h5 className="mb-1 fs-20 fw-bold">Sign In</h5>
                            <p className="mb-0">
                              Please enter below details to access the dashboard
                            </p>
                          </div>

                          {/* Username */}
                          <div className="mb-3">
                            <label className="form-label">Email Address</label>
                            <div className="input-group">
                              <span className="input-group-text border-end-0 bg-white">
                                <i className="ti ti-mail fs-14 text-dark" />
                              </span>
                              <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="form-control border-start-0 ps-0"
                                placeholder="Enter Email Address"
                                required
                              />
                            </div>
                          </div>

                          {/* Password */}
                          <div className="mb-3">
                            <label className="form-label">Password</label>
                            <div className="position-relative">
                              <div className="pass-group input-group position-relative border rounded">
                                <span className="input-group-text bg-white border-0">
                                  <i className="ti ti-lock text-dark fs-14" />
                                </span>
                                <input
                                  type={
                                    passwordVisibility.password
                                      ? "text"
                                      : "password"
                                  }
                                  name="password"
                                  value={formData.password}
                                  onChange={handleChange}
                                  className="pass-input form-control border-start-0 ps-0"
                                  placeholder="****************"
                                  required
                                />
                                <span
                                  className={`ti toggle-password text-dark fs-14 ${
                                    passwordVisibility.password
                                      ? "ti-eye"
                                      : "ti-eye-off"
                                  }`}
                                  onClick={() =>
                                    togglePasswordVisibility("password")
                                  }
                                  style={{ cursor: "pointer" }}
                                ></span>
                              </div>
                            </div>
                          </div>

                          {/* Remember + Forgot password */}
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <div className="form-check form-check-md mb-0">
                              <input
                                className="form-check-input"
                                id="remember_me"
                                type="checkbox"
                              />
                              <label
                                htmlFor="remember_me"
                                className="form-check-label mt-0 text-dark"
                              >
                                Remember Me
                              </label>
                            </div>
                            <div className="text-end">
                              <Link to={all_routes.forgotpasswordcover}>
                                Forgot Password?
                              </Link>
                            </div>
                          </div>

                          {/* Submit */}
                          <div className="mb-2">
                            <button
                              type="submit"
                              className="btn bg-primary text-white w-100"
                              disabled={loading}
                            >
                              {loading ? "Logging in..." : "Login"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                  <p className="fs-14 text-dark text-center mt-4">
                    Copyright © 2025 - Preclinic.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginCover;
