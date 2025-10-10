import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import ImageWithBasePath from "../../../../core/imageWithBasePath";
import { all_routes } from "../../../routes/all_routes";
import SCol2Chart from "./chats/scol2";
import SCol3Chart from "./chats/scol3";
import SCol4Chart from "./chats/scol4";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      navigate("/login-cover");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch Dashboard Data
        const dashboardRes = await fetch("http://3.109.62.26/api/admin-panel/dashboard/", {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        if (!dashboardRes.ok) throw new Error("Failed to fetch dashboard data");
        const dashboardResult = await dashboardRes.json();
        setDashboardData(dashboardResult);

        // Fetch Patients
        const patientsRes = await fetch("http://3.109.62.26/api/admin-panel/patients/", {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        if (!patientsRes.ok) throw new Error("Failed to fetch patients");
        const patientsResult = await patientsRes.json();
        setPatients(patientsResult);

        // Fetch Appointments
        const appointmentsRes = await fetch("http://3.109.62.26/api/admin-panel/appointments/", {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        if (!appointmentsRes.ok) throw new Error("Failed to fetch appointments");
        const appointmentsResult = await appointmentsRes.json();
        setAppointments(appointmentsResult);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      }
    };

    fetchData();
  }, [navigate, token]);

  // Small chart settings
  const [sColChart] = useState<any>({
    chart: { width: 80, height: 54, type: "bar", toolbar: { show: false }, sparkline: { enabled: true } },
    plotOptions: { bar: { horizontal: false, columnWidth: "70%", borderRadius: 3, endingShape: "rounded" } },
    dataLabels: { enabled: false },
    stroke: { show: false },
    xaxis: { labels: { show: false }, axisTicks: { show: false }, axisBorder: { show: false } },
    yaxis: { show: false },
    grid: { show: false },
    tooltip: { enabled: false },
    colors: ["#2E37A4", "#2E37A4", "#2E37A4", "#2E37A4", "#FF955A", "#2E37A4", "#2E37A4"],
    fill: { type: "solid" },
  });
  const series = [{ name: "Data", data: [40, 15, 60, 15, 90, 20, 70] }];

  const allDoctors = (dashboardData?.doctors || []).slice(0, 3);
  const displayedPatients = (dashboardData?.patients || []).slice(0, 2);
  const limitedAppointments = appointments.slice(0, 5); // 👈 Limit to 5 rows

  return (
    <div className="page-wrapper">
      <div className="content pb-0">
        {/* Page Header */}
        <div className="d-flex align-items-sm-center justify-content-between flex-wrap gap-2 mb-4">
          <h4 className="fw-bold mb-0">Admin Dashboard</h4>
          <Link to={all_routes.newAppointment} className="btn btn-primary d-inline-flex align-items-center">
            <i className="ti ti-plus me-1" /> New Appointment
          </Link>
        </div>

        {/* Statistics Row */}
        <div className="row">
          {/* Doctors Card */}
          <div className="col-xl-3 col-md-6">
            <div className="position-relative border card rounded-2 shadow-sm">
              <ImageWithBasePath src="./assets/img/bg/bg-01.svg" alt="img" className="position-absolute start-0 top-0" />
              <div className="card-body">
                <div className="d-flex align-items-center mb-2 justify-content-between">
                  <span className="avatar bg-primary rounded-circle"><i className="ti ti-calendar-heart fs-24" /></span>
                  <div className="text-end">
                    <span className="badge px-2 py-1 fs-12 fw-medium d-inline-flex mb-1 bg-success">+95%</span>
                    <p className="fs-13 mb-0">in last 7 Days</p>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <p className="mb-1">Doctors</p>
                    <h3 className="fw-bold mb-0">{dashboardData ? dashboardData.doctors_count : "Loading..."}</h3>
                  </div>
                  <Chart options={sColChart} series={series} type="bar" width={80} height={54} />
                </div>
              </div>
            </div>
          </div>

          {/* Patients Card */}
          <div className="col-xl-3 col-md-6">
            <div className="position-relative border card rounded-2 shadow-sm">
              <ImageWithBasePath src="./assets/img/bg/bg-02.svg" alt="img" className="position-absolute start-0 top-0" />
              <div className="card-body">
                <div className="d-flex align-items-center mb-2 justify-content-between">
                  <span className="avatar bg-danger rounded-circle"><i className="ti ti-calendar-heart fs-24" /></span>
                  <div className="text-end">
                    <span className="badge px-2 py-1 fs-12 fw-medium d-inline-flex mb-1 bg-success">+25%</span>
                    <p className="fs-13 mb-0">in last 7 Days</p>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <p className="mb-1">Patients</p>
                    <h3 className="fw-bold mb-0">{dashboardData ? dashboardData.patients_count : "Loading..."}</h3>
                  </div>
                  <SCol2Chart />
                </div>
              </div>
            </div>
          </div>

          {/* Appointments Card */}
          <div className="col-xl-3 col-md-6">
            <div className="position-relative border card rounded-2 shadow-sm">
              <ImageWithBasePath src="./assets/img/bg/bg-03.svg" alt="img" className="position-absolute start-0 top-0" />
              <div className="card-body">
                <div className="d-flex align-items-center mb-2 justify-content-between">
                  <span className="avatar bg-info rounded-circle"><i className="ti ti-calendar-heart fs-24" /></span>
                  <div className="text-end">
                    <span className="badge px-2 py-1 fs-12 fw-medium d-inline-flex mb-1 bg-danger">-15%</span>
                    <p className="fs-13 mb-0">in last 7 Days</p>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <p className="mb-1">Appointments</p>
                    <h3 className="fw-bold mb-0">{dashboardData ? dashboardData.appointments_count : "Loading..."}</h3>
                  </div>
                  <SCol3Chart />
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="col-xl-3 col-md-6">
            <div className="position-relative border card rounded-2 shadow-sm">
              <ImageWithBasePath src="./assets/img/bg/bg-04.svg" alt="img" className="position-absolute start-0 top-0" />
              <div className="card-body">
                <div className="d-flex align-items-center mb-2 justify-content-between">
                  <span className="avatar bg-success rounded-circle"><i className="ti ti-calendar-heart fs-24" /></span>
                  <div className="text-end">
                    <span className="badge px-2 py-1 fs-12 fw-medium d-inline-flex mb-1 bg-success">+25%</span>
                    <p className="fs-13 mb-0">in last 7 Days</p>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between overflow-hidden">
                  <div>
                    <p className="mb-1">Revenue</p>
                    <h3 className="fw-bold mb-0 text-truncate">0</h3>
                  </div>
                  <SCol4Chart />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Doctors Section */}
        <div className="row mt-4">
          <div className="col-xl-8">
            <div className="card shadow-sm flex-fill w-100">
              <div className="card-header d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0">Doctors</h5>
                <Link to={all_routes.doctorsList} className="btn fw-normal btn-outline-white">View All</Link>
              </div>
              <div className="card-body">
                <div className="row row-gap-3">
                  {allDoctors.map((doctor: any, idx: number) => (
                      <div className="col-md-4" key={idx}>
                        <div className="border shadow-sm p-3 rounded-2">
                          <div className="d-flex align-items-center mb-3">
                            <Link to={`${all_routes.doctorsDetails}/${doctor.id}`} className="avatar me-2 flex-shrink-0">
                              <ImageWithBasePath
                                src={doctor.profile_image ? `http://3.109.62.26${doctor.profile_image}` : "assets/img/doctors/doctor-01.jpg"}
                                alt={doctor.name || "Doctor"}
                                className="rounded-circle"
                              />
                            </Link>
                            <div>
                              <h6 className="fs-14 mb-1 text-truncate">
                                <Link to={`${all_routes.doctorsDetails}/${doctor.id}`} className="fw-semibold">
                                  {doctor.name}
                                </Link>
                              </h6>
                              <p className="mb-0 fs-13">{doctor.specialization}</p>
                            </div>
                          </div>
                          <p className="mb-0">
                            <span className="text-dark fw-semibold">{doctor.bookings || 0}</span> Bookings
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Patients Section */}
          <div className="col-xl-4 d-flex">
            <div className="card shadow-sm flex-fill w-100">
              <div className="card-header d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0">Patients</h5>
                <Link to={all_routes.patients} className="btn fw-normal btn-outline-white">View All</Link>
              </div>
              <div className="card-body">
               {displayedPatients.map((patient: any, idx: number) => (
  <div className="d-flex justify-content-between align-items-center mb-3" key={idx}>
    <div className="d-flex align-items-center">
      <Link to={`${all_routes.patientDetails}/${patient.id}`} className="avatar me-2 flex-shrink-0">
        <ImageWithBasePath
          src={patient.profile_image || "assets/img/profiles/avatar-02.jpg"}
          alt={patient.first_name}
          className="rounded-circle"
        />
      </Link>
      <div>
        <h6 className="fs-14 mb-1 text-truncate">
          <Link to={`${all_routes.patientDetails}/${patient.id}`} className="fw-medium">
            {patient.first_name} {patient.last_name}
          </Link>
        </h6>
        <p className="mb-0 fs-13 text-truncate">
          Age: {patient.age || "N/A"} | {patient.blood_group || "N/A"}
        </p>
      </div>
    </div>
    <span className="badge fw-medium badge-soft-primary border border-primary flex-shrink-0">
      {patient.appointments_count || 0} Appointments
    </span>
  </div>
))}

              </div>
            </div>
          </div>
        </div>

        {/* All Appointments Table */}
        <div className="row mt-4">
          <div className="col-12 d-flex">
            <div className="card shadow-sm flex-fill w-100">
              <div className="card-header d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0">All Appointments</h5>
                <Link to={all_routes.appointments} className="btn fw-normal btn-outline-white">View All</Link>
              </div>
              <div className="card-body">
                <div className="table-responsive table-nowrap">
                  <table className="table border">
                    <thead className="thead-light">
                      <tr>
                        <th>Doctor</th>
                        <th>Patient</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {limitedAppointments.length > 0 ? (
                        limitedAppointments.map((appt: any, idx: number) => {
                          const normalizedStatus = appt.status.toUpperCase();
                          return (
                            <tr key={idx}>
                              <td>{appt.doctor?.name || "N/A"}</td>
                              <td>{appt.patient?.first_name} {appt.patient?.last_name}</td>
                              <td>{new Date(appt.updated_at).toLocaleDateString()}</td>
                              <td>
                                <span
                                  className={`fs-13 badge ${
                                    normalizedStatus === "CANCELLED"
                                      ? "badge-soft-danger text-danger"
                                      : normalizedStatus === "SCHEDULED"
                                      ? "badge-soft-primary text-primary"
                                      : normalizedStatus === "COMPLETED"
                                      ? "badge-soft-success text-success"
                                      : "badge-soft-warning text-warning"
                                  } rounded fw-medium`}
                                >
                                  {appt.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr><td colSpan={4} className="text-center">No appointments found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="footer text-center bg-white p-2 border-top">
        <p className="text-dark mb-0">2025 © <Link to="#" className="link-primary">Preclinic</Link>, All Rights Reserved</p>
      </div>
    </div>
  );
};

export default Dashboard;
