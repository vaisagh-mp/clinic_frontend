import { Link, useNavigate } from "react-router";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { all_routes } from "../../../../routes/all_routes";
import { useState, useEffect } from "react";
import SearchInput from "../../../../../core/common/dataTable/dataTableSearch";
import Datatable from "../../../../../core/common/dataTable";
import Modals from "./modals/modals";
import axios from "axios";

// Axios instance with interceptors
const api = axios.create({
  baseURL: "http://3.109.62.26/api/admin-panel/",
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post("http://3.109.62.26/api/token/refresh/", {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;
        localStorage.setItem("access_token", newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login-cover";
      }
    }

    return Promise.reject(error);
  }
);

const Appointments = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    if (!token) {
      navigate("/login-cover");
      return;
    }

    const fetchAppointments = async () => {
      try {
        const res = await api.get("appointments/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const appointments = Array.isArray(res.data) ? res.data : res.data.results || [];
        setData(appointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate, token]);

  const columns = [
    {
      title: "Appointment ID",
      dataIndex: "id",
      render: (id: number) => id,
      sorter: (a: any, b: any) => a.id - b.id,
    },
    {
      title: "Date & Time",
      dataIndex: "appointment_date",
      render: (text: string, record: any) =>
        `${record.appointment_date} ${record.appointment_time || ""}`,
      sorter: (a: any, b: any) =>
        (a.appointment_date + a.appointment_time).localeCompare(
          b.appointment_date + b.appointment_time
        ),
    },
    {
      title: "Patient",
      dataIndex: "patient",
      render: (patient: any) =>
        patient ? (
          <div className="d-flex align-items-center">
            <Link to={all_routes.patientDetails} className="avatar avatar-md me-2">
              <ImageWithBasePath
                src={patient.profile_image || "assets/img/users/default.png"}
                alt="patient"
                className="rounded-circle"
              />
            </Link>
            <Link to={all_routes.patientDetails} className="text-dark fw-semibold">
              {patient.first_name} {patient.last_name}
              <span className="text-body fs-13 fw-normal d-block">{patient.phone}</span>
            </Link>
          </div>
        ) : (
          "N/A"
        ),
      sorter: (a: any, b: any) =>
        (a.patient?.first_name || "").localeCompare(b.patient?.first_name || ""),
    },
    {
      title: "Doctor",
      dataIndex: "doctor",
      render: (doctor: any) =>
        doctor ? (
          <div className="d-flex align-items-center">
            <Link to={all_routes.doctordetails} className="avatar me-2 flex-shrink-0">
              <ImageWithBasePath
                src={doctor.profile_image || "assets/img/doctors/default.png"}
                alt="doctor"
                className="rounded-circle"
              />
            </Link>
            <div>
              <h6 className="fs-14 mb-1 text-truncate">
                <Link to={all_routes.doctordetails} className="fw-semibold">
                  {doctor.name || `${doctor.user?.first_name || ""} ${doctor.user?.last_name || ""}`}
                </Link>
              </h6>
              <p className="mb-0 fs-13 text-truncate">{doctor.department || ""}</p>
            </div>
          </div>
        ) : (
          "N/A"
        ),
      sorter: (a: any, b: any) => (a.doctor?.name || "").localeCompare(b.doctor?.name || ""),
    },
    {
      title: "Clinic",
      dataIndex: "clinic",
      render: (clinic: any) => clinic?.name || "N/A",
      sorter: (a: any, b: any) => (a.clinic?.name || "").localeCompare(b.clinic?.name || ""),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => (
        <span
          className={`fs-13 badge ${
            status === "CANCELLED"
              ? "badge-soft-danger text-danger"
              : status === "SCHEDULED"
              ? "badge-soft-primary text-primary"
              : status === "COMPLETED"
              ? "badge-soft-success text-success"
              : "badge-soft-warning text-warning"
          } rounded fw-medium`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "",
      render: (record: any) => (
        <div className="action-item">
          <Link to="#" data-bs-toggle="dropdown">
            <i className="ti ti-dots-vertical" />
          </Link>
          <ul className="dropdown-menu p-2">
            <li>
              <Link
                to={`/edit-appointment/${record.id}`}
                className="dropdown-item d-flex align-items-center"
              >
                Edit
              </Link>
            </li>
            <li>
              {/* <Link
                to="#"
                className="dropdown-item d-flex align-items-center"
                data-bs-toggle="offcanvas"
                data-bs-target="#view_details"
              >
                View
              </Link> */}
            </li>
            <li>
              <Link
                to="#"
                className="dropdown-item d-flex align-items-center"
                data-bs-toggle="modal"
                data-bs-target="#delete_modal"
              >
                Delete
              </Link>
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-flex align-items-sm-center flex-sm-row flex-column gap-2 mb-3 pb-3 border-bottom">
            <div className="flex-grow-1">
              <h4 className="fw-bold mb-0">
                Appointments
                <span className="badge badge-soft-primary fs-13 fw-medium ms-2">
                  Total Appointments : {data.length}
                </span>
              </h4>
            </div>
            <div className="text-end d-flex">
              {/* dropdown*/}
              <div className="dropdown me-1">
                <Link
                  to="#"
                  className="btn btn-md fs-14 fw-normal border bg-white rounded text-dark d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  Export
                  <i className="ti ti-chevron-down ms-2" />
                </Link>
                <ul className="dropdown-menu p-2">
                  <li>
                    <Link className="dropdown-item" to="#">
                      Download as PDF
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Download as Excel
                    </Link>
                  </li>
                </ul>
              </div>
              {/* <div className="bg-white border shadow-sm rounded px-1 pb-0 text-center d-flex align-items-center justify-content-center">
                <Link
                  to={all_routes.doctorsList}
                  className="bg-light rounded p-1 d-flex align-items-center justify-content-center"
                >
                  <i className="ti ti-list fs-14 text-dark" />
                </Link>
                <Link
                  to={all_routes.doctors}
                  className="bg-white rounded p-1 d-flex align-items-center justify-content-center"
                >
                  <i className="ti ti-layout-grid fs-14 text-body" />
                </Link>
              </div> */}
              
            </div>
            <div className="text-end d-flex">
              <Link to="/new-appointment" className="btn btn-primary ms-2 fs-13 btn-md">
                <i className="ti ti-plus me-1" />
                Add Appointments
              </Link>
            </div>
          </div>

          {/* Search */}
          <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3 mb-3">
            <div className="search-set mb-3">
              <div className="d-flex align-items-center flex-wrap gap-2">
                <div className="table-search d-flex align-items-center mb-0">
                  <div className="search-input">
                    <SearchInput value={searchText} onChange={(value) => setSearchText(value)} />
                  </div>
                </div>
              </div>
            </div>
             <div className="d-flex table-dropdown mb-3 pb-1 right-content align-items-center flex-wrap row-gap-3">
              <div className="dropdown me-2">
                <Link
                  to="#"
                  className="btn btn-white bg-white fs-14 py-1 border d-inline-flex text-dark align-items-center"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="outside"
                >
                  <i className="ti ti-filter text-gray-5 me-1" />
                  Filters
                </Link>
                <div
                  className="dropdown-menu dropdown-lg dropdown-menu-end filter-dropdown p-0"
                  id="filter-dropdown"
                >
                  <div className="d-flex align-items-center justify-content-between border-bottom filter-header">
                    <h4 className="mb-0">Filter</h4>
                    <div className="d-flex align-items-center">
                      <Link
                        to="#"
                        className="link-danger text-decoration-underline"
                      >
                        Clear All
                      </Link>
                    </div>
                  </div>
                  {/* <form action="#">
                    <div className="filter-body pb-0">
                      <div className="mb-3">
                        <div className="d-flex align-items-center justify-content-between">
                          <label className="form-label">Doctor</label>
                          <Link to="#" className="link-primary mb-1">
                            Reset
                          </Link>
                        </div>
                        <Select
                          mode="multiple"
                          allowClear
                          style={{ width: "100%" }}
                          placeholder="Please select"
                          defaultValue={[]}
                          options={Doctor}
                        />
                      </div>
                      <div className="mb-3">
                        <div className="d-flex align-items-center justify-content-between">
                          <label className="form-label">Designation</label>
                          <Link to="#" className="link-primary mb-1">
                            Reset
                          </Link>
                        </div>
                        <Select
                          mode="multiple"
                          allowClear
                          style={{ width: "100%" }}
                          placeholder="Please select"
                          defaultValue={[]}
                          options={Designation}
                        />
                      </div>
                      <div className="mb-3">
                        <div className="d-flex align-items-center justify-content-between">
                          <label className="form-label">Department</label>
                          <Link to="#" className="link-primary mb-1">
                            Reset
                          </Link>
                        </div>
                        <Select
                          mode="multiple"
                          allowClear
                          style={{ width: "100%" }}
                          placeholder="Please select"
                          defaultValue={[]}
                          options={Department}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label mb-1 text-dark fs-14 fw-medium">
                          Date<span className="text-danger">*</span>
                        </label>
                        <div className="input-icon-end position-relative">
                          <DatePicker
                            className="form-control datetimepicker"
                            format={{
                              format: "DD-MM-YYYY",
                              type: "mask",
                            }}
                          
                          />
                          <span className="input-icon-addon">
                            <i className="ti ti-calendar" />
                          </span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="d-flex align-items-center justify-content-between">
                          <label className="form-label">Amount</label>
                          <Link to="#" className="link-primary mb-1">
                            Reset
                          </Link>
                        </div>
                        <Select
                          mode="multiple"
                          allowClear
                          style={{ width: "100%" }}
                          placeholder="Please select"
                          defaultValue={[]}
                          options={Amount}
                        />
                      </div>
                      <div className="mb-3">
                        <div className="d-flex align-items-center justify-content-between">
                          <label className="form-label">Status</label>
                          <Link to="#" className="link-primary mb-1">
                            Reset
                          </Link>
                        </div>
                        <Select
                          mode="multiple"
                          allowClear
                          style={{ width: "100%" }}
                          placeholder="Please select"
                          defaultValue={[]}
                          options={Status}
                        />
                      </div>
                    </div>
                    <div className="filter-footer d-flex align-items-center justify-content-end border-top">
                      <Link
                        to="#"
                        className="btn btn-light btn-md me-2"
                        id="close-filter"
                      >
                        Close
                      </Link>
                      <button type="submit" className="btn btn-primary btn-md">
                        Filter
                      </button>
                    </div>
                  </form> */}
                </div>
              </div>
              <div className="dropdown">
                <Link
                  to="#"
                  className="dropdown-toggle btn bg-white btn-md d-inline-flex align-items-center fw-normal rounded border text-dark px-2 py-1 fs-14"
                  data-bs-toggle="dropdown"
                >
                  <span className="me-1"> Sort By : </span> Recent
                </Link>
                <ul className="dropdown-menu  dropdown-menu-end p-2">
                  <li>
                    <Link to="#" className="dropdown-item rounded-1">
                      Recently Added
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="dropdown-item rounded-1">
                      Ascending
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="dropdown-item rounded-1">
                      Desending
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="dropdown-item rounded-1">
                      Last Month
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="dropdown-item rounded-1">
                      Last 7 Days
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <p>Loading appointments...</p>
          ) : (
            <div className="table-responsive">
              <Datatable columns={columns} dataSource={data || []} Selection={false} searchText={searchText} />
            </div>
          )}
        </div>
      </div>

      <Modals />
    </>
  );
};

export default Appointments;
