import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SearchInput from "../../../../../core/common/dataTable/dataTableSearch";
import Datatable from "../../../../../core/common/dataTable";
import Modals from "./modals/modals";
import axios from "axios";
import Header from "../../../../../core/common/header/header";
import Sidebarthree from "../../../../../core/common/sidebarthree/sidebarthree";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Modal, Button } from "react-bootstrap";

const ClinicBills = () => {
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
        const res = await axios.get(
          "http://3.109.62.26/api/billing/clinic/clinic-bill/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const bills = Array.isArray(res.data) ? res.data : res.data.results || [];
        setData(bills);
      } catch (error) {
        console.error("Error fetching bills:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [navigate, token]);

  // Handle Delete
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);

    try {
      await axios.delete(
        `http://3.109.62.26/api/billing/clinic/clinic-bill/${deleteId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setData((prev) => prev.filter((item) => item.id !== deleteId));
      setDeleteId(null);
      (window as any).$(`#delete_modal`).modal("hide");
    } catch (error) {
      console.error("Error deleting bill:", error);
    } finally {
      setDeleting(false);
    }
  };

//   const downloadExcel = () => {
//   if (!data || data.length === 0) {
//     alert("No bills available to download.");
//     return;
//   }

//   // Dynamically get clinic name from first record or fallback
//   const clinicName = data[0]?.clinic_name?.replace(/\s+/g, "_") || "Clinic";

//   // Format data for Excel
//   const formattedData = data.map((item) => ({
//     "Bill Number": item.bill_number,
//     "Bill Date": item.bill_date,
//     "Vendor Name": item.vendor_name,
//     "Clinic": item.clinic_name,
//     "Total Amount": item.total_amount,
//     "Status": item.status,
//   }));

//   const worksheet = XLSX.utils.json_to_sheet(formattedData);
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Clinic Bills");

//   const filename = `${clinicName}_Bills_List.xlsx`;
//   XLSX.writeFile(workbook, filename);
// };


const downloadExcel = () => {
  // ✅ Check if filters are applied
  const hasFilters =
    searchText ||
    statusFilter ||
    dateRange.from ||
    dateRange.to ||
    quickRange;

  // ✅ Use filtered data if filters exist, otherwise all data
  const exportData = hasFilters ? filteredData : data;

  const worksheetData = exportData.map((bill) => ({
    "Bill Number": bill.bill_number || "",
    "Bill Date": bill.bill_date
      ? new Date(bill.bill_date).toLocaleDateString()
      : "",
    "Vendor Name": bill.vendor_name || "",
    "Clinic": bill.clinic_name || "",
    "Total Amount": bill.total_amount || 0,
    "Status": bill.status || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "ClinicBills");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

  // ✅ Dynamic filename
  const fileName = hasFilters
    ? "ClinicBills_Filtered.xlsx"
    : "ClinicBills_All.xlsx";

  saveAs(blob, fileName);

  // ✅ Optional console/log feedback
  console.log(
    `Exported ${exportData.length} ${
      hasFilters ? "filtered" : "total"
    } records to ${fileName}`
  );
};

  const columns = [
    {
      title: "Bill Number",
      dataIndex: "bill_number",
      render: (bill_number: string) => bill_number || "N/A",
      sorter: (a: any, b: any) => a.bill_number.localeCompare(b.bill_number),
    },
    {
      title: "Bill Date",
      dataIndex: "bill_date",
      render: (bill_date: string) => bill_date || "N/A",
      sorter: (a: any, b: any) => a.bill_date.localeCompare(b.bill_date),
    },
    {
      title: "Vendor Name",
      dataIndex: "vendor_name",
      render: (vendor_name: string) => vendor_name || "N/A",
    },
    {
      title: "Clinic",
      dataIndex: "clinic",
      render: (_: any, record: any) => record.clinic_name || "N/A",
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      render: (total_amount: number) => `₹${total_amount || 0}`,
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
                to={`/clinic-dashboard/edit-clinic-bill/${record.id}`}
                className="dropdown-item d-flex align-items-center"
              >
                Edit
              </Link>
            </li>
            <li>
              <Link
                to={`/clinic-dashboard/view-clinic-bill/${record.id}`}
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
      <Sidebarthree />
      <div className="page-wrapper">
        <div className="content">
          {/* Header */}
          <div className="d-flex align-items-sm-center flex-sm-row flex-column gap-2 mb-3 pb-3 border-bottom">
            <div className="flex-grow-1">
              <h4 className="fw-bold mb-0">
                Clinic Bills
                <span className="badge badge-soft-primary fs-13 fw-medium ms-2">
                  Total Bills : {data.length}
                </span>
              </h4>
            </div>
            <div className="text-end d-flex">
              <Link
                to="/clinic-dashboard/add-clinic-bill"
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
                            <button className="dropdown-item" type="button" onClick={downloadExcel}>
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
  dataSource={filteredData || []}  // ✅ Apply filters
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

export default ClinicBills;
