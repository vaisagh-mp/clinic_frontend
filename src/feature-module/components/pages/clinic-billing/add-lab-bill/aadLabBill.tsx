import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { all_routes } from "../../../../routes/all_routes";
import axios from "axios";
import Header from "../../../../../core/common/header/header";
import Sidebarthree from "../../../../../core/common/sidebarthree/sidebarthree";

interface Item {
  test_or_service: string;
  cost: number | string;
}

interface ClinicBill {
  clinic: number | "";
  lab_name: string;
  work_description: string;
  bill_date: string;
  status: string;
  items: Item[];
}

const AddLabBill = () => {
  const [formData, setFormData] = useState<ClinicBill>({
    clinic: "",
    lab_name: "",
    work_description: "",
    bill_date: "",
    status: "PENDING",
    items: [{ test_or_service: "", cost: "" }],
  });

  const [loading, setLoading] = useState(false);
  const [clinicLoading, setClinicLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch clinic ID for logged-in user
  useEffect(() => {
    const fetchClinic = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No access token found");

        const res = await axios.get(
          "http://3.109.62.26/api/admin-panel/clinics/",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        let clinicId: number | null = null;

        if (res.data?.id) clinicId = res.data.id;
        else if (Array.isArray(res.data) && res.data.length > 0) {
          clinicId = res.data[0].id;
        }

        if (!clinicId) throw new Error("Clinic not found for this user.");

        setFormData((prev) => ({ ...prev, clinic: clinicId }));
      } catch (err: any) {
        console.error("Error fetching clinic:", err.response?.data || err.message);
        alert("Failed to fetch clinic. Please try again.");
      } finally {
        setClinicLoading(false);
      }
    };

    fetchClinic();
  }, []);

  // ✅ Bill-level input change
  const handleBillChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Item input change
  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = [...formData.items];
    updated[index] = { ...updated[index], [name]: value };
    setFormData({ ...formData, items: updated });
  };

  // ✅ Add new item row
  const addItemRow = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { test_or_service: "", cost: "" }],
    });
  };

  // ✅ Remove item row
  const removeItemRow = (index: number) => {
    const updated = [...formData.items];
    updated.splice(index, 1);
    setFormData({ ...formData, items: updated });
  };

  // ✅ Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clinic) {
      alert("Clinic is not set. Please try again.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");

      await axios.post(
        "http://3.109.62.26/api/billing/clinic/lab-bill/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Clinic Bill added successfully!");
      navigate(all_routes.clinicpanellabbillList);
    } catch (error: any) {
      console.error("Error adding clinic bill:", error.response?.data || error.message);
      alert(
        JSON.stringify(error.response?.data, null, 2) ||
          error.message ||
          "Failed to add clinic bill"
      );
    } finally {
      setLoading(false);
    }
  };

  if (clinicLoading) return <p>Loading clinic details...</p>;

  return (
    <>
      <Header />
      <Sidebarthree />
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="d-flex align-items-sm-center flex-sm-row flex-column gap-2 mb-3">
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-0 d-flex align-items-center">
                    <Link to={all_routes.clinicpanellabbillList}> 
                      <i className="ti ti-chevron-left me-1 fs-14" />
                      Clinic Bills
                    </Link>
                  </h6>
                </div>
              </div>

              {/* Form */}
              <div className="card">
                <div className="card-body">
                  <h5 className="fs-18 fw-bold mb-3">Add Clinic Bill</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      {/* ✅ Lab Name */}
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">Lab Name *</label>
                        <input
                          type="text"
                          name="lab_name"
                          className="form-control"
                          value={formData.lab_name}
                          onChange={handleBillChange}
                          required
                        />
                      </div>

                      {/* Work Description */}
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">Work Description *</label>
                        <input
                          type="text"
                          name="work_description"
                          className="form-control"
                          value={formData.work_description}
                          onChange={handleBillChange}
                          required
                        />
                      </div>

                      {/* Bill Date */}
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">Bill Date *</label>
                        <input
                          type="date"
                          name="bill_date"
                          className="form-control"
                          value={formData.bill_date}
                          onChange={handleBillChange}
                          required
                        />
                      </div>

                      {/* Status */}
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">Status *</label>
                        <select
                          name="status"
                          className="form-select"
                          value={formData.status}
                          onChange={handleBillChange}
                          required
                        >
                          <option value="PENDING">Pending</option>
                          <option value="PAID">Paid</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* ✅ Items */}
                    <div className="border-bottom d-flex align-items-center justify-content-between pb-2 mb-3">
                      <h6 className="fw-bold">Items</h6>
                      <button
                        type="button"
                        className="btn btn-sm btn-success"
                        onClick={addItemRow}
                      >
                        + Add Item
                      </button>
                    </div>

                    {formData.items.map((item, index) => (
                      <div key={index} className="border p-3 mb-3 rounded bg-light">
                        <div className="d-flex justify-content-between mb-2">
                          <h6 className="fw-bold">Item {index + 1}</h6>
                          {formData.items.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => removeItemRow(index)}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="row">
                          <div className="col-lg-6 mb-3">
                            <label className="form-label">Test / Service *</label>
                            <input
                              type="text"
                              name="test_or_service"
                              className="form-control"
                              value={item.test_or_service}
                              onChange={(e) => handleItemChange(index, e)}
                              required
                            />
                          </div>
                          <div className="col-lg-6 mb-3">
                            <label className="form-label">Cost *</label>
                            <input
                              type="number"
                              name="cost"
                              className="form-control"
                              step="0.01"
                              value={item.cost}
                              onChange={(e) => handleItemChange(index, e)}
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
                        onClick={() => navigate(all_routes.clinicpanellabbillList)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading || !formData.clinic}
                      >
                        {loading ? "Saving..." : "Save Bill"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="footer text-center bg-white p-2 border-top">
            <p className="text-dark mb-0">
              2025 © <Link to="#" className="link-primary">Preclinic</Link>, All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddLabBill;
