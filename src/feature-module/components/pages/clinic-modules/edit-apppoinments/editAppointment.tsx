import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
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

const EditAppointment = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const token = localStorage.getItem("access_token");

  const [patients, setPatients] = useState<{ value: number; label: string }[]>([]);
  const [doctors, setDoctors] = useState<{ value: number; label: string }[]>([]);
  const [clinics, setClinics] = useState<{ value: number; label: string }[]>([]);
  const [formData, setFormData] = useState({
    appointmentId: "",
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

  useEffect(() => {
    if (!token) {
      navigate("/login-cover");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch dropdown data
        const [patientsRes, doctorsRes, clinicsRes] = await Promise.all([
          axios.get("http://3.109.62.26/api/admin-panel/patients/", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://3.109.62.26/api/admin-panel/doctors/", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://3.109.62.26/api/admin-panel/clinics/", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setPatients(patientsRes.data.map((p: any) => ({ value: p.id, label: `${p.first_name} ${p.last_name || ""}`.trim() })));
        setDoctors(doctorsRes.data.map((d: any) => ({ value: d.id, label: d.name || `${d.user?.first_name || ""} ${d.user?.last_name || ""}`.trim() })));
        setClinics(clinicsRes.data.map((c: any) => ({ value: c.id, label: c.name })));

        // Fetch appointment data by ID
        const appointmentRes = await axios.get(`http://3.109.62.26/api/admin-panel/appointments/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const appt = appointmentRes.data;

        setFormData({
          appointmentId: appt.id || "",
          patient: appt.patient?.id || "",
          doctor: appt.doctor?.id || "",
          clinic: appt.clinic?.id || "",
          department: appt.department || Department[0].value,
          appointmentType: appt.appointment_type || Appointment_Type[0].value,
          appointmentDate: appt.appointment_date || "",
          appointmentTime: appt.appointment_time || "",
          reason: appt.reason || "",
          status: appt.status || Status_Checkout[0].value,
        });

      } catch (err) {
        console.error(err);
        alert("Failed to fetch appointment data");
      }
    };

    fetchData();
  }, [navigate, token, id]);

  const getModalContainer = () => document.getElementById("modal-datepicker") || document.body;

  const handleSubmit = async () => {
    try {
      await axios.put(
        `http://3.109.62.26/api/admin-panel/appointments/${id}/`,
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
      alert("Appointment updated successfully!");
      navigate(all_routes.appointments);
    } catch (err) {
      console.error(err);
      alert("Failed to update appointment");
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
                  {/* Appointment ID */}
                  {/* <div className="mb-3">
                    <label className="form-label mb-1 fw-medium">
                      Appointment ID <span className="text-danger ms-1">*</span>
                    </label>
                    <input type="text" className="form-control" value={formData.appointmentId} disabled />
                  </div> */}

                  {/* Patient / Clinic / Department */}
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label mb-1 fw-medium">Patient <span className="text-danger ms-1">*</span></label>
                      <select className="form-control" value={formData.patient} onChange={(e) => setFormData({ ...formData, patient: e.target.value })}>
                        {patients.map((p) => (<option key={p.value} value={p.value}>{p.label}</option>))}
                      </select>
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label mb-1 fw-medium">Clinic <span className="text-danger ms-1">*</span></label>
                      <select className="form-control" value={formData.clinic} onChange={(e) => setFormData({ ...formData, clinic: e.target.value })}>
                        {clinics.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
                      </select>
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label mb-1 fw-medium">Department <span className="text-danger ms-1">*</span></label>
                      <select className="form-control" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}>
                        {Department.map((d) => (<option key={d.value} value={d.value}>{d.label}</option>))}
                      </select>
                    </div>
                  </div>

                  {/* Doctor / Appointment Type */}
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label mb-1 fw-medium">Doctor <span className="text-danger ms-1">*</span></label>
                      <select className="form-control" value={formData.doctor} onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}>
                        {doctors.map((doc) => (<option key={doc.value} value={doc.value}>{doc.label}</option>))}
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label mb-1 fw-medium">Appointment Type <span className="text-danger ms-1">*</span></label>
                      <select className="form-control" value={formData.appointmentType} onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value })}>
                        {Appointment_Type.map((type) => (<option key={type.value} value={type.value}>{type.label}</option>))}
                      </select>
                    </div>
                  </div>

                  {/* Date / Time */}
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label mb-1 fw-medium">Date of Appointment <span className="text-danger ms-1">*</span></label>
                      <DatePicker
                        className="form-control datetimepicker"
                        format="DD-MM-YYYY"
                        getPopupContainer={getModalContainer}
                        value={formData.appointmentDate ? dayjs(formData.appointmentDate) : null}
                        onChange={(date) =>
                          setFormData({ ...formData, appointmentDate: date ? date.format("YYYY-MM-DD") : "" })
                        }
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label mb-1 fw-medium">Time <span className="text-danger ms-1">*</span></label>
                      <TimePicker
                        className="form-control"
                        format="HH:mm:ss"
                        value={formData.appointmentTime ? dayjs(formData.appointmentTime, "HH:mm:ss") : null}
                        onChange={(time) =>
                          setFormData({ ...formData, appointmentTime: time ? time.format("HH:mm:ss") : "" })
                        }
                        defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                      />
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="mb-3">
                    <label className="form-label mb-1 fw-medium">Appointment Reason <span className="text-danger ms-1">*</span></label>
                    <textarea className="form-control" rows={3} value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} />
                  </div>

                  {/* Status */}
                  <div className="mb-3">
                    <label className="form-label mb-1 fw-medium">Status <span className="text-danger ms-1">*</span></label>
                    <select className="form-control" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                      {Status_Checkout.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
                    </select>
                  </div>

                  {/* Buttons */}
                  <div className="d-flex align-items-center justify-content-end mt-3">
                    <Link to={all_routes.appointments} className="btn btn-light me-2">Cancel</Link>
                    <button onClick={handleSubmit} className="btn btn-primary">Update Appointment</button>
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

export default EditAppointment;
