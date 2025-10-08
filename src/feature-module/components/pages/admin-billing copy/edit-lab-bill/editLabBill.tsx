import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { all_routes } from "../../../../routes/all_routes";
import axios from "axios";
import Header from "../../../../../core/common/header/header";
import Sidebar from "../../../../../core/common/sidebar/sidebarAdmin";

interface Item {
  test_or_service: string;
  cost: number | string;
}

interface Clinic {
  id: number;
  name: string;
}

interface LabBill {
  clinic: number | "";
  lab_name: string;
  work_description: string;
  bill_date: string;
  status: string;
  items: Item[];
}

const EditLabBill = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LabBill>({
    clinic: "",
    lab_name: "",
    work_description: "",
    bill_date: "",
    status: "PENDING",
    items: [{ test_or_service: "", cost: "" }],
  });

  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch clinics
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No access token found");

        const res = await axios.get("http://3.109.62.26/api/admin-panel/clinics/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClinics(res.data);
      } catch (err: any) {
        console.error("Error fetching clinics:", err.response?.data || err.message);
      }
    };
    fetchClinics();
  }, []);

  // Fetch existing bill data
  useEffect(() => {
    const fetchBill = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No access token found");

        const res = await axios.get(`http://3.109.62.26/api/billing/admin/lab-bill/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFormData({
          clinic: res.data.clinic,
          lab_name: res.data.lab_name,
          work_description: res.data.work_description,
          bill_date: res.data.bill_date,
          status: res.data.status,
          items: res.data.items.length > 0 ? res.data.items : [{ test_or_service: "", cost: "" }],
        });
      } catch (err: any) {
        console.error("Error fetching bill:", err.response?.data || err.message);
      }
    };

    if (id) fetchBill();
  }, [id]);

  // Bill-level field change
  const handleBillChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Item field change
  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = [...formData.items];
    updated[index] = { ...updated[index], [name]: value };
    setFormData({ ...formData, items: updated });
  };

  // Add new item row
  const addItemRow = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { test_or_service: "", cost: "" }],
    });
  };

  // Remove item row
  const removeItemRow = (index: number) => {
    const updated = [...formData.items];
    updated.splice(index, 1);
    setFormData({ ...formData, items: updated });
  };

  // Submit form (update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");

      await axios.put(
        `http://3.109.62.26/api/billing/admin/lab-bill/${id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Lab Bill updated successfully!");
      navigate(all_routes.labbillList);
    } catch (error: any) {
      console.error("Error updating lab bill:", error.response?.data || error.message);
      alert(error.response?.data?.detail || error.message || "Failed to update lab bill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Header />
    <Sidebar />
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="col-lg-10 mx-auto">
            {/* Header */}
            <div className="d-flex align-items-sm-center flex-sm-row flex-column gap-2 mb-3">
              <div className="flex-grow-1">
                <h6 className="fw-bold mb-0 d-flex align-items-center">
                  <Link to={all_routes.labbillList}>
                    <i className="ti ti-chevron-left me-1 fs-14" />
                    Lab Bills
                  </Link>
                </h6>
              </div>
            </div>

            {/* Form */}
            <div className="card">
              <div className="card-body">
                <h5 className="offcanvas-title fs-18 fw-bold mb-3">
                  Edit Lab Bill
                </h5>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    {/* Clinic */}
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Clinic *</label>
                      <select
                        name="clinic"
                        className="form-select"
                        value={formData.clinic}
                        onChange={handleBillChange}
                        required
                      >
                        <option value="">Select Clinic</option>
                        {clinics.map((clinic) => (
                          <option key={clinic.id} value={clinic.id}>
                            {clinic.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Lab Name */}
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

                  {/* Items Section */}
                  <div className="border-bottom d-flex align-items-center justify-content-between pb-2 mb-3">
                    <h6 className="fw-bold">Services</h6>
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
                          <label className="form-label">Service *</label>
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

                  {/* Form Buttons */}
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => navigate(all_routes.labbillList)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? "Updating..." : "Update Bill"}
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

export default EditLabBill;
