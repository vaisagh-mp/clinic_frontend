import { Link, useNavigate } from "react-router";
import ImageWithBasePath from "../../../../core/imageWithBasePath";
import { useState, useEffect } from "react";
import axios from "axios";
import { all_routes } from "../../../routes/all_routes";

type PasswordField = "password" | "confirmPassword";

const RegisterCover = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "CLINIC", // default role
  });

  const [availableRoles, setAvailableRoles] = useState<string[]>(["CLINIC"]);
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Fetch roles dynamically
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get("http://3.109.62.26/api/accounts/users/");
        const users = res.data;

        const roles: string[] = ["CLINIC"]; // always available

        const superadminExists = users.some(
          (user: any) => user.role === "SUPERADMIN"
        );
        if (!superadminExists) {
          roles.push("SUPERADMIN");
        }

        setAvailableRoles(roles);
      } catch (err) {
        console.error("Error fetching users", err);
        setAvailableRoles(["CLINIC"]); // fallback
      }
    };

    fetchRoles();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = (field: PasswordField) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        "http://3.109.62.26/api/accounts/register/",
        formData
      );
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate(all_routes.loginCover), 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fuild position-relative z-1">
      <div className="w-100 overflow-hidden position-relative flex-wrap d-block vh-100 bg-white">
        <div className="row">
          {/* Left Section */}
          <div className="col-lg-6 p-0">
            <div className="login-backgrounds login-covers bg-primary d-lg-flex align-items-center justify-content-center d-none flex-wrap p-4 position-relative h-100 z-0">
              <div className="authentication-card w-100">
                <div className="authen-overlay-item w-100">
                  <div className="authen-head text-center">
                    <h1 className="text-white fs-32 fw-bold mb-2">
                      Seamless healthcare access <br /> with smart, modern
                      clinic
                    </h1>
                    <p className="text-light fw-normal">
                      Experience efficient, secure, and user-friendly healthcare
                      management designed for modern clinics and growing practices.
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

          {/* Right Section */}
          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="row justify-content-center align-items-center overflow-auto flex-wrap vh-100 py-4">
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

                    <div className="card border-1 p-lg-3 shadow-md rounded-3">
                      <div className="card-body">
                        <div className="text-center mb-3">
                          <h5 className="mb-1 fs-20 fw-bold">Register</h5>
                          <p className="mb-0">
                            Please enter your details to create account
                          </p>
                        </div>

                        {/* Fields */}
                        <div className="mb-3">
                          <label className="form-label">Username</label>
                          <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter username"
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">First Name</label>
                          <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter first name"
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Last Name</label>
                          <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter last name"
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Email Address</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter email address"
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Password</label>
                          <div className="position-relative">
                            <input
                              type={
                                passwordVisibility.password ? "text" : "password"
                              }
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Enter password"
                              required
                            />
                            <span
                              className={`ti toggle-password text-dark fs-14 position-absolute end-0 top-50 translate-middle-y pe-3 ${
                                passwordVisibility.password ? "ti-eye" : "ti-eye-off"
                              }`}
                              onClick={() =>
                                togglePasswordVisibility("password")
                              }
                            ></span>
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Confirm Password</label>
                          <div className="position-relative">
                            <input
                              type={
                                passwordVisibility.confirmPassword
                                  ? "text"
                                  : "password"
                              }
                              name="confirm_password"
                              value={formData.confirm_password}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Confirm password"
                              required
                            />
                            <span
                              className={`ti toggle-password text-dark fs-14 position-absolute end-0 top-50 translate-middle-y pe-3 ${
                                passwordVisibility.confirmPassword
                                  ? "ti-eye"
                                  : "ti-eye-off"
                              }`}
                              onClick={() =>
                                togglePasswordVisibility("confirmPassword")
                              }
                            ></span>
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Role</label>
                          <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="form-control"
                            required
                          >
                            {availableRoles.map((role) => (
                              <option key={role} value={role}>
                                {role === "CLINIC" ? "Clinic" : "Superadmin"}
                              </option>
                            ))}
                          </select>
                        </div>

                        {error && (
                          <p className="text-danger text-center">{error}</p>
                        )}
                        {success && (
                          <p className="text-success text-center">{success}</p>
                        )}

                        <div className="mb-2">
                          <button
                            type="submit"
                            className="btn bg-primary text-white w-100"
                            disabled={loading}
                          >
                            {loading ? "Registering..." : "Register"}
                          </button>
                        </div>

                        <div className="text-center">
                          <h6 className="fw-normal fs-14 text-dark mb-0">
                            Already have an account?{" "}
                            <Link to={all_routes.loginCover} className="hover-a">
                              Login
                            </Link>
                          </h6>
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
  );
};

export default RegisterCover;
