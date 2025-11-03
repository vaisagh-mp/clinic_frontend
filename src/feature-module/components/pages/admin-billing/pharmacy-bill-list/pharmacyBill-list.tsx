import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { all_routes } from "../../../../routes/all_routes";
import SearchInput from "../../../../../core/common/dataTable/dataTableSearch";
import Datatable from "../../../../../core/common/dataTable";
import Modals from "./modals/modals";
import Header from "../../../../../core/common/header/header";
import Sidebar from "../../../../../core/common/sidebar/sidebarAdmin";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Modal, Button } from "react-bootstrap";

// Axios instance with token refresh
const api = axios.create({
  baseURL: "http://3.109.62.26/api/",
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

const PharmacyBills = () => {
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

    const fetchBills = async () => {
      try {
        const res = await api.get("billing/admin/pharmacy-bill/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const bills = Array.isArray(res.data)
          ? res.data
          : res.data.results || [];

        // Ensure total_amount is number
        const formattedBills = bills.map((b: any) => ({
          ...b,
          total_amount: parseFloat(b.total_amount) || 0,
          clinic_name: b.clinic || "N/A",
          patient_name: b.patient?.name || "N/A",
        }));

        setData(formattedBills);
      } catch (error) {
        console.error("Error fetching bills:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [navigate, token]);

  // Export table data to Excel
const exportExcel = () => {
  // If filters are applied, export filteredData — else export all data
  const hasFilters =
    searchText ||
    statusFilter ||
    dateRange.from ||
    dateRange.to ||
    quickRange;

  const exportData = hasFilters ? filteredData : data;

  const worksheetData = exportData.map((bill) => ({
    "Bill Number": bill.bill_number || "",
    "Clinic": bill.clinic_name || "",
    "Patient": bill.patient_name || "",
    "Bill Date": bill.bill_date
      ? new Date(bill.bill_date).toLocaleDateString()
      : "",
    "Total Amount": bill.total_amount || 0,
    "Status": bill.status || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "PharmacyBills");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

  // Dynamic filename based on filter
  const fileName = hasFilters
    ? "PharmacyBills_Filtered.xlsx"
    : "PharmacyBills_All.xlsx";

  saveAs(blob, fileName);
};



  // Handle Delete
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);

    try {
      await api.delete(`billing/admin/pharmacy-bill/${deleteId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData((prev) => prev.filter((item) => item.id !== deleteId));
      setDeleteId(null);
      (window as any).$(`#delete_modal`).modal("hide");
    } catch (error) {
      console.error("Error deleting bill:", error);
    } finally {
      setDeleting(false);
    }
  };

  // Table columns
  const columns = [
    {
      title: "Bill Number",
      dataIndex: "bill_number",
      render: (bill_number: string) => bill_number || "N/A",
      sorter: (a: any, b: any) => a.bill_number?.localeCompare(b.bill_number),
    },
    {
      title: "Clinic",
      dataIndex: "clinic_name",
      render: (clinic_name: string) => clinic_name || "N/A",
    },
    {
      title: "Patient",
      dataIndex: "patient_name",
      render: (patient_name: string) => patient_name || "N/A",
    },
    {
      title: "Bill Date",
      dataIndex: "bill_date",
      render: (bill_date: string) =>
        bill_date ? new Date(bill_date).toLocaleDateString() : "N/A",
      sorter: (a: any, b: any) =>
        new Date(a.bill_date).getTime() - new Date(b.bill_date).getTime(),
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      render: (total_amount: number) => `₹${total_amount.toFixed(2)}`,
      sorter: (a: any, b: any) => a.total_amount - b.total_amount,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => (
        <span
          className={`fs-13 badge ${
            status === "CANCELLED"
              ? "badge-soft-danger text-danger"
              : status === "PAID"
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
                to={`/edit-pharmacy-bill/${record.id}`}
                className="dropdown-item d-flex align-items-center"
              >
                Edit
              </Link>
            </li>
            <li>
              <Link
                to={`/view-pharmacy-bill/${record.id}`}
                className="dropdown-item d-flex align-items-center"
              >
                View
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
  const filteredData = data.filter((bill) => {
  const matchesSearch =
    !searchText ||
    bill.bill_number?.toLowerCase().includes(searchText.toLowerCase()) ||
    bill.supplier_name?.toLowerCase().includes(searchText.toLowerCase());

  const matchesStatus = !statusFilter || bill.status === statusFilter;

  const matchesDateRange = (() => {
    if (!dateRange.from && !dateRange.to) return true;
    const billDate = new Date(bill.bill_date);
    const fromDate = dateRange.from ? new Date(dateRange.from) : null;
    const toDate = dateRange.to ? new Date(dateRange.to) : null;
    if (fromDate && billDate < fromDate) return false;
    if (toDate && billDate > toDate) return false;
    return true;
  })();

  return matchesSearch && matchesStatus && matchesDateRange;
});

  return (
    <>
      <Header />
      <Sidebar />
      <div className="page-wrapper">
        <div className="content">
          {/* Header */}
          <div className="d-flex align-items-sm-center flex-sm-row flex-column gap-2 mb-3 pb-3 border-bottom">
            <div className="flex-grow-1">
              <h4 className="fw-bold mb-0">
                Pharmacy Bills
                <span className="badge badge-soft-primary fs-13 fw-medium ms-2">
                  Total Bills: {data.length}
                </span>
              </h4>
            </div>
            <div className="text-end d-flex">
              <Link
                to="/add-pharmacy-bill"
                className="btn btn-primary ms-2 fs-13 btn-md"
              >
                <i className="ti ti-plus me-1" />
                Add Bill
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
        <option value="PAID">PAID</option>
        <option value="PENDING">PENDING</option>
        <option value="CANCELLED">CANCELLED</option>
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
            <p>Loading bills...</p>
          ) : (
            <div className="table-responsive">
              <Datatable
  columns={columns}
  dataSource={filteredData || []} 
  Selection={false}
  searchText={searchText}
/>

            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <div className="modal fade" id="delete_modal" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <h5>Are you sure you want to delete this bill?</h5>
              <div className="d-flex justify-content-center mt-3">
                <button
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="btn btn-danger position-relative z-1"
                  disabled={deleting}
                  data-bs-dismiss="modal"
                >
                  {deleting ? "Deleting..." : "Yes, Delete"}
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

export default PharmacyBills;
