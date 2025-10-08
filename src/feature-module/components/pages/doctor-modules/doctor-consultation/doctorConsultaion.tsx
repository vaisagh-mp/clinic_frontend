import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import Datatable from "../../../../../core/common/dataTable/index";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { all_routes } from "../../../../routes/all_routes";
import Modal from "./modal/modals";
import axios from "axios";

const DoctorConsultaion = () => {
  const [data, setData] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const navigate = useNavigate();

  // Fetch scheduled consultations from API
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login-cover");
      return;
    }

    const fetchScheduledConsultations = async () => {
      try {
        const response = await axios.get(
          "http://3.109.62.26/api/doctor/appointments/scheduled/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Scheduled Appointments API Response:", response.data);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching scheduled consultations:", error);
      }
    };

    fetchScheduledConsultations();
  }, [navigate]);

  const columns = [

    {
      title: "Clinic",
      render: (text: any, record: any) => record.clinic?.name || "",
      sorter: (a: any, b: any) =>
        (a.clinic?.name || "").localeCompare(b.clinic?.name || ""),
    },

    {
      title: "Appointment ID",
      dataIndex: "appointment_id",
      render: (text: any, record: any) => (
        <Link
          to={`/doctor-dashboard/consultations/add/${record.id}`}
          className="fw-semibold text-primary"
        >
          {record.appointment_id} {/* visible text */}
        </Link>
      ),
      sorter: (a: any, b: any) =>
        (a.appointment_id || "").localeCompare(b.appointment_id || ""),
    },
    {
      title: "Patient",
      render: (text: any, record: any) => (
        <div className="d-flex align-items-center">
          <Link to={all_routes.doctorspatientdetails} className="avatar avatar-md me-2">
            <ImageWithBasePath
              src="assets/img/users/user-01.jpg"
              alt="patient"
              className="rounded-circle"
            />
          </Link>
          <Link to={all_routes.doctorspatientdetails} className="fw-semibold">
            {record.patient?.name}
            <span className="text-body fs-13 fw-normal d-block">
              {record.patient?.first_name || ""} {record.patient?.last_name || ""}
            </span>
          </Link>
        </div>
      ),
      sorter: (a: any, b: any) =>
        (a.patient?.name || "").localeCompare(b.patient?.name || ""),
    },
    {
      title: "Date & Time",
      render: (text: any, record: any) =>
        `${record.appointment_date} ${record.appointment_time}`,
      sorter: (a: any, b: any) =>
        ((a.appointment_date || "") + (a.appointment_time || "")).localeCompare(
          (b.appointment_date || "") + (b.appointment_time || "")
        ),
    },
    
    // {
    //   title: "Doctor",
    //   render: (text: any, record: any) => (
    //     <div className="d-flex align-items-center">
    //       <Link to={all_routes.doctordetails} className="avatar avatar-md me-2">
    //         <ImageWithBasePath
    //           src="assets/img/users/user-02.jpg"
    //           alt="doctor"
    //           className="rounded-circle"
    //         />
    //       </Link>
    //       <Link to={all_routes.doctordetails} className="fw-semibold">
    //         {record.created_by || "N/A"}
    //       </Link>
    //     </div>
    //   ),
    //   sorter: (a: any, b: any) =>
    //     (a.created_by || "").localeCompare(b.created_by || ""),
    // },
    
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) => (
        <span
          className={`badge ${
            text === "Checked Out"
              ? "badge-soft-primary"
              : text === "Checked In"
              ? "badge-soft-warning"
              : text === "Confirmed"
              ? "badge-soft-success"
              : text === "SCHEDULED"
              ? "badge-soft-info"
              : "badge-soft-danger"
          } rounded ${
            text === "Checked Out"
              ? "text-primary"
              : text === "Checked In"
              ? "text-warning"
              : text === "Confirmed"
              ? "text-success"
              : text === "SCHEDULED"
              ? "text-info"
              : "text-danger"
          } fw-medium fs-13`}
        >
          {text}
        </span>
      ),
      sorter: (a: any, b: any) => (a.status || "").localeCompare(b.status || ""),
    },
  ];

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* Header */}
          <div className="d-flex align-items-sm-center flex-sm-row flex-column gap-2 pb-3 mb-3 border-1 border-bottom">
            <div className="flex-grow-1">
              <h4 className="fw-semibold mb-0"> Consultations </h4>
            </div>
            <div className="text-end d-flex">
              {/* Export */}
              <div className="dropdown me-1">
                <Link
                  to="#"
                  className="btn btn-md fs-14 fw-normal border bg-white rounded text-dark d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  Export <i className="ti ti-chevron-down ms-2" />
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
            2025 ©
            <Link to="#" className="link-primary">
              Preclinic
            </Link>
            , All Rights Reserved
          </p>
        </div>
      </div>
      <Modal />
    </>
  );
};

export default DoctorConsultaion;
