import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { all_routes } from "../../../../routes/all_routes";
import axios from "axios";
import doctorimage from "../../../../../../public/assets/img/doctors/doctor-01.jpg";

const ClinicDetails = () => {
  const { clinicId } = useParams();
  const [clinic, setClinic] = useState<any>(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchClinic = async () => {
    try {
      const token = localStorage.getItem("access_token"); // get saved token
      if (!token) {
        console.warn("No access token found, redirecting to login.");
        return;
      }

      const response = await axios.get(
        `http://3.109.62.26/api/admin-panel/clinics/${clinicId}/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // add token here
          },
        }
      );

      setClinic(response.data);
    } catch (error) {
      console.error("Error fetching clinic data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchClinic();
}, [clinicId]);


  if (loading) return <p>Loading clinic details...</p>;
  if (!clinic) return <p>No clinic data available.</p>;

  return (
    <div className="page-wrapper">
      <div className="content pb-0">
        {/* Page Header */}
        <div className="mb-3">
          <h6 className="fw-semibold fs-14 mb-0">
            <Link to={all_routes.clinicList}>
              <i className="ti ti-chevron-left me-1" />
              Clinic
            </Link>
          </h6>
        </div>

        {/* Clinic Card */}
        <div className="card mb-3">
          <div className="card-body d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div>
              <h6 className="mb-1 fw-semibold">{clinic.name}</h6>
              <p className="mb-0 fs-13">
                <i className="ti ti-map-pin me-1" />
                {clinic.address}
              </p>
              <span className="badge badge-soft-success fw-medium mt-1">
                <i className="ti ti-point-filled me-1 text-success" />
                {clinic.status}
              </span>
            </div>
            <div>
              <Link
                to={all_routes.appointmentCalendar}
                className="btn btn-primary"
              >
                <i className="ti ti-calendar-event me-1" />
                Book Appointment
              </Link>
            </div>
          </div>
        </div>

        {/* About Clinic */}
        <div className="row">
          <div className="col-lg-8">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="fw-bold mb-3">About Clinic</h5>
                <p>{clinic.description}</p>
              </div>
            </div>

            {/* Doctors */}
            <div className="card mb-3">
              <div className="card-body ">
                <h5 className="fw-bold mb-3">Doctors in Clinic</h5>
                <div className="doctors-in-clininc">
                {clinic.doctors.length === 0 ? (
                  <p>No doctors found</p>
                ) : (
                  clinic.doctors.map((doc: any) => (
                    <div key={doc.id} className="d-flex align-items-center mb-3">
                      <span className="me-2 avatar">
                        <img
                          src={doc.profile_image || doctorimage}
                          alt={doc.name}
                          className="rounded-circle"
                          width={50}
                          height={50}
                        />
                      </span>
                      <div>
                        <h6 className="mb-0 fw-bold">{doc.name}</h6>
                        <p className="mb-0">{doc.specialization}</p>
                        <p className="mb-0 fs-13">{doc.email}</p>
                      </div>
                    </div>
                  ))
                )}

               </div>

              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-xl-4 theiaStickySidebar">
            <div className="card mb-3">
              <div className="card-body">
                <h6 className="fw-bold mb-3">Clinic Info</h6>
                <div className="d-flex align-items-center mb-3">
                  <span className="avatar rounded-circle bg-light text-dark fs-16 flex-shrink-0 me-2">
                    <i className="ti ti-file" />
                  </span>
                  <div>
                    <h6 className="fw-semibold fs-13 mb-1">Clinic Type</h6>
                     <p>{clinic.type || "N/A"}</p>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <span className="avatar rounded-circle bg-light text-dark fs-16 flex-shrink-0 me-2">
                    <i className="ti ti-phone" />
                  </span>
                  <div>
                    <h6 className="fw-semibold fs-13 mb-1">Phone</h6>
                    <p>{clinic.phone_number}</p>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <span className="avatar rounded-circle bg-light text-dark fs-16 flex-shrink-0 me-2">
                    <i className="ti ti-mail" />
                  </span>
                  <div>
                    <h6 className="fw-semibold fs-13 mb-1">Email</h6>
                    <p>{clinic.email}</p>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <span className="avatar rounded-circle bg-light text-dark fs-16 flex-shrink-0 me-2">
                    <i className="ti ti-world" />
                  </span>
                  <div>
                    <h6 className="fw-semibold fs-13 mb-1">Website</h6>
                    <a href={clinic.website || "#"}>{clinic.website || "None"}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
  );
};

export default ClinicDetails;
