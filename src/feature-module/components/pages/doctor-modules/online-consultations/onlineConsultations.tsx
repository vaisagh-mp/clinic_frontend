import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";

import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import CommonSelect from "../../../../../core/common/common-select/commonSelect";
import {
  empty_Stomach,
} from "../../../../../core/common/selectOption";
import ComplaintForm from "../../../../../core/common/dynamic-list/complientForm";
import DiagnosisForm from "../../../../../core/common/dynamic-list/diagnosisForm";
import AdviceForm from "../../../../../core/common/dynamic-list/AdviceForm";
import InvestigationList from "../../../../../core/common/dynamic-list/InvestigationForm";

// -------------------- Constants --------------------
export const Frequency = [
  { value: "1-0-0", label: "1-0-0 (Morning only)" },
  { value: "0-1-0", label: "0-1-0 (Afternoon only)" },
  { value: "0-0-1", label: "0-0-1 (Night only)" },
  { value: "1-0-1", label: "1-0-1 (Morning & Night)" },
  { value: "1-1-1", label: "1-1-1 (Morning, Afternoon & Night)" },
  { value: "0-1-1", label: "0-1-1 (Afternoon & Night)" },
  { value: "1-1-0", label: "1-1-0 (Morning & Afternoon)" },
];

export const Timing = [
  { value: "BEFORE_MEAL", label: "Before Meal" },
  { value: "AFTER_MEAL", label: "After Meal" },
  { value: "ANYTIME", label: "Anytime" },
];

// -------------------- Types --------------------
interface MedicationItem {
  id: number;
  medicine?: string;
  dosageMg: string;
  dosageM: string;
  frequency?: string;
  timing?: string;
  instruction: string;
}

// -------------------- Component --------------------
const OnlineConsultations = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams();

  const [appointmentData, setAppointmentData] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    notes: "",
    temperature: "",
    pulse: "",
    respiratory_rate: "",
    spo2: "",
    height: "",
    weight: "",
    bmi: "",
    waist: "",
    complaints: "",
    diagnosis: "",
    advices: "",
    investigations: "",
    allergies: "",
    next_consultation: "",
    empty_stomach_required: false,
  });

  // -------------------- Prescriptions --------------------
  const [prescriptions, setPrescriptions] = useState<MedicationItem[]>([
    { id: Date.now(), dosageMg: "", dosageM: "", instruction: "" },
  ]);

  const [medicineOptions, setMedicineOptions] = useState<{ value: string; label: string }[]>([]);

  // -------------------- Fetch Medicines --------------------
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://3.109.62.26/api/billing/medicines/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const options = response.data.map((med: any) => ({
          value: med.name,
          label: med.name,
        }));
        setMedicineOptions(options);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };
    fetchMedicines();
  }, []);

  // -------------------- Prescription Handlers --------------------
  const handleAddAboveLast = () => {
    const newMedication: MedicationItem = {
      id: Date.now() + Math.random(),
      dosageMg: "",
      dosageM: "",
      instruction: "",
    };
    setPrescriptions((prev) => {
      const last = prev[prev.length - 1];
      return [...prev.slice(0, -1), newMedication, last];
    });
  };

  const handleRemove = (id: number) => {
    setPrescriptions((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDosageMgChange = (id: number, value: string) => {
    setPrescriptions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, dosageMg: value } : item))
    );
  };

  const handleDosageMChange = (id: number, value: string) => {
    setPrescriptions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, dosageM: value } : item))
    );
  };

  const handleInstructionChange = (id: number, value: string) => {
    setPrescriptions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, instruction: value } : item))
    );
  };

  const handleMedicineChange = (id: number, value: string) => {
    setPrescriptions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, medicine: value } : item))
    );
  };

  const handleFrequencyChange = (id: number, value: string) => {
    setPrescriptions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, frequency: value } : item))
    );
  };

  const handleTimingChange = (id: number, value: string) => {
    setPrescriptions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, timing: value } : item))
    );
  };

  // -------------------- Fetch Appointment --------------------
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login-cover");
      return;
    }

    let isMounted = true;

    const fetchAppointment = async () => {
      try {
        const response = await axios.get(
          `http://3.109.62.26/api/doctor/appointments/${appointmentId}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!isMounted) return;
        const appt = response.data;

        setAppointmentData({
          ...appt,
          patient_name: `${appt.patient.first_name} ${appt.patient.last_name}`,
          age: appt.patient.age,
          gender: appt.patient.gender,
          blood_group: appt.patient.blood_group,
          department: appt.clinic.type,
          date_time: `${appt.appointment_date} ${appt.appointment_time}`,
        });

        setFormData({
          notes: appt.notes || "",
          temperature: appt.temperature || "",
          pulse: appt.pulse || "",
          respiratory_rate: appt.respiratory_rate || "",
          spo2: appt.spo2 || "",
          height: appt.height || "",
          weight: appt.weight || "",
          bmi: appt.bmi || "",
          waist: appt.waist || "",
          complaints: appt.complaints || "",
          diagnosis: appt.diagnosis || "",
          advices: appt.advices?.length ? appt.advices : [""],
          investigations: appt.investigations?.length ? appt.investigations : [""],
          follow_ups: appt.follow_ups?.length ? appt.follow_ups : [""],
          next_consultation: appt.next_consultation || "",
          empty_stomach_required: appt.empty_stomach_required || false,
          select_option: appt.select_option || "",
        });

        if (appt.prescriptions?.length > 0) {
          const mapped = appt.prescriptions.map((item: any) => ({
  id: Date.now() + Math.random(),
  medicine: item.medicine_name,
  dosageMg: item.dosage.split("/")[0] || "",
  dosageM: item.dosage.split("/")[1] || "",
  frequency: item.frequency, // ✅ ensure backend sends correct string
  timing: item.timings,     // ✅ ensure backend sends correct string
  instruction: item.duration,
}));

          setPrescriptions(mapped);
        }
      } catch (error) {
        console.error("Error fetching consultation:", error);
      }
    };

    fetchAppointment();

    return () => {
      isMounted = false;
    };
  }, [appointmentId, navigate]);

  // -------------------- Form Handlers --------------------
  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, value, type } = e.target;

  // 🛠️ Type guard: Only use 'checked' for checkboxes
  const newValue =
    type === "checkbox"
      ? (e.target as HTMLInputElement).checked
      : value;

  setFormData((prev: any) => ({
    ...prev,
    [name]: newValue,
  }));
};


  const handleSubmit = async () => {
    const token = localStorage.getItem("access_token");
    if (!token || !appointmentData) return;

    try {
      const mappedPrescriptions = prescriptions.map((item) => ({
        medicine_name: item.medicine || (medicineOptions[0]?.value || ""),
        dosage: `${item.dosageMg}${item.dosageM ? "/" + item.dosageM : ""}`.trim(),
        frequency: item.frequency || "1-0-0",
        timings: item.timing || "ANYTIME",
        duration: item.instruction || "1 day",
      }));

      await axios.post(
  "http://3.109.62.26/api/doctor/consultations/",
  {
    doctor: appointmentData.doctor_id,
    patient: appointmentData.patient.id,
    appointment: appointmentData.id,
    ...formData,
    advices: Array.isArray(formData.advices) ? formData.advices.join(", ") : formData.advices,
    investigations: Array.isArray(formData.investigations) ? formData.investigations.join(", ") : formData.investigations,
    prescriptions: mappedPrescriptions,
  },
  { headers: { Authorization: `Bearer ${token}` } }
);
      alert("Consultation saved successfully!");
  navigate("/doctor-dashboard/consultations");
} catch (error: any) {
  console.error("Error saving consultation:", error.response?.data || error);
}
  };

  if (!appointmentData) return <p>Loading consultation details...</p>;

  return (
    <div className="page-wrapper consultation-custom">
      <div className="content">
        {/* Header */}
        <div className="d-flex align-items-sm-center flex-sm-row flex-column gap-2 pb-3 mb-3 border-1 border-bottom">
          <div className="flex-grow-1">
            <h4 className="fw-bold mb-0"> Online Consultations </h4>
          </div>
        </div>

        {/* Basic Info */}
        <div className="card rounded-0 mb-3">
          <div className="card-header">
            <h5 className="m-0 fw-bold"> Basic Information </h5>
          </div>
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-lg-6 d-flex align-items-center gap-3">
                <div className="avatar avatar-xxxl">
                  <ImageWithBasePath
                    src="assets/img/users/user-04.jpg"
                    alt="patient"
                    className="img-fluid img1 rounded"
                  />
                </div>
                <div>
                  <span className="badge badge-md text-info border border-info mb-1 fs-13 fw-medium px-2">
                    #{appointmentData.appointment_id}
                  </span>
                  <h5 className="text-dark mb-1 fw-bold">
                    {appointmentData.patient_name}
                  </h5>
                  <p className="text-dark m-0">
                    <span className="text-body"> Reason: </span>
                    {appointmentData.reason || ""}
                  </p>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="bg-light p-3 rounded d-flex justify-content-between">
                  <div>
                    <h6 className="text-dark fs-14 fw-semibold mb-1">Age</h6>
                    <p className="text-body fs-13 m-0">
                      {appointmentData.age || ""} Years
                    </p>
                    <h6 className="text-dark fs-14 fw-semibold mb-1">
                      Department
                    </h6>
                    <p className="text-body fs-13 m-0">
                      {appointmentData.department || ""}
                    </p>
                  </div>
                  <div>
                    <h6 className="text-dark fs-14 fw-semibold mb-1">Date</h6>
                    <p className="text-body fs-13 m-0">
                      {appointmentData.date_time}
                    </p>
                    <h6 className="text-dark fs-14 fw-semibold mb-1">Gender</h6>
                    <p className="text-body fs-13 m-0">
                      {appointmentData.gender}
                    </p>
                  </div>
                  <div>
                    <h6 className="text-dark fs-14 fw-semibold mb-1">
                      Blood Group
                    </h6>
                    <p className="text-body fs-13 m-0">
                      {appointmentData.blood_group}
                    </p>
                    <h6 className="text-dark fs-14 fw-semibold mb-1">
                      Consultation Type
                    </h6>
                    <p className="text-body fs-13 m-0">
                      {appointmentData.consultation_type}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vitals */}
        <div className="card rounded-0 mb-3">
          <div className="card-header">
            <h5 className="m-0 fw-bold"> Vitals </h5>
          </div>
          <div className="card-body pb-0">
            <div className="row">
              {[
                "temperature",
                "pulse",
                "respiratory_rate",
                "spo2",
                "height",
                "weight",
                "bmi",
                "waist",
              ].map((field) => (
                <div className="col-md-4 mb-3" key={field}>
                  <label className="form-label mb-1 text-dark fs-14 fw-medium">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Complaint, Diagnosis */}
        <div className="card rounded-0 mb-3">
          <div className="card-header">
            <h5 className="m-0 fw-bold"> Complaint </h5>
          </div>
          <div className="card-body">
            <ComplaintForm
  value={formData.complaints}
  onChange={(val) => setFormData((prev: any) => ({ ...prev, complaints: val }))}
/>
          </div>
        </div>

        <div className="card rounded-0 mb-3">
          <div className="card-header">
            <h5 className="m-0 fw-bold"> Diagnosis </h5>
          </div>
          <div className="card-body">
            <DiagnosisForm
              value={formData.diagnosis}
              onChange={(val) =>
  setFormData((prev: any) => ({ ...prev, diagnosis: val }))
}
            />
          </div>
        </div>

        {/* ✅ Prescriptions Section */}
       <div className="card rounded-0 mb-3">
  <div className="card-header">
    <h5 className="m-0 fw-bold"> Prescriptions </h5>
  </div>
  <div className="card-body">
    <div className="medication-list">
      {prescriptions.map((item, index) => {
        const isLast = index === prescriptions.length - 1;
        return (
          <div className="row medication-list-item mb-2" key={item.id}>
            <div className="col-lg-11">
              <div className="row">
                {/* Medicine */}
                <div className="col-lg-2">
                  {index === 0 && <label className="form-label">Medicine</label>}
                  <select
                    className="form-control"
                    value={item.medicine || ""}
                    onChange={(e) => handleMedicineChange(item.id, e.target.value)}
                  >
                    <option value="">Select Medicine</option>
                    {medicineOptions.map((med) => (
                      <option key={med.value} value={med.value}>
                        {med.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dosage (mg) */}
                <div className="col-lg-2">
                  {index === 0 && <label className="form-label">Dosage (mg)</label>}
                  <input
                    type="text"
                    className="form-control"
                    value={item.dosageMg}
                    onChange={(e) => handleDosageMgChange(item.id, e.target.value)}
                  />
                </div>

                {/* Dosage (m) */}
                {/* <div className="col-lg-2">
                  {index === 0 && <label className="form-label">Dosage (m)</label>}
                  <input
                    type="text"
                    className="form-control"
                    value={item.dosageM}
                    onChange={(e) => handleDosageMChange(item.id, e.target.value)}
                  />
                </div> */}

                {/* Frequency */}
                <div className="col-lg-2">
                  {index === 0 && <label className="form-label">Frequency</label>}
                  <select
                    className="form-control"
                    value={item.frequency || "1-0-0"}
                    onChange={(e) => handleFrequencyChange(item.id, e.target.value)}
                  >
                    {Frequency.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Timing */}
                <div className="col-lg-2">
                  {index === 0 && <label className="form-label">Timing</label>}
                  <select
                    className="form-control"
                    value={item.timing || "ANYTIME"}
                    onChange={(e) => handleTimingChange(item.id, e.target.value)}
                  >
                    {Timing.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Instruction */}
                <div className="col-lg-2">
                  {index === 0 && <label className="form-label">Instruction</label>}
                  <input
                    type="text"
                    className="form-control"
                    value={item.instruction}
                    onChange={(e) => handleInstructionChange(item.id, e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="col-lg-1 d-flex align-items-center">
              {!isLast ? (
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemove(item.id);
                  }}
                  className="btn btn-sm btn-danger"
                >
                  🗑
                </Link>
              ) : (
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddAboveLast();
                  }}
                  className="btn btn-sm btn-primary"
                >
                  ➕
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
</div>


        {/* Advice & Investigation */}
        <div className="card rounded-0 mb-3">
          <div className="card-header">
            <h5 className="m-0 fw-bold"> Advice </h5>
          </div>
          <div className="card-body">
            <AdviceForm
  value={formData.advices}
  onChange={(val: any) => setFormData((prev: any) => ({ ...prev, advices: val }))}
/>

          </div>
        </div>

        <div className="card rounded-0 mb-3">
          <div className="card-header">
            <h5 className="m-0 fw-bold"> Investigation & Procedure </h5>
          </div>
          <div className="card-body">
            <InvestigationList
              value={formData.investigations}
              onChange={(val) =>
                setFormData((prev : any) => ({ ...prev, investigations: val }))
              }
            />

          </div>
        </div>

        {/* Follow Up */}
        <div className="card rounded-0 mb-3">
          <div className="card-header">
            <h5 className="m-0 fw-bold"> Follow Up </h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-lg-6 mb-3">
                <label className="form-label">Next Consultation</label>
                <input
                  type="date"
                  className="form-control"
                  name="next_consultation"
                  value={formData.next_consultation || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-6 mb-3">
                <label className="form-label">Empty Stomach Required</label>
                <CommonSelect
                  options={empty_Stomach}
                  className="select"
                  defaultValue={
                    formData.empty_stomach_required
                      ? empty_Stomach[1]
                      : empty_Stomach[0]
                  }
                  onChange={(val) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      empty_stomach_required: val.value,
                    }))
                  }

                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="d-flex gap-2 justify-content-end mb-4">
          <Link
            to=""
            className="btn btn-md bg-light text-dark fs-13 fw-medium rounded"
          >
            Cancel
          </Link>
          <button
            className="btn btn-md btn-primary fs-13 fw-medium rounded"
            onClick={handleSubmit}
          >
            Complete Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnlineConsultations;
