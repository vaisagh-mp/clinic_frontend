import { Link, useNavigate } from "react-router-dom";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { all_routes } from "../../../../routes/all_routes";
import Chart from "react-apexcharts";
import SCol2Chart from "../chats/scol2";
import SCol3Chart from "../chats/scol3";
import SCol4Chart from "../chats/scol4";
import { useState, useEffect } from "react";

interface DashboardStats {
  total_doctors: number;
  total_patients: number;
  total_appointments: number;
  upcoming_appointments: number;
  completed_appointments: number;
  cancelled_appointments: number;
}

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  profile_image: string | null;
}

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
}

interface Appointment {
  id: number;
  doctor: Doctor;
  patient: Patient;
  appointment_date: string;
  appointment_time: string;
  status: string;
}

const ClinicDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [latestDoctors, setLatestDoctors] = useState<Doctor[]>([]);
  const [latestPatients, setLatestPatients] = useState<Patient[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          navigate("/login-cover");
          return;
        }

        const response = await fetch("http://3.109.62.26/api/clinic/dashboard/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch dashboard data");

        const result = await response.json();

        setStats(result.stats || null);
        setLatestDoctors(result.latest_doctors || []);
        setLatestPatients(result.latest_patients || []);
        setUpcomingAppointments(result.upcoming_appointments || []);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    };

    fetchDashboard();
  }, [navigate]);

  const sColChartOptions = {
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
  };

  const series = [{ name: "Data", data: [40, 15, 60, 15, 90, 20, 70] }];

  return (
    <div className="page-wrapper">
      <div className="content pb-0">
        {/* Header */}
        <div className="d-flex align-items-sm-center justify-content-between flex-wrap gap-2 mb-4">
          <h4 className="fw-bold mb-0">Clinic Dashboard</h4>
          <div className="d-flex align-items-center flex-wrap gap-2">
            <Link to={all_routes.clinicnewAppointments} className="btn btn-primary d-inline-flex align-items-center">
              <i className="ti ti-plus me-1" /> New Appointment
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="row">
          {/* Doctors */}
          <div className="col-xl-3 col-md-6">
            <div className="position-relative border card rounded-2 shadow-sm">
              <ImageWithBasePath src="./assets/img/bg/bg-01.svg" alt="img" className="position-absolute start-0 top-0" />
              <div className="card-body">
                <div className="d-flex align-items-center mb-2 justify-content-between">
                  <span className="avatar bg-primary rounded-circle">
                    <i className="ti ti-calendar-heart fs-24" />
                  </span>
                  <div className="text-end">
                    <span className="badge px-2 py-1 fs-12 fw-medium d-inline-flex mb-1 bg-success">+95%</span>
                    <p className="fs-13 mb-0">in last 7 Days</p>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <p className="mb-1">Doctors</p>
                    <h3 className="fw-bold mb-0">{stats ? stats.total_doctors : "Loading..."}</h3>
                  </div>
                  <Chart options={sColChartOptions} series={series} type="bar" width={80} height={54} />
                </div>
              </div>
            </div>
          </div>

          {/* Patients */}
          <div className="col-xl-3 col-md-6">
            <div className="position-relative border card rounded-2 shadow-sm">
              <ImageWithBasePath src="./assets/img/bg/bg-02.svg" alt="img" className="position-absolute start-0 top-0" />
              <div className="card-body">
                <div className="d-flex align-items-center mb-2 justify-content-between">
                  <span className="avatar bg-danger rounded-circle">
                    <i className="ti ti-calendar-heart fs-24" />
                  </span>
                  <div className="text-end">
                    <span className="badge px-2 py-1 fs-12 fw-medium d-inline-flex mb-1 bg-success">+25%</span>
                    <p className="fs-13 mb-0">in last 7 Days</p>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <p className="mb-1">Patients</p>
                    <h3 className="fw-bold mb-0">{stats ? stats.total_patients : "Loading..."}</h3>
                  </div>
                  <SCol2Chart />
                </div>
              </div>
            </div>
          </div>

          {/* Appointments */}
          <div className="col-xl-3 col-md-6">
            <div className="position-relative border card rounded-2 shadow-sm">
              <ImageWithBasePath src="./assets/img/bg/bg-03.svg" alt="img" className="position-absolute start-0 top-0" />
              <div className="card-body">
                <div className="d-flex align-items-center mb-2 justify-content-between">
                  <span className="avatar bg-info rounded-circle">
                    <i className="ti ti-calendar-heart fs-24" />
                  </span>
                  <div className="text-end">
                    <span className="badge px-2 py-1 fs-12 fw-medium d-inline-flex mb-1 bg-danger">-15%</span>
                    <p className="fs-13 mb-0">in last 7 Days</p>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <p className="mb-1">Appointments</p>
                    <h3 className="fw-bold mb-0">{stats ? stats.total_appointments : "Loading..."}</h3>
                  </div>
                  <SCol3Chart />
                </div>
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="col-xl-3 col-md-6">
            <div className="position-relative border card rounded-2 shadow-sm">
              <ImageWithBasePath src="./assets/img/bg/bg-04.svg" alt="img" className="position-absolute start-0 top-0" />
              <div className="card-body">
                <div className="d-flex align-items-center mb-2 justify-content-between">
                  <span className="avatar bg-success rounded-circle">
                    <i className="ti ti-calendar-heart fs-24" />
                  </span>
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

        {/* Popular Doctors */}
        <div className="row mt-4">
          <div className="col-xl-12">
            <div className="card shadow-sm flex-fill w-100">
              <div className="card-header d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0">Popular Doctors</h5>
              </div>
              <div className="card-body">
                <div className="row row-gap-3">
                  {latestDoctors.slice(0, 4).map((doc) => (
                    <div key={doc.id} className="col-lg-3 col-md-6">
                      <div className="border shadow-sm p-3 rounded-2">
                        <div className="d-flex align-items-center mb-3">
                          <Link
                            to={`${all_routes.clinicdoctordetails}/${doc.id}`}
                            className="avatar me-2 flex-shrink-0 position-relative"
                          >
                            {doc.profile_image ? (
                              <ImageWithBasePath src={doc.profile_image} alt="img" className="rounded-circle" />
                            ) : (
                              <span className="avatar-placeholder rounded-circle">{doc.name.charAt(0)}</span>
                            )}
                          </Link>
                          <div>
                            <h6 className="fs-14 mb-1 text-truncate">
                              <Link to={`${all_routes.clinicdoctordetails}/${doc.id}`} className="fw-semibold">
                                {doc.name}
                              </Link>
                            </h6>
                            <p className="mb-0 fs-13">{doc.specialization}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All Appointments (Limited to 5 Rows) */}
        <div className="row mt-4">
          <div className="col-12 d-flex">
            <div className="card shadow-sm flex-fill w-100">
              <div className="card-header d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0">All Appointments</h5>
                <Link to={all_routes.appointments} className="btn fw-normal btn-outline-white">
                  View All
                </Link>
              </div>
              <div className="card-body">
                <div className="table-responsive table-nowrap">
                  <table className="table border">
                    <thead className="thead-light">
                      <tr>
                        <th>Doctor</th>
                        <th>Patient</th>
                        <th>Date &amp; Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingAppointments.slice(0, 5).map((appt) => ( // 👈 Limit to 5 rows
                        <tr key={appt.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div>
                                <h6 className="fs-14 mb-1">
                                  <Link to="#" className="fw-semibold">
                                    {appt.doctor.name}
                                  </Link>
                                </h6>
                                <p className="mb-0 fs-13">{appt.doctor.specialization}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div>
                                <h6 className="fs-14 mb-1">
                                  <Link to={`${all_routes.clinicpatientdetails}/${appt.patient.id}`} className="fw-medium">
                                    {appt.patient.first_name} {appt.patient.last_name}
                                  </Link>
                                </h6>
                                <p className="mb-0 fs-13">{appt.patient.phone_number}</p>
                              </div>
                            </div>
                          </td>
                          <td>{`${appt.appointment_date} - ${appt.appointment_time}`}</td>
                          <td>
                            <span
                              className={`badge fs-13 py-1 ${
                                appt.status === "CONFIRMED"
                                  ? "badge-soft-success border border-success text-success"
                                  : appt.status === "CANCELLED"
                                  ? "badge-soft-danger border border-danger"
                                  : appt.status === "SCHEDULED"
                                  ? "badge-soft-info border border-info"
                                  : "badge-soft-secondary border border-secondary"
                              } rounded fw-medium`}
                            >
                              {appt.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {upcomingAppointments.length === 0 && (
                        <tr>
                          <td colSpan={4} className="text-center text-muted">
                            No appointments available
                          </td>
                        </tr>
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
        <p className="text-dark mb-0">
          2025 © <Link to="#" className="link-primary">Preclinic</Link>, All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default ClinicDashboard;
