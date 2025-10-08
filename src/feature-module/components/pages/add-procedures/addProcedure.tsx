import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { all_routes } from "../../../routes/all_routes";
import axios from "axios";
import Header from "../../../../core/common/header/header";
import Sidebarthree from "../../../../core/common/sidebarthree/sidebarthree";

interface Procedure {
  name: string;
  description: string;
  price: string;
}

// Axios instance with authentication
const api = axios.create({
  baseURL: "http://3.109.62.26/api/billing/",
});

// Interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post("http://3.109.62.26/api/token/refresh/", {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;
        localStorage.setItem("access_token", newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login-cover";
      }
    }
    return Promise.reject(error);
  }
);

const AddProcedure = () => {
  const [procedures, setProcedures] = useState<Procedure[]>([
    { name: "", description: "", price: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login-cover");
    }
  }, [navigate, token]);

  // Handle input change for each procedure
  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updated = [...procedures];
    updated[index] = { ...updated[index], [name]: value };
    setProcedures(updated);
  };

  // Add a new procedure row
  const addProcedureRow = () => {
    setProcedures([...procedures, { name: "", description: "", price: "" }]);
  };

  // Remove a procedure row
  const removeProcedureRow = (index: number) => {
    const updated = [...procedures];
    updated.splice(index, 1);
    setProcedures(updated);
  };

  // Submit all procedures
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!token) throw new Error("No access token found");

      let successCount = 0;
      let failureCount = 0;

      for (const procedure of procedures) {
        try {
          await api.post("procedures/", procedure, {
            headers: { Authorization: `Bearer ${token}` },
          });
          successCount++;
        } catch (err: any) {
          console.error("Error adding procedure:", err.response?.data || err.message);
          failureCount++;
        }
      }

      if (failureCount === 0) {
        alert("All procedures added successfully!");
      } else if (successCount > 0) {
        alert(`${successCount} procedures added, ${failureCount} failed.`);
      } else {
        alert("Failed to add procedures.");
      }

      navigate(all_routes.ProcedureList);
    } catch (error: any) {
      console.error("Error adding procedures:", error.response?.data || error.message);
      alert(error.response?.data?.detail || error.message || "Failed to add procedures");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Header />
    <Sidebarthree/>
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="col-lg-10 mx-auto">
            {/* Page Header */}
            <div className="d-flex align-items-sm-center flex-sm-row flex-column gap-2 mb-3">
              <div className="flex-grow-1">
                <h6 className="fw-bold mb-0 d-flex align-items-center">
                  <Link to={all_routes.ProcedureList}>
                    <i className="ti ti-chevron-left me-1 fs-14" />
                    Procedures
                  </Link>
                </h6>
              </div>
            </div>

            {/* Add Procedures Form */}
            <div className="card">
              <div className="card-body">
                <div className="border-bottom d-flex align-items-center justify-content-between pb-3 mb-3">
                  <h5 className="offcanvas-title fs-18 fw-bold">Add Procedures</h5>
                  <button
                    type="button"
                    className="btn btn-sm btn-success"
                    onClick={addProcedureRow}
                  >
                    + Add Procedure
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  {procedures.map((procedure, index) => (
                    <div key={index} className="border p-3 mb-3 rounded bg-light">
                      <div className="d-flex justify-content-between mb-2">
                        <h6 className="fw-bold">Procedure {index + 1}</h6>
                        {procedures.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => removeProcedureRow(index)}
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="row">
                        {/* Name */}
                        <div className="col-lg-4 mb-3">
                          <label className="form-label">
                            Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={procedure.name}
                            onChange={(e) => handleChange(index, e)}
                            required
                          />
                        </div>

                        {/* Description */}
                        <div className="col-lg-6 mb-3">
                          <label className="form-label">
                            Description <span className="text-danger">*</span>
                          </label>
                          <textarea
                          style={{ height: "38px" }}
                            name="description"
                            className="form-control"
                            value={procedure.description}
                            onChange={(e) => handleChange(index, e)}
                            required
                          />
                        </div>

                        {/* Price */}
                        <div className="col-lg-2 mb-3">
                          <label className="form-label">
                            Price <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            name="price"
                            className="form-control"
                            step="0.01"
                            value={procedure.price}
                            onChange={(e) => handleChange(index, e)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Buttons */}
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => navigate(all_routes.ProcedureList)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? "Adding..." : "Save Procedures"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer text-center bg-white p-2 border-top">
        <p className="text-dark mb-0">
          2025 ©
          <Link to="#" className="link-primary">
            Preclinic
          </Link>
          , All Rights Reserved
        </p>
      </div>
    </div>
    </>
  );
};

export default AddProcedure;
