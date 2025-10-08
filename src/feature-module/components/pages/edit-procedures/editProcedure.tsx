import { Link, useNavigate, useParams } from "react-router-dom";
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

// Axios instance
const api = axios.create({
  baseURL: "http://3.109.62.26/api/billing/",
});

// Token refresh interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post("http://3.109.62.26/api/token/refresh/", { refresh: refreshToken });
        const newAccessToken = res.data.access;
        localStorage.setItem("access_token", newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login-cover";
      }
    }
    return Promise.reject(error);
  }
);

const EditProcedure = () => {
  const { id } = useParams<{ id: string }>();
  const [procedure, setProcedure] = useState<Procedure>({ name: "", description: "", price: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login-cover");
      return;
    }

    const fetchProcedure = async () => {
      try {
        const res = await api.get(`procedures/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProcedure(res.data);
      } catch (error) {
        console.error("Error fetching procedure:", error);
        alert("Failed to fetch procedure data");
        navigate(all_routes.ProcedureList);
      } finally {
        setLoading(false);
      }
    };

    fetchProcedure();
  }, [id, navigate, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProcedure((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.patch(`procedures/${id}/`, procedure, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Procedure updated successfully!");
      navigate(all_routes.ProcedureList);
    } catch (error: any) {
      console.error("Error updating procedure:", error.response?.data || error.message);
      alert(error.response?.data?.detail || "Failed to update procedure");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading procedure...</p>;

  return (
    <>
    <Header />
    <Sidebarthree />
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="col-lg-10 mx-auto">
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

            <div className="card">
              <div className="card-body">
                <h5 className="fs-18 fw-bold mb-3">Edit Procedure</h5>

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-lg-4 mb-3">
                      <label className="form-label">
                        Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={procedure.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-lg-6 mb-3">
                      <label className="form-label">
                        Description <span className="text-danger">*</span>
                      </label>
                      <textarea
                        name="description"
                        className="form-control"
                        value={procedure.description}
                        onChange={handleChange}
                        required
                        style={{ height: "38px" }}
                      />
                    </div>

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
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-light" onClick={() => navigate(all_routes.ProcedureList)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      {saving ? "Saving..." : "Update Procedure"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default EditProcedure;
