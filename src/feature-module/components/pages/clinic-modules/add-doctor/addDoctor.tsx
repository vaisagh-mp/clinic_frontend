import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { all_routes } from "../../../../routes/all_routes";
import axios from "axios";

const AddDoctor = () => {
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

  const [educations, setEducations] = useState([
    { degree: "", university: "", from_year: "", to_year: "" },
  ]);

  const [certifications, setCertifications] = useState([
    { name: "", from_year: "" },
  ]);

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch clinics
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
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setClinics(response.data);
      } catch (error) {
        console.error("Error fetching clinics:", error);
      }
    };
    fetchClinics();
  }, [navigate]);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

    // ✅ Handle Education changes
  const handleEducationChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = [...educations];
    updated[index][e.target.name as keyof typeof updated[number]] = e.target.value;
    setEducations(updated);
  };

  const addEducation = () => {
    setEducations([...educations, { degree: "", university: "", from_year: "", to_year: "" }]);
  };

  const removeEducation = (index: number) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  // ✅ Handle Certification changes
  const handleCertificationChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = [...certifications];
    updated[index][e.target.name as keyof typeof updated[number]] = e.target.value;
    setCertifications(updated);
  };

  const addCertification = () => {
    setCertifications([...certifications, { name: "", from_year: "" }]);
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };


  // Handle profile image selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Submit form
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
      formPayload.append("name", formData.name);
      formPayload.append("username", formData.username);
      formPayload.append("password", formData.password);
      formPayload.append("phone_number", formData.phone_number);
      formPayload.append("email", formData.email);
      formPayload.append("dob", formData.dob);
      formPayload.append("years_of_experience", String(formData.years_of_experience));
      formPayload.append("medical_license_number", formData.medical_license_number);
      formPayload.append("blood_group", formData.blood_group);
      formPayload.append("gender", formData.gender);
      formPayload.append("specialization", formData.specialization);
      formPayload.append("address", formData.address);

      if (profileImage) {
        formPayload.append("profile_image", profileImage);
      }

      // ✅ Add educations and certifications as JSON strings
      formPayload.append("educations", JSON.stringify(educations));
      formPayload.append("certifications", JSON.stringify(certifications));


      const response = await axios.post(
        "http://3.109.62.26/api/admin-panel/doctors/",
        formPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Doctor added successfully!");
      navigate(all_routes.doctorsList);
    } catch (error: any) {
      console.error("Error adding doctor:", error.response?.data || error.message);
      alert(error.response?.data?.detail || error.message || "Failed to add doctor");
    } finally {
      setLoading(false);
    }
  };

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
                    Doctor
                  </Link>
                </h6>
              </div>
            </div>

            {/* Add Doctor Form */}
            <div className="card">
              <div className="card-body">
                <div className="border-bottom d-flex align-items-center justify-content-between pb-3 mb-3">
                  <h5 className="offcanvas-title fs-18 fw-bold">New Doctor</h5>
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
                            <img
                              src={previewImage}
                              alt="preview"
                              className="rounded-circle"
                              width={100}
                              height={100}
                            />
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
                      <label className="form-label">
                        Clinic <span className="text-danger">*</span>
                      </label>
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
                      <label className="form-label">
                        Name <span className="text-danger">*</span>
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

                    {/* Username */}
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">
                        Username <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="username"
                        className="form-control"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Password */}
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">
                        Password <span className="text-danger">*</span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">
                        Phone Number <span className="text-danger">*</span>
                      </label>
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
                      <label className="form-label">
                        Email Address <span className="text-danger">*</span>
                      </label>
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
                      <label className="form-label">
                        Date of Birth <span className="text-danger">*</span>
                      </label>
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
                      <label className="form-label">
                        Years of Experience <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        name="years_of_experience"
                        className="form-control"
                        value={formData.years_of_experience}
                        onChange={(e) =>
                          setFormData({ ...formData, years_of_experience: Number(e.target.value) })
                        }
                        required
                      />
                    </div>

                    {/* Medical License */}
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">
                        Medical License Number <span className="text-danger">*</span>
                      </label>
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
                      <label className="form-label">
                        Blood Group <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-control"
                        name="blood_group"
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
                      <label className="form-label">
                        Gender <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-control"
                        name="gender"
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
                      <label className="form-label">
                        Specialization <span className="text-danger">*</span>
                      </label>
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
                      <label className="form-label">
                        Address <span className="text-danger">*</span>
                      </label>
                      <textarea
                        name="address"
                        className="form-control"
                        rows={3}
                        value={formData.address}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>
                  </div>


                  {/* EDUCATION SECTION */}
                  {/* <div className="bg-light px-3 py-2 mb-3 mt-4">
                    <h6 className="fw-bold mb-0">Education Information</h6>
                  </div>
                  {educations.map((edu, index) => (
                    <div key={index} className="row align-items-end mb-3">
                      <div className="col-md-3">
                        <label className="form-label">Degree</label>
                        <input
                          type="text"
                          name="degree"
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(index, e)}
                          className="form-control"
                          required
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">University</label>
                        <input
                          type="text"
                          name="university"
                          value={edu.university}
                          onChange={(e) => handleEducationChange(index, e)}
                          className="form-control"
                          required
                        />
                      </div>
                      <div className="col-md-2">
                        <label className="form-label">From Year</label>
                        <input
                          type="number"
                          name="from_year"
                          value={edu.from_year}
                          onChange={(e) => handleEducationChange(index, e)}
                          className="form-control"
                          required
                        />
                      </div>
                      <div className="col-md-2">
                        <label className="form-label">To Year</label>
                        <input
                          type="number"
                          name="to_year"
                          value={edu.to_year}
                          onChange={(e) => handleEducationChange(index, e)}
                          className="form-control"
                          required
                        />
                      </div>
                      <div className="col-md-2">
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => removeEducation(index)}
                          disabled={educations.length === 1}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button type="button" className="btn btn-primary mb-3" onClick={addEducation}>
                    + Add Education
                  </button> */}

                  {/* CERTIFICATION SECTION */}
                  {/* <div className="bg-light px-3 py-2 mb-3 mt-4">
                    <h6 className="fw-bold mb-0">Certifications</h6>
                  </div>
                  {certifications.map((cert, index) => (
                    <div key={index} className="row align-items-end mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Certification Name</label>
                        <input
                          type="text"
                          name="name"
                          value={cert.name}
                          onChange={(e) => handleCertificationChange(index, e)}
                          className="form-control"
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">From Year</label>
                        <input
                          type="number"
                          name="from_year"
                          value={cert.from_year}
                          onChange={(e) => handleCertificationChange(index, e)}
                          className="form-control"
                          required
                        />
                      </div>
                      <div className="col-md-2">
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => removeCertification(index)}
                          disabled={certifications.length === 1}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button type="button" className="btn btn-primary mb-3" onClick={addCertification}>
                    + Add Certification
                  </button> */}


                  {/* Buttons */}
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => navigate(all_routes.doctors)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? "Adding..." : "Add Doctor"}
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

export default AddDoctor;
