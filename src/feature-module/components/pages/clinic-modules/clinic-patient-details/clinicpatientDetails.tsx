import { Link, useNavigate, useParams } from "react-router";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { all_routes } from "../../../../routes/all_routes";
import { useState, useEffect } from "react";
import Modals from "./modals/modals";
import axios from "axios";

interface VitalSigns {
  bloodPressure: string;
  heartRate: string;
  spo2: string;
  temperature: string;
  respiratoryRate: string;
  weight: string;
}

interface Appointment {
  id: number;
  dateTime: string;
  doctorName: string;
  doctorImage: string;
  specialization: string;
  clinic: string;
  status: string;
  doctorId: number;
}

interface Patient {
  id: number;
  name: string;
  dob: string;
  bloodGroup: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  lastVisited: string;
  vitalSigns: VitalSigns;
}

const ClinicpatientDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [patient, setPatient] = useState<Patient>({
    id: 0,
    name: "N/A",
    dob: "N/A",
    bloodGroup: "N/A",
    gender: "N/A",
    email: "N/A",
    phone: "N/A",
    address: "N/A",
    lastVisited: "N/A",
    vitalSigns: {
      bloodPressure: "N/A",
      heartRate: "N/A",
      spo2: "N/A",
      temperature: "N/A",
      respiratoryRate: "N/A",
      weight: "N/A",
    },
  });

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    navigate("/login-cover");
    return;
  }

  const fetchPatient = async () => {
    try {
      // --- Fetch patient details ---
      const res = await axios.get(
        `http://3.109.62.26/api/clinic/patients/${id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data || {};

      // --- Fetch appointments ---
      const appointmentsRes = await axios.get(
        `http://3.109.62.26/api/clinic/appointments/?patient_id=${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const appointmentsData =
        appointmentsRes.data.results || appointmentsRes.data || [];

      // --- Format appointments date & time ---
      const formatDateTime = (date: string, time: string) => {
        if (!date) return "N/A";
        try {
          const dateTime = new Date(`${date}T${time || "00:00:00"}`);
          return dateTime.toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
        } catch {
          return "N/A";
        }
      };

      const formattedAppointments = appointmentsData.map((item: any) => ({
  id: item.id,
  dateTime: formatDateTime(item.appointment_date, item.appointment_time),
  doctorName: item.doctor?.name || "N/A",
  doctorImage:
    item.doctor?.profile_image
      ? `http://3.109.62.26${item.doctor.profile_image}`
      : "assets/img/doctors/doctor-01.jpg",
  specialization: item.doctor?.specialization || "N/A",
  clinic: item.clinic?.name || "N/A",
  status: item.status || "N/A",
  doctorId: item.doctor?.id || 0,
  appointmentDate: item.appointment_date,
}));


      setAppointments(formattedAppointments);

      // --- Find last visited (latest completed appointment) ---
      const completedAppointments = formattedAppointments.filter(
        (a) => a.status === "COMPLETED"
      );
      const lastVisited =
        completedAppointments.length > 0
          ? completedAppointments.sort(
              (a, b) =>
                new Date(b.appointmentDate).getTime() -
                new Date(a.appointmentDate).getTime()
            )[0].dateTime
          : "N/A";

      // --- Fetch consultations for this patient ---
      const consultationsRes = await axios.get(
        `http://3.109.62.26/api/clinic/consultations/?patient_id=${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const consultationsData = consultationsRes.data || [];

      // --- Get the latest consultation for vital signs ---
      const latestConsultation =
        consultationsData.length > 0
          ? consultationsData.sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )[0]
          : null;

      setPatient({
        id: data.id || 0,
        name:
          data.first_name && data.last_name
            ? `${data.first_name} ${data.last_name}`
            : data.first_name || "N/A",
        dob: data.dob || "N/A",
        bloodGroup: data.blood_group || "N/A",
        gender: data.gender || "N/A",
        email: data.email || "N/A",
        phone: data.phone_number || "N/A",
        address: data.address || "N/A",
        lastVisited,
        vitalSigns: latestConsultation
          ? {
              bloodPressure: latestConsultation.blood_pressure || "N/A",
              heartRate: latestConsultation.heart_rate || "N/A",
              spo2: latestConsultation.spo2 || "N/A",
              temperature: latestConsultation.temperature || "N/A",
              respiratoryRate: latestConsultation.respiratory_rate || "N/A",
              weight: latestConsultation.weight || "N/A",
            }
          : {
              bloodPressure: "N/A",
              heartRate: "N/A",
              spo2: "N/A",
              temperature: "N/A",
              respiratoryRate: "N/A",
              weight: "N/A",
            },
      });
    } catch (err) {
      console.error("Error fetching patient, appointment or consultation data:", err);
    }
  };

  fetchPatient();
}, [id, navigate]);


  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Page Header */}
        <div className="mb-4">
          <h6 className="fw-bold mb-0 d-flex align-items-center">
            <Link to={all_routes.patients} className="text-dark">
              <i className="ti ti-chevron-left me-1" />
              Patients
            </Link>
          </h6>
        </div>

        {/* Patient Card */}
        <div className="card">
          <div className="row align-items-end">
            <div className="col-xl-9 col-lg-8">
              <div className="d-sm-flex align-items-center position-relative z-0 overflow-hidden p-3">
                <ImageWithBasePath
                  src="./assets/img/icons/shape-01.svg"
                  alt="img"
                  className="z-n1 position-absolute end-0 top-0 d-none d-lg-flex"
                />
                <Link
                  to="#"
                  className="avatar avatar-xxxl patient-avatar me-2 flex-shrink-0"
                >
                  <ImageWithBasePath
                    src="assets/img/users/user-08.jpg"
                    alt="product"
                    className="rounded"
                  />
                </Link>
                <div>
                  <p className="text-primary mb-1">#PT{patient.id}</p>
                  <h5 className="mb-1">
                    <Link to="#" className="fw-bold">
                      {patient.name}
                    </Link>
                  </h5>
                  <p className="mb-3">{patient.address}</p>
                  <div className="d-flex align-items-center flex-wrap">
                    <p className="mb-0 d-inline-flex align-items-center">
                      <i className="ti ti-phone me-1 text-dark" />
                      Phone :
                      <span className="text-dark ms-1">{patient.phone}</span>
                    </p>
                    <span className="mx-2 text-light">|</span>
                    <p className="mb-0 d-inline-flex align-items-center">
                      <i className="ti ti-calendar-time me-1 text-dark" />
                      Last Visited :
                      <span className="text-dark ms-1">{patient.lastVisited}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 text-lg-end p-3">
              <Link
                to={`${all_routes.clinicnewAppointments}?patient_id=${patient.id}`}
                className="btn btn-primary"
              >
                <i className="ti ti-calendar-event me-1" />
                Book Appointment
              </Link>
            </div>
          </div>
        </div>

        {/* About & Vital Signs */}
        <div className="row">
          {/* About */}
          <div className="col-xl-5 d-flex">
            <div className="card shadow-sm flex-fill w-100">
              <div className="card-header">
                <h5 className="fw-bold mb-0">
                  <i className="ti ti-user-star me-1" />
                  About
                </h5>
              </div>
              <div className="card-body pb-0">
                <div className="row">
                  <div className="col-sm-5 mb-3">
                    <h6>DOB</h6>
                    <p>{patient.dob}</p>
                  </div>
                  <div className="col-sm-7 mb-3">
                    <h6>Blood Group</h6>
                    <p>{patient.bloodGroup}</p>
                  </div>
                  <div className="col-sm-5 mb-3">
                    <h6>Gender</h6>
                    <p>{patient.gender}</p>
                  </div>
                  <div className="col-sm-7 mb-3">
                    <h6>Email</h6>
                    <p>{patient.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vital Signs */}
          <div className="col-xl-7 d-flex">
            <div className="card shadow-sm flex-fill w-100">
              <div className="card-header">
                <h5 className="fw-bold mb-0">
                  <i className="ti ti-book me-1" />
                  Vital Signs
                </h5>
              </div>
              <div className="card-body pb-0">
                <div className="row">
                  <div className="col-sm-4 mb-3">
                    <h6>Blood Pressure</h6>
                    <p>{patient.vitalSigns.bloodPressure}</p>
                  </div>
                  <div className="col-sm-4 mb-3">
                    <h6>Heart Rate</h6>
                    <p>{patient.vitalSigns.heartRate}</p>
                  </div>
                  <div className="col-sm-4 mb-3">
                    <h6>SPO2</h6>
                    <p>{patient.vitalSigns.spo2}</p>
                  </div>
                  <div className="col-sm-4 mb-3">
                    <h6>Temperature</h6>
                    <p>{patient.vitalSigns.temperature}</p>
                  </div>
                  <div className="col-sm-4 mb-3">
                    <h6>Respiratory Rate</h6>
                    <p>{patient.vitalSigns.respiratoryRate}</p>
                  </div>
                  <div className="col-sm-4 mb-3">
                    <h6>Weight</h6>
                    <p>{patient.vitalSigns.weight}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="card mt-4">
          <div className="card-header">
            <h5 className="fw-bold mb-0">
              <i className="ti ti-calendar-event me-1" />
              Appointments
            </h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table datatable table-nowrap">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Doctor Name</th>
                    <th>Clinic</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length > 0 ? (
                    appointments.map((app) => (
                      <tr key={app.id}>
                        <td>{app.dateTime}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <Link
                              to={`${all_routes.doctordetails}/${app.doctorId}`}
                              className="avatar me-2 flex-shrink-0"
                            >
                              <ImageWithBasePath
                                src={app.doctorImage}
                                alt="doctor"
                                className="rounded-circle"
                              />
                            </Link>
                            <div>
                              <h6 className="fs-14 mb-1 text-truncate">
                                <Link
                                  to="#"
                                  className="fw-semibold"
                                >
                                  {app.doctorName}
                                </Link>
                              </h6>
                              <p className="mb-0 fs-13 text-truncate">
                                {app.specialization}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>{app.clinic}</td>
                       <td>
                        <span
                          className={`badge fs-13 rounded fw-medium text-uppercase badge-soft-${
                            app.status === "COMPLETED"
                              ? "success"
                              : app.status === "CANCELLED"
                              ? "danger"
                              : "warning"
                          } text-${
                            app.status === "COMPLETED"
                              ? "success"
                              : app.status === "CANCELLED"
                              ? "danger"
                              : "warning"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center">
                        No appointments available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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

      {/* Modals */}
      <Modals />
    </div>
  );
};

export default ClinicpatientDetails;
