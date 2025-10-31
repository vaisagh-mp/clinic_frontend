import { Link, useNavigate } from "react-router";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { all_routes } from "../../../../routes/all_routes";
import { useState, useEffect } from "react";
import SearchInput from "../../../../../core/common/dataTable/dataTableSearch";
import Datatable from "../../../../../core/common/dataTable";
import Modals from "./modals/modals";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Modal, Button } from "react-bootstrap";

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

  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });
  const [quickRange, setQuickRange] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  // Delete state
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

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
        const appointments = Array.isArray(res.data)
          ? res.data
          : res.data.results || [];
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


  // ✅ Export as Excel
  const exportExcel = () => {
  // Apply same filtering logic used in UI
  const filteredData = data.filter((appt) => {
    const matchesSearch =
      !searchText ||
      appt.appointment_id?.toString().includes(searchText) ||
      appt.patient?.first_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      appt.doctor?.name?.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus = !statusFilter || appt.status === statusFilter;

    const matchesDateRange = (() => {
      if (!dateRange.from && !dateRange.to) return true;
      const apptDate = new Date(appt.appointment_date);
      const fromDate = dateRange.from ? new Date(dateRange.from) : null;
      const toDate = dateRange.to ? new Date(dateRange.to) : null;
      if (fromDate && apptDate < fromDate) return false;
      if (toDate && apptDate > toDate) return false;
      return true;
    })();

    return matchesSearch && matchesStatus && matchesDateRange;
  });

  // Prepare data for Excel
  const worksheetData = filteredData.map((appt) => ({
    "Appointment ID": appt.appointment_id || "",
    "Date": appt.appointment_date
      ? new Date(appt.appointment_date).toLocaleDateString()
      : "N/A",
    "Time": appt.appointment_time || "",
    "Patient": appt.patient
      ? `${appt.patient.first_name || ""} ${appt.patient.last_name || ""}`
      : "N/A",
    "Patient Phone": appt.patient?.phone_number || "N/A",
    "Doctor":
      appt.doctor?.name ||
      `${appt.doctor?.user?.first_name || ""} ${appt.doctor?.user?.last_name || ""}` ||
      "N/A",
    "Clinic": appt.clinic?.name || "N/A",
    "Status": appt.status || "N/A",
  }));

  if (worksheetData.length === 0) {
    alert("No appointments found for the selected filters!");
    return;
  }

  // Create Excel sheet
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments");

  // Generate and download file
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, `Appointments_${new Date().toISOString().split("T")[0]}.xlsx`);
};


  // Handle Delete
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);

    try {
      await api.delete(`appointments/${deleteId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove from state
      setData((prev) => prev.filter((item) => item.id !== deleteId));
      setDeleteId(null);
      (window as any).$(`#delete_modal`).modal("hide"); // close modal if bootstrap js is used
    } catch (error) {
      console.error("Error deleting appointment:", error);
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      title: "Appointment ID",
      dataIndex: "appointment_id",
      render: (appointment_id: number) => appointment_id,
      sorter: (a: any, b: any) => a.appointment_id - b.appointment_id,
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
            {/* <Link
              to={all_routes.patientDetails}
              className="avatar avatar-md me-2"
            >
              <ImageWithBasePath
                src={patient.profile_image || "assets/img/users/default.png"}
                alt="patient"
                className="rounded-circle"
              />
            </Link> */}
            {/* <Link
              to={all_routes.patientDetails}
              className="text-dark fw-semibold"
            > */}
              {patient.first_name} {patient.last_name}
              <span className="text-body fs-13 fw-normal d-block">
                {patient.phone}
              </span>
            {/* </Link> */}
          </div>
        ) : (
          "N/A"
        ),
    },
    {
      title: "Doctor",
      dataIndex: "doctor",
      render: (doctor: any) =>
        doctor ? (
          <div className="d-flex align-items-center">
            {/* <Link
              to={all_routes.doctordetails}
              className="avatar me-2 flex-shrink-0"
            >
              <ImageWithBasePath
                src={doctor.profile_image || "assets/img/doctors/default.png"}
                alt="doctor"
                className="rounded-circle"
              />
            </Link> */}
            <div>
              <h6 className="fs-14 mb-1 text-truncate">
                {/* <Link to={all_routes.doctordetails} className="fw-semibold"> */}
                  {doctor.name ||
                    `${doctor.user?.first_name || ""} ${
                      doctor.user?.last_name || ""
                    }`}
                {/* </Link> */}
              </h6>
              <p className="mb-0 fs-13 text-truncate">
                {doctor.department || ""}
              </p>
            </div>
          </div>
        ) : (
          "N/A"
        ),
    },
    {
      title: "Clinic",
      dataIndex: "clinic",
      render: (clinic: any) => clinic?.name || "N/A",
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
      title: "Actions",
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
              <Link
                to="#"
                className="dropdown-item d-flex align-items-center text-danger"
                data-bs-toggle="modal"
                data-bs-target="#delete_modal"
                onClick={() => setDeleteId(record.id)}
              >
                Delete
              </Link>
            </li>
          </ul>
        </div>
      ),
    },
  ];

  const handleQuickRange = (value: string) => {
    setQuickRange(value);
    const today = new Date();
    let from = "";
    let to = today.toISOString().split("T")[0];

    if (value === "today") {
      from = to;
    } else if (value === "last_month") {
      const past = new Date();
      past.setMonth(today.getMonth() - 1);
      from = past.toISOString().split("T")[0];
    } else if (value === "last_6_months") {
      const past = new Date();
      past.setMonth(today.getMonth() - 6);
      from = past.toISOString().split("T")[0];
    } else if (value === "last_year") {
      const past = new Date();
      past.setFullYear(today.getFullYear() - 1);
      from = past.toISOString().split("T")[0];
    } else if (value === "custom") {
      from = "";
      to = "";
      setShowModal(true);
    } else {
      from = "";
      to = "";
    }

    setDateRange({ from, to });
  };


  const handleApplyCustom = () => {
    setShowModal(false);
  };

  const handleClear = () => {
    setQuickRange("");
    setDateRange({ from: "", to: "" });
  };
  const filteredData = data.filter((appt) => {
  const matchesSearch =
    !searchText ||
    appt.appointment_id?.toString().includes(searchText) ||
    appt.patient?.first_name?.toLowerCase().includes(searchText.toLowerCase()) ||
    appt.doctor?.name?.toLowerCase().includes(searchText.toLowerCase());

  const matchesStatus = !statusFilter || appt.status === statusFilter;

  const matchesDateRange = (() => {
    if (!dateRange.from && !dateRange.to) return true;
    const apptDate = new Date(appt.appointment_date);
    const fromDate = dateRange.from ? new Date(dateRange.from) : null;
    const toDate = dateRange.to ? new Date(dateRange.to) : null;
    if (fromDate && apptDate < fromDate) return false;
    if (toDate && apptDate > toDate) return false;
    return true;
  })();

  return matchesSearch && matchesStatus && matchesDateRange;
});


  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* Header */}
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
              <Link
                to="/new-appointment"
                className="btn btn-primary ms-2 fs-13 btn-md"
              >
                <i className="ti ti-plus me-1" />
                Add Appointments
              </Link>
            </div>
          </div>

          {/* Search + Export */}
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      {/* Search Input */}
                      <div className="table-search mb-3">
                        <SearchInput
                          value={searchText}
                          onChange={(value) => setSearchText(value)}
                        />
                      </div>

                      <div className="d-flex  gap-2">
    {/* Status Filter */}
      <select
  className="form-select"
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
>
  <option value="">All Status</option>
  <option value="SCHEDULED">Scheduled</option>
  <option value="COMPLETED">Completed</option>
  <option value="CANCELLED">Cancelled</option>
</select>


    {/* Quick Preset */}
    <select
      className="form-select"
      style={{ minWidth: "160px" }}
      value={quickRange}
      onChange={(e) => handleQuickRange(e.target.value)}
    >
      <option value="">Select Range</option>
      <option value="today">Today</option>
      <option value="last_month">Last Month</option>
      <option value="last_6_months">Last 6 Months</option>
      <option value="last_year">Last 1 Year</option>
      <option value="custom">Custom Range</option>
    </select>

    {/* Custom From–To Range */}
    {quickRange && (
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleClear}
            >
              Clear
            </Button>
          )}

          {/* Custom Range Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Select Custom Date Range</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex align-items-center gap-2">
              <div>
                <label className="form-label">From:</label>
                <input
                  type="date"
                  className="form-control"
                  value={dateRange.from}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      from: e.target.value,
                      to:
                        prev.to && prev.to < e.target.value
                          ? ""
                          : prev.to,
                    }))
                  }
                />
              </div>
              <div>
                <label className="form-label">To:</label>
                <input
                  type="date"
                  className="form-control"
                  value={dateRange.to}
                  min={dateRange.from || undefined}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, to: e.target.value }))
                  }
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleApplyCustom}>
              Apply
            </Button>
          </Modal.Footer>
        </Modal>
  </div>
                    
                      {/* Export Dropdown */}
                      <div className="dropdown">
                        <button
                          className="btn btn-md fs-14 fw-normal border bg-white rounded text-dark d-inline-flex align-items-center"
                          data-bs-toggle="dropdown"
                        >
                          Export <i className="ti ti-chevron-down ms-2" />
                        </button>
                        <ul className="dropdown-menu p-2">
                          <li>
                            <button className="dropdown-item" type="button" onClick={exportExcel}>
                              Download as Excel
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>

          {/* Table */}
          {loading ? (
            <p>Loading appointments...</p>
          ) : (
            <div className="table-responsive">
              <Datatable
  columns={columns}
  dataSource={filteredData || []}  // ✅ Apply filters
  Selection={false}
  searchText={searchText}
/>

            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
         {/* Delete Modal */}
        <div className="modal fade" id="delete_modal" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <h5>Are you sure you want to delete this clinic?</h5>
              <div className="d-flex justify-content-center mt-3">
                <button
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="btn btn-danger position-relative z-1"
                  disabled={loading}
                  data-bs-dismiss="modal"
                >
                  {loading ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modals />
    </>
  );
};

export default Appointments;
