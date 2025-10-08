import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { all_routes } from "../../../../routes/all_routes";

const CLINIC_TYPES = [
  { label: "General", value: "GENERAL" },
  { label: "Multispecialty", value: "MULTISPECIALTY" },
  { label: "Dental", value: "DENTAL" },
  { label: "Eye", value: "EYE" },
  { label: "Pediatric", value: "PEDIATRIC" },
];

const STATUS_CHOICES = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Suspended", value: "SUSPENDED" },
];

const EditClinic = () => {
  const { clinicId } = useParams();
  const navigate = useNavigate();
  const [clinic, setClinic] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch clinic details
  useEffect(() => {
    const fetchClinic = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          navigate("/login-cover");
          return;
        }

        const response = await fetch(
          `http://3.109.62.26/api/admin-panel/clinics/${clinicId}/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          navigate("/login-cover");
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setClinic(data);
      } catch (error) {
        console.error("Error fetching clinic:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClinic();
  }, [clinicId, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setClinic((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");

      // Remove username/password if empty
      const payload = { ...clinic };
      if (!payload.username) delete payload.username;
      if (!payload.password) delete payload.password;

      const response = await fetch(
        `http://3.109.62.26/api/admin-panel/clinics/${clinicId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        alert("Clinic updated successfully");
        navigate("/clinic-list");
      } else {
        const errorData = await response.json();
        console.error("Update errors:", errorData);
        alert("Failed to update clinic");
      }
    } catch (error) {
      console.error("Error updating clinic:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!clinic) return <p>Clinic not found</p>;

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="col-lg-10 mx-auto">
            {/* Page Header */}
            <div className="d-flex align-items-sm-center flex-sm-row flex-column gap-2 mb-3">
              <div className="flex-grow-1">
                <h6 className="fw-bold mb-0 d-flex align-items-center">
                  <Link to={all_routes.doctors}>
                    <i className="ti ti-chevron-left me-1 fs-14" />
                    Clinic
                  </Link>
                </h6>
              </div>
            </div>

            {/* Edit Clinic Form */}
            <div className="card">
              <div className="card-body">
                <div className="border-bottom d-flex align-items-center justify-content-between pb-3 mb-3">
                  <h5 className="offcanvas-title fs-18 fw-bold">Edit Clinic</h5>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Clinic Information */}
                  <div className="bg-light px-3 py-2 mb-3">
                    <h6 className="fw-bold mb-0">Clinic Information</h6>
                  </div>
                  <div className="pb-0">
                    <div className="row">
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">
                          Clinic Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={clinic.name || ""}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          rows={1}
                          name="description"
                          value={clinic.description || ""}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                      <div className="col-lg-12 mb-3">
                        <label className="form-label">
                          Clinic Address <span className="text-danger">*</span>
                        </label>
                        <textarea
                          className="form-control"
                          rows={2}
                          name="address"
                          value={clinic.address || ""}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">
                          Phone Number <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="phone_number"
                          value={clinic.phone_number || ""}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">Email Address</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={clinic.email || ""}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">Website</label>
                        <input
                          type="text"
                          className="form-control"
                          name="website"
                          value={clinic.website || ""}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">
                          Clinic Type <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-control"
                          name="type"
                          value={clinic.type || ""}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Type</option>
                          {CLINIC_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">
                          Status <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-control"
                          name="status"
                          value={clinic.status || ""}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Status</option>
                          {STATUS_CHOICES.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Login Credentials */}
                  <div className="bg-light px-3 py-2 mb-3">
                    <h6 className="fw-bold mb-0">Login Credentials</h6>
                  </div>
                  <div className="pb-0">
                    <div className="row">
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">Username</label>
                        <input
                          type="text"
                          className="form-control"
                          name="username"
                          value={clinic.username || ""}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">Password</label>
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                          value={clinic.password || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => navigate("/clinic-list")}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Update Clinic
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
  );
};

export default EditClinic;
