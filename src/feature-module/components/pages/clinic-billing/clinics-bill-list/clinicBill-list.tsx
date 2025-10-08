import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SearchInput from "../../../../../core/common/dataTable/dataTableSearch";
import Datatable from "../../../../../core/common/dataTable";
import Modals from "./modals/modals";
import axios from "axios";
import Header from "../../../../../core/common/header/header";
import Sidebarthree from "../../../../../core/common/sidebarthree/sidebarthree";

const ClinicBills = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");

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

          {/* Search */}
          <div className="table-search mb-3">
            <SearchInput
              value={searchText}
              onChange={(value) => setSearchText(value)}
            />
          </div>

          {/* Table */}
          {loading ? (
            <p>Loading bills...</p>
          ) : (
            <div className="table-responsive">
              <Datatable
                columns={columns}
                dataSource={data || []}
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
