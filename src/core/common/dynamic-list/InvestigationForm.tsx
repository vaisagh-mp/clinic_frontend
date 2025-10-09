import React from "react";
import { Link } from "react-router-dom";

export interface InvestigationItem {
  id: number;
  value: string;
}

interface InvestigationListProps {
  value: InvestigationItem[];
  onChange: (val: InvestigationItem[]) => void;
}

const InvestigationList: React.FC<InvestigationListProps> = ({ value, onChange }) => {
  const handleAddInvestigation = () => {
    const newItem = { id: Date.now() + Math.random(), value: "" };
    const last = value[value.length - 1];
    onChange([...value.slice(0, -1), newItem, last]);
  };

  const handleRemoveInvestigation = (id: number) => {
    onChange(value.filter((item) => item.id !== id));
  };

  const handleChangeInvestigation = (id: number, newValue: string) => {
    onChange(
      value.map((item) => (item.id === id ? { ...item, value: newValue } : item))
    );
  };

  return (
    <>
      {value.map((item, index) => {
        const isLast = index === value.length - 1;
        return (
          <div className="mb-3 invest-list-item" key={item.id}>
            {index === 0 && (
              <label className="form-label mb-1 text-dark fs-14 fw-medium">
                Investigation &amp; Procedure
              </label>
            )}
            <div className="input-group">
              <input
                type="text"
                className="form-control rounded"
                value={item.value}
                onChange={(e) =>
                  handleChangeInvestigation(item.id, e.target.value)
                }
              />
              {!isLast && (
                <Link
                  to="#"
                  className="remove-invest ms-3 p-2 bg-light text-danger rounded d-flex align-items-center justify-content-center"
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemoveInvestigation(item.id);
                  }}
                >
                  <i className="ti ti-trash fs-16" />
                </Link>
              )}
              {isLast && (
                <Link
                  to="#"
                  className="add-invest ms-3 p-2 bg-light text-dark rounded d-flex align-items-center justify-content-center"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddInvestigation();
                  }}
                >
                  <i className="ti ti-plus fs-16" />
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default InvestigationList;
