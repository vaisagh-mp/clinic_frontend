import { Link } from "react-router";
import { all_routes } from "../../../../routes/all_routes";
import { useState } from "react";
import axios from "axios";

const AddClinic = () => {
  const token = localStorage.getItem("access_token");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone_number: "",
    email: "",
    website: "",
    type: "",    // store as string
    status: "",  // store as string
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert("No token available. Please login again.");
      return;
    }

    if (!formData.type || !formData.status) {
      alert("Please select clinic type and status.");
      return;
    }

    setLoading(true);
    try {
      // send formData directly, type and status are already strings
      const payload = { ...formData };

      const response = await axios.post(
        "http://3.109.62.26/api/admin-panel/clinics/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Clinic added successfully:", response.data);
      alert("Clinic added successfully!");
    } catch (err: any) {
      console.error("Error adding clinic: ", err);
      alert(
        `Error adding clinic: ${
          err.response?.data ? JSON.stringify(err.response.data) : err.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="col-lg-10 mx-auto">
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

            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {/* Clinic Info */}
                  <div className="bg-light px-3 py-2 mb-3">
                    <h6 className="fw-bold mb-0">Clinic Information</h6>
                  </div>
                  <div className="row">
                    {/* Clinic Name */}
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">
                          Clinic Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          name="description"
                          className="form-control"
                          rows={1}
                          value={formData.description}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="col-lg-12">
                      <div className="mb-3">
                        <label className="form-label">Address</label>
                        <textarea
                          name="address"
                          className="form-control"
                          rows={2}
                          value={formData.address}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="text"
                          name="phone_number"
                          className="form-control"
                          value={formData.phone_number}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* Website */}
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">Website</label>
                        <input
                          type="text"
                          name="website"
                          className="form-control"
                          value={formData.website}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* Clinic Type */}
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">Clinic Type</label>
                        <select
                          className="form-control"
                          name="type"
                          value={formData.type}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="GENERAL">General</option>
                          <option value="MULTISPECIALTY">Multispecialty</option>
                          <option value="DENTAL">Dental</option>
                          <option value="EYE">Eye</option>
                          <option value="PEDIATRIC">Pediatric</option>
                        </select>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">Status</label>
                        <select
                          className="form-control"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Status</option>
                          <option value="ACTIVE">Active</option>
                          <option value="INACTIVE">Inactive</option>
                          <option value="SUSPENDED">Suspended</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Login Credentials */}
                  <div className="bg-light px-3 py-2 mb-3">
                    <h6 className="fw-bold mb-0">Login Credentials</h6>
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                          type="text"
                          name="username"
                          className="form-control"
                          value={formData.username}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                          type="password"
                          name="password"
                          className="form-control"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => window.history.back()}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Adding..." : "Add Clinic"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddClinic;
