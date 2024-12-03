import { Avatar } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user.userProfile);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const isVerified =
    (user?.Is_Email_Verified && user?.Is_Mobile_Verified) ||
    (user?.Is_Google_Verified && user?.Is_Mobile_Verified);

  return (
    <header
      data-add-bg=""
      className="header js-header bg-white border-bottom-light"
      data-x="header"
      data-x-toggle="is-menu-opened"
    >
      <div
        data-anim=""
        className="header__container header__container-1500 mx-auto px-50 sm:px-20"
      >
        <div className="row justify-between items-center">
          <div className="col-auto">
            <div className="d-flex items-center">
              <div className="header-logo">
                <img src="img/general/logo-dark.png" alt="logo icon" />
                <img src="img/general/logo-dark.png" alt="logo icon" />
              </div>
            </div>
          </div>
          <div className="col-auto"></div>
          <div className="col-auto">
            <div className="d-flex items-center">
              <div
                className="header-menu "
                data-x="mobile-menu"
                data-x-toggle="is-menu-active"
              >
                <div className="mobile-overlay"></div>
                <div className="header-menu__content">
                  <div className="mobile-bg js-mobile-bg"></div>
                  <div className="mobile-footer px-20 py-20 border-top-light js-mobile-footer"></div>
                </div>
              </div>
              {isLoggedIn && isVerified ? (
                <button
                  className="d-flex items-center gap-10"
                  // href="/dashboard/profile"
                  onClick={() => {
                    navigate("/dashboard/profile", {
                      state: { from: location },
                    });
                  }}
                >
                  <div className="ml-15">
                    <Avatar
                      sx={{
                        bgcolor: "#fff3c7",
                        color: "#f05736",
                        border: "1px solid #f05736",
                        cursor: "pointer",
                        fontSize: 18,
                        fontWeight: 500,
                      }}
                    >
                      {user?.User_Name?.slice(0, 1)}
                    </Avatar>
                  </div>
                  <div className="text-15 text-black fw-500">
                    Hi, {user?.User_Name?.split(" ")[0]}
                  </div>
                </button>
              ) : (
                <></>
              )}
              <div
                className="d-none lg:d-flex x-gap-20 items-center"
                data-x="header-mobile-icons"
                data-x-toggle="text-dark-1"
              >
                <div className="search-icon">
                  <a
                    href="#"
                    className="d-flex items-center icon-search text-dark-1 text-24"
                  ></a>
                </div>
                <div id="search-inputmob" className="search-inputmob">
                  <div className="searchMenu-loc lg:py-20 lg:px-0 js-form-dd js-liverSearch">
                    <div
                      className="single-field relative d-flex items-center search-bar"
                      data-x-dd-click="searchMenu-loc"
                    >
                      <input
                        className="border-light text-dark-1 search-input"
                        type="text"
                        name="search-input"
                        placeholder="Events, attraction, activities, etc..."
                        required
                      />
                      <button className="absolute d-flex items-center h-full single-field bg-primary text-dark-1 input-btn">
                        <i className="icon-search text-20 px-15"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <a
                    href="*"
                    className="d-flex items-center icon-user text-dark-1 text-22"
                  />
                </div>
                <div>
                  <button
                    className="d-flex items-center icon-menu text-dark-1 text-20"
                    data-x-click="html, header, header-logo, header-mobile-icons, mobile-menu"
                  ></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
