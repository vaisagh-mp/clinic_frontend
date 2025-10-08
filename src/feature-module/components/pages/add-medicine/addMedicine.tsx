import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { all_routes } from "../../../routes/all_routes";
import axios from "axios";
import Header from "../../../../core/common/header/header";
import Sidebarthree from "../../../../core/common/sidebarthree/sidebarthree";

interface Medicine {
  name: string;
  dosage: string;
  stock: number;
  unit_price: string;
  expiry_date: string;
}

const AddMedicine = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([
    { name: "", dosage: "", stock: 0, unit_price: "", expiry_date: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input change for each medicine
  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updated = [...medicines];
    updated[index] = { ...updated[index], [name]: value };
    setMedicines(updated);
  };

  // Add a new medicine row
  const addMedicineRow = () => {
    setMedicines([
      ...medicines,
      { name: "", dosage: "", stock: 0, unit_price: "", expiry_date: "" },
    ]);
  };

  // Remove a medicine row
  const removeMedicineRow = (index: number) => {
    const updated = [...medicines];
    updated.splice(index, 1);
    setMedicines(updated);
  };

  // Submit all medicines (one by one)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");

      let successCount = 0;
      let failureCount = 0;

      // Loop through each medicine and send separately
      for (const med of medicines) {
        try {
          await axios.post(
            "http://3.109.62.26/api/billing/medicines/",
            med, // single dictionary
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          successCount++;
        } catch (err: any) {
          console.error("Error adding medicine:", err.response?.data || err.message);
          failureCount++;
        }
      }

      if (failureCount === 0) {
        alert("All medicines added successfully!");
      } else if (successCount > 0) {
        alert(
          `${successCount} medicines added successfully, ${failureCount} failed.`
        );
      } else {
        alert("Failed to add medicines.");
      }

      navigate(all_routes.MedicineList);
    } catch (error: any) {
      console.error("Error adding medicines:", error.response?.data || error.message);
      alert(error.response?.data?.detail || error.message || "Failed to add medicines");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Header />
    <Sidebarthree />
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="col-lg-10 mx-auto">
            {/* Page Header */}
            <div className="d-flex align-items-sm-center flex-sm-row flex-column gap-2 mb-3">
              <div className="flex-grow-1">
                <h6 className="fw-bold mb-0 d-flex align-items-center">
                  <Link to={all_routes.MedicineList}>
                    <i className="ti ti-chevron-left me-1 fs-14" />
                    Medicines
                  </Link>
                </h6>
              </div>
            </div>

            {/* Add Medicines Form */}
            <div className="card">
              <div className="card-body">
                <div className="border-bottom d-flex align-items-center justify-content-between pb-3 mb-3">
                  <h5 className="offcanvas-title fs-18 fw-bold">Add Medicines</h5>
                  <button
                    type="button"
                    className="btn btn-sm btn-success"
                    onClick={addMedicineRow}
                  >
                    + Add Medicine
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  {medicines.map((medicine, index) => (
                    <div key={index} className="border p-3 mb-3 rounded bg-light">
                      <div className="d-flex justify-content-between mb-2">
                        <h6 className="fw-bold">Medicine {index + 1}</h6>
                        {medicines.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => removeMedicineRow(index)}
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="row">
                        {/* Name */}
                        <div className="col-lg-4 mb-3">
                          <label className="form-label">
                            Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={medicine.name}
                            onChange={(e) => handleChange(index, e)}
                            required
                          />
                        </div>

                        {/* Dosage */}
                        <div className="col-lg-4 mb-3">
                          <label className="form-label">
                            Dosage <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="dosage"
                            className="form-control"
                            value={medicine.dosage}
                            onChange={(e) => handleChange(index, e)}
                            required
                          />
                        </div>

                        {/* Stock */}
                        <div className="col-lg-4 mb-3">
                          <label className="form-label">
                            Stock <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            name="stock"
                            className="form-control"
                            value={medicine.stock}
                            onChange={(e) => handleChange(index, e)}
                            required
                          />
                        </div>

                        {/* Unit Price */}
                        <div className="col-lg-4 mb-3">
                          <label className="form-label">
                            Unit Price <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            name="unit_price"
                            className="form-control"
                            step="0.01"
                            value={medicine.unit_price}
                            onChange={(e) => handleChange(index, e)}
                            required
                          />
                        </div>

                        {/* Expiry Date */}
                        <div className="col-lg-4 mb-3">
                          <label className="form-label">
                            Expiry Date <span className="text-danger">*</span>
                          </label>
                          <input
                            type="date"
                            name="expiry_date"
                            className="form-control"
                            value={medicine.expiry_date}
                            onChange={(e) => handleChange(index, e)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Buttons */}
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => navigate(all_routes.MedicineList)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? "Adding..." : "Save Medicines"}
                    </button>
                  </div>
                </form>
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
    </>
  );
};

export default AddMedicine;
