import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { all_routes } from "../../../../routes/all_routes";
import { DatePicker } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { Dayjs } from "dayjs";

const ClinicEditPatient = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // get patient id from route params

  const [clinics, setClinics] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    care_of: "",
    phone_number: "",
    email: "",
    clinic: "",
    dob: "",
    gender: "",
    blood_group: "",
    address: "",
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);

  // Fetch Clinics
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          navigate("/login-cover");
          return;
        }
        const response = await axios.get(
          "http://3.109.62.26/api/admin-panel/clinics/",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setClinics(response.data);
      } catch (error) {
        console.error("Error fetching clinics:", error);
      }
    };
    fetchClinics();
  }, [navigate]);

  // Fetch Patient details
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          navigate("/login-cover");
          return;
        }
        const response = await axios.get(
          `http://3.109.62.26/api/admin-panel/patients/${id}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const patient = response.data;
        setFormData({
          first_name: patient.first_name || "",
          last_name: patient.last_name || "",
          care_of: patient.care_of || "",
          phone_number: patient.phone_number || "",
          email: patient.email || "",
          // 🔑 handle both object or id
          clinic: String(patient.clinic?.id || patient.clinic || ""),
          dob: patient.dob || "",
          gender: patient.gender || "",
          blood_group: patient.blood_group || "",
          address: patient.address || "",
        });
      } catch (error) {
        console.error("Error fetching patient:", error);
      }
    };
    if (id) fetchPatient();
  }, [id, navigate]);

  // Handle field change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle DOB
  const handleDateChange = (date: Dayjs | null, dateString: string | string[]) => {
    let formatted = "";
    
    if (date) {
      formatted = date.format("YYYY-MM-DD");
    }
  
    setFormData((prev) => ({ ...prev, dob: formatted }));
  };

  // Handle Profile Image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  // Submit form (PATCH)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login-cover");
        return;
      }

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      if (profileImage) {
        formDataToSend.append("profile_image", profileImage);
      }

      const response = await axios.patch(
        `http://3.109.62.26/api/admin-panel/patients/${id}/`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Patient Updated:", response.data);
      alert("Patient updated successfully!");
      navigate(all_routes.clinicpatients);
    } catch (error: any) {
      console.error("Error updating patient:", error.response?.data || error);
      alert("Failed to update patient. Please try again.");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <form onSubmit={handleSubmit}>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="mb-4">
                <h6 className="fw-bold mb-0 d-flex align-items-center">
                  <Link to={all_routes.clinicpatients} className="text-dark">
                    <i className="ti ti-chevron-left me-1" />
                    Patients
                  </Link>
                </h6>
              </div>

              <div className="card">
                <div className="card-body pb-0">
                  <div className="form">
                    <div className="row">
                      <h6 className="fw-bold mb-3">Edit Patient</h6>

                      {/* Profile Image */}
                      {/* <div className="col-lg-12">
                        <div className="mb-3 d-flex align-items-center">
                          <label className="form-label mb-0">Profile Image</label>
                          <div className="drag-upload-btn avatar avatar-xxl rounded-circle bg-light text-muted position-relative overflow-hidden z-1 mb-2 ms-4 p-0">
                            {profileImage ? (
                              <img
                                src={URL.createObjectURL(profileImage)}
                                alt="Profile"
                                className="w-100 h-100 object-fit-cover"
                              />
                            ) : (
                              <i className="ti ti-user-plus fs-16" />
                            )}
                            <input
                              type="file"
                              className="form-control image-sign"
                              onChange={handleFileChange}
                              accept="image/*"
                              style={{
                                opacity: 0,
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                cursor: "pointer",
                              }}
                            />
                          </div>
                        </div>
                      </div> */}

                      {/* First Name */}
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label mb-1 fw-medium">First Name</label>
                          <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className="form-control"
                            required
                          />
                        </div>
                      </div>

                      {/* Last Name */}
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label mb-1 fw-medium">Last Name</label>
                          <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            className="form-control"
                            required
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label mb-1 fw-medium">Phone Number</label>
                          <input
                            type="text"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            className="form-control"
                            required
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label mb-1 fw-medium">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-control"
                            required
                          />
                        </div>
                      </div>

                      {/* Clinic */}
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label mb-1 fw-medium">Clinic</label>
                          <select
                            name="clinic"
                            value={formData.clinic}
                            onChange={handleChange}
                            className="form-control"
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
                      </div>

                      {/* DOB */}
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label mb-1 fw-medium">DOB</label>
                          <div className="input-icon-end position-relative">
                            <DatePicker
                              className="form-control datetimepicker"
                              format="DD-MM-YYYY"
                              value={formData.dob ? dayjs(formData.dob) : null}
                              onChange={handleDateChange}
                            />
                            <span className="input-icon-addon">
                              <i className="ti ti-calendar" />
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Gender */}
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label mb-1 fw-medium">Gender</label>
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="form-control"
                            required
                          >
                            <option value="">-------</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                            <option value="O">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* Blood Group */}
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label mb-1 fw-medium">Blood Group</label>
                          <select
                            name="blood_group"
                            value={formData.blood_group}
                            onChange={handleChange}
                            className="form-control"
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
                      </div>

                      {/* Care Of */}
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label mb-1 fw-medium">Care Of</label>
                          <input
                            type="text"
                            name="care_of"
                            value={formData.care_of}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                      </div>

                      {/* Address */}
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label mb-1 fw-medium">Address</label>
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="form-control"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="d-flex align-items-center justify-content-end">
                <Link to={all_routes.patients} className="btn btn-light me-2">
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary">
                  Update Patient
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClinicEditPatient;
