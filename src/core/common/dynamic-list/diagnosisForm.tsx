import React from "react";

interface DiagnosisFormProps {
  value: string;
  onChange: (value: string) => void;
}

const DiagnosisForm: React.FC<DiagnosisFormProps> = ({ value, onChange }) => {
  return (
    <div className="mb-3">
      <label className="form-label mb-1 text-dark fs-14 fw-medium">
        Diagnosis
      </label>
      <textarea
        className="form-control"
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter diagnosis details"
      />
    </div>
  );
};

export default DiagnosisForm;
