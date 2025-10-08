import { Link, useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";
import { all_routes } from "../../../../routes/all_routes";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";

interface Education {
  id: number;
  degree: string;
  university: string;
  from_year: number;
  to_year: number;
}

interface Certification {
  id: number;
  name: string;
  from_year: number;
}

const DoctorDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<any>(null);
  const [educations, setEducations] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          navigate("/login-cover");
          return;
        }

        const res = await axios.get(
          `http://3.109.62.26/api/admin-panel/doctors/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const doc = res.data;
        setDoctor({
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
            doc.gender === "M"
              ? "Male"
              : doc.gender === "F"
              ? "Female"
              : "Other",
          medical_license_number: doc.medical_license_number || "N/A",
          address: doc.address || "N/A",
          dob: doc.dob || "N/A",
          profile_image: doc.profile_image
            ? `http://3.109.62.26${doc.profile_image}`
            : "assets/img/doctors/doctor-06.jpg",
        });

      // ✅ Safe handling for educations & certifications
        setEducations(Array.isArray(doc.educations) ? doc.educations : []);
        setCertifications(Array.isArray(doc.certifications) ? doc.certifications : []);
        
      } catch (error: any) {
        console.error("Error fetching doctor details:", error);
        if (error.response?.status === 401) {
          navigate("/login-cover");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id, navigate]);

  if (loading) return <div className="p-5 text-center">Loading doctor details...</div>;
  if (!doctor) return <div className="p-5 text-center">Doctor not found.</div>;

  return (
    <div className="page-wrapper">
      <div className="content pb-0">
        <div className="mb-3">
          <h6 className="fw-semibold fs-14 mb-0">
            <Link to={all_routes.doctorsList}>
              <i className="ti ti-chevron-left me-1" />
              Doctors
            </Link>
          </h6>
        </div>

        <div className="card">
          <div className="card-body d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="d-flex align-items-center flex-sm-nowrap flex-wrap row-gap-3">
              <div className="me-3 doctor-profile-img">
                <ImageWithBasePath
                  src={doctor.profile_image}
                  className="rounded"
                  alt={doctor.name}
                />
              </div>
              <div className="flex-fill">
                <div className="d-flex align-items-center mb-1">
                  <h6 className="mb-0 fw-semibold">{doctor.name}</h6>
                  <span className="badge border bg-white text-dark fw-medium ms-2">
                    <i className="ti ti-point-filled me-1 text-info" />
                    {doctor.specialization}
                  </span>
                </div>
                <span className="d-block mb-3 fs-13">{doctor.specialization}</span>
                <div className="d-flex align-items-center">
                  <p className="mb-0 fs-13">
                    <i className="ti ti-building-hospital me-1" />
                    Clinic: {doctor.clinic}
                  </p>
                  <span className="badge badge-soft-success fw-medium ms-2">
                    <i className="ti ti-point-filled me-1 text-success" />
                    Available
                  </span>
                </div>
              </div>
            </div>
            <div>
              {/* <Link
                to={all_routes.appointmentCalendar}
                className="btn btn-primary"
              >
                <i className="ti ti-calendar-event me-1" />
                Book Appointment
              </Link> */}
            </div>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-lg-8">
            {/* Education Info */}
            <div className="card">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Education Information</h5>
                {educations.length > 0 ? (
                  <ul className="activity-feed rounded">
                    {educations.map((edu) => (
                      <li key={edu.id} className="feed-item timeline-item">
                        <h6 className="fw-bold mb-2">
                          {edu.university} - {edu.degree}
                        </h6>
                        <p>
                          {edu.from_year} - {edu.to_year}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">No education information available.</p>
                )}
              </div>
            </div>

            <div className="card mt-3">
             <div className="card-body">
                <h5 className="fw-bold mb-3">Certifications</h5>
                {certifications.length > 0 ? (
                  certifications.map((cert) => (
                    <div key={cert.id} className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <span className="me-2">
                          <i className="ti ti-award" />
                        </span>
                        <h6 className="mb-0 fw-bold">
                          {cert.name}, {cert.from_year}
                        </h6>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No certifications available.</p>
                )}
              </div>
            </div>
          </div>

          <div className="col-xl-4 theiaStickySidebar">
            <div className="card">
              <div className="card-body">
                <h6 className="fw-bold mb-3">About</h6>
                <div className="d-flex align-items-center mb-3">
                  <span className="avatar rounded-circle bg-light text-dark fs-16 flex-shrink-0 me-2">
                    <i className="ti ti-file" />
                  </span>
                  <div>
                    <h6 className="fw-semibold fs-13 mb-1">Medical License Number</h6>
                    <p>{doctor.medical_license_number}</p>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <span className="avatar rounded-circle bg-light text-dark fs-16 flex-shrink-0 me-2">
                    <i className="ti ti-phone" />
                  </span>
                  <div>
                    <h6 className="fw-semibold fs-13 mb-1">Phone Number</h6>
                    <p>{doctor.phone_number}</p>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <span className="avatar rounded-circle bg-light text-dark fs-16 flex-shrink-0 me-2">
                    <i className="ti ti-mail" />
                  </span>
                  <div>
                    <h6 className="fw-semibold fs-13 mb-1">Email Address</h6>
                    <p>{doctor.email}</p>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <span className="avatar rounded-circle bg-light text-dark fs-16 flex-shrink-0 me-2">
                    <i className="ti ti-map-pin-check" />
                  </span>
                  <div>
                    <h6 className="fw-semibold fs-13 mb-1">Address</h6>
                    <p>{doctor.address}</p>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <span className="avatar rounded-circle bg-light text-dark fs-16 flex-shrink-0 me-2">
                    <i className="ti ti-calendar-event" />
                  </span>
                  <div>
                    <h6 className="fw-semibold fs-13 mb-1">DOB</h6>
                    <p>{doctor.dob}</p>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <span className="avatar rounded-circle bg-light text-dark fs-16 flex-shrink-0 me-2">
                    <i className="ti ti-droplet" />
                  </span>
                  <div>
                    <h6 className="fw-semibold fs-13 mb-1">Blood Group</h6>
                    <p>{doctor.blood_group}</p>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <span className="avatar rounded-circle bg-light text-dark fs-16 flex-shrink-0 me-2">
                    <i className="ti ti-user-check" />
                  </span>
                  <div>
                    <h6 className="fw-semibold fs-13 mb-1">Years of Experience</h6>
                    <p>{doctor.years_of_experience}+</p>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <span className="avatar rounded-circle bg-light text-dark fs-16 flex-shrink-0 me-2">
                    <i className="ti ti-gender-male" />
                  </span>
                  <div>
                    <h6 className="fw-semibold fs-13 mb-1">Gender</h6>
                    <p>{doctor.gender}</p>
                  </div>
                </div>
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

export default DoctorDetails;
