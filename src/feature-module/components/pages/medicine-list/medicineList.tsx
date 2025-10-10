import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { all_routes } from "../../../routes/all_routes";
import SearchInput from "../../../../core/common/dataTable/dataTableSearch";
import Datatable from "../../../../core/common/dataTable";
import axios from "axios";
import Header from "../../../../core/common/header/header";
import Sidebarthree from "../../../../core/common/sidebarthree/sidebarthree";

// Axios instance with base URL
const api = axios.create({
  baseURL: "http://3.109.62.26/api/billing/",
});

// Interceptor for automatic token refresh
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

const MedicineList = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  // Redirect to login if token missing & fetch medicines
  useEffect(() => {
    if (!token) {
      navigate("/login-cover");
      return;
    }

    const fetchMedicines = async () => {
      try {
        const res = await api.get("medicines/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const medicines = Array.isArray(res.data) ? res.data : res.data.results || [];
        setData(medicines);
      } catch (error) {
        console.error("Error fetching medicines:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [navigate, token]);

  // Handle delete
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);

    try {
      await api.delete(`medicines/${deleteId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData((prev) => prev.filter((item) => item.id !== deleteId));
      setDeleteId(null);
      (window as any).$(`#delete_modal`).modal("hide");
    } catch (error) {
      console.error("Error deleting medicine:", error);
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", sorter: (a: any, b: any) => a.id - b.id },
    { title: "Name", dataIndex: "name", sorter: (a: any, b: any) => a.name.localeCompare(b.name) },
    { title: "Dosage", dataIndex: "dosage", sorter: (a: any, b: any) => a.dosage.localeCompare(b.dosage) },
    { title: "Stock", dataIndex: "stock", sorter: (a: any, b: any) => a.stock - b.stock },
    {
      title: "Unit Price",
      dataIndex: "unit_price",
      render: (price: string) => `₹${price}`,
      sorter: (a: any, b: any) => parseFloat(a.unit_price) - parseFloat(b.unit_price),
    },
    { title: "Expiry Date", dataIndex: "expiry_date", sorter: (a: any, b: any) => a.expiry_date.localeCompare(b.expiry_date) },
    {
      title: "Actions",
      render: (record: any) => (
        <div className="action-item">
          <Link to="#" data-bs-toggle="dropdown">
            <i className="ti ti-dots-vertical" />
          </Link>
          <ul className="dropdown-menu p-2">
            {/* EDIT link with actual ID */}
            <li>
              <Link
                to={`${all_routes.editMedicine}/${record.id}`}
                className="dropdown-item d-flex align-items-center"
              >
                Edit
              </Link>
            </li>
            {/* DELETE */}
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
                Medicines
                <span className="badge badge-soft-primary fs-13 fw-medium ms-2">
                  Total Medicines : {data.length}
                </span>
              </h4>
            </div>
            <div className="text-end d-flex">
              <Link to={all_routes.addMedicine} className="btn btn-primary ms-2 fs-13 btn-md">
                <i className="ti ti-plus me-1" />
                Add Medicine
              </Link>
            </div>
          </div>

          {/* Search */}
          <div className="table-search mb-3">
            <SearchInput value={searchText} onChange={(value) => setSearchText(value)} />
          </div>

          {/* Table */}
          {loading ? (
            <p>Loading medicines...</p>
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

      {/* Delete Modal */}
      <div className="modal fade" id="delete_modal" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <h5>Are you sure you want to delete this medicine?</h5>
              <div className="d-flex justify-content-center mt-3">
                <button className="btn btn-light me-2" data-bs-dismiss="modal" disabled={deleting}>
                  Cancel
                </button>
                <button onClick={handleDelete} className="btn btn-danger position-relative z-1" disabled={deleting} data-bs-dismiss="modal">
                  {deleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MedicineList;
