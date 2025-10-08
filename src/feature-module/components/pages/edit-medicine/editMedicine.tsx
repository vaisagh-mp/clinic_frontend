import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
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

const EditMedicine = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState<Medicine>({
    name: "",
    dosage: "",
    stock: 0,
    unit_price: "",
    expiry_date: "",
  });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      navigate("/login-cover");
      return;
    }

    const fetchMedicine = async () => {
      try {
        const res = await axios.get(`http://3.109.62.26/api/billing/medicines/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMedicine(res.data);
      } catch (error) {
        console.error("Error fetching medicine:", error);
        alert("Failed to fetch medicine details");
        navigate(all_routes.MedicineList);
      }
    };

    if (id) fetchMedicine();
  }, [id, token, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMedicine({ ...medicine, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`http://3.109.62.26/api/billing/medicines/${id}/`, medicine, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert("Medicine updated successfully!");
      navigate(all_routes.MedicineList);
    } catch (error: any) {
      console.error("Error updating medicine:", error.response?.data || error.message);
      alert(error.response?.data?.detail || error.message || "Failed to update medicine");
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

            {/* Edit Medicine Form */}
            <div className="card">
              <div className="card-body">
                <h5 className="offcanvas-title fs-18 fw-bold mb-3">Edit Medicine</h5>
                <form onSubmit={handleSubmit}>
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
                        onChange={handleChange}
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
                        onChange={handleChange}
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
                        onChange={handleChange}
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
                        onChange={handleChange}
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
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

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
                      {loading ? "Updating..." : "Update Medicine"}
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

export default EditMedicine;
