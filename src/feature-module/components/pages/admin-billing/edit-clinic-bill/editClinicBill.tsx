import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { all_routes } from "../../../../routes/all_routes";
import axios from "axios";
import Header from "../../../../../core/common/header/header";
import Sidebar from "../../../../../core/common/sidebar/sidebarAdmin";

interface Item {
  item_name: string;
  quantity: number;
  unit_price: number | string;
}

interface Clinic {
  id: number;
  name: string;
}

interface ClinicBill {
  clinic: number | "";
  vendor_name: string;
  bill_date: string;
  status: string;
  items: Item[];
}

const EditClinicBill = () => {
  const { id } = useParams(); // bill ID from route
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [formData, setFormData] = useState<ClinicBill>({
    clinic: "",
    vendor_name: "",
    bill_date: "",
    status: "PENDING",
    items: [{ item_name: "", quantity: 0, unit_price: "" }],
  });

  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Check authentication
  useEffect(() => {
    if (!token) {
      navigate("/login-cover");
    }
  }, [token, navigate]);

  // ✅ Fetch clinics
  useEffect(() => {
    if (!token) return;

    const fetchClinics = async () => {
      try {
        const res = await axios.get("http://3.109.62.26/api/admin-panel/clinics/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClinics(res.data.results || res.data);
      } catch (err: any) {
        console.error("Error fetching clinics:", err.response?.data || err.message);
      }
    };
    fetchClinics();
  }, [token]);

  // ✅ Fetch bill data for editing
  useEffect(() => {
    if (!id || !token) return;

    const fetchBill = async () => {
      try {
        const res = await axios.get(
          `http://3.109.62.26/api/billing/admin/clinic-bill/${id}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFormData(res.data);
      } catch (error: any) {
        console.error("Error fetching bill:", error.response?.data || error.message);
      }
    };
    fetchBill();
  }, [id, token]);

  // Handle bill-level changes
  const handleBillChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle item change
  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = [...formData.items];
    updated[index] = { ...updated[index], [name]: value };
    setFormData({ ...formData, items: updated });
  };

  // Add item row
  const addItemRow = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { item_name: "", quantity: 0, unit_price: "" }],
    });
  };

  // Remove item row
  const removeItemRow = (index: number) => {
    const updated = [...formData.items];
    updated.splice(index, 1);
    setFormData({ ...formData, items: updated });
  };

  // Save (PUT if edit, POST if new)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!token) throw new Error("No access token found");

      if (id) {
        // update bill
        await axios.put(
          `http://3.109.62.26/api/billing/admin/clinic-bill/${id}/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        alert("Clinic bill updated successfully!");
      } else {
        // create new bill
        await axios.post(
          "http://3.109.62.26/api/billing/admin/clinic-bill/",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        alert("Clinic bill added successfully!");
      }

      navigate(all_routes.clinicbillList);
    } catch (error: any) {
      console.error("Error saving bill:", error.response?.data || error.message);
      alert(error.response?.data?.detail || error.message || "Failed to save bill");
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
                  <Link to={all_routes.clinicbillList}>
                    <i className="ti ti-chevron-left me-1 fs-14" />
                    Clinic Bills
                  </Link>
                </h6>
              </div>
            </div>

            {/* Form */}
            <div className="card">
              <div className="card-body">
                <h5 className="offcanvas-title fs-18 fw-bold mb-3">
                  {id ? "Edit Clinic Bill" : "Add Clinic Bill"}
                </h5>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    {/* Clinic Selection */}
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

                    {/* Vendor */}
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Vendor Name *</label>
                      <input
                        type="text"
                        name="vendor_name"
                        className="form-control"
                        value={formData.vendor_name}
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

                  {/* Items */}
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
                        <div className="col-lg-4 mb-3">
                          <label className="form-label">Item Name *</label>
                          <input
                            type="text"
                            name="item_name"
                            className="form-control"
                            value={item.item_name}
                            onChange={(e) => handleItemChange(index, e)}
                            required
                          />
                        </div>
                        <div className="col-lg-4 mb-3">
                          <label className="form-label">Quantity *</label>
                          <input
                            type="number"
                            name="quantity"
                            className="form-control"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, e)}
                            required
                          />
                        </div>
                        <div className="col-lg-4 mb-3">
                          <label className="form-label">Unit Price *</label>
                          <input
                            type="number"
                            name="unit_price"
                            className="form-control"
                            step="0.01"
                            value={item.unit_price}
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
                      onClick={() => navigate(all_routes.clinicbillList)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? "Saving..." : id ? "Update Bill" : "Save Bill"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default EditClinicBill;
