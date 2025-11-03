import { Link } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { all_routes } from "../../../../routes/all_routes";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import Datatable from "../../../../../core/common/dataTable";
import SearchInput from "../../../../../core/common/dataTable/dataTableSearch";
import Header from "../../../../../core/common/header/header";
import Sidebarthree from "../../../../../core/common/sidebarthree/sidebarthree";
import * as XLSX from "xlsx";


const ClinicPrescriptions = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
  const token = localStorage.getItem("access_token");
  const clinicId = localStorage.getItem("clinic_id"); // ✅ get clinic_id from storage

  if (!token) {
    window.location.href = "/login-cover";
    return;
  }

  const fetchPrescriptions = async () => {
    try {
      // ✅ Base API URL
      let apiUrl = "http://3.109.62.26/api/clinic/prescriptions/";

      // ✅ If superadmin switched clinic, append ?clinic_id=XYZ
      if (clinicId) {
        apiUrl += `?clinic_id=${clinicId}`;
      }

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const mappedData = response.data.map((item: any) => ({
        Prescription_ID: item.id,
        Patient: item.patient?.full_name || "N/A",
        img: "default-avatar.jpg",
        phone_number: item.patient?.phone_number || "N/A",
        Doctor: item.doctor?.name || "N/A",
        Prescribed_On: new Date(item.created_at).toLocaleDateString(),
        Status: "Active",
      }));


      setData(mappedData);
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        window.location.href = "/login-cover";
      } else {
        console.error("Error fetching prescriptions:", error.response?.data || error);
        alert(error.response?.data?.detail || "Failed to fetch prescriptions");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchPrescriptions();
}, []);



  const downloadExcel = () => {
  if (!data || data.length === 0) {
    alert("No prescriptions available to download.");
    return;
  }

  // Dynamically get clinic name from first record or fallback
  const clinicName = data[0]?.Clinic?.replace(/\s+/g, "_") || "Clinic";

  // Format data for Excel
  const formattedData = data.map((item) => ({
    "Prescription ID": item.Prescription_ID,
    "Patient": item.Patient,
    "Phone": item.phone_number,
    "Doctor": item.Doctor,
    "Prescribed On": item.Prescribed_On,
    "Status": item.Status,
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Prescriptions");

  const filename = `${clinicName}_Prescriptions_List.xlsx`;
  XLSX.writeFile(workbook, filename);
};


  const columns = [
    {
  title: "Prescription ID",
  dataIndex: "Prescription_ID",
  render: (text: any, record: any) => (
    <Link to={`${all_routes.clinicPrescriptionsdetails}/${record.Prescription_ID}`}>
  {text}
</Link>

  ),
  sorter: (a: any, b: any) => a.Prescription_ID - b.Prescription_ID,
},

    {
      title: "Patient",
      dataIndex: "Patient",
      render: (text: any, record: any) => (
        <div className="d-flex align-items-center">
          {/* <Link
            to={all_routes.doctorspatientdetails}
            className="avatar avatar-md me-2"
          >
            <ImageWithBasePath
              src={`assets/img/users/${record.img}`}
              alt="patient"
              className="rounded-circle"
            />
          </Link> */}
          <Link to={`${all_routes.clinicPrescriptionsdetails}/${record.Prescription_ID}`}>
            {text}
            <span className="text-body fs-13 fw-normal d-block">
              {record.phone_number}
            </span>
          </Link>
        </div>
      ),
      sorter: (a: any, b: any) => a.Patient.length - b.Patient.length,
    },
    {
      title: "Doctor",
      dataIndex: "Doctor",
      sorter: (a: any, b: any) => a.Doctor.localeCompare(b.Doctor),
    },
    {
      title: "Prescribed On",
      dataIndex: "Prescribed_On",
      sorter: (a: any, b: any) =>
        new Date(a.Prescribed_On).getTime() - new Date(b.Prescribed_On).getTime(),
    },
    {
  title: "",
  render: (_: any, record: any) => (
    <div className="action-item">
      <Link to="#" data-bs-toggle="dropdown">
        <i className="ti ti-dots-vertical" />
      </Link>
      <ul className="dropdown-menu p-2">
        <li>
          <Link
            to={`${all_routes.clinicPrescriptionsdetails}/${record.Prescription_ID}`}
            className="dropdown-item d-flex align-items-center"
          >
            View
          </Link>
        </li>
        <li>
          <Link
            to="#"
            className="dropdown-item d-flex align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#delete_modal"
          >
            Delete
          </Link>
        </li>
      </ul>
    </div>
  ),
  sorter: (a: any, b: any) => 0,
}
,
  ];

  return loading ? (
    <p>Loading prescriptions...</p>
  ) : (
    <>
      <Header />
      <Sidebarthree />
      <div className="page-wrapper">
        <div className="content">
          <div className="d-flex align-items-sm-center flex-sm-row flex-column gap-2 pb-3 mb-3 border-1 border-bottom">
            <div className="flex-grow-1">
              <h4 className="fw-bold mb-0">Prescriptions</h4>
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
    </>
  );
};

export default ClinicPrescriptions;
