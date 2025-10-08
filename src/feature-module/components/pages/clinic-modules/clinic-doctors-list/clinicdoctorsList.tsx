import { Link, useNavigate } from "react-router";
import { all_routes } from "../../../../routes/all_routes";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { useState, useEffect } from "react";
import SearchInput from "../../../../../core/common/dataTable/dataTableSearch";
import Datatable from "../../../../../core/common/dataTable";
import axios from "axios";

const ClinicDoctorsList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login-cover");
        return;
      }

      const res = await axios.get("http://3.109.62.26/api/clinic/doctors/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const apiData = res.data.map((doc: any) => ({
        id: doc.id,
        name: doc.name || `${doc.user?.first_name} ${doc.user?.last_name}`,
        specialization: doc.specialization || "N/A",
        username: doc.username || doc.user?.username || "N/A",
        phone_number: doc.phone_number || "N/A",
        email: doc.email || "N/A",
        years_of_experience: doc.years_of_experience || 0,
        blood_group: doc.blood_group || "N/A",
        gender:
          doc.gender === "M" ? "Male" : doc.gender === "F" ? "Female" : "Other",
        medical_license_number: doc.medical_license_number || "N/A",
        address: doc.address || "N/A",
        profile_image: doc.profile_image
          ? `http://3.109.62.26${doc.profile_image}`
          : "assets/img/doctors/doctor-03.jpg",
      }));

      setData(apiData);
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        navigate("/login-cover");
      } else {
        console.error("Error fetching doctors:", error);
      }
    }
  };

  // 🔹 Delete Doctor
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      await axios.delete(`http://3.109.62.26/api/clinic/doctors/${deleteId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove from UI
      setData((prev) => prev.filter((doc) => doc.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting doctor:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Profile",
      dataIndex: "profile_image",
      render: (text: any, record: any) => (
        <Link to={`${all_routes.doctorsDetails}/${record.id}`} className="avatar me-2">
          <ImageWithBasePath
            src={record.profile_image}
            alt={record.name}
            className="rounded-circle"
          />
        </Link>
      ),
    },
    {
      title: "Name & Specialization",
      dataIndex: "name",
      render: (text: any, record: any) => (
        <div>
          <h6 className="mb-1 fs-14 fw-semibold">
            <Link to={`${all_routes.clinicdoctordetails}/${record.id}`}>{text}</Link>
          </h6>
          <span className="fs-13 d-block">{record.specialization}</span>
        </div>
      ),
    },
    { title: "Username", dataIndex: "username" },
    { title: "Phone", dataIndex: "phone_number" },
    { title: "Email", dataIndex: "email" },
    { title: "Experience", dataIndex: "years_of_experience" },
    { title: "Medical License", dataIndex: "medical_license_number" },
    { title: "Blood Group", dataIndex: "blood_group" },
    { title: "Gender", dataIndex: "gender" },
    { title: "Address", dataIndex: "address" },
    {
      title: "Actions",
      render: (record: any) => (
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
                  to={`/clinic-dashboard/edit-doctor/${record.id}`}
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
                  onClick={() => setDeleteId(record.id)}
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

  const handleSearch = (value: string) => setSearchText(value);

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="d-flex align-items-sm-center flex-sm-row flex-column gap-2 mb-3 pb-3 border-bottom">
            <div className="flex-grow-1">
              <h4 className="fw-bold mb-0">
                Doctor List
                <span className="badge badge-soft-primary fs-13 fw-medium ms-2">
                  Total Doctors : {data.length}
                </span>
              </h4>
            </div>
            <div className="text-end d-flex">
              <Link
                to="/clinic-dashboard/add-doctor"
                className="btn btn-primary ms-2 fs-13 btn-md"
              >
                <i className="ti ti-plus me-1" />
                New Doctor
              </Link>
            </div>
          </div>

          <SearchInput value={searchText} onChange={handleSearch} />

          <div className="table-responsive">
            <Datatable
              columns={columns}
              dataSource={data}
              Selection={false}
              searchText={searchText}
            />
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

      {/* 🔹 Delete Modal (your design) */}
      <div className="modal fade" id="delete_modal" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <h5>Are you sure you want to delete this doctor?</h5>
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
    </>
  );
};

export default ClinicDoctorsList;
