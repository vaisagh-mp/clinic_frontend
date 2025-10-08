import React from "react";

interface AdviceFormProps {
  value: string;
  onChange: (value: string) => void;
}

const AdviceForm: React.FC<AdviceFormProps> = ({ value, onChange }) => {
  return (
    <div className="mb-3">
      <label className="form-label mb-1 text-dark fs-14 fw-medium">
        Advice
      </label>
      <textarea
        className="form-control"
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter advices here, each on a new line"
      />
    </div>
  );
};

export default AdviceForm;
