import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { all_routes } from "../../../../routes/all_routes";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Header from "../../../../../core/common/header/header";
import Sidebar from "../../../../../core/common/sidebar/sidebarAdmin";
import Sidebarthree from "../../../../../core/common/sidebarthree/sidebarthree";

const ViewClinicBill = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [bill, setBill] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch bill and handle auth
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login-cover");
      return;
    }

    const fetchBill = async () => {
      try {
        const response = await axios.get(
          `http://3.109.62.26/api/billing/clinic/clinic-bill/${id}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBill(response.data);
      } catch (error: any) {
        console.error("Error fetching bill:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("access_token");
          navigate("/login-cover");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBill();
  }, [id, navigate]);

  if (loading) return <p>Loading bill details...</p>;
  if (!bill) return <p>No bill data found.</p>;

  const { clinic, vendor_name, bill_number, bill_date, status, items } = bill;

  // Download XLS function with bold headers and frozen top row
  const downloadXLS = () => {
    if (!bill) return;

    const data = items.map((item) => ({
      "Bill Number": bill_number,
      "Bill Date": new Date(bill_date).toLocaleDateString(),
      Vendor: vendor_name,
      Clinic: bill.clinic_name || "N/A",
      "Item Name": item.item_name,
      Quantity: item.quantity,
      "Unit Price": item.unit_price,
      Total: item.quantity * item.unit_price,
    }));

    const ws = XLSX.utils.json_to_sheet(data, {
      header: [
        "Bill Number",
        "Bill Date",
        "Vendor",
        "Clinic",
        "Item Name",
        "Quantity",
        "Unit Price",
        "Total",
      ],
    });

    // Make header bold
    const range = XLSX.utils.decode_range(ws["!ref"]!);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell = ws[XLSX.utils.encode_cell({ r: 0, c: C })];
      if (cell) cell.s = { font: { bold: true } };
    }

    // Freeze header row
    ws["!freeze"] = { xSplit: 0, ySplit: 1 };

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Clinic Bill");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `Clinic_Bill_${bill_number}.xlsx`);
  };

  return (
    <>
      <Header />
      <Sidebarthree />
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              {/* Header */}
              <div className="d-flex align-items-sm-center flex-sm-row flex-column mb-4">
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-0 d-flex align-items-center">
                    <Link to={all_routes.clinicpanelclinicbillList} className="me-1">
                      <i className="ti ti-chevron-left" /> Clinic Bills
                    </Link>
                  </h6>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  {/* Bill Header */}
                  <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                    <h5 className="fw-bold">Clinic Bill</h5>
                    <span
                      className={`badge 
                        ${status === "PENDING" ? "bg-warning-subtle text-warning" : ""} 
                        ${status === "PAID" ? "bg-success-subtle text-success" : ""} 
                        ${status === "CANCELLED" ? "bg-danger-subtle text-danger" : ""} 
                        fs-13 fw-medium border py-1 px-2`}
                    >
                      {status}
                    </span>
                  </div>

                  {/* Bill Details */}
                  <div className="mb-4">
                    <h6 className="mb-2 fs-14 fw-medium">Bill Details</h6>
                    <div className="px-3 py-2 bg-light rounded">
                      <p className="mb-1">
                        <strong>Bill Number:</strong> {bill_number}
                      </p>
                      <p className="mb-1">
                        <strong>Bill Date:</strong>{" "}
                        {new Date(bill_date).toLocaleDateString()}
                      </p>
                      <p className="mb-1">
                        <strong>Vendor:</strong> {vendor_name}
                      </p>
                      <p className="mb-0">
                        <strong>Clinic:</strong> {bill.clinic_name || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="mb-4">
                    <h6 className="mb-3 fs-16 fw-semibold text-center">Items</h6>
                    <div className="table-responsive border bg-white">
                      <table className="table table-nowrap">
                        <thead className="table-light">
                          <tr>
                            <th>SNO</th>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items && items.length > 0 ? (
                            items.map((item: any, index: number) => (
                              <tr key={index}>
                                <td>{(index + 1).toString().padStart(2, "0")}</td>
                                <td>{item.item_name}</td>
                                <td>{item.quantity}</td>
                                <td>{item.unit_price}</td>
                                <td>{(item.quantity * item.unit_price).toFixed(2)}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="text-center">
                                No items found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Download Button */}
                  <div className="text-center d-flex align-items-center justify-content-center gap-2">
                    <button
                      onClick={downloadXLS}
                      className="btn btn-md btn-primary d-flex align-items-center"
                    >
                      <i className="ti ti-download me-1" /> Download XLS
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-top text-center">
          <p className="text-dark text-center">
            2025 © <span className="text-info">Preclinic</span>, All Rights Reserved
          </p>
        </div>
      </div>
    </>
  );
};

export default ViewClinicBill;
