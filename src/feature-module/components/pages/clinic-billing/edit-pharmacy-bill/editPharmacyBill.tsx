import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { all_routes } from "../../../../routes/all_routes";
import axios from "axios";
import Header from "../../../../../core/common/header/header";
import Sidebarthree from "../../../../../core/common/sidebarthree/sidebarthree";

interface Item {
  item_type: string;
  medicine?: number | string | null;
  procedure?: number | string | null;
  quantity: number;
  unit_price?: number;
  procedure_payments?: { amount_paid: number; notes: string }[];
}

interface Patient {
  id: number;
  first_name: string;
  last_name?: string;
}

interface Medicine {
  id: number;
  name: string;
  unit_price: string;
}

interface Procedure {
  id: number;
  name: string;
  price: number;
}

interface FormData {
  patient_id: string;
  bill_date: string;
  status: string;
  items: Item[];
}

const EditPharmacyBill = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    patient_id: "",
    bill_date: "",
    status: "PENDING",
    items: [{ item_type: "", medicine: null, procedure: null, quantity: 1, procedure_payments: [] }],
  });

  const [patients, setPatients] = useState<Patient[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(false);

  // Fetch Patients, Medicines, Procedures
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No access token found");

        setLoadingPatients(true);
        const [patientRes, medRes, procRes] = await Promise.all([
          axios.get("http://3.109.62.26/api/clinic/patients/", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://3.109.62.26/api/billing/medicines/", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://3.109.62.26/api/billing/procedures/", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setPatients(patientRes.data.results || patientRes.data);
        setMedicines(medRes.data);
        setProcedures(procRes.data);
      } catch (err: any) {
        console.error("Error fetching data:", err.response?.data || err.message);
      } finally {
        setLoadingPatients(false);
      }
    };
    fetchData();
  }, []);

  // Fetch existing bill
  useEffect(() => {
    if (!id || medicines.length === 0 || procedures.length === 0 || patients.length === 0) return;

    const fetchBill = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No access token found");

        const res = await axios.get(`http://3.109.62.26/api/billing/clinic/pharmacy-bill/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const bill = res.data;
        const patientObj = patients.find((p) => `${p.first_name} ${p.last_name || ""}`.trim() === bill.patient.name);

        const mappedItems: Item[] = bill.items.map((item: any) => {
          if (item.item_type === "MEDICINE") {
            const medObj = medicines.find(
              (m) =>
                m.name.toLowerCase().trim() ===
                (typeof item.medicine === "string" ? item.medicine.toLowerCase().trim() : "")
            );
            return {
              item_type: "MEDICINE",
              medicine: medObj ? medObj.id : item.medicine,
              procedure: null,
              quantity: item.quantity || 1,
              unit_price: item.unit_price ? Number(item.unit_price) : 0,
            };
          } else if (item.item_type === "PROCEDURE") {
            const procObj = procedures.find(
              (p) =>
                p.name.toLowerCase().trim() ===
                (typeof item.procedure === "string" ? item.procedure.toLowerCase().trim() : "")
            );
            return {
              item_type: "PROCEDURE",
              procedure: procObj ? procObj.id : item.procedure,
              medicine: null,
              quantity: item.quantity || 1,
              unit_price: item.unit_price ? Number(item.unit_price) : 0,
              procedure_payments: [
                {
                  amount_paid: item.total_paid || 0,
                  notes: "", // If API has notes, replace here
                },
              ],
            };
          } else {
            return { item_type: "", medicine: null, procedure: null, quantity: 1, procedure_payments: [] };
          }
        });

        setFormData({
          patient_id: patientObj?.id?.toString() || "",
          bill_date: bill.bill_date,
          status: bill.status,
          items:
            mappedItems.length > 0
              ? mappedItems
              : [{ item_type: "", medicine: null, procedure: null, quantity: 1, procedure_payments: [] }],
        });
      } catch (err: any) {
        console.error("Error fetching bill:", err.response?.data || err.message);
      }
    };

    fetchBill();
  }, [id, medicines, procedures, patients]);

  // Subtotal calculation
  const calculateSubtotal = (item: Item) => {
    if (item.item_type === "MEDICINE") {
      if (typeof item.medicine === "number") {
        const med = medicines.find((m) => m.id === item.medicine);
        return med ? Number(med.unit_price) * item.quantity : item.unit_price || 0;
      }
      return item.unit_price || 0;
    }
    if (item.item_type === "PROCEDURE") {
      if (typeof item.procedure === "number") {
        const proc = procedures.find((p) => p.id === item.procedure);
        return proc ? Number(proc.price) * item.quantity : item.unit_price || 0;
      }
      return item.unit_price || 0;
    }
    return 0;
  };

  // Handlers
  const handleBillChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updated = [...formData.items];
    updated[index] = {
      ...updated[index],
      [name]:
        name === "quantity" ? Number(value) : name === "medicine" || name === "procedure" ? Number(value) || value : value,
    };
    if (name === "item_type") {
      updated[index].medicine = null;
      updated[index].procedure = null;
      updated[index].procedure_payments = [];
    }
    setFormData({ ...formData, items: updated });
  };

  const addItemRow = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { item_type: "", medicine: null, procedure: null, quantity: 1, procedure_payments: [] }],
    });
  };

  const removeItemRow = (index: number) => {
    const updated = [...formData.items];
    updated.splice(index, 1);
    setFormData({ ...formData, items: updated });
  };

  const handleProcedurePaymentChange = (itemIndex: number, paymentIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    if (!updatedItems[itemIndex].procedure_payments) updatedItems[itemIndex].procedure_payments = [];
    updatedItems[itemIndex].procedure_payments![paymentIndex] = {
      ...updatedItems[itemIndex].procedure_payments![paymentIndex],
      [name]: name === "amount_paid" ? Number(value) : value,
    };
    setFormData({ ...formData, items: updatedItems });
  };

  const addProcedurePayment = (itemIndex: number) => {
    const updatedItems = [...formData.items];
    if (!updatedItems[itemIndex].procedure_payments) updatedItems[itemIndex].procedure_payments = [];
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

    for (const item of formData.items) {
      if (item.item_type === "PROCEDURE") {
        if (!item.procedure_payments || item.procedure_payments.length === 0) {
          alert("Each procedure must have at least one payment.");
          return;
        }
        for (const payment of item.procedure_payments) {
          if (payment.amount_paid === null || payment.amount_paid === undefined || payment.amount_paid <= 0) {
            alert("Please enter a valid Amount Paid for all procedure payments.");
            return;
          }
        }
      }
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");

      const payload = {
        ...formData,
        items: formData.items.map((item) => ({
          item_type: item.item_type,
          medicine_id: item.item_type === "MEDICINE" ? item.medicine : null,
          procedure_id: item.item_type === "PROCEDURE" ? item.procedure : null,
          quantity: item.quantity,
          unit_price: item.unit_price || 0,
          procedure_payments: item.procedure_payments || [],
        })),
      };

      await axios.put(
        `http://3.109.62.26/api/billing/clinic/pharmacy-bill/${id}/`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate(all_routes.clinicpharmacybillList);
    } catch (err: any) {
      console.error("Error updating bill:", err.response?.data || err.message);
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
              <div className="d-flex align-items-sm-center flex-sm-row flex-column gap-2 mb-3">
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-0 d-flex align-items-center">
                    <Link to={all_routes.clinicpharmacybillList}>
                      <i className="ti ti-chevron-left me-1 fs-14" />
                      Pharmacy Bills
                    </Link>
                  </h6>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <h5 className="offcanvas-title fs-18 fw-bold mb-3">Edit Pharmacy Bill</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">Patient *</label>
                        <select
                          name="patient_id"
                          className="form-select"
                          value={formData.patient_id}
                          onChange={handleBillChange}
                          required
                        >
                          <option value="">Select Patient</option>
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

                    {formData.items.map((item, index) => (
                      <div key={index} className="border p-3 mb-3 rounded bg-light">
                        <div className="d-flex justify-content-between mb-2">
                          <h6 className="fw-bold">Item {index + 1}</h6>
                          {formData.items.length > 1 && (
                            <button type="button" className="btn btn-sm btn-danger" onClick={() => removeItemRow(index)}>
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
                                {item.item_type === "PROCEDURE" ? "Select Procedure" : "Select Medicine"}
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
                            <input type="number" className="form-control" value={calculateSubtotal(item)} readOnly />
                          </div>
                        </div>

                        {item.item_type === "PROCEDURE" && item.procedure && (
                          <div className="border p-2 mb-3 rounded bg-light">
                            <h6 className="fw-bold">Procedure Payments</h6>
                            {item.procedure_payments?.map((payment, pIndex) => (
                              <div key={pIndex} className="d-flex gap-2 align-items-end mb-2">
                                <div className="col">
                                  <label className="form-label">Amount Paid *</label>
                                  <input
                                    type="number"
                                    name="amount_paid"
                                    className="form-control"
                                    value={payment.amount_paid}
                                    min={0}
                                    required
                                    onChange={(e) => handleProcedurePaymentChange(index, pIndex, e)}
                                  />
                                </div>
                                <div className="col">
                                  <label className="form-label">Notes</label>
                                  <input
                                    type="text"
                                    name="notes"
                                    className="form-control"
                                    value={payment.notes}
                                    onChange={(e) => handleProcedurePaymentChange(index, pIndex, e)}
                                  />
                                </div>
                                <div>
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={() => removeProcedurePayment(index, pIndex)}
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                            <button type="button" className="btn btn-success btn-sm mt-1" onClick={() => addProcedurePayment(index)}>
                              + Add Payment
                            </button>
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="d-flex justify-content-end gap-2">
                      <button type="button" className="btn btn-light" onClick={() => navigate(all_routes.clinicpharmacybillList)}>
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
        </div>
      </div>
    </>
  );
};

export default EditPharmacyBill;
