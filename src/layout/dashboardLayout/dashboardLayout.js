/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AppBar, Toolbar, Box, Avatar, Drawer } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Menu, Sidebar } from "react-pro-sidebar";
import { Outlet } from "react-router-dom";

import DarkLogo from "../../assets/img/general/logo-dark.png";
import FavLogo from "../../assets/img/general/favicon.png";
import Avatar3 from "../../assets/img/avatars/3.png";

import "./layout.css";
import { HtmlLightTooltip } from "../../utils/Tooltip";

const Header = ({ open, handleDrawerToggle }) => {
  return (
    <AppBar
      position="static"
      className="main-toolbar bg-white border-bottom-light"
      sx={{ boxShadow: "none" }}
    >
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            p: 2,
          }}
          className={`${open ? "drawer-open" : ""}`}
        >
          <div className="col-auto">
            <div className="d-flex items-center">
              <button
                data-x-click="dashboard"
                onClick={() => {
                  handleDrawerToggle();
                }}
              >
                <i className="fas fa-bars text-20"></i>
              </button>
            </div>
          </div>

          <div className="col-auto">
            <div className="d-flex items-center">
              {/* <div
                className="header-menu "
                data-x="mobile-menu"
                data-x-toggle="is-menu-active"
              >
                <div className="mobile-overlay"></div>

                <div className="header-menu__content">
                  <div className="mobile-bg js-mobile-bg"></div>

                  <div className="mobile-footer px-20 py-20 border-top-light js-mobile-footer"></div>
                </div>
              </div> */}

              <div className="row items-center x-gap-5 y-gap-20 pl-20 lg:d-none">
                <div className="col-auto">
                  <button className="button -blue-1-05 size-50 rounded-22 flex-center">
                    <i className="far fa-bell text-20"></i>
                  </button>
                </div>
              </div>

              <div className="pl-15">
                <a href="#">
                  <img
                    src={Avatar3}
                    alt="image-avatar"
                    className="size-50 rounded-22 object-cover"
                  />
                </a>
              </div>

              <div
                className="d-none xl:d-flex x-gap-20 items-center pl-20"
                data-x="header-mobile-icons"
                data-x-toggle="text-white"
              >
                <div>
                  <button
                    className="d-flex items-center icon-menu text-20"
                    data-x-click="html, header, header-logo, header-mobile-icons, mobile-menu"
                  ></button>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const ReactSidebar = ({ open, menu, navigate }) => {
  console.log(menu);

  const location = useLocation();

  const isCurrentPage = (url) => location.pathname.includes(url);

  return (
    <>
      <Sidebar
        collapsed={!open}
        className={`sidebar${!open ? " sidebar-shadow" : " sidebar-border"}`}
      >
        <Menu iconShape="square">
          {open ? (
            <Box
              sx={{
                px: 2,
                py: 1.9,
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
              onClick={() => {
                navigate("/sign-in");
              }}
              className="border-bottom-light"
            >
              <img
                src={DarkLogo}
                style={{
                  height: "100%",
                  width: "190px",
                }}
              />
            </Box>
          ) : (
            <Box
              sx={{
                px: 2,
                py: 2.3,
                display: "flex",
                justifyContent: "center",
              }}
              onClick={() => {
                navigate("/sign-in");
              }}
              className="border-bottom-light"
            >
              <img
                src={FavLogo}
                style={{
                  height: "100%",
                  width: "50px",
                }}
              />
            </Box>
          )}

          <div
            id="sidebar-place"
            className="dashboard__sidebar bg-light-4 scroll-bar-1"
          >
            <div className="sidebar -dashboard">
              {open ? (
                <div className="sidebar__item">
                  <div className="sidebar__button">
                    <a
                      href="/dashboard/all-events"
                      className={`d-flex items-center text-14 lh-1${
                        isCurrentPage("/dashboard/all-events")
                          ? " active-link"
                          : ""
                      }`}
                    >
                      <i className="fas fa-trophy mr-15"></i>
                      All Events
                    </a>
                  </div>
                </div>
              ) : (
                <HtmlLightTooltip arrow title="All Events" placement="right">
                  <div className="sidebar__item">
                    <div className="sidebar__button">
                      <a
                        href="/dashboard/all-events"
                        className={`d-flex items-center text-14 lh-1${
                          isCurrentPage("/dashboard/all-events")
                            ? " active-link"
                            : ""
                        }`}
                      >
                        <i className="fas fa-trophy mr-15"></i>
                      </a>
                    </div>
                  </div>
                </HtmlLightTooltip>
              )}
              {open ? (
                <div className="sidebar__item">
                  <div className="sidebar__button ">
                    <a href="#" className="d-flex items-center text-14 lh-1">
                      <i className="fas fa-volume-up mr-15"></i>
                      Promote Event
                    </a>
                  </div>
                </div>
              ) : (
                <HtmlLightTooltip arrow title="Promote Event" placement="right">
                  <div className="sidebar__item">
                    <div className="sidebar__button ">
                      <a href="#" className="d-flex items-center text-14 lh-1">
                        <i className="fas fa-volume-up mr-15"></i>
                      </a>
                    </div>
                  </div>
                </HtmlLightTooltip>
              )}
              {open ? (
                <div className="sidebar__item">
                  <div className="sidebar__button ">
                    <a
                      href="/dashboard/reports"
                      className={`d-flex items-center text-14 lh-1${
                        isCurrentPage("/dashboard/reports")
                          ? " active-link"
                          : ""
                      }`}
                    >
                      <i className="fas fa-poll-h mr-15"></i>
                      Reports
                    </a>
                  </div>
                </div>
              ) : (
                <HtmlLightTooltip arrow title="Support" placement="right">
                  <div className="sidebar__item">
                    <div className="sidebar__button ">
                      <a
                        href="/dashboard/reports"
                        className={`d-flex items-center text-14 lh-1${
                          isCurrentPage("/dashboard/reports")
                            ? " active-link"
                            : ""
                        }`}
                      >
                        <i className="fas fa-poll-h mr-15"></i>
                      </a>
                    </div>
                  </div>
                </HtmlLightTooltip>
              )}
              {open ? (
                <div className="sidebar__item">
                  <div className="sidebar__button ">
                    <a href="#" className="d-flex items-center text-14 lh-1">
                      <i className="fas fa-phone-alt mr-15"></i>
                      Support
                    </a>
                  </div>
                </div>
              ) : (
                <HtmlLightTooltip arrow title="Support" placement="right">
                  <div className="sidebar__item">
                    <div className="sidebar__button ">
                      <a href="#" className="d-flex items-center text-14 lh-1">
                        <i className="fas fa-phone-alt mr-15"></i>
                      </a>
                    </div>
                  </div>
                </HtmlLightTooltip>
              )}
              {open ? (
                <div className="sidebar__item">
                  <div className="sidebar__button ">
                    <a
                      href="/dashboard/profile"
                      className={`d-flex items-center text-14 lh-1${
                        isCurrentPage("/dashboard/profile")
                          ? " active-link"
                          : ""
                      }`}
                    >
                      <i className="far fa-user-circle mr-15"></i>
                      Profile
                    </a>
                  </div>
                </div>
              ) : (
                <HtmlLightTooltip arrow title="Profile" placement="right">
                  <div className="sidebar__item">
                    <div className="sidebar__button ">
                      <a
                        href="/dashboard/profile"
                        className={`d-flex items-center text-14 lh-1${
                          isCurrentPage("/dashboard/profile")
                            ? " active-link"
                            : ""
                        }`}
                      >
                        <i className="far fa-user-circle mr-15"></i>
                      </a>
                    </div>
                  </div>
                </HtmlLightTooltip>
              )}
              {open ? (
                <div className="sidebar__item">
                  <div className="sidebar__button">
                    <a href="#" className="d-flex items-center text-14 lh-1">
                      <i className="fas fa-sign-out-alt mr-15"></i>
                      Sign Out
                    </a>
                  </div>
                </div>
              ) : (
                <HtmlLightTooltip arrow title="Sign Out" placement="right">
                  <div className="sidebar__item">
                    <div className="sidebar__button">
                      <a href="#" className="d-flex items-center text-14 lh-1">
                        <i className="fas fa-sign-out-alt mr-15"></i>
                      </a>
                    </div>
                  </div>
                </HtmlLightTooltip>
              )}
            </div>
          </div>
          {/* <div className="sidebar -dashboard">
            <div className="sidebar__item">
              <div className="sidebar__button">
                <a
                  href="all-event.html"
                  className="d-flex items-center text-13 lh-1"
                >
                  <i className="fas fa-trophy mr-15"></i>
                  All Events
                </a>
              </div>
            </div>
            <div className="sidebar__item">
              <div className="sidebar__button ">
                <a href="#" className="d-flex items-center text-13 lh-1">
                  <i className="fas fa-volume-up mr-15"></i>
                  Promote Event
                </a>
              </div>
            </div>
            <div className="sidebar__item">
              <div className="sidebar__button ">
                <a href="#" className="d-flex items-center text-13 lh-1">
                  <i className="fas fa-phone-alt mr-15"></i>
                  Support
                </a>
              </div>
            </div>
            <div className="sidebar__item">
              <div className="sidebar__button">
                <a href="#" className="d-flex items-center text-13 lh-1">
                  <i className="fas fa-sign-out-alt mr-15"></i>
                  Sign Out
                </a>
              </div>
            </div>
          </div> */}
        </Menu>
      </Sidebar>
    </>
  );
};

export const DashboardLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const handleDesktopDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  const handleMobileDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100%",
        position: "fixed",
      }}
    >
      {isDesktop ? (
        <ReactSidebar open={drawerOpen} navigate={navigate} />
      ) : (
        <></>
      )}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          width: "calc(100% - 20px)",
        }}
      >
        <Header
          open={isDesktop ? drawerOpen : mobileDrawerOpen}
          handleDrawerToggle={
            isDesktop ? handleDesktopDrawerToggle : handleMobileDrawerToggle
          }
        />
        {/* <Toolbar
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            paddingLeft: "16px",
            paddingRight: "16px",
            minHeight: "74px",
            paddingTop: "8px",
            paddingBottom: "8px",
            marginTop: "inherit",
            marginBottom: "inherit",
          }}
        ></Toolbar> */}
        <Box
          sx={{
            // paddingLeft: 4,
            // paddingTop: 4,
            // paddingBottom: 4,
            flexGrow: 1,
            width: {
              // md: "calc(100% - 32px)",
              // sm: "calc(100% - 48px)",
              xs: "100%",
            },
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: "4px",
              border: "2px solid #f1f1f1",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#555",
            },
          }}
        >
          {/* <Box sx={{ width: "80px" }}></Box> */}
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
