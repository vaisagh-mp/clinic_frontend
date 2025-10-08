import { Link } from "react-router";
import Modals from "./modals/modals";
import { useState } from "react";
import SearchInput from "../../../../../core/common/dataTable/dataTableSearch";
import Datatable from "../../../../../core/common/dataTable";
import { ServiceListData } from "../../../../../core/json/servicesData";
import { Department, Service_Name, StatusActive } from "../../../../../core/common/selectOption";
import { Select } from "antd";
import Slider from "rc-slider";

const Services = () => {
  const data = ServiceListData;
  const columns = [
    {
      title: "Service Name",
      dataIndex: "ServiceName",
      sorter: (a: any, b: any) => a.ServiceName.length - b.ServiceName.length,
    },
    {
      title: "Department",
      dataIndex: "Department",
      sorter: (a: any, b: any) => a.Department.length - b.Department.length,
    },
    {
      title: "Price",
      dataIndex: "Price",
      sorter: (a: any, b: any) => a.Price.length - b.Price.length,
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (text: string) => (
        <span
          className={`badge ${
            text === "Active"
              ? "badge-soft-success border-success"
              : "badge-soft-danger border-danger"
          }  border  px-2 py-1 fs-13 fw-medium`}
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
          <Link to="#" data-bs-toggle="dropdown">
            <i className="ti ti-dots-vertical" />
          </Link>
          <ul className="dropdown-menu p-2">
            <li>
              <Link
                to="#"
                className="dropdown-item d-flex align-items-center"
                data-bs-toggle="modal"
                data-bs-target="#edit_service"
              >
                Edit
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="dropdown-item d-flex align-items-center"
                data-bs-toggle="modal"
                data-bs-target="#delete_service"
              >
                Delete
              </Link>
            </li>
          </ul>
        </div>
      ),
      sorter: (a: any, b: any) => a.Status.length - b.Status.length,
    },
  ];
  const [searchText, setSearchText] = useState<string>("");

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const [sliderValueDefault, setSliderValueDefault] = useState(0);
   const handleChangeDefault = (value: any) => {
    setSliderValueDefault(value);
  };

  return (
    <>
      <>
        {/* ========================
			Start Page Content
		========================= */}
        <div className="page-wrapper">
          {/* Start Content */}
          <div className="content">
            {/* Start Page Header */}
            <div className="d-flex align-items-sm-center flex-sm-row flex-column gap-2 mb-3 pb-3 border-bottom">
              <div className="flex-grow-1">
                <h4 className="fw-bold mb-0">
                  Services
                  <span className="badge badge-soft-primary border border-primary fs-13 fw-medium ms-2">
                    Total Services : 565
                  </span>
                </h4>
              </div>
              <div className="text-end d-flex">
                {/* dropdown*/}
                <div className="dropdown me-1">
                  <Link
                    to="#"
                    className="btn btn-md fs-14 fw-normal border bg-white rounded text-dark d-inline-flex align-items-center"
                    data-bs-toggle="dropdown"
                  >
                    Export
                    <i className="ti ti-chevron-down ms-2" />
                  </Link>
                  <ul className="dropdown-menu p-2">
                    <li>
                      <Link className="dropdown-item" to="#">
                        Download as PDF
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="#">
                        Download as Excel
                      </Link>
                    </li>
                  </ul>
                </div>
                <Link
                  to="#"
                  className="btn btn-primary ms-2 fs-13 btn-md"
                  data-bs-toggle="modal"
                  data-bs-target="#add_service"
                >
                  <i className="ti ti-plus me-1" />
                  New Services
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
                    className="btn btn-white bg-white fs-14 py-1 border d-inline-flex text-dark align-items-center"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                  >
                    <i className="ti ti-filter text-gray-5 me-1" />
                    Filters
                  </Link>
                  <div
                    className="dropdown-menu dropdown-lg dropdown-menu-end filter-dropdown p-0"
                    id="filter-dropdown"
                  >
                    <div className="d-flex align-items-center justify-content-between border-bottom filter-header">
                      <h5 className="mb-0 fw-bold">Filter</h5>
                      <div className="d-flex align-items-center">
                        <Link
                          to="#"
                          className="link-danger text-decoration-underline"
                        >
                          Clear All
                        </Link>
                      </div>
                    </div>
                    <form action="#">
                      <div className="filter-body pb-0">
                        <div className="mb-3">
                          <div className="d-flex align-items-center justify-content-between">
                            <label className="form-label">Service Name</label>
                            <a
                              href="#"
                              className="link-primary mb-1"
                            >
                              Reset
                            </a>
                          </div>
                           <Select
                          mode="multiple"
                          allowClear
                          style={{ width: "100%" }}
                          placeholder="Please select"
                          defaultValue={[]}
                          options={Service_Name}
                        />
                        </div>
                        <div className="mb-3">
                          <div className="d-flex align-items-center justify-content-between">
                            <label className="form-label">Department</label>
                            <a
                              href="#"
                              className="link-primary mb-1"
                            >
                              Reset
                            </a>
                          </div>
                           <Select
                          mode="multiple"
                          allowClear
                          style={{ width: "100%" }}
                          placeholder="Please select"
                          defaultValue={[]}
                          options={Department}
                        />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Amount</label>
                          <div className="dropdown">
                            <a
                              href="#"
                              className="dropdown-toggle form-control"
                              data-bs-toggle="dropdown"
                              data-bs-auto-close="outside"
                              aria-expanded="true"
                            >
                              Select
                            </a>
                            <div className="dropdown-menu shadow-lg w-100 dropdown-info">
                              <div className="filter-range">
                                <Slider
                    min={0}
                    max={100}
                    value={sliderValueDefault}
                    defaultValue={[0, 50]}
                    onChange={handleChangeDefault}
                  />
                                <p>
                                  Range :{" "}
                                  <span className="text-gray-9">
                                    $200 - $5695
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex align-items-center justify-content-between">
                            <label className="form-label">Status</label>
                            <a
                              href="#"
                              className="link-primary mb-1"
                            >
                              Reset
                            </a>
                          </div>
                           <Select
                          mode="multiple"
                          allowClear
                          style={{ width: "100%" }}
                          placeholder="Please select"
                          defaultValue={[]}
                          options={StatusActive}
                        />
                        </div>
                      </div>
                      <div className="filter-footer d-flex align-items-center justify-content-end border-top">
                        <a
                          href="#"
                          className="btn btn-light btn-md me-2"
                          id="close-filter"
                        >
                          Close
                        </a>
                        <button
                          type="submit"
                          className="btn btn-primary btn-md"
                        >
                          Filter
                        </button>
                      </div>
                    </form>
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
      </>

      <Modals />
    </>
  );
};

export default Services;
