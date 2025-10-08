import { Link, useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { all_routes } from "../../../../routes/all_routes";
import axios from "axios";

const CliniceditDoctor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    phone_number: "",
    email: "",
    dob: "",
    years_of_experience: 0,
    medical_license_number: "",
    blood_group: "",
    gender: "",
    specialization: "",
    address: "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      navigate("/login-cover");
      return;
    }

    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`http://3.109.62.26/api/clinic/doctors/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const doc = res.data;
        setFormData({
          name: doc.name || "",
          username: doc.username || "",
          password: "",
          phone_number: doc.phone_number || "",
          email: doc.email || "",
          dob: doc.dob || "",
          years_of_experience: doc.years_of_experience || 0,
          medical_license_number: doc.medical_license_number || "",
          blood_group: doc.blood_group || "",
          gender: doc.gender || "",
          specialization: doc.specialization || "",
          address: doc.address || "",
        });
        if (doc.profile_image) setPreviewImage(doc.profile_image);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch doctor data");
      }
    };

    fetchDoctor();
  }, [id, navigate, token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!token) throw new Error("No access token found");

      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "password" || value) formPayload.append(key, String(value));
      });

      if (profileImage) formPayload.append("profile_image", profileImage);

      await axios.put(
        `http://3.109.62.26/api/clinic/doctors/${id}/`,
        formPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Doctor updated successfully!");
      navigate(all_routes.clinicallDoctors);
    } catch (error: any) {
      console.error("Error updating doctor:", error.response?.data || error.message);
      alert(error.response?.data?.detail || error.message || "Failed to update doctor");
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
                  <Link to={all_routes.clinicallDoctors}>
                    <i className="ti ti-chevron-left me-1 fs-14" /> Doctor
                  </Link>
                </h6>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="border-bottom d-flex align-items-center justify-content-between pb-3 mb-3">
                  <h5 className="offcanvas-title fs-18 fw-bold">Edit Doctor</h5>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="bg-light px-3 py-2 mb-3">
                    <h6 className="fw-bold mb-0">Contact Information</h6>
                  </div>

                  <div className="row">
                    {/* Profile Image */}
                    <div className="col-lg-12 mb-3">
                      <label className="form-label">Profile Image</label>
                      <div className="d-flex align-items-center gap-3">
                        <div className="avatar avatar-xxl rounded-circle bg-light text-muted overflow-hidden position-relative">
                          {previewImage ? (
                            <img src={previewImage} alt="preview" className="rounded-circle" width={100} height={100} />
                          ) : (
                            <i className="ti ti-user-plus fs-32 d-flex align-items-center justify-content-center w-100 h-100" />
                          )}
                          <input
                            type="file"
                            className="form-control position-absolute top-0 start-0 w-100 h-100 opacity-0"
                            name="profile_image"
                            onChange={handleFileChange}
                            accept="image/*"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Name */}
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Name <span className="text-danger">*</span></label>
                      <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                    </div>

                    {/* Username */}
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Username <span className="text-danger">*</span></label>
                      <input type="text" name="username" className="form-control" value={formData.username} onChange={handleChange} />
                    </div>

                    {/* Password */}
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Password (Leave blank to keep unchanged)</label>
                      <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} />
                    </div>

                    {/* Phone Number */}
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Phone Number <span className="text-danger">*</span></label>
                      <input type="text" name="phone_number" className="form-control" value={formData.phone_number} onChange={handleChange} required />
                    </div>

                    {/* Email */}
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Email Address <span className="text-danger">*</span></label>
                      <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                    </div>

                    {/* DOB */}
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Date of Birth <span className="text-danger">*</span></label>
                      <input type="date" name="dob" className="form-control" value={formData.dob} onChange={handleChange} required />
                    </div>

                    {/* Years of Experience */}
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Years of Experience <span className="text-danger">*</span></label>
                      <input type="number" name="years_of_experience" className="form-control" value={formData.years_of_experience} onChange={(e) => setFormData({ ...formData, years_of_experience: Number(e.target.value) })} required />
                    </div>

                    {/* Medical License */}
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Medical License Number <span className="text-danger">*</span></label>
                      <input type="text" name="medical_license_number" className="form-control" value={formData.medical_license_number} onChange={handleChange} required />
                    </div>

                    {/* Blood Group */}
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Blood Group <span className="text-danger">*</span></label>
                      <select className="form-control" name="blood_group" value={formData.blood_group} onChange={handleChange} required>
                        <option value="">-------</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>

                    {/* Gender */}
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Gender <span className="text-danger">*</span></label>
                      <select className="form-control" name="gender" value={formData.gender} onChange={handleChange} required>
                        <option value="">-------</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                      </select>
                    </div>

                    {/* Specialization */}
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Specialization <span className="text-danger">*</span></label>
                      <input type="text" name="specialization" className="form-control" value={formData.specialization} onChange={handleChange} required />
                    </div>

                    {/* Address */}
                    <div className="col-lg-12 mb-3">
                      <label className="form-label">Address <span className="text-danger">*</span></label>
                      <textarea name="address" className="form-control" rows={3} value={formData.address} onChange={handleChange} required></textarea>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-light" onClick={() => navigate(all_routes.clinicallDoctors)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? "Updating..." : "Update Doctor"}
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
          2025 © <Link to="#" className="link-primary">Preclinic</Link>, All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default CliniceditDoctor;
