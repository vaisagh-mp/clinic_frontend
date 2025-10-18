import { Link } from "react-router"
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { all_routes } from "../../../routes/all_routes"
import { useState } from "react";
import ImageWithBasePath from "../../../../core/imageWithBasePath";
type PasswordField = "password" | "confirmPassword";

const ResetPasswordCover = () => {

  const { uidb64, token } = useParams();
  const navigate = useNavigate();

    const [passwordVisibility, setPasswordVisibility] = useState({
        password: false,
        confirmPassword: false,
      });

    const [passwords, setPasswords] = useState({
      password: "",
      confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    
      const togglePasswordVisibility = (field: PasswordField) => {
        setPasswordVisibility((prevState) => ({
          ...prevState,
          [field]: !prevState[field],
        }));
      };

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `http://3.109.62.26/api/accounts/reset-password/${uidb64}/${token}/`,
        {
          password: passwords.password,
          confirm_password: passwords.confirmPassword,
        }
      );
      alert("Password reset successful!");
      navigate(all_routes.loginCover);
    } catch (err: any) {
      alert(err.response?.data?.error || "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
<>
  {/* Start Content */}
  <div className="container-fuild position-relative z-1">
    <div className="w-100 overflow-hidden position-relative flex-wrap d-block vh-100 bg-white">
      {/* start row*/}
      <div className="row">
        <div className="col-lg-6 p-0">
          <div className="login-backgrounds login-covers bg-primary d-lg-flex align-items-center justify-content-center d-none flex-wrap p-4 position-relative h-100 z-0">
            <div className="authentication-card w-100">
              <div className="authen-overlay-item w-100">
                <div className="authen-head text-center">
                  <h1 className="text-white fs-32 fw-bold mb-2">
                    Seamless healthcare access <br /> with smart, modern clinic
                  </h1>
                  <p className="text-light fw-normal text-light">
                    
                    Experience efficient, secure, and user-friendly healthcare
                    management designed for modern clinics and growing
                    practices.
                  </p>
                </div>
                <div className="mt-4 mx-auto authen-overlay-img">
                  <ImageWithBasePath src="assets/img/auth/cover-imgs-1.png" alt="Img" />
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
        {/* end row*/}
        <div className="col-lg-6 col-md-12 col-sm-12">
          <div className="row justify-content-center align-items-center overflow-auto flex-wrap vh-100">
            <div className="col-md-8 mx-auto">
              <div className="d-flex justify-content-center align-items-center">
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
                      {/* ✅ Only ONE form here */}
                      <form onSubmit={handleSubmit}>
                        <div className="text-center mb-3">
                          <h5 className="mb-1 fs-20 fw-bold">Reset Password</h5>
                          <p className="mb-0">
                            Your new password must be different from previously used passwords.
                          </p>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Password</label>
                          <div className="position-relative">
                            <div className="pass-group input-group position-relative border rounded">
                              <span className="input-group-text bg-white border-0">
                                <i className="ti ti-lock text-dark fs-14" />
                              </span>
                              <input
                                type={passwordVisibility.password ? "text" : "password"}
                                name="password"
                                value={passwords.password}
                                onChange={handleChange}
                                className="pass-input form-control border-start-0 ps-0"
                                placeholder="****************"
                                required
                              />
                              <span
                                className={`ti toggle-password text-dark fs-14 ${
                                  passwordVisibility.password ? "ti-eye" : "ti-eye-off"
                                }`}
                                onClick={() => togglePasswordVisibility("password")}
                              ></span>
                            </div>
                          </div>
                        </div>
                              
                        <div className="mb-3">
                          <label className="form-label">Confirm Password</label>
                          <div className="position-relative">
                            <div className="pass-group input-group position-relative border rounded">
                              <span className="input-group-text bg-white border-0">
                                <i className="ti ti-lock text-dark fs-14" />
                              </span>
                              <input
                                type={passwordVisibility.confirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={passwords.confirmPassword}
                                onChange={handleChange}
                                required
                                className="pass-input form-control border-start-0 ps-0"
                                placeholder="****************"
                              />
                              <span
                                className={`ti toggle-password text-dark fs-14 ${
                                  passwordVisibility.confirmPassword ? "ti-eye" : "ti-eye-off"
                                }`}
                                onClick={() => togglePasswordVisibility("confirmPassword")}
                              ></span>
                            </div>
                          </div>
                        </div>
                              
                        <div className="mb-3">
                          <button type="submit" className="btn bg-primary text-white w-100" disabled={loading}>
                            {loading ? "Submitting..." : "Submit"}
                          </button>
                        </div>
                              
                        <div className="text-center">
                          <h6 className="fw-normal fs-14 text-dark mb-0">
                            Return to <Link to={all_routes.loginCover} className="hover-a">Login</Link>
                          </h6>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <p className="fs-14 text-dark text-center mt-4">
                Copyright © 2025 - Preclinic.
              </p>
            </div>
            {/* end row*/}
          </div>
        </div>
      </div>
      {/* end row*/}
    </div>
  </div>
  {/* End Content */}
</>

  )
}

export default ResetPasswordCover