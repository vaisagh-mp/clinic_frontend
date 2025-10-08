import { Link, useNavigate } from "react-router";
import { all_routes } from "../../../../routes/all_routes";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { useState, useEffect } from "react";
import SearchInput from "../../../../../core/common/dataTable/dataTableSearch";
import Datatable from "../../../../../core/common/dataTable";
import axios from "axios";

const DoctorsList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          navigate("/login-cover");
          return;
        }

        const res = await axios.get(
          "http://3.109.62.26/api/admin-panel/doctors/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const apiData = res.data.map((doc: any) => ({
          id: doc.id,
          name: doc.name || `${doc.user?.first_name} ${doc.user?.last_name}`,
          specialization: doc.specialization || "N/A",
          username: doc.username || doc.user?.username || "N/A",
          clinic: doc.clinic?.name || "N/A",
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

    fetchDoctors();
  }, [navigate]);

  // Delete doctor
  const handleDeleteDoctor = async () => {
    if (!selectedDoctorId) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      await axios.delete(
        `http://3.109.62.26/api/admin-panel/doctors/${selectedDoctorId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Remove deleted doctor from state
      setData((prev) => prev.filter((doc) => doc.id !== selectedDoctorId));
      setSelectedDoctorId(null);
      setLoading(false);
      (window as any).bootstrap.Modal.getInstance(
        document.getElementById("delete_modal")!
      )?.hide();
    } catch (error) {
      setLoading(false);
      console.error("Error deleting doctor:", error);
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
            <Link to={`${all_routes.doctorsDetails}/${record.id}`}>{text}</Link>
          </h6>
          <span className="fs-13 d-block">{record.specialization}</span>
        </div>
      ),
      sorter: (a: any, b: any) => a.name.length - b.name.length,
    },
    {
      title: "Username",
      dataIndex: "username",
      sorter: (a: any, b: any) =>
        (a.username || "").localeCompare(b.username || ""),
    },
    {
      title: "Phone",
      dataIndex: "phone_number",
      sorter: (a: any, b: any) => a.phone_number.length - b.phone_number.length,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a: any, b: any) => a.email.length - b.email.length,
    },
    {
      title: "Clinic",
      dataIndex: "clinic",
      sorter: (a: any, b: any) => a.clinic.length - b.clinic.length,
    },
    {
      title: "Experience",
      dataIndex: "years_of_experience",
      render: (text: any) => <span>{text}</span>,
      sorter: (a: any, b: any) => a.years_of_experience - b.years_of_experience,
    },
    {
      title: "Medical License",
      dataIndex: "medical_license_number",
      sorter: (a: any, b: any) =>
        (a.medical_license_number || "").length -
        (b.medical_license_number || "").length,
    },
    {
      title: "Blood Group",
      dataIndex: "blood_group",
      sorter: (a: any, b: any) =>
        (a.blood_group || "").localeCompare(b.blood_group || ""),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      sorter: (a: any, b: any) =>
        (a.gender || "").localeCompare(b.gender || ""),
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
                  to={`/edit-doctors/${record.id}`}
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
                  onClick={() => setSelectedDoctorId(record.id)}
                >
                  Delete
                </Link>
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
                to="/add-doctor"
                className="btn btn-primary ms-2 fs-13 btn-md"
              >
                <i className="ti ti-plus me-1" />
                New Doctor
              </Link>
            </div>
          </div>

          <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3 mb-3">
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
                  onClick={handleDeleteDoctor}
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

export default DoctorsList;
