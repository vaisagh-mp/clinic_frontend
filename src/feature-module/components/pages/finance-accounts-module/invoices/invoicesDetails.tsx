
import { Link } from "react-router";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { all_routes } from "../../../../routes/all_routes";

const InvoicesDetails = () => {
  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Content */}
        <div className="content">
          {/* start row */}
          <div className="row m-auto justify-content-center">
            <div className="col-lg-10">
              {/* Start Page Header */}
              <div className="d-flex align-items-sm-center flex-sm-row flex-column gap-2 mb-3">
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-0 d-flex align-items-center">
                    <Link to={all_routes.invoices} className="">
                      <i className="ti ti-chevron-left me-1 fs-14" />
                      Invoices
                    </Link>
                  </h6>
                </div>
              </div>
              {/* End Page Header */}
              <div className="card">
                <div className="card-body">
                  {/* Items */}
                  <div className="d-flex align-items-center justify-content-between border-1 border-bottom pb-3 mb-3">
                    <ImageWithBasePath src="assets/img/logo.svg" alt="" />
                    <span className="badge bg-danger text-white">
                      {" "}
                      Due in 8 days{" "}
                    </span>
                  </div>
                  {/* start row */}
                  <div className="row pb-3 border-1 border-bottom mb-4">
                    <div className="col-lg-4">
                      <h5 className="mb-2 fs-16 fw-bold"> Invoice Details </h5>
                      <p className="text-body mb-1">
                        {" "}
                        Bill Number:{" "}
                        <span className="text-dark"> PB-00001</span>{" "}
                      </p>
                      <p className="text-body mb-1">
                        {" "}
                        Bill Date: :{" "}
                        <span className="text-dark"> 10/2/2025</span>{" "}
                      </p>
                      <p className="text-body mb-1">
                        {" "}
                        Clinic :{" "}
                        <span className="text-dark"> clinic2</span>{" "}
                      </p>

                    </div>{" "}
                    {/* end col */}
                    <div className="col-lg-4">
                      <h5 className="mb-2 fs-16 fw-bold"> Invoice Fromm </h5>
                      <p className="text-dark fw-medium mb-1">
                        {" "}
                        Clinic2
                      </p>
                      <p className="text-body mb-1 pe-5">
                        <span className="text-body">
                          5754 Airport Rd Coosada, AL, 36020 United States
                        </span>
                      </p>
                    </div>{" "}
                    {/* end col */}
                    <div className="col-lg-4 text-lg-end">
                      {/* patient name and address */}
                      <h5 className="mb-2 fs-16 fw-bold"> Invoice To </h5>
                      <p className="text-dark fw-medium mb-1">
                        {" "}
                        Andrew Fletcher{" "}
                      </p>
                      <p className="m-0 ps-5">
                        299 Star Trek Drive, Florida, 3240, United States
                      </p>
                    </div>{" "}
                    {/* end col */}
                  </div>
                  {/* end row */}
                  {/* Items */}
                  <div className="mb-4">
                    <h6 className="mb-3 fs-16 fw-bold">
                      {" "}
                       Items{" "}
                    </h6>
                    <div className="">
                      {/* Table List */}
                      <div className="table-responsive border bg-white">
                        <table className="table table-nowrap">
                          <thead className="table-light">
                            <tr>
                              <th>SL.NO</th>
                              <th>Item Name</th>
                              <th>Type</th>
                              <th> Quantity</th>
                              <th> Unit Price</th>
                              <th> Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>1</td>
                              <td>Full body checkup</td>
                              <td>
                                Complete health screening covering all major
                                systems
                              </td>
                              <td> ₹400 </td>
                              <td> 1 </td>
                              <td> ₹400 </td>
                            </tr>
                            <tr>
                              <td>2</td>
                              <td>Blood Test </td>
                              <td>
                                Routine blood analysis to assess overall health
                                status{" "}
                              </td>
                              <td> ₹250</td>
                              <td> 1 </td>
                              <td> ₹250 </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      {/* /Table List */}
                    </div>
                  </div>
                  {/* etart row */}
                  <div className="row pb-3 mb-3 border-1 border-bottom">
                    <div className="col-lg-6">
                      {/* <div className="">
                        <h6 className="mb-2 fs-16 fw-bold"> Bank Details</h6>
                        <p className="text-body mb-1">
                          Bank Name :{" "}
                          <span className="text-dark"> ABC Bank </span>{" "}
                        </p>
                        <p className="text-body mb-1">
                          Account Number :{" "}
                          <span className="text-dark"> 782459739212 </span>{" "}
                        </p>
                        <p className="text-body mb-1">
                          IFSC Code :{" "}
                          <span className="text-dark"> ABC0001345 </span>{" "}
                        </p>
                        <p className="text-body mb-1">
                          Payment Reference :{" "}
                          <span className="text-dark"> INV-20250220-001 </span>{" "}
                        </p>
                      </div> */}
                    </div>{" "}
                    {/* end col */}
                    <div className="col-lg-6">
                      <div className="">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <h6 className="fs-14 fw-medium text-body">Amount</h6>
                          <h6 className="fs-14 fw-semibold text-dark">₹650</h6>
                        </div>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <h6 className="fs-14 fw-medium text-body">
                            CGST (5%)
                          </h6>
                          <h6 className="fs-14 fw-semibold text-dark">₹18</h6>
                        </div>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <h6 className="fs-14 fw-medium text-body">
                            SGST (5%)
                          </h6>
                          <h6 className="fs-14 fw-semibold text-dark">₹18</h6>
                        </div>
                        <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                          <h6 className="fs-14 fw-medium text-body">
                            Discount
                          </h6>
                          <h6 className="fs-14 fw-semibold text-danger">
                            -₹36
                          </h6>
                        </div>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <h6 className="fs-18 fw-bold">Total (USD)</h6>
                          <h6 className="fs-18 fw-bold">₹650</h6>
                        </div>
                        <div>
                          <h6 className="fs-14 text-body mb-1">
                            Total in words
                          </h6>
                          <p className="fw-semibold text-dark">
                            Dollar Six Hundread Fifty
                          </p>
                        </div>
                      </div>
                    </div>{" "}
                    {/* end col */}
                  </div>
                  {/* end row */}
                  {/* Items */}
                  <div className="pb-3 mb-3 border-1 border-bottom d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div>
                      <div className=" mb-3">
                        <h6 className="mb-1 fs-14 fw-semibold">
                          {" "}
                          Terms and Conditions{" "}
                        </h6>
                        <p>
                          {" "}
                          The Payment must be returned in the same condition.{" "}
                        </p>
                      </div>
                      <div className="">
                        <h6 className="mb-1 fs-14 fw-semibold"> Notes </h6>
                        <p>
                          {" "}
                          All charges are final and include applicable taxes,
                          fees, and additional costs.
                        </p>
                      </div>
                    </div>
                    
                  </div>
                  <div className="text-center d-flex align-items-center justify-content-center">
                    <Link
                      to=""
                      className="btn btn-md btn-dark me-2 d-flex align-items-center"
                    >
                      {" "}
                      <i className="ti ti-printer me-1" /> Print
                    </Link>
                    <Link
                      to=""
                      className="btn btn-md btn-primary d-flex align-items-center"
                    >
                      {" "}
                      <i className="ti ti-download me-1" /> Download
                    </Link>
                  </div>
                </div>{" "}
                {/* end card-body */}
              </div>{" "}
              {/* end card */}
            </div>{" "}
            {/* end col */}
          </div>
          {/* end row */}
        </div>
        {/* End Content */}
        {/* Footer Start */}
        <div className="footer text-center bg-white p-2 border-top">
          <p className="text-dark mb-0">
            2025 ©{" "}
            <Link to="#" className="link-primary">
              Preclinic
            </Link>
            , All Rights Reserved
          </p>
        </div>
        {/* Footer End */}
      </div>
      {/* ========================
			End Page Content
		========================= */}
    </>
  );
};

export default InvoicesDetails;
