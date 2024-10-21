import email from "../../assets/img/icons/email.png";
import { Link } from "react-router-dom";

const Support = () => {
  return (
    <div className="dashboard__main">
      <div className="dashboard__content pt-50">
        <section className="layout-pb-md">
          <div className="container">
            <div className="row justify-content-between align-items-end pb-3">
              <div className="col-auto pl-3">
                <h1 className="text-16 lh-14 fw-600">
                  Having an issue?{" "}
                  <span className="text-primary">
                    Raise a ticket for prompt resolution.
                  </span>
                </h1>
              </div>
              <div className="col-auto"></div>
            </div>
            <div className="py-4 px-3 rounded bg-white">
              <div className="row">
                {/* <div className="col-md-6 col-lg-3 mb-3">
            <div className="px-15 py-50 rounded-16 shadow-sm shadow-2 text-center">
              <img
                src={mobile}
                width="150"
                className="d-block mx-auto"
                alt="Mobile-number"
              />
              <div className="mt-3">
                <Link className="text-14 fw-600" to="tel:9833111510">
                  +91 98331 11510
                </Link>
                <br />
                <Link className="text-14 fw-600" to="tel:9833111510">
                  +91 98331 11510
                </Link>
              </div>
            </div>
          </div> */}
                <div className="col-md-6 col-lg-3 p-0">
                  <div className="px-15 py-50 rounded-16 shadow-sm shadow-2 text-center">
                    <img
                      src={email}
                      width="150"
                      alt="email"
                      className="d-block mx-auto"
                    />
                    <div className="mt-3">
                      <Link
                        className="text-14 fw-600"
                        to="mailto:marketing@fitizenindia.com"
                      >
                        marketing@fitizenindia.com
                      </Link>
                      <br />
                      <Link
                        className="text-14 fw-600"
                        to="mailto:supportevents@fitizenindia.com"
                      >
                        supportevents@fitizenindia.com
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Support;
