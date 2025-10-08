import  { useState } from "react";
import { Link } from "react-router";
import ImageWithBasePath from "../../../../core/imageWithBasePath";
import { TicketsListData } from "../../../../core/json/ticketsListData";
import FilterIndex from "../../../../core/common/filter/filterIndex";
import SearchInput from "../../../../core/common/dataTable/dataTableSearch";
import { all_routes } from "../../../routes/all_routes";
import Datatable from "../../../../core/common/dataTable";
import TicketsModal from "./modal/ticketsModal";

const TicketsList = () => {
  const data = TicketsListData;
  const columns = [
    {
      title: "Ticket ID",
      dataIndex: "TicketID",
      render: (text: any) => <Link to={all_routes.ticketDetails}>{text}</Link>,
      sorter: (a: any, b: any) => a.TicketID.length - b.TicketID.length,
    },
    {
      title: "Created By",
      dataIndex: "CreatedBy",
      render: (text: any, record: any) => (
        <div className="d-flex align-items-center">
          <Link to="#" className="avatar avatar-sm me-2">
            <ImageWithBasePath
              src={`assets/img/users/${record.Image}`}
              alt="product"
              className="rounded-circle"
            />
          </Link>
          <Link to="#" className="fw-medium">
            {text}
          </Link>
        </div>
      ),
      sorter: (a: any, b: any) => a.CreatedBy.length - b.CreatedBy.length,
    },
    {
      title: "Subject",
      dataIndex: "Subject",
      sorter: (a: any, b: any) => a.Subject.length - b.Subject.length,
    },
    {
      title: "Created Date",
      dataIndex: "CreatedDate",
      sorter: (a: any, b: any) => a.CreatedDate.length - b.CreatedDate.length,
    },
    {
      title: "Priority",
      dataIndex: "Priority",
      render: (text: any) => (
        <span className="badge border bg-white text-dark fw-medium">
          <i
            className={`ti ti-point-filled ${
              text === "Low"
                ? "text-success"
                : text === "High"
                ? "text-danger"
                : "text-warning"
            } me-1`}
          />
          {text}
        </span>
      ),
      sorter: (a: any, b: any) => a.Priority.length - b.Priority.length,
    },
    {
      title: "Assignee",
      dataIndex: "Assignee",
      sorter: (a: any, b: any) => a.Assignee.length - b.Assignee.length,
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (text: any) => (
        <span
          className={`badge fw-medium ${
            text === "Resolved"
              ? "bg-soft-success text-success"
              : text === "Inprogress"
              ? "bg-soft-warning text-warning"
              : text === "Open"
              ? "bg-soft-info text-info"
              : "bg-soft-danger text-danger"
          } border ${
            text === "Resolved"
              ? "border-success"
              : text === "Inprogress"
              ? "border-warning"
              : text === "Open"
              ? "border-info"
              : "border-danger"
          }`}
        >
          {text}
        </span>
      ),
      sorter: (a: any, b: any) => a.Status.length - b.Status.length,
    },
    {
      title: "",
      render: () => (
        <div className="action-item">
          <Link
            to="#"
            data-bs-toggle="dropdown"
            className="btn p-1 btn-white border"
          >
            <i className="ti ti-dots-vertical" />
          </Link>
          <ul className="dropdown-menu p-2">
            <li>
              <Link
                to="#"
                className="dropdown-item d-flex align-items-center"
                data-bs-toggle="modal"
                data-bs-target="#edit_tickets"
              >
                Edit
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="dropdown-item d-flex align-items-center"
                data-bs-toggle="modal"
                data-bs-target="#delete_tickets"
              >
                Delete
              </Link>
            </li>
          </ul>
        </div>
      ),
    },
  ];
  const [searchText, setSearchText] = useState<string>("");

  const handleSearch = (value: string) => {
    setSearchText(value);
  };
  return (
      <>
        {/* ========================
			Start Page Content
		========================= */}
        <div className="page-wrapper">
          {/* Start Content */}
          <div className="content">
            {/* Page Header */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 pb-3 mb-3 border-bottom">
              <div className="d-flex align-items-center">
                <h4 className="fw-bold mb-0 me-2">Tickets</h4>
                <span className="badge badge-soft-primary border pt-1 px-2 border-primary fw-medium">
                  Total Announcements : 582
                </span>
              </div>
              <div className="text-end">
                <Link
                  to="#"
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#add_tickets"
                >
                  <i className="ti ti-plus me-1" />
                  Add New Ticket
                </Link>
              </div>
            </div>
            {/* End Page Header */}
            <div className=" d-flex align-items-center justify-content-between flex-wrap row-gap-3">
              <div className="search-set mb-3">
                <div className="d-flex align-items-center flex-wrap gap-2">
                  <div className="table-search d-flex align-items-center mb-0">
                    <div className="search-input">
                      <SearchInput value={searchText} onChange={handleSearch} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex table-dropdown mb-3 pb-1 right-content align-items-center flex-wrap row-gap-3">
                <div className="dropdown me-2">
                  <Link
                    to="#"
                    className="dropdown-toggle btn bg-white btn-md d-inline-flex align-items-center fw-normal rounded border text-dark px-2 py-1 fs-14"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                  >
                    <i className="ti ti-filter me-2 fs-14" />
                    Filter
                  </Link>
                  <div
                    className="dropdown-menu dropdown-lg dropdown-menu-end filter-dropdown"
                    id="filter-dropdown"
                  >
                    <div className="d-flex align-items-center justify-content-between border-bottom filter-header">
                      <h4 className="fs-18 fw-bold">Filter</h4>
                      <div className="d-flex align-items-center">
                        <Link
                          to="#"
                          className="link-danger text-decoration-underline me-3"
                        >
                          Clear All
                        </Link>
                      </div>
                    </div>
                    <FilterIndex />
                  </div>
                </div>
                <div className="dropdown">
                  <Link
                    to="#"
                    className="dropdown-toggle btn bg-white btn-md d-inline-flex align-items-center fw-normal rounded border text-dark px-2 py-1 fs-14"
                    data-bs-toggle="dropdown"
                  >
                    <span className="me-1"> Sort By : </span> Recent
                  </Link>
                  <ul className="dropdown-menu  dropdown-menu-end p-2">
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Recent
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Oldest
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <Datatable
                columns={columns}
                dataSource={data}
                Selection={false}
                searchText={searchText}
              />
            </div>
          </div>
          {/* End Content */}
          {/* Footer Start */}
          <div className="footer text-center bg-white p-2 border-top">
            <p className="text-dark mb-0">
              2025 ©
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

        <TicketsModal />
      </>
  );
};

export default TicketsList;
