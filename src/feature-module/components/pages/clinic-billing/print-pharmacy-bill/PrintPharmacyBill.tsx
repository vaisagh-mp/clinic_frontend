import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface BillItem {
  name?: string;
  medicine_name?: string;
  procedure_name?: string;
  item_type?: string;
  quantity?: number;
  unit_price?: number | string;
  subtotal?: number | string;
}

interface BillData {
  bill_number?: string;
  bill_date?: string;
  status?: string;
  clinic?: { name?: string; address?: string };
  patient?: { name?: string; address?: string };
  items?: BillItem[];
  total_in_words?: string;
}

const PrintPharmacyBill = () => {
  const { billId } = useParams();
  const [billData, setBillData] = useState<BillData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get(
          `http://3.109.62.26/api/billing/clinic/pharmacy-bill/${billId}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Bill fetched:", res.data);
        setBillData(res.data);
      } catch (err) {
        console.error("Error fetching bill:", err);
        setError("Failed to fetch bill data.");
      } finally {
        setLoading(false);
      }
    };
    fetchBill();
  }, [billId]);

  const handlePrint = () => window.print();

  if (loading) return <p>Loading bill...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!billData) return <p>No bill data found.</p>;

  return (
    <div className="invoice-page bg-white p-4">
      {/* Print Button */}
      <div className="text-end mb-3 d-print-none">
        <button onClick={handlePrint} className="btn btn-primary">
          <i className="ti ti-printer me-1"></i> Print
        </button>
      </div>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
        <div className="d-flex align-items-center gap-2">
          <img
            src="/assets/img/logo.svg"
            alt="Preclinic Logo"
            width="140"
            style={{ objectFit: "contain" }}
          />
        </div>
        <span
          className={`badge ${
            billData.status === "PAID"
              ? "bg-success"
              : billData.status === "CANCELLED"
              ? "bg-danger"
              : "bg-warning text-dark"
          } fs-6 px-3 py-2`}
        >
          {billData.status || "PENDING"}
        </span>
      </div>

      {/* Invoice Info */}
      <div className="row mb-4">
        <div className="col-md-6">
          <h6 className="fw-bold">Invoice Details</h6>
          <p className="mb-1">
            <strong>Bill Number:</strong> {billData.bill_number || "-"}
          </p>
          <p className="mb-1">
            <strong>Bill Date:</strong> {billData.bill_date || "-"}
          </p>
          <p className="mb-1">
            <strong>Clinic:</strong> {billData.clinic?.name || "-"}
          </p>
        </div>

        <div className="col-md-3">
          <h6 className="fw-bold">Invoice From</h6>
          <p className="mb-1">{billData.clinic?.name || "-"}</p>
          <p className="text-muted small mb-0">{billData.clinic?.address || "-"}</p>
        </div>

        <div className="col-md-3 text-end">
          <h6 className="fw-bold">Invoice To</h6>
          <p className="mb-1">{billData.patient?.name || "-"}</p>
          <p className="text-muted small mb-0">{billData.patient?.address || "-"}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-4">
        <h6 className="fw-bold mb-2">Items</h6>
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>SL.NO</th>
              <th>Item Name</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {billData.items?.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.name || item.medicine_name || item.procedure_name || "Unnamed Item"}</td>
                <td>{item.item_type || "-"}</td>
                <td>{item.quantity ?? 0}</td>
                <td>₹{Number(item.unit_price ?? 0).toFixed(2)}</td>
                <td>₹{Number(item.subtotal ?? 0).toFixed(2)}</td>
              </tr>
            )) || (
              <tr>
                <td colSpan={6} className="text-center">
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="row justify-content-end">
        <div className="col-md-4">
          <p className="mb-0 fw-semibold">
            Total in words:
            <br />
            <span className="text-muted">{billData.total_in_words || "-"}</span>
          </p>
        </div>
      </div>

      {/* Notes */}
      <div className="mt-4">
        <h6 className="fw-bold">Terms and Conditions</h6>
        <p className="text-muted small">The payment must be returned in the same condition.</p>

        <h6 className="fw-bold mt-3">Notes</h6>
        <p className="text-muted small">All charges are final and include applicable taxes, fees, and additional costs.</p>
      </div>

      {/* Print Styles */}
      <style>
        {`
          @media print {
            body {
              -webkit-print-color-adjust: exact;
            }
            .btn, .d-print-none {
              display: none !important;
            }
            .invoice-page {
              padding: 0;
              margin: 0;
            }
          }
          .table td, .table th {
            vertical-align: middle;
          }
        `}
      </style>
    </div>
  );
};

export default PrintPharmacyBill;
