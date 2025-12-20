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
  appointmentId?: string;
  dateTime: string;
  doctorName: string;
  doctorImage: string;
  specialization: string;
  clinic: string;
  status: string;
  doctorId: number;
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
  careOf?: string;
  vitalSigns: VitalSigns;
  attachmentUrl?: string | null;
}

const PatientDetails = () => {
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
  const [procedures, setProcedures] = useState<FlattenedProcedureItem[]>([]);

  // ✅ Patient History state
  const [patientHistory, setPatientHistory] = useState<any[]>([]);

  // ✅ Upload file state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // --- Upload attachment handler
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
        `http://3.109.62.26/api/admin-panel/patients/${patient.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Attachment uploaded successfully!");
      // Refetch patient to update attachment URL
      fetchPatient();
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload attachment.");
    }
  };

  const fetchPatient = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login-cover");
      return;
    }

    try {
      // --- 1️⃣ Patient Info
      const res = await axios.get(
        `http://3.109.62.26/api/admin-panel/patients/${id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data || {};

      // --- 2️⃣ Appointments
      const appointmentsRes = await axios.get(
        `http://3.109.62.26/api/admin-panel/appointments/?patient_id=${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const appointmentsData = appointmentsRes.data || [];

      // Map appointments for table
      const mappedAppointments: Appointment[] = appointmentsData.map(
        (item: any) => ({
          id: item.id,
          appointmentId: item.appointment_id,
          dateTime:
            item.appointment_date && item.appointment_time
              ? new Date(
                  `${item.appointment_date}T${item.appointment_time}`
                ).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "N/A",
          doctorName: item.doctor?.name || "N/A",
          doctorImage: item.doctor?.profile_image
            ? `http://3.109.62.26${item.doctor.profile_image}`
            : "assets/img/doctors/doctor-01.jpg",
          specialization: item.doctor?.specialization || "N/A",
          clinic: item.clinic?.name || "N/A",
          status: item.status || "N/A",
          doctorId: item.doctor?.id || 0,
        })
      );

      setAppointments(mappedAppointments);

      // --- 3️⃣ Calculate lastVisited
      const completedAppointments = appointmentsData.filter(
        (a: any) => a.status === "COMPLETED"
      );

      const lastVisited =
        completedAppointments.length > 0
          ? new Date(
              completedAppointments
                .sort(
                  (a: any, b: any) =>
                    new Date(
                      b.appointment_date + "T" + b.appointment_time
                    ).getTime() -
                    new Date(
                      a.appointment_date + "T" + a.appointment_time
                    ).getTime()
                )[0].appointment_date +
                "T" +
                completedAppointments[0].appointment_time
            ).toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : "N/A";

      // --- 4️⃣ Vital Signs
      const vitalRes = await axios.get(
        `http://3.109.62.26/api/admin-panel/patient-vital-signs/?patient_id=${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const vitalData = vitalRes.data?.[0]?.vitalSigns || {
        bloodPressure: "N/A",
        heartRate: "N/A",
        spo2: "N/A",
        temperature: "N/A",
        respiratoryRate: "N/A",
        weight: "N/A",
      };

      // --- 5️⃣ Procedures (PatientDetails)
      const billingRes = await axios.get(
        `http://3.109.62.26/api/billing/patient/${id}/`, // ✅ filtered by patient
        { headers: { Authorization: `Bearer ${token}` } }
      );

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

        // loop through items inside each bill
        (bill.items || [])
          .filter((item: any) => item.item_type === "PROCEDURE")
          .forEach((item: any) => {
            procedureItems.push({
              id: item.id,
              bill_number: bill.bill_number || "N/A",
              bill_date: formattedBillDate,
              doctor_name: bill.doctor_name || "N/A",
              procedure_name: item.procedure || "N/A",
              subtotal: Number(item.subtotal || item.unit_price || 0),
              total_paid: Number(item.total_paid || 0),
              balance_due: Number(item.balance_due || 0),
            });
          });
      });

      setProcedures(procedureItems);

      // --- 6️⃣ Patient History
      const historyRes = await axios.get(
        `http://3.109.62.26/api/admin-panel/patients/${id}/history/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // API shape you showed: { id, first_name, ..., appointments: [ ... ] }
      setPatientHistory(historyRes.data?.appointments || []);

      // --- 7️⃣ Set Patient State
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
        careOf: data.care_of || "N/A",
        lastVisited, // ✅ dynamically calculated
        vitalSigns: vitalData,
        attachmentUrl: data.attachment ? `${data.attachment}` : null,
      });
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchPatient();
  }, [id, navigate]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // show 5 appointments per page

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = appointments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(appointments.length / itemsPerPage);

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Header & Patient Card */}
        <div className="mb-4">
          <h6 className="fw-bold mb-0 d-flex align-items-center">
            <Link to={all_routes.patients} className="text-dark">
              <i className="ti ti-chevron-left me-1" />
              Patients
            </Link>
          </h6>
        </div>

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
                    {patient.careOf && patient.careOf !== "N/A" && (
                      <>
                        <p className="mb-0 d-inline-flex align-items-center me-3">
                          <i className="ti ti-user me-1 text-dark" />
                          Care Of:
                          <span className="text-dark ms-1">
                            {patient.careOf}
                          </span>
                        </p>
                        <span className="mx-2 text-light">|</span>
                      </>
                    )}

                    {patient.phone && (
                      <>
                        <p className="mb-0 d-inline-flex align-items-center me-3">
                          <i className="ti ti-phone me-1 text-dark" />
                          Phone:
                          <span className="text-dark ms-1">
                            {patient.phone}
                          </span>
                        </p>
                        <span className="mx-2 text-light">|</span>
                      </>
                    )}

                    {patient.lastVisited && (
                      <p className="mb-0 d-inline-flex align-items-center">
                        <i className="ti ti-calendar-time me-1 text-dark" />
                        Last Visited:
                        <span className="text-dark ms-1">
                          {patient.lastVisited}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-lg-4 text-lg-end p-3">
              <form onSubmit={handleUpload}>
                <input
                  type="file"
                  onChange={(e) =>
                    setSelectedFile(e.target.files?.[0] || null)
                  }
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

        {/* Procedures Table */}
        <div className="card mt-4">
          <div className="card-header">
            <h5 className="fw-bold mb-0">
              <i className="ti ti-file-text me-1" /> Procedures
            </h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table datatable table-nowrap align-middle">
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
                      const formatCurrency = (amount: number) =>
                        `₹${amount.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`;

                      const balanceBadgeColor =
                        proc.balance_due > 0 ? "danger" : "success";
                      const balanceText =
                        proc.balance_due > 0 ? "Pending" : "Paid";

                      return (
                        <tr key={proc.id}>
                          <td>{proc.bill_number}</td>
                          <td>{proc.procedure_name}</td>
                          <td>{proc.bill_date}</td>
                          <td>{proc.doctor_name}</td>
                          <td>{formatCurrency(proc.subtotal)}</td>
                          <td>{formatCurrency(proc.total_paid)}</td>
                          <td>
                            <span
                              className={`badge fs-13 rounded fw-medium text-uppercase badge-soft-${balanceBadgeColor} text-${balanceBadgeColor}`}
                            >
                              {formatCurrency(proc.balance_due)} (
                              {balanceText})
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
                        <td>{app.appointmentId || `APT-${app.id}`}</td>
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
                                  to={`${all_routes.doctordetails}/${app.doctorId}`}
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
                      <td colSpan={5} className="text-center">
                        No appointments available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination Controls */}
              {appointments.length > itemsPerPage && (
                <div className="d-flex justify-content-center align-items-center mt-3">
                  <button
                    className="btn btn-outline-primary btn-sm me-2"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <i className="ti ti-chevron-left" /> Previous
                  </button>

                  <span className="mx-2">
                    Page <strong>{currentPage}</strong> of {totalPages}
                  </span>

                  <button
                    className="btn btn-outline-primary btn-sm ms-2"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, totalPages)
                      )
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next <i className="ti ti-chevron-right" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Patient History Table (Option A: below Appointments) */}
        <div className="card mt-4">
          <div className="card-header">
            <h5 className="fw-bold mb-0">
              <i className="ti ti-history me-1" />
              Patient History
            </h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table datatable table-nowrap align-middle">
                <thead>
                  <tr>
                    <th>Appointment ID</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Doctor</th>
                    <th>Clinic</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {patientHistory.length > 0 ? (
                    patientHistory.map((item: any) => (
                      <tr key={item.id}>
                        <td>{item.appointment_id}</td>
                        <td>{item.appointment_date}</td>
                        <td>{item.appointment_time}</td>
                        <td>{item.doctor?.name || "N/A"}</td>
                        <td>{item.clinic?.name || "N/A"}</td>
                        <td>{item.reason || "N/A"}</td>
                        <td>
                          <span
                            className={`badge fs-13 rounded fw-medium text-uppercase badge-soft-${
                              item.status === "COMPLETED"
                                ? "success"
                                : item.status === "CANCELLED"
                                ? "danger"
                                : "warning"
                            } text-${
                              item.status === "COMPLETED"
                                ? "success"
                                : item.status === "CANCELLED"
                                ? "danger"
                                : "warning"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center">
                        No history available
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

export default PatientDetails;
