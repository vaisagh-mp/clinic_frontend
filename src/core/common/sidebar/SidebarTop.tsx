import React, { useEffect, useState } from "react";
import axios from "axios";
import ImageWithBasePath from "../../imageWithBasePath";
import { useNavigate } from "react-router-dom";

const SidebarTop = () => {
  const [clinics, setClinics] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<any>(null);
  const [selectedDoctors, setSelectedDoctors] = useState<any[]>([]);

  const token = localStorage.getItem("access_token"); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    // Fetch clinics
    axios
      .get("http://3.109.62.26/api/admin-panel/clinics/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setClinics(res.data);
        if (res.data.length > 0) setSelectedClinic(res.data[0]);
      })
      .catch((err) => console.error("Clinics fetch error:", err.response || err));

    // Fetch doctors
    axios
      .get("http://3.109.62.26/api/admin-panel/doctors/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error("Doctors fetch error:", err.response || err));
  }, [token]);

  // Filter doctors under selected clinic
  useEffect(() => {
    if (selectedClinic) {
      const filteredDoctors = doctors.filter(
        (doc) => doc.clinic?.id === selectedClinic.id
      );
      setSelectedDoctors(filteredDoctors);
    }
  }, [selectedClinic, doctors]);

  // Handle selecting a clinic
  const handleClinicChange = async (clinic: any) => {
    try {
      const targetId = clinic.user || clinic.user_id || clinic.id;
      console.log("Switching to clinic target_id:", targetId);

      if (!targetId) {
        console.error("No valid target_id found for clinic:", clinic);
        return;
      }

      const res = await axios.post(
        "http://3.109.62.26/api/admin-panel/switch-panel/",
        { target_id: targetId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Switch clinic response:", res.data);

      const newToken = res.data.access;
      localStorage.setItem("access_token", newToken);
      localStorage.setItem("acting_as_role", res.data.acting_as);
      localStorage.setItem("acting_as_user_id", res.data.target_id);

      navigate(`/clinic/dashboard`);
    } catch (err: any) {
      if (err.response) {
        console.error(
          "Clinic switch server error:",
          err.response.status,
          err.response.data
        );
      } else {
        console.error("Clinic switch failed:", err.message);
      }
    }
  };

  // Handle selecting a doctor
  const handleDoctorClick = async (doctor: any) => {
    try {
      const targetId = doctor.user?.id || doctor.user_id || doctor.id;
      console.log("Switching to doctor target_id:", targetId);

      if (!targetId) {
        console.error("No valid target_id found for doctor:", doctor);
        return;
      }

      const res = await axios.post(
        "http://3.109.62.26/api/admin-panel/switch-panel/",
        { target_id: targetId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Switch doctor response:", res.data);

      const newToken = res.data.access;
      localStorage.setItem("access_token", newToken);
      localStorage.setItem("acting_as_role", res.data.acting_as);
      localStorage.setItem("acting_as_user_id", res.data.target_id);

      navigate(`/doctor/dashboard`);
    } catch (err: any) {
      if (err.response) {
        console.error(
          "Doctor switch server error:",
          err.response.status,
          err.response.data
        );
      } else {
        console.error("Doctor switch failed:", err.message);
      }
    }
  };

  return (
    <div className="sidebar-top shadow-sm p-2 rounded-1 mb-3 dropend">
      <a
        href="#"
        className="drop-arrow-none"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        data-bs-offset="0,22"
        aria-haspopup="false"
        aria-expanded="false"
      >
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <span className="avatar rounded-circle flex-shrink-0 p-2">
              <ImageWithBasePath src="./assets/img/icons/trustcare.svg" alt="img" />
            </span>
            <div className="ms-2">
              <h6 className="fs-14 fw-semibold mb-0">
                {selectedClinic?.name || "Select Clinic"}
              </h6>
              <p className="fs-13 mb-0">{selectedClinic?.address || ""}</p>
            </div>
          </div>
          <i className="ti ti-arrows-transfer-up" />
        </div>
      </a>

      <div className="dropdown-menu dropdown-menu-lg">
        <div className="p-2">
          {/* Clinics list */}
          {clinics.map((clinic) => (
            <label
              key={clinic.id}
              className="dropdown-item d-flex align-items-center justify-content-between p-1"
              onClick={() => handleClinicChange(clinic)}
              style={{ cursor: "pointer" }}
            >
              <span className="d-flex align-items-center">
                <span className="me-2">
                  <ImageWithBasePath src="assets/img/icons/clinic-01.svg" alt="" />
                </span>
                <span className="fw-semibold text-dark">
                  {clinic.name}
                  <small className="d-block text-muted fw-normal fs-13">
                    {clinic.address}
                  </small>
                </span>
              </span>
              <input
                className="form-check-input m-0 me-2"
                type="radio"
                checked={selectedClinic?.id === clinic.id}
                readOnly
              />
            </label>
          ))}

          {/* Doctors under selected clinic */}
          {selectedDoctors.length > 0 && (
            <div className="mt-2">
              <h6 className="fs-14 fw-semibold mb-1">Doctors</h6>
              {selectedDoctors.map((doc: any) => (
                <div
                  key={doc.id}
                  className="d-flex align-items-center justify-content-between p-1"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDoctorClick(doc)}
                >
                  <span>{doc.name}</span>
                  <input className="form-check-input m-0 me-2" type="radio" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarTop;
