import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { DatePicker, TimePicker, type TimePickerProps } from "antd";
import dayjs from "dayjs";
import { all_routes } from "../../../../routes/all_routes";

const Appointment_Type = [
  { value: "Consultation", label: "Consultation" },
  { value: "Follow-up", label: "Follow-up" },
];
const Department = [
  { value: "Cardiology", label: "Cardiology" },
  { value: "Neurology", label: "Neurology" },
];
const Status_Checkout = [
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

const NewAppointment = () => {
  const navigate = useNavigate();
  const [allPatients, setAllPatients] = useState<any[]>([]);
  const [allDoctors, setAllDoctors] = useState<any[]>([]);
  const [patients, setPatients] = useState<{ value: number; label: string }[]>([]);
  const [doctors, setDoctors] = useState<{ value: number; label: string }[]>([]);
  const [clinics, setClinics] = useState<{ value: number; label: string }[]>([]);
  const [formData, setFormData] = useState({
    appointmentId: "AP234354",
    patient: "",
    doctor: "",
    clinic: "",
    department: Department[0].value,
    appointmentType: Appointment_Type[0].value,
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    status: Status_Checkout[0].value,
  });

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      navigate("/login-cover");
      return;
    }

    const fetchData = async () => {
      try {
        const [patientsRes, doctorsRes, clinicsRes] = await Promise.all([
          axios.get("http://3.109.62.26/api/admin-panel/patients/", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://3.109.62.26/api/admin-panel/doctors/", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://3.109.62.26/api/admin-panel/clinics/", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setAllPatients(patientsRes.data);
        setAllDoctors(doctorsRes.data);
        setClinics(clinicsRes.data.map((c: any) => ({ value: c.id, label: c.name })));

        const defaultClinicId = clinicsRes.data[0]?.id || "";

        // Filter and set first doctor/patient for default clinic
        handleClinicFilter(defaultClinicId, patientsRes.data, doctorsRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [navigate, token]);

  const getModalContainer = () => document.getElementById("modal-datepicker") || document.body;

  const handleClinicFilter = (clinicId: string, allPatientsData = allPatients, allDoctorsData = allDoctors) => {
    // Filter patients
    const filteredPatients = allPatientsData
      .filter((p: any) => p.clinic?.id == clinicId || p.clinic == clinicId)
      .map((p: any) => ({ value: p.id, label: `${p.first_name} ${p.last_name || ""}`.trim() }));
    
    // Filter doctors
    const filteredDoctors = allDoctorsData
      .filter((d: any) => d.clinic?.id == clinicId || d.clinic == clinicId)
      .map((d: any) => ({
        value: d.id,
        label: d.name || `${d.user?.first_name || ""} ${d.user?.last_name || ""}`.trim(),
      }));

    setPatients(filteredPatients);
    setDoctors(filteredDoctors);

    // Automatically select first available patient and doctor
    setFormData((prev) => ({
      ...prev,
      clinic: clinicId,
      patient: filteredPatients[0]?.value || "",
      doctor: filteredDoctors[0]?.value || "",
    }));
  };

  const handleClinicChange = (clinicId: string) => {
    handleClinicFilter(clinicId);
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        "http://3.109.62.26/api/admin-panel/appointments/",
        {
          patient_id: formData.patient,
          doctor_id: formData.doctor,
          clinic_id: formData.clinic,
          appointment_date: formData.appointmentDate,
          appointment_time: formData.appointmentTime,
          reason: formData.reason,
          status: formData.status,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Appointment created successfully!");
      navigate(all_routes.appointments);
    } catch (err) {
      console.error(err);
      alert("Failed to create appointment");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="mb-4">
              <h6 className="fw-bold mb-0 d-flex align-items-center">
                <Link to={all_routes.appointments} className="text-dark">
                  <i className="ti ti-chevron-left me-1" /> Appointments
                </Link>
              </h6>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="form">
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label mb-1 fw-medium">
                        Clinic <span className="text-danger ms-1">*</span>
                      </label>
                      <select className="form-control" value={formData.clinic} onChange={(e) => handleClinicChange(e.target.value)}>
                        {clinics.map((c) => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label mb-1 fw-medium">
                        Patient <span className="text-danger ms-1">*</span>
                      </label>
                      <select className="form-control" value={formData.patient} onChange={(e) => setFormData({ ...formData, patient: e.target.value })}>
                        {patients.map((p) => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label mb-1 fw-medium">
                        Department <span className="text-danger ms-1">*</span>
                      </label>
                      <select className="form-control" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}>
                        {Department.map((d) => (
                          <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label mb-1 fw-medium">
                        Doctor <span className="text-danger ms-1">*</span>
                      </label>
                      <select className="form-control" value={formData.doctor} onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}>
                        {doctors.map((doc) => (
                          <option key={doc.value} value={doc.value}>{doc.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label mb-1 fw-medium">
                        Appointment Type <span className="text-danger ms-1">*</span>
                      </label>
                      <select className="form-control" value={formData.appointmentType} onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value })}>
                        {Appointment_Type.map((type) => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label mb-1 fw-medium">
                        Date of Appointment <span className="text-danger ms-1">*</span>
                      </label>
                      <DatePicker
                        className="form-control datetimepicker"
                        format="DD-MM-YYYY"
                        getPopupContainer={() => document.getElementById("modal-datepicker") || document.body}
                        onChange={(date) =>
                          setFormData({ ...formData, appointmentDate: date ? date.format("YYYY-MM-DD") : "" })
                        }
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label mb-1 fw-medium">
                        Time <span className="text-danger ms-1">*</span>
                      </label>
                      <TimePicker
  className="form-control"
  format="hh:mm A" // display 12-hour format
  onChange={(time) =>
    setFormData({
      ...formData,
      appointmentTime: time ? time.format("HH:mm:ss") : "", // send 24-hour to backend
    })
  }
  defaultOpenValue={dayjs("12:00 PM", "hh:mm A")}
/>

                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label mb-1 fw-medium">
                      Appointment Reason <span className="text-danger ms-1">*</span>
                    </label>
                    <textarea className="form-control" rows={3} value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label mb-1 fw-medium">
                      Status <span className="text-danger ms-1">*</span>
                    </label>
                    <select className="form-control" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                      {Status_Checkout.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="d-flex align-items-center justify-content-end mt-3">
                    <Link to="#" className="btn btn-light me-2">Cancel</Link>
                    <button onClick={handleSubmit} className="btn btn-primary">Create Appointment</button>
                  </div>
                </div>
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

export default NewAppointment;
