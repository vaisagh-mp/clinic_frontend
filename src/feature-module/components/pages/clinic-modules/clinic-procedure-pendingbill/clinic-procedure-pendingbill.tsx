import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { all_routes } from "../../../../routes/all_routes";
import Header from "../../../../../core/common/header/header";
import Sidebarthree from "../../../../../core/common/sidebarthree/sidebarthree";

interface BillItemOption {
  value: number;
  label: string;
}

interface PaymentHistoryItem {
  id: number;
  bill_number: string;
  procedure_name: string;
  amount_paid: string;
  balance_due: number;
  notes: string;
  bill_item: number;
}

const ProcedurePaymentForm = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [billItems, setBillItems] = useState<BillItemOption[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([]);
  const [formData, setFormData] = useState({
    bill_item: "", // will store the selected bill_item ID as string
    amount_paid: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login-cover");
      return;
    }

    const fetchBillItems = async () => {
      try {
        const res = await axios.get(
          "http://3.109.62.26/api/billing/clinic/procedure-payments/",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("API response:", res.data);

        // Map procedure items for dropdown
        const procedureItems = res.data.results
          .filter((item: any) => item.bill_item && item.procedure_name)
          .map((item: any) => ({
            value: item.bill_item,
            label: `${item.bill_number} - ${item.procedure_name} (Balance: ${item.balance_due})`,
          }));

        setBillItems(procedureItems);

        // Set default selected bill_item if available
        if (procedureItems.length > 0) {
          setFormData((prev) => ({
            ...prev,
            bill_item: procedureItems[0].value.toString(),
          }));
        }

        // Set payment history
        setPaymentHistory(res.data.results);
      } catch (err) {
        console.error("Failed to fetch procedure bill items:", err);
      }
    };

    fetchBillItems();
  }, [navigate, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.bill_item) {
      alert("Please select a procedure bill item.");
      return;
    }
    if (!formData.amount_paid || Number(formData.amount_paid) <= 0) {
      alert("Please enter a valid amount paid.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "http://3.109.62.26/api/billing/clinic/procedure-payments/",
        {
          bill_item: Number(formData.bill_item),
          amount_paid: parseFloat(formData.amount_paid),
          notes: formData.notes,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Payment created successfully!");
      navigate(all_routes.clinicpatients);
    } catch (err) {
      console.error("Failed to create payment:", err);
      alert("Failed to create payment.");
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
          <div className="row justify-content-center">
            <div>
              {/* Payment History Section */}
              <div className="mb-4">
                <div className="mb-4">
                    <h6 className="fw-bold mb-0 d-flex align-items-center">
                <Link to={all_routes.clinicpatients} className="text-dark">
                    <i className="ti ti-chevron-left me-1" />Procedure Payment History
                </Link>
                </h6>
                
                </div>
                
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Bill Number</th>
                        <th>Procedure</th>
                        <th>Amount Paid</th>
                        <th>Balance Due</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentHistory.length > 0 ? (
                        paymentHistory.map((item) => (
                          <tr key={item.id}>
                            <td>{item.bill_number}</td>
                            <td>{item.procedure_name}</td>
                            <td>{item.amount_paid}</td>
                            <td>{item.balance_due}</td>
                            <td>{item.notes}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center">
                            No procedure payments available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment Form */}
              <div className="mb-4">
                <h6 className="fw-bold mb-0 d-flex align-items-center">
                  <Link to={all_routes.clinicpatients} className="text-dark">
                    <i className="ti ti-chevron-left me-1" /> Procedure Payments
                  </Link>
                </h6>
              </div>

              <div className="card">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label mb-1 fw-medium">
                        Procedure Bill Item <span className="text-danger ms-1">*</span>
                      </label>
                      <select
                        className="form-control"
                        value={formData.bill_item}
                        onChange={(e) =>
                          setFormData({ ...formData, bill_item: e.target.value })
                        }
                      >
                        {billItems.length > 0 ? (
                          billItems.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))
                        ) : (
                          <option value="">No procedure bills available</option>
                        )}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label mb-1 fw-medium">
                        Amount Paid <span className="text-danger ms-1">*</span>
                      </label>
                      <input
                        type="number"
                        min={0}
                        className="form-control"
                        value={formData.amount_paid}
                        onChange={(e) =>
                          setFormData({ ...formData, amount_paid: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label mb-1 fw-medium">Notes</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                      />
                    </div>

                    <div className="d-flex align-items-center justify-content-end mt-3">
                      <Link
                        to={all_routes.procedurePayments}
                        className="btn btn-light me-2"
                      >
                        Cancel
                      </Link>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={!formData.bill_item || loading}
                      >
                        {loading ? "Submitting..." : "Create Payment"}
                      </button>
                    </div>
                  </form>
                </div>
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

export default ProcedurePaymentForm;
