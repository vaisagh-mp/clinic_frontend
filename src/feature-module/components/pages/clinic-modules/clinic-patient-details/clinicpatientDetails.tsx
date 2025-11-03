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

interface Consultation {
  created_at: string;
  blood_pressure?: string;
  heart_rate?: string;
  spo2?: string;
  temperature?: string;
  respiratory_rate?: string;
  weight?: string;
  allergies: string;
  // add other fields if needed
}

interface Appointment {
  id: number;
  appointmentId: string;
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
  allergies: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  lastVisited: string;
  careOf?: string;
  vitalSigns: VitalSigns;
  attachmentUrl?: string | null;
}


interface FormattedAppointment {
  id: number;
  dateTime: string;
  doctorName: string;
  doctorImage: string;
  specialization: string;
  clinic: string;
  status: string;
  doctorId: number;
  appointmentDate: string;
}

interface FlattenedProcedureItem {
  id: number;
  bill_number: string;
  bill_date: string;
  doctor_name: string;
  procedure_name: string;
  subtotal: number;
  total_paid: number;
  balance_due: number;
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
    allergies: "N/A",
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
  const [procedures, setProcedures] = useState<FlattenedProcedureItem[]>([]);

  // ✅ Add upload file state here
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // ✅ Upload handler inside component
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("attachment", selectedFile);

    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login-cover");
      return;
    }

    try {
      await axios.patch(
        `http://3.109.62.26/api/clinic/patients/${patient.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Attachment uploaded successfully!");
      // Optional: refetch patient data to update UI
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload attachment.");
    }
  };


  useEffect(() => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    navigate("/login-cover");
    return;
  }

  const fetchPatient = async () => {
    try {
      // ✅ Superadmin support: read clinic_id from localStorage
      const clinicId = localStorage.getItem("clinic_id");

      // ✅ Helper to append ?clinic_id= if available
      const withClinic = (url: string) =>
        clinicId ? `${url}${url.includes("?") ? "&" : "?"}clinic_id=${clinicId}` : url;

      // --- Fetch patient details ---
      const patientUrl = withClinic(
        `http://3.109.62.26/api/clinic/patients/${id}/`
      );
      const res = await axios.get(patientUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data || {};

      // --- Fetch appointments ---
      const appointmentsUrl = withClinic(
        `http://3.109.62.26/api/clinic/appointments/?patient_id=${id}`
      );
      const appointmentsRes = await axios.get(appointmentsUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const appointmentsData =
        appointmentsRes.data.results || appointmentsRes.data || [];

      // --- Fetch billing / procedure data ---
      const billingUrl = withClinic(
        `http://3.109.62.26/api/billing/clinic/pharmacy-bill/?patient_id=${id}`
      );
      const billingRes = await axios.get(billingUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const billingData = billingRes.data.results || billingRes.data || [];

      const procedureItems: FlattenedProcedureItem[] = [];

      billingData.forEach((bill: any) => {
        const formattedBillDate = bill.bill_date
          ? new Date(bill.bill_date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "N/A";

        bill.items
          .filter((item: any) => item.item_type === "PROCEDURE")
          .forEach((item: any) => {
            procedureItems.push({
              id: item.id,
              bill_number: bill.bill_number,
              bill_date: formattedBillDate,
              doctor_name: bill.doctor_name,
              procedure_name: item.procedure,
              subtotal: item.subtotal,
              total_paid: item.total_paid,
              balance_due: item.balance_due,
            });
          });
      });

      setProcedures(procedureItems);

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
        appointmentId: item.appointment_id,
        dateTime: formatDateTime(item.appointment_date, item.appointment_time),
        doctorName: item.doctor?.name || "N/A",
        doctorImage: item.doctor?.profile_image
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
        (a: FormattedAppointment) => a.status === "COMPLETED"
      );

      const lastVisited =
        completedAppointments.length > 0
          ? completedAppointments.sort(
              (a: FormattedAppointment, b: FormattedAppointment) =>
                new Date(b.appointmentDate).getTime() -
                new Date(a.appointmentDate).getTime()
            )[0].dateTime
          : "N/A";

      // --- Fetch consultations for this patient ---
      const consultationsUrl = withClinic(
        `http://3.109.62.26/api/clinic/consultations/?patient_id=${id}`
      );
      const consultationsRes = await axios.get(consultationsUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const consultationsData: Consultation[] = consultationsRes.data || [];

      // --- Get the latest consultation for vital signs ---
      const latestConsultation =
        consultationsData.length > 0
          ? consultationsData.sort(
              (a: Consultation, b: Consultation) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )[0]
          : null;

      // --- Set Patient Data ---
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
        careOf: data.care_of || "N/A",
        allergies: latestConsultation?.allergies || "N/A",
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
        attachmentUrl: data.attachment
          ? `http://3.109.62.26${data.attachment}`
          : null,
      });
    } catch (err) {
      console.error("Error fetching patient, appointment or consultation data:", err);
    }
  };

  fetchPatient();
}, [id, navigate]);


// ✅ Appointment pagination
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5; // show 5 appointments per page


// ✅ Pagination logic for appointments
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentAppointments = appointments.slice(indexOfFirstItem, indexOfLastItem);
const totalPages = Math.ceil(appointments.length / itemsPerPage);


  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Page Header */}
        <div className="mb-4">
          <h6 className="fw-bold mb-0 d-flex align-items-center">
            <Link to={all_routes.clinicpatients} className="text-dark">
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
                  {patient.allergies && patient.allergies !== "N/A" && (
                    <p className="mb-3">
                      <span className="text-body">Allergies: </span>
                      {patient.allergies}
                    </p>
                  )}
                  <div className="d-flex align-items-center flex-wrap">
                    {patient.careOf && patient.careOf !== "N/A" && (
                      <>
                        <p className="mb-0 d-inline-flex align-items-center me-3">
                          <i className="ti ti-user me-1 text-dark" />
                          Care Of:
                          <span className="text-dark ms-1">{patient.careOf}</span>
                        </p>
                        <span className="mx-2 text-light">|</span>
                      </>
                    )}
                    <p className="mb-0 d-inline-flex align-items-center">
                      <i className="ti ti-phone me-1 text-dark" />
                      Phone:
                      <span className="text-dark ms-1">{patient.phone}</span>
                    </p>
                    <span className="mx-2 text-light">|</span>
                      <p className="mb-0 d-inline-flex align-items-center">
                        <i className="ti ti-calendar-time me-1 text-dark" />
                        Last Visited:
                        <span className="text-dark ms-1">{patient.lastVisited}</span>
                      </p>
                    </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 text-lg-end p-3">
  <form onSubmit={handleUpload}>
    <input
      type="file"
      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
      className="form-control mb-2"
    />
    <div className="d-flex gap-2">
      <button type="submit" className="btn btn-primary">
        <i className="ti ti-upload me-1" />
        Upload Attachment
      </button>

      {/* ✅ View button */}
      {patient.attachmentUrl && (
        <a
          href={patient.attachmentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary"
        >
          <i className="ti ti-eye me-1" />
          View
        </a>
      )}
    </div>
  </form>
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


        {/* Procedure Table */}
<div className="card mt-4">
  <div className="card-header">
    <h5 className="fw-bold mb-0">
      <i className="ti ti-file-text me-1" />
      Procedures
    </h5>
  </div>
  <div className="card-body">
    <div className="table-responsive">
      <table className="table datatable table-nowrap">
        <thead>
          <tr>
            <th>Bill Number</th>
            <th>Procedure Name</th>
            <th>Bill Date</th>
            <th>Doctor Name</th>
            <th>Subtotal</th>
            <th>Total Paid</th>
            <th>Balance Due</th>
          </tr>
        </thead>
        <tbody>
          {procedures.length > 0 ? (
            procedures.map((proc) => {
              const formatCurrency = (value: number | string) => {
                const num = Number(value) || 0;
                return `₹${num.toLocaleString("en-IN")}`;
              };

              const isPending = Number(proc.balance_due) > 0;

              return (
                <tr key={proc.id}>
                  <td>
                    <Link
                      to={`/clinic-dashboard/patient-details/procedurepayment/${proc.id}`}
                      className="text-decoration-none"
                    >
                      {proc.bill_number}
                    </Link>
                  </td>
                  <td>{proc.procedure_name}</td>
                  <td>{proc.bill_date || "N/A"}</td>
                  <td>{proc.doctor_name}</td>
                  <td>{formatCurrency(proc.subtotal)}</td>
                  <td>{formatCurrency(proc.total_paid)}</td>
                  <td>
                    <span
                      className={`badge fs-13 rounded fw-medium text-uppercase badge-soft-${
                        isPending ? "danger" : "success"
                      } text-${isPending ? "danger" : "success"}`}
                    >
                      {isPending
                        ? `${formatCurrency(proc.balance_due)}`
                        : "Paid"}
                    </span>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={7} className="text-center">
                No procedures available
              </td>
            </tr>
          )}
        </tbody>
      </table>
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
                    <th>Appointment ID</th>
                    <th>Date & Time</th>
                    <th>Doctor Name</th>
                    <th>Clinic</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAppointments.length > 0 ? (
  currentAppointments.map((app) => (

                      <tr key={app.id}>
                        <td>{app.appointmentId}</td>
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

              {/* ✅ Pagination Controls */}
{appointments.length > itemsPerPage && (
  <div className="d-flex justify-content-center align-items-center mt-3">
    <button
      className="btn btn-outline-primary btn-sm me-2"
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
    >
      <i className="ti ti-chevron-left" /> Previous
    </button>

    <span className="mx-2">
      Page <strong>{currentPage}</strong> of {totalPages}
    </span>

    <button
      className="btn btn-outline-primary btn-sm ms-2"
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
    >
      Next <i className="ti ti-chevron-right" />
    </button>
  </div>
)}

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
