
import { Link } from "react-router";
import Footer from "../../../../../../core/common/footer/footer";

const UiOffcanvas = () => {
  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Content */}
        <div className="content">
          {/* Page Header Start */}
          <div className="d-flex align-items-sm-center flex-sm-row flex-column gap-2 pb-3">
            <div className="flex-grow-1">
              <h4 className="fs-18 fw-semibold mb-0">Offcanvas</h4>
            </div>
            <div className="text-end">
              <ol className="breadcrumb m-0 py-0">
                <li className="breadcrumb-item">
                  <Link to="#">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="#">Base UI</Link>
                </li>
                <li className="breadcrumb-item active">Offcanvas</li>
              </ol>
            </div>
          </div>
          {/* Page Header End */}
          {/* start row */}
          <div className="row">
            <div className="col-xl-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Offcanvas</h5>
                </div>
                <div className="card-body">
                  <p>
                    You can use a link with the <code>to</code> attribute, or
                    a button with the <code>data-bs-target</code> attribute. In
                    both cases, the <code>data-bs-toggle="offcanvas"</code> is
                    required.
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    <Link
                      className="btn btn-primary"
                      data-bs-toggle="offcanvas"
                      to="#offcanvasExample"
                      role="button"
                      aria-controls="offcanvasExample"
                    >
                      Link with to
                    </Link>
                    <button
                      className="btn btn-primary"
                      type="button"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasExample"
                      aria-controls="offcanvasExample"
                    >
                      Button with data-bs-target
                    </button>
                  </div>
                  <div
                    className="offcanvas offcanvas-start"
                    tabIndex={-1}
                    id="offcanvasExample"
                    aria-labelledby="offcanvasExampleLabel"
                  >
                    <div className="offcanvas-header">
                      <h4
                        className="offcanvas-title"
                        id="offcanvasExampleLabel"
                      >
                        Offcanvas
                      </h4>
                      <button
                        type="button"
                        className="btn-close text-reset"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                      />
                    </div>
                    {/* end offcanvas header */}
                    <div className="offcanvas-body">
                      <div>
                        Some text as placeholder. In real life you can have the
                        elements you have chosen. Like, text, images, lists,
                        etc.
                      </div>
                      <h5 className="mt-3">List</h5>
                      <ul className="ps-3">
                        <li>Nemo enim ipsam voluptatem quia aspernatur</li>
                        <li>Neque porro quisquam est, qui dolorem</li>
                        <li>Quis autem vel eum iure qui in ea</li>
                      </ul>
                      <ul className="ps-3">
                        <li>
                          At vero eos et accusamus et iusto odio dignissimos
                        </li>
                        <li>Et harum quidem rerum facilis</li>
                        <li>Temporibus autem quibusdam et aut officiis</li>
                      </ul>
                    </div>
                    {/* end offcanvas body */}
                  </div>
                  {/* end offcanvas */}
                </div>
                {/* end card body */}
              </div>
              {/* end card */}
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Offcanvas Backdrop</h5>
                </div>
                <div className="card-body">
                  <p>
                    Scrolling the <code>&lt;body&gt;</code> element is disabled
                    when an offcanvas and its backdrop are visible. Use the
                    <code>data-bs-scroll</code> attribute to toggle
                    <code>&lt;body&gt;</code> scrolling and
                    <code>data-bs-backdrop</code> to toggle the backdrop.
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      className="btn btn-primary mt-2 mt-md-0"
                      type="button"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasScrolling"
                      aria-controls="offcanvasScrolling"
                    >
                      Enable body scrolling
                    </button>
                    <button
                      className="btn btn-primary mt-2 mt-md-0"
                      type="button"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasWithBackdrop"
                      aria-controls="offcanvasWithBackdrop"
                    >
                      Enable backdrop (default)
                    </button>
                    <button
                      className="btn btn-primary mt-2 mt-md-0"
                      type="button"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasWithBothOptions"
                      aria-controls="offcanvasWithBothOptions"
                    >
                      Enable both scrolling &amp; backdrop
                    </button>
                  </div>
                  <div
                    className="offcanvas offcanvas-start"
                    data-bs-scroll="true"
                    data-bs-backdrop="false"
                    tabIndex={-1}
                    id="offcanvasScrolling"
                    aria-labelledby="offcanvasScrollingLabel"
                  >
                    <div className="offcanvas-header">
                      <h5
                        className="offcanvas-title"
                        id="offcanvasScrollingLabel"
                      >
                        Colored with scrolling
                      </h5>
                      <button
                        type="button"
                        className="btn-close text-reset"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                      />
                    </div>
                    {/* end offcanvas header */}
                    <div className="offcanvas-body">
                      <div>
                        Some text as placeholder. In real life you can have the
                        elements you have chosen. Like, text, images, lists,
                        etc.
                      </div>
                      <h5 className="mt-3">List</h5>
                      <ul className="ps-3">
                        <li>Nemo enim ipsam voluptatem quia aspernatur</li>
                        <li>Neque porro quisquam est, qui dolorem</li>
                        <li>Quis autem vel eum iure qui in ea</li>
                      </ul>
                      <ul className="ps-3">
                        <li>
                          At vero eos et accusamus et iusto odio dignissimos
                        </li>
                        <li>Et harum quidem rerum facilis</li>
                        <li>Temporibus autem quibusdam et aut officiis</li>
                      </ul>
                    </div>
                    {/* end offcanvas body */}
                  </div>
                  {/* end offcanvas */}
                  <div
                    className="offcanvas offcanvas-start"
                    tabIndex={-1}
                    id="offcanvasWithBackdrop"
                    aria-labelledby="offcanvasWithBackdropLabel"
                  >
                    <div className="offcanvas-header">
                      <h4
                        className="offcanvas-title"
                        id="offcanvasWithBackdropLabel"
                      >
                        Offcanvas with backdrop
                      </h4>
                      <button
                        type="button"
                        className="btn-close text-reset"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                      />
                    </div>
                    {/* end offcanvas header */}
                    <div className="offcanvas-body">
                      <div>
                        Some text as placeholder. In real life you can have the
                        elements you have chosen. Like, text, images, lists,
                        etc.
                      </div>
                      <h5 className="mt-3">List</h5>
                      <ul className="ps-3">
                        <li>Nemo enim ipsam voluptatem quia aspernatur</li>
                        <li>Neque porro quisquam est, qui dolorem</li>
                        <li>Quis autem vel eum iure qui in ea</li>
                      </ul>
                      <ul className="ps-3">
                        <li>
                          At vero eos et accusamus et iusto odio dignissimos
                        </li>
                        <li>Et harum quidem rerum facilis</li>
                        <li>Temporibus autem quibusdam et aut officiis</li>
                      </ul>
                    </div>
                    {/* end offcanvas body */}
                  </div>
                  {/* end offcanvas */}
                  <div
                    className="offcanvas offcanvas-start"
                    data-bs-scroll="true"
                    tabIndex={-1}
                    id="offcanvasWithBothOptions"
                    aria-labelledby="offcanvasWithBothOptionsLabel"
                  >
                    <div className="offcanvas-header">
                      <h4
                        className="offcanvas-title"
                        id="offcanvasWithBothOptionsLabel"
                      >
                        Backdroped with scrolling
                      </h4>
                      <button
                        type="button"
                        className="btn-close text-reset"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                      />
                    </div>
                    {/* end offcanvas header */}
                    <div className="offcanvas-body">
                      <div>
                        Some text as placeholder. In real life you can have the
                        elements you have chosen. Like, text, images, lists,
                        etc.
                      </div>
                      <h5 className="mt-3">List</h5>
                      <ul className="ps-3">
                        <li>Nemo enim ipsam voluptatem quia aspernatur</li>
                        <li>Neque porro quisquam est, qui dolorem</li>
                        <li>Quis autem vel eum iure qui in ea</li>
                      </ul>
                      <ul className="ps-3">
                        <li>
                          At vero eos et accusamus et iusto odio dignissimos
                        </li>
                        <li>Et harum quidem rerum facilis</li>
                        <li>Temporibus autem quibusdam et aut officiis</li>
                      </ul>
                    </div>
                    {/* end offcanvas body */}
                  </div>
                  {/* end offcanvas */}
                </div>
                {/* end card body */}
              </div>
              {/* end card */}
            </div>
            {/* end col */}
            <div className="col-xl-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Offcanvas Placement</h5>
                </div>
                <div className="card-body">
                  <p>Try the right and bottom examples out below.</p>
                  <ul>
                    <li>
                      <code>.offcanvas-start</code> places offcanvas on the left
                      of the viewport (shown above)
                    </li>
                    <li>
                      <code>.offcanvas-end</code> places offcanvas on the right
                      of the viewport
                    </li>
                    <li>
                      <code>.offcanvas-top</code> places offcanvas on the top of
                      the viewport
                    </li>
                    <li>
                      <code>.offcanvas-bottom</code> places offcanvas on the
                      bottom of the viewport
                    </li>
                  </ul>
                  <div>
                    <div className="d-flex flex-wrap gap-2">
                      <button
                        className="btn btn-primary mt-2 mt-md-0"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasTop"
                        aria-controls="offcanvasTop"
                      >
                        Toggle Top offcanvas
                      </button>
                      <button
                        className="btn btn-primary mt-2 mt-md-0"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasRight"
                        aria-controls="offcanvasRight"
                      >
                        Toggle right offcanvas
                      </button>
                      <button
                        className="btn btn-primary mt-2 mt-md-0"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasBottom"
                        aria-controls="offcanvasBottom"
                      >
                        Toggle bottom offcanvas
                      </button>
                      <button
                        className="btn btn-primary mt-2 mt-lg-0"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasLeft"
                        aria-controls="offcanvasLeft"
                      >
                        Toggle Left offcanvas
                      </button>
                    </div>
                    <div
                      className="offcanvas offcanvas-top"
                      tabIndex={-1}
                      id="offcanvasTop"
                      aria-labelledby="offcanvasTopLabel"
                    >
                      <div className="offcanvas-header">
                        <h4 id="offcanvasTopLabel">Offcanvas Top</h4>
                        <button
                          type="button"
                          className="btn-close text-reset"
                          data-bs-dismiss="offcanvas"
                          aria-label="Close"
                        />
                      </div>
                      {/* end offcanvas header */}
                      <div className="offcanvas-body">
                        <div>
                          Some text as placeholder. In real life you can have
                          the elements you have chosen. Like, text, images,
                          lists, etc.
                        </div>
                        <h5 className="mt-3">List</h5>
                        <ul className="ps-3">
                          <li>Nemo enim ipsam voluptatem quia aspernatur</li>
                          <li>Neque porro quisquam est, qui dolorem</li>
                          <li>Quis autem vel eum iure qui in ea</li>
                        </ul>
                      </div>
                      {/* end offcanvas body */}
                    </div>
                    {/* end offcanvas */}
                    <div
                      className="offcanvas offcanvas-end"
                      tabIndex={-1}
                      id="offcanvasRight"
                      aria-labelledby="offcanvasRightLabel"
                    >
                      <div className="offcanvas-header">
                        <h4 id="offcanvasRightLabel">Offcanvas right</h4>
                        <button
                          type="button"
                          className="btn-close text-reset"
                          data-bs-dismiss="offcanvas"
                          aria-label="Close"
                        />
                      </div>
                      {/* end offcanvas header */}
                      <div className="offcanvas-body">
                        <div>
                          Some text as placeholder. In real life you can have
                          the elements you have chosen. Like, text, images,
                          lists, etc.
                        </div>
                        <h5 className="mt-3">List</h5>
                        <ul className="ps-3">
                          <li>Nemo enim ipsam voluptatem quia aspernatur</li>
                          <li>Neque porro quisquam est, qui dolorem</li>
                          <li>Quis autem vel eum iure qui in ea</li>
                        </ul>
                      </div>
                      {/* end offcanvas body */}
                    </div>
                    {/* end offcanvas */}
                    <div
                      className="offcanvas offcanvas-bottom"
                      tabIndex={-1}
                      id="offcanvasBottom"
                      aria-labelledby="offcanvasBottomLabel"
                    >
                      <div className="offcanvas-header">
                        <h4
                          className="offcanvas-title"
                          id="offcanvasBottomLabel"
                        >
                          Offcanvas bottom
                        </h4>
                        <button
                          type="button"
                          className="btn-close text-reset"
                          data-bs-dismiss="offcanvas"
                          aria-label="Close"
                        />
                      </div>
                      {/* end offcanvas header */}
                      <div className="offcanvas-body">
                        <div>
                          Some text as placeholder. In real life you can have
                          the elements you have chosen. Like, text, images,
                          lists, etc.
                        </div>
                        <h5 className="mt-3">List</h5>
                        <ul className="ps-3">
                          <li>Nemo enim ipsam voluptatem quia aspernatur</li>
                          <li>Neque porro quisquam est, qui dolorem</li>
                          <li>Quis autem vel eum iure qui in ea</li>
                        </ul>
                      </div>
                      {/* end offcanvas body */}
                    </div>
                    {/* end offcanvas */}
                    <div
                      className="offcanvas offcanvas-start"
                      tabIndex={-1}
                      id="offcanvasLeft"
                      aria-labelledby="offcanvasLeftLabel"
                    >
                      <div className="offcanvas-header">
                        <h4 id="offcanvasLeftLabel">Offcanvas Left</h4>
                        <button
                          type="button"
                          className="btn-close text-reset"
                          data-bs-dismiss="offcanvas"
                          aria-label="Close"
                        />
                      </div>
                      {/* end offcanvas header */}
                      <div className="offcanvas-body">
                        <div>
                          Some text as placeholder. In real life you can have
                          the elements you have chosen. Like, text, images,
                          lists, etc.
                        </div>
                        <h5 className="mt-3">List</h5>
                        <ul className="ps-3">
                          <li>Nemo enim ipsam voluptatem quia aspernatur</li>
                          <li>Neque porro quisquam est, qui dolorem</li>
                          <li>Quis autem vel eum iure qui in ea</li>
                        </ul>
                      </div>
                      {/* end offcanvas body */}
                    </div>
                    {/* end offcanvas */}
                  </div>
                </div>
                {/* end card body */}
              </div>
              {/* end card */}
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Dark Offcanvas</h5>
                </div>
                <div className="card-body">
                  <p>
                    Change the appearance of offcanvases with utilities to
                    better match them to different contexts like dark navbars.
                    Here we add <code>.text-bg-dark</code> to the
                    <code>.offcanvas</code> and <code>.btn-close-white</code> to
                    <code>.btn-close</code> for proper styling with a dark
                    offcanvas. If you have dropdowns within, consider also
                    adding
                    <code>.dropdown-menu-dark</code> to
                    <code>.dropdown-menu</code>.
                  </p>
                  <div>
                    <button
                      className="btn btn-primary mt-2 mt-md-0"
                      type="button"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasDark"
                      aria-controls="offcanvasDark"
                    >
                      Dark offcanvas
                    </button>
                    <div
                      className="offcanvas offcanvas-start text-bg-dark"
                      tabIndex={-1}
                      id="offcanvasDark"
                      aria-labelledby="offcanvasDarkLabel"
                    >
                      <div className="offcanvas-header">
                        <h5 id="offcanvasDarkLabel">Dark Offcanvas</h5>
                        <button
                          type="button"
                          className="btn-close btn-close-white"
                          data-bs-dismiss="offcanvas"
                          aria-label="Close"
                        />
                      </div>
                      <div className="offcanvas-body">
                        <div>
                          Some text as placeholder. In real life you can have
                          the elements you have chosen. Like, text, images,
                          lists, etc.
                        </div>
                        <h5 className="mt-3">List</h5>
                        <ul className="ps-3">
                          <li>Nemo enim ipsam voluptatem quia aspernatur</li>
                          <li>Neque porro quisquam est, qui dolorem</li>
                          <li>Quis autem vel eum iure qui in ea</li>
                        </ul>
                      </div>
                      {/* end offcanvas body */}
                    </div>
                    {/* end offcanvas */}
                  </div>
                </div>
                {/* end card body */}
              </div>
              {/* end card */}
            </div>
            {/* end col */}
          </div>
          {/* end row */}
        </div>
        {/* End Content */}
        {/* Start Footer */}
       <Footer/>
        {/* End Footer */}
      </div>
      {/* ========================
			End Page Content
		========================= */}
    </>
  );
};

export default UiOffcanvas;
