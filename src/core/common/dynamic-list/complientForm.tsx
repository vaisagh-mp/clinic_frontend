import React from "react";

interface ComplaintFormProps {
  value: string;
  onChange: (value: string) => void;
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({ value, onChange }) => {
  return (
    <div className="mb-3">
      <label className="form-label mb-1 text-dark fs-14 fw-medium">
        Complaint
      </label>
      <textarea
        className="form-control"
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter complaint here..."
      />
    </div>
  );
};

export default ComplaintForm;
