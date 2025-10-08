import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import axios from "axios";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { all_routes } from "../../../../routes/all_routes";
import Header from "../../../../../core/common/header/header";
import Sidebarthree from "../../../../../core/common/sidebarthree/sidebarthree";

const ClinicPrescriptionDetails = () => {
  const { prescriptionId } = useParams<{ prescriptionId: string }>();
  const navigate = useNavigate();

  const [prescription, setPrescription] = useState<any>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // ✅ Format date
  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "Date not available";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Date not available";
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login-cover");
      return;
    }

    const fetchPrescription = async () => {
      try {
        // ✅ Step 1: Fetch list API to get `created_at`
        const listResponse = await axios.get(
          "http://3.109.62.26/api/clinic/prescriptions/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const listData = listResponse.data;
        const matchedPrescription = listData.find(
          (item: any) => item.id.toString() === prescriptionId
        );

        if (matchedPrescription) {
          setCreatedAt(matchedPrescription.created_at);
        }

        // ✅ Step 2: Fetch details API
        const detailResponse = await axios.get(
          `http://3.109.62.26/api/clinic/prescriptions/${prescriptionId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setPrescription(detailResponse.data);
      } catch (error: any) {
        console.error("Error fetching prescription:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("access_token");
          navigate("/login-cover");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPrescription();
  }, [prescriptionId, navigate]);

  if (loading) return <p>Loading prescription details...</p>;
  if (!prescription) return <p>No data found.</p>;

  const { doctor, patient, clinic, prescriptions, advices, next_consultation } =
    prescription;

  const handlePrint = () => window.print();

  return (
    <>
      <Header />
      <Sidebarthree />

      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              {/* Page Header */}
              <div className="d-flex align-items-sm-center flex-sm-row flex-column mb-4">
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-0 d-flex align-items-center">
                    <Link to={all_routes.doctorsprescriptions} className="me-1">
                      <i className="ti ti-chevron-left" /> Prescriptions
                    </Link>
                  </h6>
                </div>
              </div>

              {/* ✅ PRINTABLE AREA */}
              <div id="print-area" className="card shadow-sm">
                <div className="card-body">
                  {/* Header */}
                  <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                    <ImageWithBasePath src="assets/img/logo.svg" alt="" />
                    <span className="badge bg-info-subtle text-info-emphasis fs-13 fw-medium border border-primary py-1 px-2">
                      #{prescription.id.toString().padStart(4, "0")}
                    </span>
                  </div>

                  {/* Doctor & Clinic */}
                  <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3 flex-wrap gap-2">
                    <div className="d-flex align-items-center gap-2">
                      <div className="avatar avatar-xxl rounded bg-light border p-2">
                        <ImageWithBasePath
                          src="./assets/img/icons/trust-care.svg"
                          alt="doctor"
                          className="img-fluid img1"
                        />
                      </div>
                      <div>
                        <h6 className="text-dark fw-semibold mb-1">
                          {clinic?.name}
                        </h6>
                        <p className="mb-1">
                          <strong>Dr. {doctor?.name}</strong>
                        </p>
                        {doctor?.department && (
                          <p className="mb-0">{doctor.department}</p>
                        )}
                      </div>
                    </div>

                    <div className="text-lg-end">
                      <p className="text-dark mb-1">
                        Prescribed on:{" "}
                        <span className="text-body">
                          {formatDate(createdAt)}
                        </span>
                      </p>
                      <p className="text-dark mb-0">
                        Clinic: <span className="text-body">{clinic?.name}</span>
                      </p>
                    </div>
                  </div>

                  {/* Patient Details */}
                  <div className="mb-3">
                    <h6 className="mb-2 fs-14 fw-medium">Patient Details</h6>
                    <div className="px-3 py-2 bg-light rounded d-flex align-items-center justify-content-between">
                      <h6 className="m-0 fw-semibold fs-16">
                        {patient.first_name} {patient.last_name}
                      </h6>
                      <div className="d-flex align-items-center gap-3">
                        <p className="mb-0 text-dark">
                          {new Date().getFullYear() -
                            new Date(patient.dob).getFullYear()}
                          Y / {patient.gender}
                        </p>
                        <p className="mb-0 text-dark">
                          Blood: {patient.blood_group || "N/A"}
                        </p>
                        <p className="mb-0 text-dark">
                          Patient ID: PT{patient.id.toString().padStart(4, "0")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Prescription Table */}
                  <div className="mb-4">
                    <h6 className="mb-3 fs-16 fw-semibold text-center">
                      Prescription
                    </h6>
                    <div className="table-responsive border bg-white">
                      <table className="table table-nowrap">
                        <thead className="table-light">
                          <tr>
                            <th>SNO</th>
                            <th>Medicine Name</th>
                            <th>Dosage</th>
                            <th>Frequency</th>
                            <th>Duration</th>
                            <th>Timings</th>
                          </tr>
                        </thead>
                        <tbody>
                          {prescriptions?.map((med: any, index: number) => (
                            <tr key={index}>
                              <td>{(index + 1).toString().padStart(2, "0")}</td>
                              <td>{med.medicine_name}</td>
                              <td>{med.dosage}</td>
                              <td>{med.frequency}</td>
                              <td>{med.duration}</td>
                              <td>{med.timings?.replace("_", " ")}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Advice */}
                  <div className="pb-3 mb-3 border-bottom">
                    <h6 className="mb-1 fs-16 fw-semibold">Advice</h6>
                    <p>{advices || "No specific advice provided."}</p>
                  </div>

                  {/* Follow Up */}
                  {next_consultation && (
                    <div className="pb-3 mb-3 border-bottom">
                      <h6 className="mb-1 fs-14 fw-semibold">Follow Up</h6>
                      <p>Next consultation: {formatDate(next_consultation)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="text-center d-flex align-items-center justify-content-center gap-2 mt-3 no-print">
                <button
                  onClick={handlePrint}
                  className="btn btn-md btn-dark d-flex align-items-center"
                >
                  <i className="ti ti-printer me-1" /> Print
                </button>
                <button
                  onClick={handlePrint}
                  className="btn btn-md btn-primary d-flex align-items-center"
                >
                  <i className="ti ti-download me-1" /> Download
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-top text-center no-print">
          <p className="text-dark text-center">
            2025 © <span className="text-info">Preclinic</span>, All Rights Reserved
          </p>
        </div>
      </div>

      {/* Print Styles */}
      <style>
        {`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}
      </style>
    </>
  );
};

export default ClinicPrescriptionDetails;
