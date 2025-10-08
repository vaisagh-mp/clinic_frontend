import React from "react";

interface AllergiesFormProps {
  value: string;
  onChange: (value: string) => void;
}

const AllergiesForm: React.FC<AllergiesFormProps> = ({ value, onChange }) => {
  return (
    <div className="mb-3">
      <label className="form-label mb-1 text-dark fs-14 fw-medium">
        Allergies
      </label>
      <textarea
        className="form-control"
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Mention any drug, food, or environmental allergies..."
      />
    </div>
  );
};

export default AllergiesForm;
