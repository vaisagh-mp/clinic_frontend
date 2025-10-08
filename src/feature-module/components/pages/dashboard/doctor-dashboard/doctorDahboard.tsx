import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { all_routes } from "../../../../routes/all_routes";
import Modals from "./modals/modals";
import SCol20Chart from "./charts/scol20";
import SCol5Chart from "./charts/scol5";
import SCol6Chart from "./charts/scol6";
import SCol7Chart from "./charts/scol7";
import axios from "axios";

const DoctorDahboard = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login-cover");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          "http://3.109.62.26/api/doctor/dashboard/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          "http://3.109.62.26/api/doctor/appointments/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchDashboardData();
    fetchAppointments();
  }, [navigate]);

  if (!dashboardData) {
    return <div className="text-center p-5">Loading...</div>;
  }

  const { total_consultations, total_patients, total_prescriptions, upcoming_appointments } = dashboardData;

  return (
    <>
      <div className="page-wrapper">
        <div className="content pb-0">
          {/* Page Header */}
          <div className="d-flex align-items-sm-center justify-content-between flex-wrap gap-2 mb-4">
            <div>
              <h4 className="fw-bold mb-0">Doctor Dashboard</h4>
            </div>
            <div className="d-flex align-items-center flex-wrap gap-2">
              {/* <Link
                to="#"
                className="btn btn-primary d-inline-flex align-items-center"
                data-bs-toggle="offcanvas"
                data-bs-target="#new_appointment"
              >
                <i className="ti ti-plus me-1" /> New Appointment
              </Link> */}
              {/* <Link
                to="#"
                className="btn btn-outline-white bg-white d-inline-flex align-items-center"
              >
                <i className="ti ti-calendar-time me-1" /> Schedule Availability
              </Link> */}
            </div>
          </div>

          {/* Row: Summary Cards */}
          <div className="row">
            <div className="col-xl-4 d-flex">
              <div className="card shadow-sm flex-fill w-100">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <p className="mb-1">Total Patients</p>
                      <div className="d-flex align-items-center gap-1">
                        <h3 className="fw-bold mb-0">{total_patients}</h3>
                        <span className="badge fw-medium bg-success flex-shrink-0">+0%</span>
                      </div>
                    </div>
                    <span className="avatar border border-primary text-primary rounded-2 flex-shrink-0">
                      <i className="ti ti-calendar-heart fs-20" />
                    </span>
                  </div>
                  <div className="d-flex align-items-end">
                    <SCol5Chart />
                    <span className="badge fw-medium badge-soft-success flex-shrink-0 ms-2">
                      +0% <i className="ti ti-arrow-up ms-1" />
                    </span>
                    <p className="ms-1 fs-13 text-truncate">in last 7 Days </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-4 d-flex">
              <div className="card shadow-sm flex-fill w-100">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <p className="mb-1">Consultations</p>
                      <div className="d-flex align-items-center gap-1">
                        <h3 className="fw-bold mb-0">{total_consultations}</h3>
                        <span className="badge fw-medium bg-danger flex-shrink-0">-0%</span>
                      </div>
                    </div>
                    <span className="avatar border border-danger text-danger rounded-2 flex-shrink-0">
                      <i className="ti ti-users fs-20" />
                    </span>
                  </div>
                  <div className="d-flex align-items-end">
                    <SCol6Chart />
                    <span className="badge fw-medium badge-soft-danger flex-shrink-0 ms-2">
                      +0% <i className="ti ti-arrow-down ms-1" />
                    </span>
                    <p className="ms-1 fs-13 text-truncate">in last 7 Days </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-4 d-flex">
              <div className="card shadow-sm flex-fill w-100">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <p className="mb-1">Prescriptions</p>
                      <div className="d-flex align-items-center gap-1">
                        <h3 className="fw-bold mb-0">{total_prescriptions}</h3>
                        <span className="badge fw-medium bg-success flex-shrink-0">+0%</span>
                      </div>
                    </div>
                    <span className="avatar border border-success text-success rounded-2 flex-shrink-0">
                      <i className="ti ti-versions fs-20" />
                    </span>
                  </div>
                  <div className="d-flex align-items-end">
                    <SCol7Chart />
                    <span className="badge fw-medium badge-soft-success flex-shrink-0 ms-2">
                      +0% <i className="ti ti-arrow-up ms-1" />
                    </span>
                    <p className="ms-1 fs-13 text-truncate">in last 7 Days </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row: Upcoming Appointment - Only one */}
          <div className="row">
            {upcoming_appointments.slice(0, 1).map((appt: any) => (
              <div className="col-xl-4 d-flex" key={appt.id}>
                <div className="card shadow-sm flex-fill w-100">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <Link to="#" className="avatar me-2 flex-shrink-0">
                        <ImageWithBasePath
                          src="assets/img/doctors/doctor-01.jpg"
                          alt="img"
                          className="rounded-circle"
                        />
                      </Link>
                      <div>
                        <h6 className="fs-14 mb-1 text-truncate">
                          <Link to="#" className="fw-semibold">
                            {appt.patient_name}
                          </Link>
                        </h6>
                        <p className="mb-0 fs-13 text-truncate">#{appt.appointment_id}</p>
                      </div>
                    </div>
                    <h6 className="fs-14 fw-semibold mb-1">General Visit</h6>
                    <div className="d-flex align-items-center gap-2 flex-wrap mb-3">
                      <p className="mb-0 d-inline-flex align-items-center">
                        <i className="ti ti-calendar-time text-dark me-1" />
                        {appt.appointment_date}
                      </p>
                      <p className="mb-0 d-inline-flex align-items-center">
                        <i className="ti ti-clock text-dark me-1" />
                        {appt.appointment_time}
                      </p>
                    </div>
                    <div className="my-3 border-bottom pb-3">
                      <Link to="#" className="btn btn-primary w-100">
                        Start Appointment
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="col-xl-8 d-flex">
              <div className="card shadow-sm flex-fill w-100">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h5 className="fw-bold mb-0">Appointments</h5>
                </div>
                <div className="card-body pb-0">
                  <SCol20Chart />
                </div>
              </div>
            </div>
          </div>

          {/* Row: All Appointments Table */}
          <div className="row">
            <div className="col-12 d-flex">
              <div className="card shadow-sm flex-fill w-100">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h5 className="fw-bold mb-0">All Appointments</h5>
                  <Link to={all_routes.doctorsappointments} className="btn fw-normal btn-outline-white">
                                    View All
                                  </Link>
                </div>
                <div className="card-body">
                  <div className="table-responsive table-nowrap">
                    <table className="table border">
                      <thead className="thead-light">
                        <tr>
                          <th>Appointment ID</th>
                          <th>Patient</th>
                          <th>Date &amp; Time</th>
                          <th>Clinic</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
  {appointments.length > 0 ? (
    appointments
      .slice(0, 5) // Show only first 5 appointments
      .map((appt) => (
        <tr key={appt.appointment_id}>
          <td>{appt.appointment_id}</td>
          <td>{appt.patient.first_name} {appt.patient.last_name}</td>
          <td>{appt.appointment_date} {appt.appointment_time}</td>
          <td>{appt.clinic.name}</td>
          <td>{appt.status}</td>
        </tr>
      ))
  ) : (
    <tr>
      <td colSpan={5} className="text-center text-muted">
        No appointment data available
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
            2025 ©
            <Link to="#" className="link-primary">
              Preclinic
            </Link>
            , All Rights Reserved
          </p>
        </div>
      </div>

      <Modals />
    </>
  );
};

export default DoctorDahboard;
