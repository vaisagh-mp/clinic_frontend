import { Link, useNavigate, useParams } from "react-router-dom";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { all_routes } from "../../../../routes/all_routes";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Header from "../../../../../core/common/header/header";
import Sidebarthree from "../../../../../core/common/sidebarthree/sidebarthree";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Patient {
  name: string;
  dob: string;
  gender: string;
  address: string;
}

interface BillItem {
  id: number;
  item_type: string;
  medicine?: string | null;
  procedure?: string | null;
  quantity: number;
  unit_price: string; // string from API
  subtotal: string;   // string from API
}

interface BillData {
  id: number;
  bill_number: string;
  clinic: string;
  patient: Patient;
  bill_date: string;
  status: string;
  total_amount: string; // string from API
  doctor_name: string;
  items: BillItem[];
}

const ViewPharmacyBill = () => {
  const [billData, setBillData] = useState<BillData | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Preclinic - Medical & Hospital "; // Clean title
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login-cover");
      return;
    }

    const fetchBill = async () => {
      try {
        const response = await axios.get(
          `http://3.109.62.26/api/billing/clinic/pharmacy-bill/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBillData(response.data);
      } catch (error) {
        console.error("Failed to fetch bill data:", error);
      }
    };

    fetchBill();
  }, [id, navigate]);

  if (!billData) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  const downloadXLS = () => {
    const data = billData.items.map((item) => ({
      "Bill Number": billData.bill_number,
      "Bill Date": new Date(billData.bill_date).toLocaleDateString(),
      Clinic: billData.clinic,
      Patient: billData.patient.name,
      "Item Name": item.medicine || item.procedure || "N/A",
      "Item Type": item.item_type,
      Quantity: item.quantity,
      "Unit Price": item.unit_price,
      Total: item.subtotal,
    }));

    const ws = XLSX.utils.json_to_sheet(data, {
      header: [
        "Bill Number",
        "Bill Date",
        "Clinic",
        "Patient",
        "Item Name",
        "Item Type",
        "Quantity",
        "Unit Price",
        "Total",
      ],
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pharmacy Bill");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `Pharmacy_Bill_${billData.bill_number}.xlsx`);
  };





const printBill = async () => {
  if (!printRef.current || !billData) return;

  // Hide elements with class "no-print"
  const elementsToHide = Array.from(printRef.current.querySelectorAll<HTMLElement>(".no-print"));
  elementsToHide.forEach(el => el.style.setProperty("display", "none", "important"));

  // Temporarily expand the bill container to full width for PDF
  const originalWidth = printRef.current.style.width;
  printRef.current.style.width = "210mm"; // full A4 width

  // Wait a tick to ensure DOM updates
  await new Promise((resolve) => setTimeout(resolve, 50));

  // Capture the bill
  const canvas = await html2canvas(printRef.current, { scale: 2, useCORS: true });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(`Pharmacy_Bill_${billData.bill_number}.pdf`);

  // Restore original state
  printRef.current.style.width = originalWidth;
  elementsToHide.forEach(el => el.style.removeProperty("display"));
};




  return (
    <>
      <Header />
      <Sidebarthree />
      <div className="page-wrapper" ref={printRef}>
        <div></div>
        <div className="content">
          <div className="row m-auto justify-content-center">
            <div className="col-lg-10">
              {/* Header */}
              <div className="d-flex align-items-sm-center flex-sm-row flex-column gap-2 mb-3">
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-0 d-flex align-items-center">
                    
                    <Link to={all_routes.clinicpharmacybillList}>
                      <i className="ti ti-chevron-left me-1 fs-14" />
                      Invoices
                    </Link>
                  </h6>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  {/* Logo & Status */}
                  <div className="d-flex align-items-center justify-content-between border-1 border-bottom pb-3 mb-3">
                    <ImageWithBasePath src="assets/img/logo.svg" alt="" />
                    <span
                      className={`
                        badge 
                        ${billData.status === "PENDING" ? "bg-warning-subtle text-warning" : ""} 
                        ${billData.status === "PAID" ? "bg-success-subtle text-success" : ""} 
                        ${billData.status === "CANCELLED" ? "bg-danger-subtle text-danger" : ""} 
                        fs-13 fw-medium border py-1 px-2
                      `}
                    >
                      {billData.status}
                    </span>
                  </div>

                  {/* Invoice Info Table */}
                 <div className="table-responsive mb-4">
  <table className="table align-middle mb-0" style={{ border: "none" }}>
    <thead>
      <tr>
        <th className="fw-bold fs-16 border-0 bg-transparent">Invoice Details</th>
        <th className="fw-bold fs-16 border-0 bg-transparent text-end">Patient Details</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        {/* Left column: Invoice / Clinic / Doctor */}
        <td className="border-0">
          <p className="mb-1 text-body">
            Bill Number: <span className="text-dark fw-medium">{billData.bill_number}</span>
          </p>
          <p className="mb-1 text-body">
            Bill Date: <span className="text-dark fw-medium">{billData.bill_date}</span>
          </p>
          <p className="mb-0 text-body">
            Clinic: <span className="text-dark fw-medium">{billData.clinic}</span>
          </p>
          <p className="mb-0 text-body">
            Doctor: <span className="text-dark fw-medium">{billData.doctor_name}</span>
          </p>
        </td>

        {/* Right column: Patient */}
        <td className="border-0 text-end">
          <p className="mb-0 text-body">
            Patient: <span className="text-dark fw-medium">{billData.patient.name}</span>
          </p>
          <p className="mb-0 text-body">
            Gender: <span className="text-dark fw-medium">{billData.patient.gender}</span>
          </p>
          <p className="mb-0 text-body">
            Age: <span className="text-dark fw-medium">{new Date().getFullYear() - new Date(billData.patient.dob).getFullYear()}</span>
          </p>
          <p className="mb-0 text-body">{billData.patient.address}</p>
        </td>
      </tr>
    </tbody>
  </table>
</div>


                  {/* Items Table */}
                  <div className="mb-4">
                    <h6 className="mb-3 fs-16 fw-bold">Items</h6>
                    <div className="table-responsive border bg-white">
                      <table className="table table-nowrap">
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
                          {billData.items.map((item, idx) => (
                            <tr key={idx}>
                              <td>{idx + 1}</td>
                              <td>{item.medicine || item.procedure}</td>
                              <td>{item.item_type}</td>
                              <td>{item.quantity}</td>
                              <td>₹{parseFloat(item.unit_price).toFixed(2)}</td>
                              <td>₹{parseFloat(item.subtotal).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Amount Summary */}
                  <div className="row pb-3 mb-3 border-1 border-bottom">
                    <div className="col-lg-6"></div>
                    <div className="col-lg-6">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <h6 className="fs-14 fw-medium text-body">Amount</h6>
                        <h6 className="fs-14 fw-semibold text-dark">₹{parseFloat(billData.total_amount).toFixed(2)}</h6>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <h6 className="fs-14 fw-medium text-body">CGST (5%)</h6>
                        <h6 className="fs-14 fw-semibold text-dark">₹0.00</h6>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <h6 className="fs-14 fw-medium text-body">SGST (5%)</h6>
                        <h6 className="fs-14 fw-semibold text-dark">₹0.00</h6>
                      </div>
                      <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                        <h6 className="fs-14 fw-medium text-body">Discount</h6>
                        <h6 className="fs-14 fw-semibold text-danger">₹0.00</h6>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <h6 className="fs-18 ">Total (INR)</h6>
                        <h6 className="fs-18 ">₹{parseFloat(billData.total_amount).toFixed(2)}</h6>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="text-center d-flex align-items-center justify-content-center gap-2 no-print">
                    <button
                      onClick={printBill}
                      className="btn btn-md btn-dark d-flex align-items-center  "
                    >
                      <i className="ti ti-printer me-1" /> Print
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer (hidden on print) */}
        <div className="footer text-center bg-white p-2 border-top no-print">
          <p className="text-dark mb-0">
            2025 © <Link to="#" className="link-primary">Preclinic</Link>, All Rights Reserved
          </p>
        </div>
      </div>

      {/* Print CSS */}
      <style>
        {`
          @media print {
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default ViewPharmacyBill;
