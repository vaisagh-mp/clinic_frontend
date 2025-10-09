import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { all_routes } from "../../../../routes/all_routes";
import { DatePicker } from "antd";
import axios from "axios";
import type { Dayjs } from "dayjs";

const ClinicCreatePatient = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    care_of: "",
    phone_number: "",
    email: "",
    dob: "",
    gender: "",
    blood_group: "",
    address: "",
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);

  // Handle field change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle DOB
  const handleDateChange = (date: Dayjs | null, dateString: string | string[]) => {
  // If dateString is an array, pick the first value
  const dobString = Array.isArray(dateString) ? dateString[0] : dateString;

  if (date) {
    const formatted = (date as Dayjs).format("YYYY-MM-DD"); // format for API
    setFormData((prev) => ({ ...prev, dob: formatted }));
  } else {
    setFormData((prev) => ({ ...prev, dob: "" }));
  }
};

  // Handle Profile Image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  // Submit form
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

      const response = await axios.post(
        "http://3.109.62.26/api/clinic/patients/",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Patient Created:", response.data);
      alert("Patient created successfully!");
      navigate(all_routes.clinicpatients);
    } catch (error: any) {
      console.error("Error creating patient:", error.response?.data || error);
      alert("Failed to create patient. Please try again.");
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
                      <h6 className="fw-bold mb-3">Patient Information</h6>

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
                            <div className="position-absolute bottom-0 end-0 star-0 w-100 h-25 bg-dark d-flex align-items-center justify-content-center z-n1">
                              <Link
                                to="#"
                                className="text-white d-flex align-items-center justify-content-center"
                              >
                                <i className="ti ti-photo fs-14" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div> */}

                      {/* First Name */}
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label mb-1 fw-medium">
                            First Name<span className="text-danger ms-1">*</span>
                          </label>
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
                          <label className="form-label mb-1 fw-medium">
                            Last Name<span className="text-danger ms-1">*</span>
                          </label>
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
                          <label className="form-label mb-1 fw-medium">
                            Phone Number<span className="text-danger ms-1">*</span>
                          </label>
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
                          <label className="form-label mb-1 fw-medium">
                            Email Address<span className="text-danger ms-1">*</span>
                          </label>
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

                      {/* DOB */}
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label mb-1 fw-medium">
                            DOB<span className="text-danger ms-1">*</span>
                          </label>
                          <div className="input-icon-end position-relative">
                            <DatePicker
                              className="form-control datetimepicker"
                              format="DD-MM-YYYY"
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
                          <label className="form-label mb-1 fw-medium">
                            Gender<span className="text-danger ms-1">*</span>
                          </label>
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
                          <label className="form-label mb-1 fw-medium">
                            Blood Group<span className="text-danger ms-1">*</span>
                          </label>
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
                            placeholder="Enter guardian/relative name"
                          />
                        </div>
                      </div>

                      {/* Address */}
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label mb-1 fw-medium">
                            Address<span className="text-danger ms-1">*</span>
                          </label>
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
                <Link to="#" className="btn btn-light me-2">
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary">
                  Add New Patient
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClinicCreatePatient;
