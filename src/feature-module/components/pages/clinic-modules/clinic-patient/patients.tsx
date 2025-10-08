import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Datatable from "../../../../../core/common/dataTable";
import SearchInput from "../../../../../core/common/dataTable/dataTableSearch";
import { all_routes } from "../../../../routes/all_routes";

const ClinicPatients = () => {
  const [data, setData] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login-cover");
      return;
    }
    fetchPatients();
  }, [navigate]);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://3.109.62.26/api/clinic/patients/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `http://3.109.62.26/api/clinic/patients/${deleteId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete patient");
      }

      setData((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error(error);
      alert("Error deleting patient");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Patient",
      dataIndex: "first_name",
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <div>
            <Link
  to={`${all_routes.clinicpatientdetails}/${record.id}`}
  className="text-dark fw-semibold"
>
  {record.first_name}
</Link>
          </div>
        </div>
      ),
      sorter: (a: any, b: any) =>
        (a.first_name || "").length - (b.first_name || "").length,
    },
    {
      title: "Care Of",
      dataIndex: "care_of",
      sorter: (a: any, b: any) =>
        (a.care_of || "").length - (b.care_of || "").length,
    },
    {
      title: "Phone",
      dataIndex: "phone_number",
      sorter: (a: any, b: any) =>
        (a.phone_number || "").length - (b.phone_number || "").length,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a: any, b: any) =>
        (a.email || "").length - (b.email || "").length,
    },
    {
      title: "Clinic",
      dataIndex: "clinic",
      sorter: (a: any, b: any) =>
        (a.clinic || "").length - (b.clinic || "").length,
    },
    {
      title: "DOB",
      dataIndex: "dob",
      sorter: (a: any, b: any) =>
        new Date(a.dob).getTime() - new Date(b.dob).getTime(),
    },
    {
      title: "Blood Group",
      dataIndex: "blood_group",
      sorter: (a: any, b: any) =>
        (a.blood_group || "").length - (b.blood_group || "").length,
    },
    {
      title: "Address",
      dataIndex: "address",
      sorter: (a: any, b: any) =>
        (a.address || "").length - (b.address || "").length,
    },
    {
      title: "Actions",
      render: (record: any) => (
        <div className="d-flex align-items-center gap-1">
          {/* <Link
            to={all_routes.appointments}
            className="shadow-sm fs-14 d-inline-flex border rounded-2 p-1 me-1"
          >
            <i className="ti ti-calendar-cog" />
          </Link> */}
          <Link
            to="#"
            className="shadow-sm fs-14 d-inline-flex border rounded-2 p-1 me-1"
            data-bs-toggle="dropdown"
          >
            <i className="ti ti-dots-vertical" />
          </Link>
          <ul className="dropdown-menu p-2">
            <li>
              <Link
                to={`${all_routes.cliniceditPatient}/${record.id}`}
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
      sorter: false,
    },
  ];

  const handleSearch = (value: string) => setSearchText(value);

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="d-flex align-items-sm-center flex-sm-row flex-column gap-2 pb-3 mb-3 border-bottom">
          <div className="flex-grow-1">
            <h4 className="fw-bold mb-0">
              Patients List
              <span className="badge badge-soft-primary fw-medium border py-1 px-2 border-primary fs-13 ms-1">
                Total Patients : {data.length}
              </span>
            </h4>
          </div>
          <div className="text-end d-flex">
            <Link
              to={all_routes.cliniccreatePatient}
              className="btn btn-primary ms-2 fs-13 btn-md"
            >
              <i className="ti ti-plus me-1" />
              New Patient
            </Link>
          </div>
        </div>

        <div className="table-search mb-3">
          <SearchInput value={searchText} onChange={handleSearch} />
        </div>

        <div className="table-responsive">
          <Datatable
            columns={columns}
            dataSource={data}
            Selection={false}
            searchText={searchText}
          />
        </div>
      </div>

      {/* Delete Modal */}
      <div className="modal fade" id="delete_modal" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <h5>Are you sure you want to delete this patient?</h5>
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
  );
};

export default ClinicPatients;
