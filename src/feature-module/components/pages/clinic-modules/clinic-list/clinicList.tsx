import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";


import SearchInput from "../../../../../core/common/dataTable/dataTableSearch";
import Datatable from "../../../../../core/common/dataTable";

import { all_routes } from "../../../../routes/all_routes";


const ClinicList = () => {
  const [data, setData] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedClinic, setSelectedClinic] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchClinics = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.warn("No access token found, redirecting to login.");
        navigate("/login-cover");
        return;
      }

      const response = await fetch(
        "http://3.109.62.26/api/admin-panel/clinics/",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        console.error("Unauthorized. Token may be expired.");
        navigate("/login-cover");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching clinics:", error);
    }
  };

  useEffect(() => {
    fetchClinics();
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const deleteClinic = async () => {
    if (!selectedClinic) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login-cover");
        return;
      }

      const response = await fetch(
        `http://3.109.62.26/api/admin-panel/clinics/${selectedClinic}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete clinic. Status: ${response.status}`);
      }

      // Refresh data after delete
      fetchClinics();
      setSelectedClinic(null);
    } catch (error) {
      console.error("Error deleting clinic:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Name & Type",
      dataIndex: "name",
      render: (_: any, record: any) => (
        <div className="d-flex align-items-center">
          {/* <Link to={`/clinics/${record.id}`} className="avatar me-2">
            <ImageWithBasePath
              src="assets/img/doctors/doctor-01.jpg"
              alt="Clinic"
              className="rounded-circle"
            />
          </Link> */}
          <div>
            <h6 className="mb-1 fs-14 fw-semibold">
              <Link to={`/clinics/${record.id}`}>{record.name}</Link>
            </h6>
            <span className="fs-13 d-block">{record.type}</span>
          </div>
        </div>
      ),
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: "Description",
      dataIndex: "description",
      sorter: (a: any, b: any) => a.description.localeCompare(b.description),
    },
    {
      title: "Phone",
      dataIndex: "phone_number",
      sorter: (a: any, b: any) => a.phone_number.localeCompare(b.phone_number),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a: any, b: any) => a.email.localeCompare(b.email),
    },
    {
      title: "Address",
      dataIndex: "address",
      sorter: (a: any, b: any) => a.address.localeCompare(b.address),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) => (
        <span
          className={`badge ${
            text === "ACTIVE" ? "badge-soft-success" : "badge-soft-danger"
          } border border-success`}
        >
          {text}
        </span>
      ),
      sorter: (a: any, b: any) => a.status.localeCompare(b.status),
    },
    {
      title: "Actions",
      render: (_: any, record: any) => (
        <div className="d-flex align-items-center">
          {/* <div className="action-item me-2">
            <Link to={all_routes.appointmentCalendar}>
              <i className="ti ti-calendar-cog" />
            </Link>
          </div> */}
          <div className="action-item">
            <Link to="#" data-bs-toggle="dropdown">
              <i className="ti ti-dots-vertical" />
            </Link>
            <ul className="dropdown-menu">
              <li>
                <Link
                  to={`/edit-clinic/${record.id}`}
                  className="dropdown-item d-flex align-items-center"
                >
                  Edit
                </Link>
              </li>
              <li>
                <button
                  className="dropdown-item d-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#delete_modal"
                  onClick={() => setSelectedClinic(record.id)}
                >
                  Delete
                </button>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* Header */}
          <div className="d-flex align-items-sm-center flex-sm-row flex-column gap-2 mb-3 pb-3 border-bottom">
            <div className="flex-grow-1">
              <h4 className="fw-bold mb-0">
                Clinic List
                <span className="badge badge-soft-primary fs-13 fw-medium ms-2">
                  Total Clinic : {data.length}
                </span>
              </h4>
            </div>
            <div className="text-end d-flex">
              <Link
                to="/add-clinic"
                className="btn btn-primary ms-2 fs-13 btn-md"
              >
                <i className="ti ti-plus me-1" />
                Add Clinic
              </Link>
            </div>
          </div>

          {/* Search + Filters */}
          <div className=" d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="search-set mb-3">
              <div className="d-flex align-items-center flex-wrap gap-2">
                <div className="table-search d-flex align-items-center mb-0">
                  <div className="search-input">
                    <SearchInput value={searchText} onChange={handleSearch} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <Datatable
              columns={columns}
              dataSource={data}
              Selection={false}
              searchText={searchText}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="footer text-center bg-white p-2 border-top">
          <p className="text-dark mb-0">
            2025 ©{" "}
            <Link to="#" className="link-primary">
              Preclinic
            </Link>
            , All Rights Reserved
          </p>
        </div>
      </div>

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
                  onClick={deleteClinic}
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

    
    </>
  );
};

export default ClinicList;
