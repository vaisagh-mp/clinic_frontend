import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { all_routes } from "../../../../routes/all_routes";
import axios from "axios";
import Header from "../../../../../core/common/header/header";
import Sidebar from "../../../../../core/common/sidebar/sidebarAdmin";

interface ProcedurePayment {
  amount_paid: number;
  notes: string;
}

interface Item {
  item_type: string;
  medicine: number | null;
  procedure: number | null;
  quantity: number;
  procedure_payments: ProcedurePayment[];
  subtotal?: number;
}

interface Clinic {
  id: number;
  name: string;
}

interface Patient {
  id: number;
  first_name: string;
  last_name?: string;
  clinic: number;
}

interface Medicine {
  id: number;
  name: string;
}

interface Procedure {
  id: number;
  name: string;
}

const AddPharmacyBill = () => {
  const [formData, setFormData] = useState<{
  clinic_id: string;
  patient_id: string;
  bill_date: string;
  status: string;
  items: Item[];
}>({
  clinic_id: "",
  patient_id: "",
  bill_date: "",
  status: "PENDING",
  items: [
    {
      item_type: "",
      medicine: null,
      procedure: null,
      quantity: 1,
      procedure_payments: [],
    },
  ],
});

  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No access token found");

        const [clinicRes, medRes, procRes, patientRes] = await Promise.all([
          axios.get("http://3.109.62.26/api/admin-panel/clinics/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://3.109.62.26/api/billing/medicines/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://3.109.62.26/api/billing/procedures/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://3.109.62.26/api/admin-panel/patients/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setClinics(clinicRes.data);
        setMedicines(medRes.data);
        setProcedures(procRes.data);
        setAllPatients(patientRes.data);
      } catch (err: any) {
        console.error("Error fetching data:", err.response?.data || err.message);
      }
    };
    fetchData();
  }, []);

  // Filter patients by clinic
  useEffect(() => {
    if (!formData.clinic_id) {
      setPatients([]);
      setFormData((prev) => ({ ...prev, patient_id: "" }));
      return;
    }

    setLoadingPatients(true);
    const filtered = allPatients.filter(
      (p) => p.clinic.toString() === formData.clinic_id.toString()
    );
    setPatients(filtered);
    setFormData((prev) => ({ ...prev, patient_id: "" }));
    setLoadingPatients(false);
  }, [formData.clinic_id, allPatients]);

  const calculateSubtotal = (item: Item) => {
  if (item.item_type === "MEDICINE" && item.medicine) {
    const med = medicines.find((m) => m.id === item.medicine);
    return med ? (med as any).unit_price * item.quantity : 0; // adjust field name if different
  }
  if (item.item_type === "PROCEDURE" && item.procedure) {
    const proc = procedures.find((p) => p.id === item.procedure);
    return proc ? (proc as any).price * item.quantity : 0; // adjust field name if different
  }
  return 0;
};


  // Input Handlers
  const handleBillChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = [...formData.items];

    updated[index] = {
      ...updated[index],
      [name]:
        name === "quantity"
          ? Number(value)
          : name === "medicine" || name === "procedure"
          ? Number(value)
          : value,
    };

    if (name === "item_type") {
      updated[index].medicine = null;
      updated[index].procedure = null;
      updated[index].procedure_payments = [];
    }

    setFormData({ ...formData, items: updated });
  };

  // Add/remove item
  const addItemRow = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { item_type: "", medicine: null, procedure: null, quantity: 1, procedure_payments: [] },
      ],
    });
  };

  const removeItemRow = (index: number) => {
    const updated = [...formData.items];
    updated.splice(index, 1);
    setFormData({ ...formData, items: updated });
  };

  // Procedure Payments handlers
  const handleProcedurePaymentChange = (
    itemIndex: number,
    paymentIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];

    if (!updatedItems[itemIndex].procedure_payments) {
      updatedItems[itemIndex].procedure_payments = [];
    }

    updatedItems[itemIndex].procedure_payments![paymentIndex] = {
      ...updatedItems[itemIndex].procedure_payments![paymentIndex],
      [name]: name === "amount_paid" ? Number(value) : value,
    };

    setFormData({ ...formData, items: updatedItems });
  };

  const addProcedurePayment = (itemIndex: number) => {
    const updatedItems = [...formData.items];
    if (!updatedItems[itemIndex].procedure_payments) {
      updatedItems[itemIndex].procedure_payments = [];
    }
    updatedItems[itemIndex].procedure_payments!.push({ amount_paid: 0, notes: "" });
    setFormData({ ...formData, items: updatedItems });
  };

  const removeProcedurePayment = (itemIndex: number, paymentIndex: number) => {
    const updatedItems = [...formData.items];
    updatedItems[itemIndex].procedure_payments!.splice(paymentIndex, 1);
    setFormData({ ...formData, items: updatedItems });
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");

      const cleanedItems = formData.items.map((item) => {
        const base = { item_type: item.item_type, quantity: item.quantity };

        if (item.item_type === "PROCEDURE") {
          return {
            ...base,
            procedure: item.procedure,
            procedure_id: item.procedure,
            procedure_payments: item.procedure_payments || [],
          };
        }

        return { ...base, medicine: item.medicine, medicine_id: item.medicine };
      });

      const payload = { ...formData, items: cleanedItems };

      await axios.post("http://3.109.62.26/api/billing/admin/pharmacy-bill/", payload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      alert("Pharmacy Bill added successfully!");
      navigate(all_routes.pharmacybillList);
    } catch (err: any) {
      console.error("Error adding pharmacy bill:", err.response?.data || err.message);
      alert(err.response?.data?.detail || "Failed to add bill");
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
          <div className="col-lg-10 mx-auto">
            <h5 className="fw-bold mb-3 d-flex align-items-center">
              <Link to={all_routes.pharmacybillList}>
                <i className="ti ti-chevron-left me-1 fs-14" />
                Pharmacy Bills
              </Link>
            </h5>

            <div className="card">
              <div className="card-body">
                <h5 className="offcanvas-title fs-18 fw-bold mb-3">Add Pharmacy Bill</h5>

                <form onSubmit={handleSubmit}>
                  {/* Clinic, Patient, Bill Date, Status */}
                  <div className="row">
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Clinic *</label>
                      <select
                        name="clinic_id"
                        className="form-select"
                        value={formData.clinic_id}
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

                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Patient *</label>
                      <select
                        name="patient_id"
                        className="form-select"
                        value={formData.patient_id}
                        onChange={handleBillChange}
                        required
                        disabled={!formData.clinic_id || loadingPatients}
                      >
                        <option value="">
                          {loadingPatients ? "Loading..." : "Select Patient"}
                        </option>
                        {patients.map((p) => (
                          <option key={p.id} value={p.id}>
                            {`${p.first_name} ${p.last_name || ""}`.trim()}
                          </option>
                        ))}
                      </select>
                    </div>

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
                        <div className="col-lg-3 mb-3">
                          <label className="form-label">Item Type *</label>
                          <select
                            name="item_type"
                            className="form-select"
                            value={item.item_type}
                            onChange={(e) => handleItemChange(index, e)}
                            required
                          >
                            <option value="">Select Type</option>
                            <option value="MEDICINE">Medicine</option>
                            <option value="PROCEDURE">Procedure</option>
                          </select>
                        </div>

                        <div className="col-lg-3 mb-3">
                          <label className="form-label">
                            {item.item_type === "PROCEDURE" ? "Procedure" : "Medicine"} *
                          </label>
                          <select
                            name={item.item_type === "PROCEDURE" ? "procedure" : "medicine"}
                            className="form-select"
                            value={item.item_type === "PROCEDURE" ? item.procedure || "" : item.medicine || ""}
                            onChange={(e) => handleItemChange(index, e)}
                            required
                            disabled={!item.item_type}
                          >
                            <option value="">
                              {item.item_type === "PROCEDURE"
                                ? "Select Procedure"
                                : "Select Medicine"}
                            </option>
                            {(item.item_type === "PROCEDURE" ? procedures : medicines).map((opt) => (
                              <option key={opt.id} value={opt.id}>
                                {opt.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-lg-3 mb-3">
                          <label className="form-label">Quantity *</label>
                          <input
                            type="number"
                            name="quantity"
                            className="form-control"
                            value={item.quantity}
                            min={1}
                            onChange={(e) => handleItemChange(index, e)}
                            required
                          />
                        </div>

                        <div className="col-lg-3 mb-3">
                          <label className="form-label">Subtotal</label>
                          <input
                            type="number"
                            className="form-control"
                            value={calculateSubtotal(item)}
                            readOnly
                          />
                        </div>

                      </div>
                            
                      {/* ✅ Procedure Payments Section */}
                      {item.item_type === "PROCEDURE" && item.procedure && (
                        <div className="border p-2 mb-3 rounded bg-white">
                          <h6 className="fw-bold">Procedure Payments</h6>
                          {item.procedure_payments?.map((payment, pIndex) => (
                            <div key={pIndex} className="d-flex gap-2 align-items-end mb-2">
                              <div className="col">
                                <label className="form-label">Amount Paid</label>
                                <input
                                  type="number"
                                  name="amount_paid"
                                  className="form-control"
                                  value={payment.amount_paid}
                                  min={0}
                                  onChange={(e) =>
                                    handleProcedurePaymentChange(index, pIndex, e)
                                  }
                                />
                              </div>
                              <div className="col">
                                <label className="form-label">Notes</label>
                                <input
                                  type="text"
                                  name="notes"
                                  className="form-control"
                                  value={payment.notes}
                                  onChange={(e) =>
                                    handleProcedurePaymentChange(index, pIndex, e)
                                  }
                                />
                              </div>
                              <div>
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm"
                                  onClick={() =>
                                    removeProcedurePayment(index, pIndex)
                                  }
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                          <button
                            type="button"
                            className="btn btn-success btn-sm mt-1"
                            onClick={() => addProcedurePayment(index)}
                          >
                            + Add Payment
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Footer Buttons */}
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => navigate(all_routes.pharmacybillList)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? "Saving..." : "Save Bill"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="footer text-center bg-white p-2 border-top">
          <p className="text-dark mb-0">
            2025 © <Link to="#" className="link-primary">Preclinic</Link>, All Rights Reserved
          </p>
        </div>
      </div>
    </>
  );
};

export default AddPharmacyBill;
