import React from "react";

interface InvestigationFormProps {
  value: string;
  onChange: (value: string) => void;
}

const InvestigationForm: React.FC<InvestigationFormProps> = ({ value, onChange }) => {
  return (
    <div className="mb-3">
      <label className="form-label mb-1 text-dark fs-14 fw-medium">
        Investigation &amp; Procedure
      </label>
      <textarea
        className="form-control"
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter investigations/procedures here, each on a new line"
      />
    </div>
  );
};

export default InvestigationForm;
