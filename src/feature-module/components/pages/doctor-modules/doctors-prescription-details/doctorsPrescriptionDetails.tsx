import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import axios from "axios";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { all_routes } from "../../../../routes/all_routes";

const DoctorsPrescriptionDetails = () => {
  const { prescriptionId } = useParams<{ prescriptionId: string }>();
  const navigate = useNavigate();

  const [prescription, setPrescription] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/login-cover");
      return;
    }

    const fetchPrescription = async () => {
      try {
        // ✅ Fetch list API to get created_at field
        const listResponse = await axios.get(
          "http://3.109.62.26/api/doctor/prescriptions/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Find the matching prescription from list API
        const listItem = listResponse.data.find(
          (item: any) =>
            item.consultation_id === Number(prescriptionId) ||
            item.id === Number(prescriptionId)
        );

        // ✅ Fetch detailed data
        const detailResponse = await axios.get(
          `http://3.109.62.26/api/doctor/prescriptions/${prescriptionId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Merge created_at (from list) into detail data
        const finalData = {
          ...detailResponse.data,
          created_at: listItem?.created_at || null,
        };

        setPrescription(finalData);
      } catch (error: any) {
        console.error("Error fetching prescription:", error);
        if (error.response && error.response.status === 401) {
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

  const {
    doctor,
    patient,
    clinic,
    prescriptions,
    advices,
    next_consultation,
    created_at,
  } = prescription;

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              {/* Page Header */}
              <div className="d-flex align-items-sm-center flex-sm-row flex-column mb-4">
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-0 d-flex align-items-center ">
                    <Link to={all_routes.doctorsprescriptions} className="me-1">
                      <i className="ti ti-chevron-left" /> Prescriptions
                    </Link>
                  </h6>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  {/* Header: Prescription ID */}
                  <div className="d-flex align-items-center justify-content-between border-1 border-bottom pb-3 mb-3">
                    <ImageWithBasePath src="assets/img/logo.svg" alt="" />
                    <span className="badge bg-info-subtle text-info-emphasis fs-13 fw-medium border border-primary py-1 px-2">
                      #{prescription.id.toString().padStart(4, "0")}
                    </span>
                  </div>

                  {/* Doctor & Clinic */}
                  <div className="d-flex align-items-center justify-content-between border-1 border-bottom pb-3 mb-3 flex-wrap gap-2">
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
                          {clinic.name}
                        </h6>
                        <p className="mb-1">Dr. {doctor.name}</p>
                        <p className="mb-0">{doctor.department}</p>
                      </div>
                    </div>
                    <div className="text-lg-end">
                      <p className="text-dark mb-1">
                        Department:{" "}
                        <span className="text-body">{doctor.department}</span>
                      </p>
                      <p className="text-dark mb-1">
                        Prescribed on:{" "}
                        <span className="text-body">
                          {created_at
                            ? new Date(created_at).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </p>
                      <p className="text-dark mb-0">
                        Clinic: <span className="text-body">{clinic.name}</span>
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
                          Blood: {patient.blood_group}
                        </p>
                        <p className="mb-0 text-dark">
                          Patient ID: PT
                          {patient.id.toString().padStart(4, "0")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Prescriptions Table */}
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
                          {prescriptions.map((med: any, index: number) => (
                            <tr key={index}>
                              <td>{(index + 1).toString().padStart(2, "0")}</td>
                              <td>{med.medicine_name}</td>
                              <td>{med.dosage}</td>
                              <td>{med.frequency}</td>
                              <td>{med.duration}</td>
                              <td>{med.timings.replace("_", " ")}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Advices */}
                  <div className="pb-3 mb-3 border-1 border-bottom">
                    <h6 className="mb-1 fs-16 fw-semibold">Advice</h6>
                    <p>{advices || "No advice provided."}</p>
                  </div>

                  {/* Follow Up */}
                  <div className="pb-3 mb-3 border-1 border-bottom d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div>
                      <h6 className="mb-1 fs-14 fw-semibold">Follow Up</h6>
                      <p>
                        Next consultation:{" "}
                        {next_consultation
                          ? new Date(next_consultation).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  {/* <div className="text-center d-flex align-items-center justify-content-center gap-2">
                    <Link
                      to=""
                      className="btn btn-md btn-dark d-flex align-items-center"
                    >
                      <i className="ti ti-printer me-1" /> Print
                    </Link>
                    <Link
                      to=""
                      className="btn btn-md btn-primary d-flex align-items-center"
                    >
                      <i className="ti ti-download me-1" /> Download
                    </Link>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-1 border-top text-center">
          <p className="text-dark text-center">
            2025 © <span className="text-info">Preclinic</span>, All Rights Reserved
          </p>
        </div>
      </div>
    </>
  );
};

export default DoctorsPrescriptionDetails;