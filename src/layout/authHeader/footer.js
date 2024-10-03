import React from "react";

function Footer() {
  return (
    <footer id="footer" className="footer -type-1 bg-grey text-white">
      <div className="container">
        <div className="py-60 lg:py-30">
          <div className="row y-gap-40 justify-between xl:justify-start">
            <div className="col-xl-3 col-lg-4 col-sm-6">
              <img
                src="https://fitizenindia.com/static/media/footer-logo.e5b16877070aa63a4362.png"
                alt="logo"
                style={{ width: "90%" }}
              />
            </div>
            <div className="col-xl-3 col-lg-4 col-sm-6">
              <div className="d-flex y-gap-5 flex-column">
                <div className="d-flex gap-10 mb-10">
                  <h5 className="text-16 fw-500">Contact</h5>
                </div>
                <a
                  href="tel:98331 11510"
                  className="text-15 fw-500 text-white mt-5"
                >
                  +91 98331 11510
                </a>
                <a
                  href="tel:95940 01042"
                  className="text-15 fw-500 text-white mt-5"
                >
                  +91 95940 01042
                </a>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-sm-6">
              <div className="d-flex y-gap-5 flex-column">
                <div className="d-flex gap-10 mb-10">
                  <h5 className="text-16 fw-500">Email</h5>
                </div>
                <a
                  href="mailto:marketing@fitizenindia.com"
                  className="text-15 fw-500 text-white mt-5"
                >
                  marketing@fitizenindia.com
                </a>
                <a
                  href="mailto:supportevents@fitizenindia.com"
                  className="text-15 fw-500 text-white mt-5"
                >
                  supportevents@fitizenindia.com
                </a>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-sm-6">
              <div className="d-flex x-gap-10 items-center justify-center mt-40 lg:mt-10">
                <a
                  target="_blank"
                  href="https://www.facebook.com/FitizenIndia?mibextid=LQQJ4d"
                  className="social-icon"
                  rel="noreferrer"
                >
                  <i className="fab fa-facebook-f text-20"></i>
                </a>
                <a
                  target="_blank"
                  href="https://youtube.com/@fitizenindia?si=qp3rKtDO-qtRNCzT"
                  className="social-icon"
                  rel="noreferrer"
                >
                  <i className="fab fa-youtube text-20"></i>
                </a>
                <a
                  target="_blank"
                  href="https://www.instagram.com/fitizenindia?igsh=dHVzamRwNzZzOXFz&amp;utm_source=qr"
                  className="social-icon"
                  rel="noreferrer"
                >
                  <i className="fab fa-instagram text-20"></i>
                </a>
                <a
                  target="_blank"
                  href="https://www.linkedin.com/company/fitizenindia/"
                  className="social-icon"
                  rel="noreferrer"
                >
                  <i className="fab fa-linkedin-in text-20"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="py-20 border-top-light">
          <div className="row justify-between items-center y-gap-10">
            <div className="col-auto">
              <div className="row x-gap-30 y-gap-10">
                <div className="col-auto">
                  <div className="d-flex items-center text-13">
                    Copyright © 2024 Fitizen India All rights reserved.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
