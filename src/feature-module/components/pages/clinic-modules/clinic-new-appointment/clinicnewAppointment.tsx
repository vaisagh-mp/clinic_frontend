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

const ClinicnewAppointment = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<{ value: number; label: string }[]>([]);
  const [doctors, setDoctors] = useState<{ value: number; label: string }[]>([]);
  const [formData, setFormData] = useState({
    appointmentId: "AP234354",
    patient: "",
    doctor: "",
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
        const [patientsRes, doctorsRes] = await Promise.all([
          axios.get("http://3.109.62.26/api/clinic/patients/", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://3.109.62.26/api/clinic/doctors/", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setPatients(patientsRes.data.map((p: any) => ({ value: p.id, label: `${p.first_name} ${p.last_name || ""}`.trim() })));
        setDoctors(doctorsRes.data.map((d: any) => ({ value: d.id, label: d.name || `${d.user?.first_name || ""} ${d.user?.last_name || ""}`.trim() })));

        // default select first option if available
        setFormData((prev) => ({
          ...prev,
          patient: patientsRes.data[0]?.id || "",
          doctor: doctorsRes.data[0]?.id || "",
        }));
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [navigate, token]);

  const getModalContainer = () => document.getElementById("modal-datepicker") || document.body;

  const handleSubmit = async () => {
    try {
      await axios.post(
        "http://3.109.62.26/api/clinic/appointments/",
        {
          patient_id: formData.patient,
          doctor_id: formData.doctor,
          appointment_date: formData.appointmentDate,
          appointment_time: formData.appointmentTime,
          reason: formData.reason,
          status: formData.status,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Appointment created successfully!");
      navigate(all_routes.clinicappointments);
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
            {/* Page Header */}
            <div className="mb-4">
              <h6 className="fw-bold mb-0 d-flex align-items-center">
                <Link to={all_routes.clinicappointments} className="text-dark">
                  <i className="ti ti-chevron-left me-1" /> Appointments
                </Link>
              </h6>
            </div>

            {/* Card */}
            <div className="card">
              <div className="card-body">
                <div className="form">
                  {/* Appointment ID */}
                  {/* <div className="mb-3">
                    <label className="form-label mb-1 fw-medium">
                      Appointment ID <span className="text-danger ms-1">*</span>
                    </label>
                    <input type="text" className="form-control" value={formData.appointmentId} disabled />
                  </div> */}

                  {/* Patient / Department */}
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label mb-1 fw-medium">
                        Patient <span className="text-danger ms-1">*</span>
                      </label>
                      <select className="form-control" value={formData.patient} onChange={(e) => setFormData({ ...formData, patient: e.target.value })}>
                        {patients.map((p) => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
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

                  {/* Doctor / Appointment Type */}
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

                  {/* Date / Time */}
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label mb-1 fw-medium">
                        Date of Appointment <span className="text-danger ms-1">*</span>
                      </label>
                      <DatePicker
                        className="form-control datetimepicker"
                        format="DD-MM-YYYY"
                        getPopupContainer={getModalContainer}
                        onChange={(date) =>
                          setFormData({
                            ...formData,
                            appointmentDate: date ? date.format("YYYY-MM-DD") : "",
                          })
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

                  {/* Reason */}
                  <div className="mb-3">
                    <label className="form-label mb-1 fw-medium">
                      Appointment Reason <span className="text-danger ms-1">*</span>
                    </label>
                    <textarea className="form-control" rows={3} value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} />
                  </div>

                  {/* Status */}
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

                  {/* Buttons */}
                  <div className="d-flex align-items-center justify-content-end mt-3">
                    <Link to="#" className="btn btn-light me-2">Cancel</Link>
                    <button onClick={handleSubmit} className="btn btn-primary">Create Appointment</button>
                  </div>
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
    </div>
  );
};

export default ClinicnewAppointment;
