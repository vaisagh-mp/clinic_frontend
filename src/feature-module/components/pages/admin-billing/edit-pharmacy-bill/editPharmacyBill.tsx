import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { all_routes } from "../../../../routes/all_routes";
import axios from "axios";
import Header from "../../../../../core/common/header/header";
import Sidebar from "../../../../../core/common/sidebar/sidebarAdmin";

interface Item {
  item_type: string;
  medicine?: number | null;
  procedure?: number | null;
  quantity: number;
  procedure_payments?: { amount_paid: number; notes: string }[];
}

interface Clinic {
  id: number;
  name: string;
}

interface Patient {
  id: number;
  first_name: string;
  last_name?: string;
}

interface Medicine {
  id: number;
  name: string;
}

interface Procedure {
  id: number;
  name: string;
}


interface FormData {
  clinic_id: string;
  patient_id: string;
  bill_date: string;
  status: string;
  items: Item[];
}

const EditPharmacyBill = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
  clinic_id: "",
  patient_id: "",
  bill_date: "",
  status: "PENDING",
  items: [{ item_type: "", medicine: null, procedure: null, quantity: 1 }],
});

  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch Clinics, Medicines, Procedures
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No access token found");

        const [clinicRes, medRes, procRes] = await Promise.all([
          axios.get("http://3.109.62.26/api/admin-panel/clinics/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://3.109.62.26/api/billing/medicines/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://3.109.62.26/api/billing/procedures/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setClinics(clinicRes.data);
        setMedicines(medRes.data);
        setProcedures(procRes.data);
      } catch (err: any) {
        console.error("Error fetching data:", err.response?.data || err.message);
      }
    };
    fetchData();
  }, []);

  // Fetch Patients by Clinic
  useEffect(() => {
    const fetchPatients = async () => {
      if (!formData.clinic_id) {
        setPatients([]);
        setFormData((prev) => ({ ...prev, patient_id: "" }));
        return;
      }

      setLoadingPatients(true);
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get(
          `http://3.109.62.26/api/admin-panel/patients/?clinic=${formData.clinic_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPatients(res.data);
      } catch (err: any) {
        console.error("Error fetching patients:", err.response?.data || err.message);
      } finally {
        setLoadingPatients(false);
      }
    };
    fetchPatients();
  }, [formData.clinic_id]);

  // Fetch existing pharmacy bill AFTER medicines/procedures are loaded
  useEffect(() => {
    if (!id || medicines.length === 0 || procedures.length === 0) return;

    const fetchBill = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No access token found");

        const res = await axios.get(
          `http://3.109.62.26/api/billing/admin/pharmacy-bill/${id}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const bill = res.data;

        // Map clinic name to ID
        const clinicObj = clinics.find((c) => c.name === bill.clinic);
        const clinic_id = clinicObj?.id?.toString() || "";

        // Fetch patients for this clinic
        let patientList: Patient[] = [];
        if (clinic_id) {
          setLoadingPatients(true);
          const patientRes = await axios.get(
            `http://3.109.62.26/api/admin-panel/patients/?clinic=${clinic_id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          patientList = patientRes.data;
          setPatients(patientList);
          setLoadingPatients(false);
        }

        // Map patient name to ID
        const patientObj = patientList.find(
          (p) => `${p.first_name} ${p.last_name || ""}`.trim() === bill.patient
        );

        // Map items robustly
        const mappedItems: Item[] = bill.items.map((item: any) => {
          if (item.item_type === "MEDICINE") {
            const medRaw = item.medicine;
            let medId: number | null = null;
          
            if (typeof medRaw === "string") {
              const medObj = medicines.find(
                (m) => m.name.toLowerCase().trim() === medRaw.toLowerCase().trim()
              );
              medId = medObj ? medObj.id : null;
            } else if (typeof medRaw === "number") {
              medId = medRaw;
            }
          
            return {
              item_type: "MEDICINE",
              medicine: medId,
              procedure: null,
              quantity: item.quantity || 1,
              procedure_payments: [], // No payments for medicine
            };
          } else if (item.item_type === "PROCEDURE") {
            const procRaw = item.procedure;
            let procId: number | null = null;
          
            if (typeof procRaw === "string") {
              const procObj = procedures.find(
                (p) => p.name.toLowerCase().trim() === procRaw.toLowerCase().trim()
              );
              procId = procObj ? procObj.id : null;
            } else if (typeof procRaw === "number") {
              procId = procRaw;
            }
          
            // 🟢 Include existing payments if available
            const existingPayments =
              item.procedure_payments?.map((p: any) => ({
                amount_paid: p.amount_paid || 0,
                notes: p.notes || "",
              })) ||
              (item.total_paid
                ? [{ amount_paid: item.total_paid, notes: "" }]
                : []);
              
            return {
              item_type: "PROCEDURE",
              procedure: procId,
              medicine: null,
              quantity: item.quantity || 1,
              procedure_payments: existingPayments,
            };
          } else {
            return { item_type: "", medicine: null, procedure: null, quantity: 1, procedure_payments: [] };
          }
        });


        setFormData({
          clinic_id,
          patient_id: patientObj?.id?.toString() || "",
          bill_date: bill.bill_date,
          status: bill.status,
          items: mappedItems.length > 0 ? mappedItems : [{ item_type: "", medicine: null, procedure: null, quantity: 1 }],
        });
      } catch (err: any) {
        console.error("Error fetching bill:", err.response?.data || err.message);
      }
    };

    fetchBill();
  }, [id, medicines, procedures, clinics]);

  // Handle form field changes
  const handleBillChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle item changes
  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    }

    setFormData({ ...formData, items: updated });
  };

  const addItemRow = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { item_type: "", medicine: null, procedure: null, quantity: 1 }],
    });
  };

  const removeItemRow = (index: number) => {
    const updated = [...formData.items];
    updated.splice(index, 1);
    setFormData({ ...formData, items: updated });
  };

  // --- Procedure Payment Handlers ---

  const handleProcedurePaymentChange = (
    itemIndex: number,
    paymentIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    if (!updatedItems[itemIndex].procedure_payments)
      updatedItems[itemIndex].procedure_payments = [];
    updatedItems[itemIndex].procedure_payments![paymentIndex] = {
      ...updatedItems[itemIndex].procedure_payments![paymentIndex],
      [name]: name === "amount_paid" ? Number(value) : value,
    };
    setFormData({ ...formData, items: updatedItems });
  };

  const addProcedurePayment = (itemIndex: number) => {
    const updatedItems = [...formData.items];
    if (!updatedItems[itemIndex].procedure_payments)
      updatedItems[itemIndex].procedure_payments = [];
    updatedItems[itemIndex].procedure_payments!.push({
      amount_paid: 0,
      notes: "",
    });
    setFormData({ ...formData, items: updatedItems });
  };

  const removeProcedurePayment = (itemIndex: number, paymentIndex: number) => {
    const updatedItems = [...formData.items];
    updatedItems[itemIndex].procedure_payments!.splice(paymentIndex, 1);
    setFormData({ ...formData, items: updatedItems });
  };


  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");

      const cleanedItems = formData.items.map((item) => {
        if (item.item_type === "PROCEDURE") {
          return {
            item_type: "PROCEDURE",
            procedure_id: item.procedure,
            quantity: item.quantity,
            procedure_payments: item.procedure_payments || [],
          };
        }
        return {
          item_type: "MEDICINE",
          medicine_id: item.medicine,
          quantity: item.quantity,
        };
      });

      const payload = { ...formData, items: cleanedItems };

      await axios.put(
        `http://3.109.62.26/api/billing/admin/pharmacy-bill/${id}/`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        }
      );

      alert("Pharmacy Bill updated successfully!");
      navigate(all_routes.pharmacybillList);
    } catch (err: any) {
      console.error("Error updating pharmacy bill:", err.response?.data || err.message);
      alert(err.response?.data?.detail || "Failed to update bill");
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
              <div className="d-flex align-items-sm-center flex-sm-row flex-column gap-2 mb-3">
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-0 d-flex align-items-center">
                    <Link to={all_routes.pharmacybillList}>
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
                      {/* Clinic */}
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
                            <option key={clinic.id} value={clinic.id.toString()}>
                              {clinic.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Patient */}
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
                            <option key={p.id} value={p.id.toString()}>
                              {`${p.first_name} ${p.last_name || ""}`.trim()}
                            </option>
                          ))}
                        </select>
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
                      <h6 className="fw-bold">Items</h6>
                      <button type="button" className="btn btn-sm btn-success" onClick={addItemRow}>
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
                          {/* Item Type */}
                          <div className="col-lg-4 mb-3">
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

                          {/* Medicine or Procedure */}
                          <div className="col-lg-4 mb-3">
                            <label className="form-label">
                              {item.item_type === "PROCEDURE" ? "Procedure" : "Medicine"} *
                            </label>
                            <select
                              name={item.item_type === "PROCEDURE" ? "procedure" : "medicine"}
                              className="form-select"
                              value={
                                item.item_type === "PROCEDURE"
                                  ? item.procedure?.toString() || ""
                                  : item.medicine?.toString() || ""
                              }
                              onChange={(e) => handleItemChange(index, e)}
                              required
                              disabled={!item.item_type}
                            >
                              <option value="">
                                {item.item_type === "PROCEDURE" ? "Select Procedure" : "Select Medicine"}
                              </option>
                              {(item.item_type === "PROCEDURE" ? procedures : medicines).map((opt) => (
                                <option key={opt.id} value={opt.id.toString()}>
                                  {opt.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Quantity */}
                          <div className="col-lg-4 mb-3">
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
                      </div>
                    ))}

                    {/* Buttons */}
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => navigate(all_routes.pharmacybillList)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? "Saving..." : "Update Bill"}
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
            2025 © <Link to="#" className="link-primary">Preclinic</Link>, All Rights Reserved
          </p>
        </div>
      </div>
    </>
  );
};

export default EditPharmacyBill;
