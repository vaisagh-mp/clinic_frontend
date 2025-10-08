import { Link, useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { all_routes } from "../../../../routes/all_routes";
import axios from "axios";

const EditDoctor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [clinics, setClinics] = useState<{ id: number; name: string }[]>([]);
  const [selectedClinicId, setSelectedClinicId] = useState<number | "">("");
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

  // Fetch clinics
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          navigate("/login-cover");
          return;
        }
        const res = await axios.get("http://3.109.62.26/api/admin-panel/clinics/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClinics(res.data);
      } catch (error) {
        console.error("Error fetching clinics:", error);
      }
    };
    fetchClinics();
  }, [navigate]);

  // Fetch doctor data
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          navigate("/login-cover");
          return;
        }

        const res = await axios.get(`http://3.109.62.26/api/admin-panel/doctors/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const doc = res.data;

        // Prefill formData
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

        // Prefill clinic
        setSelectedClinicId(doc.clinic?.id || "");

        // Prefill profile image
        setPreviewImage(doc.profile_image ? `http://3.109.62.26${doc.profile_image}` : null);
      } catch (error) {
        console.error("Error fetching doctor:", error);
      }
    };

    if (id) fetchDoctor();
  }, [id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    if (!selectedClinicId) {
      alert("Please select a clinic");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");

      const formPayload = new FormData();
      formPayload.append("clinic", String(selectedClinicId));
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "password" || (key === "password" && value)) {
          formPayload.append(key, String(value));
        }
      });
      if (profileImage) formPayload.append("profile_image", profileImage);

      await axios.put(`http://3.109.62.26/api/admin-panel/doctors/${id}/`, formPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Doctor updated successfully!");
      navigate(all_routes.doctorsList);
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
                  <Link to={all_routes.doctors}>
                    <i className="ti ti-chevron-left me-1 fs-14" />
                    Doctors
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

                    {/* Clinic */}
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Clinic <span className="text-danger">*</span></label>
                      <select
                        className="form-control"
                        name="clinic"
                        value={selectedClinicId}
                        onChange={(e) => setSelectedClinicId(Number(e.target.value))}
                        required
                      >
                        <option value="">-------</option>
                        {clinics.map((clinic) => (
                          <option key={clinic.id} value={clinic.id}>
                            {clinic.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Name */}
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Name <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Username */}
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Username <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="username"
                        className="form-control"
                        value={formData.username}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Password */}
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <small className="text-muted">Leave blank to keep current password</small>
                    </div>

                    {/* Phone */}
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Phone Number <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="phone_number"
                        className="form-control"
                        value={formData.phone_number}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Email <span className="text-danger">*</span></label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* DOB */}
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Date of Birth <span className="text-danger">*</span></label>
                      <input
                        type="date"
                        name="dob"
                        className="form-control"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Years of Experience */}
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Years of Experience <span className="text-danger">*</span></label>
                      <input
                        type="number"
                        name="years_of_experience"
                        className="form-control"
                        value={formData.years_of_experience}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Medical License */}
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Medical License Number <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="medical_license_number"
                        className="form-control"
                        value={formData.medical_license_number}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Blood Group */}
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Blood Group <span className="text-danger">*</span></label>
                      <select
                        name="blood_group"
                        className="form-control"
                        value={formData.blood_group}
                        onChange={handleChange}
                        required
                      >
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
                      <select
                        name="gender"
                        className="form-control"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                      >
                        <option value="">-------</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                      </select>
                    </div>

                    {/* Specialization */}
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Specialization <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="specialization"
                        className="form-control"
                        value={formData.specialization}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Address */}
                    <div className="col-lg-12 mb-3">
                      <label className="form-label">Address <span className="text-danger">*</span></label>
                      <textarea
                        name="address"
                        className="form-control"
                        rows={3}
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => navigate(all_routes.doctorsList)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? "Updating..." : "Update Doctor"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="footer text-center bg-white p-2 border-top">
          <p className="text-dark mb-0">
            2025 © <Link to="#" className="link-primary">Preclinic</Link>, All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditDoctor;
