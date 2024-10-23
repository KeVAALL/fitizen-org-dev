/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { AppBar, Toolbar, Box } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Menu, Sidebar } from "react-pro-sidebar";
import { Outlet } from "react-router-dom";

import DarkLogo from "../../assets/img/general/logo-dark.png";
import FavLogo from "../../assets/img/general/favicon.png";
import Avatar3 from "../../assets/img/avatars/3.png";

import "../dashboardLayout/layout.css";
import { HtmlLightTooltip } from "../../utils/Tooltip";
import { decryptData } from "../../utils/DataEncryption";

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

const ReactSidebar = ({ open, menu, navigate, event_id }) => {
  console.log(menu);
  const location = useLocation();

  // Check if the current URL includes '/dashboard/all-events'
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
                alt="main-logo"
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
                alt="fav-logo"
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
                      <i className="fas fa-home mr-15"></i>
                      Main Dashboard
                    </a>
                  </div>
                </div>
              ) : (
                <HtmlLightTooltip
                  arrow
                  title="Main Dashboard"
                  placement="right"
                >
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
                        <i className="fas fa-home mr-15"></i>
                      </a>
                    </div>
                  </div>
                </HtmlLightTooltip>
              )}
              {open ? (
                <div className="sidebar__item">
                  <div className="sidebar__button">
                    <a
                      href={`/event/dashboard/${event_id}`}
                      className={`d-flex items-center text-14 lh-1${
                        isCurrentPage("/event/dashboard") ? " active-link" : ""
                      }`}
                    >
                      <i className="fas fa-th-large mr-15"></i>
                      Dashboard
                    </a>
                  </div>
                </div>
              ) : (
                <HtmlLightTooltip arrow title="Dashboard" placement="right">
                  <div className="sidebar__item">
                    <div className="sidebar__button">
                      <a
                        href={`/event/dashboard/${event_id}`}
                        className={`d-flex items-center text-14 lh-1${
                          isCurrentPage("/event/dashboard")
                            ? " active-link"
                            : ""
                        }`}
                      >
                        <i className="fas fa-th-large mr-15"></i>
                      </a>
                    </div>
                  </div>
                </HtmlLightTooltip>
              )}
              {open ? (
                <div className="sidebar__item">
                  <div className="sidebar__button">
                    <a
                      href={`/event/participants/${event_id}`}
                      className={`d-flex items-center text-14 lh-1${
                        isCurrentPage("/event/participants")
                          ? " active-link"
                          : ""
                      }`}
                    >
                      <i className="fas fa-users mr-15"></i>
                      Event Participants
                    </a>
                  </div>
                </div>
              ) : (
                <HtmlLightTooltip
                  arrow
                  title="Event Participants"
                  placement="right"
                >
                  <div className="sidebar__item">
                    <div className="sidebar__button">
                      <a
                        href={`/event/participants/${event_id}`}
                        className={`d-flex items-center text-14 lh-1${
                          isCurrentPage("/event/participants")
                            ? " active-link"
                            : ""
                        }`}
                      >
                        <i className="fas fa-users mr-15"></i>
                      </a>
                    </div>
                  </div>
                </HtmlLightTooltip>
              )}
              {open ? (
                <div className="sidebar__item">
                  <div className="sidebar__button">
                    <a
                      href={`/event/edit-event/${event_id}`}
                      className={`d-flex items-center text-14 lh-1${
                        isCurrentPage("/event/edit-event") ? " active-link" : ""
                      }`}
                    >
                      <i className="fas fa-edit mr-15"></i>
                      Edit Event
                    </a>
                  </div>
                </div>
              ) : (
                <HtmlLightTooltip arrow title="Edit Event" placement="right">
                  <div className="sidebar__item">
                    <div className="sidebar__button">
                      <a
                        href={`/event/edit-event/${event_id}`}
                        className={`d-flex items-center text-14 lh-1${
                          isCurrentPage("/event/edit-event")
                            ? " active-link"
                            : ""
                        }`}
                      >
                        <i className="fas fa-edit mr-15"></i>
                      </a>
                    </div>
                  </div>
                </HtmlLightTooltip>
              )}
              {open ? (
                <div className="sidebar__item">
                  <div className="sidebar__button">
                    <a
                      href={`/event/billings/${event_id}`}
                      className={`d-flex items-center text-14 lh-1${
                        isCurrentPage("/event/billings") ? " active-link" : ""
                      }`}
                    >
                      <i className="fas fa-money-bill mr-15"></i>
                      Billings
                    </a>
                  </div>
                </div>
              ) : (
                <HtmlLightTooltip arrow title="Billings" placement="right">
                  <div className="sidebar__item">
                    <div className="sidebar__button">
                      <a
                        href={`/event/billings/${event_id}`}
                        className={`d-flex items-center text-14 lh-1${
                          isCurrentPage("/event/billings") ? " active-link" : ""
                        }`}
                      >
                        <i className="fas fa-money-bill mr-15"></i>
                      </a>
                    </div>
                  </div>
                </HtmlLightTooltip>
              )}
              {open ? (
                <div className="sidebar__item">
                  <div className="sidebar__button">
                    <a
                      href={`/event/bib-expo/${event_id}`}
                      className={`d-flex items-center text-14 lh-1${
                        isCurrentPage("/event/bib-expo") ? " active-link" : ""
                      }`}
                    >
                      <i className="far fa-calendar-plus mr-15"></i>
                      Add BIB Expo
                    </a>
                  </div>
                </div>
              ) : (
                <HtmlLightTooltip arrow title="Add BIB Expo" placement="right">
                  <div className="sidebar__item">
                    <div className="sidebar__button">
                      <a
                        href={`/event/bib-expo/${event_id}`}
                        className={`d-flex items-center text-14 lh-1${
                          isCurrentPage("/event/bib-expo") ? " active-link" : ""
                        }`}
                      >
                        <i className="far fa-calendar-plus mr-15"></i>
                      </a>
                    </div>
                  </div>
                </HtmlLightTooltip>
              )}
              {open ? (
                <div className="sidebar__item">
                  <div className="sidebar__button">
                    <a
                      href={`/event/discount/${event_id}`}
                      className={`d-flex items-center text-14 lh-1${
                        isCurrentPage("/event/discount") ? " active-link" : ""
                      }`}
                    >
                      <i className="fas fa-percentage mr-15"></i>
                      Discounts
                    </a>
                  </div>
                </div>
              ) : (
                <HtmlLightTooltip arrow title="Discounts" placement="right">
                  <div className="sidebar__item">
                    <div className="sidebar__button">
                      <a
                        href={`/event/discount/${event_id}`}
                        className={`d-flex items-center text-14 lh-1${
                          isCurrentPage("/event/discount") ? " active-link" : ""
                        }`}
                      >
                        <i className="fas fa-percentage mr-15"></i>
                      </a>
                    </div>
                  </div>
                </HtmlLightTooltip>
              )}
              {open ? (
                <div className="sidebar__item">
                  <div className="sidebar__button">
                    <a
                      href={`/event/polls/${event_id}`}
                      className={`d-flex items-center text-14 lh-1${
                        isCurrentPage("/event/polls") ? " active-link" : ""
                      }`}
                    >
                      <i className="far fa-chart-bar mr-15"></i>
                      Polls
                    </a>
                  </div>
                </div>
              ) : (
                <HtmlLightTooltip arrow title="Polls" placement="right">
                  <div className="sidebar__item">
                    <div className="sidebar__button">
                      <a
                        href={`/event/polls/${event_id}`}
                        className={`d-flex items-center text-14 lh-1${
                          isCurrentPage("/event/polls") ? " active-link" : ""
                        }`}
                      >
                        <i className="far fa-chart-bar mr-15"></i>
                      </a>
                    </div>
                  </div>
                </HtmlLightTooltip>
              )}
              {open ? (
                <div className="sidebar__item">
                  <div className="sidebar__button">
                    <a
                      href={`/event/reviews/${event_id}`}
                      className={`d-flex items-center text-14 lh-1${
                        isCurrentPage("/event/reviews") ? " active-link" : ""
                      }`}
                    >
                      <i className="far fa-comment-alt mr-15"></i>
                      Reviews
                    </a>
                  </div>
                </div>
              ) : (
                <HtmlLightTooltip arrow title="Reviews" placement="right">
                  <div className="sidebar__item">
                    <div className="sidebar__button">
                      <a
                        href={`/event/reviews/${event_id}`}
                        className={`d-flex items-center text-14 lh-1${
                          isCurrentPage("/event/reviews") ? " active-link" : ""
                        }`}
                      >
                        <i className="far fa-comment-alt mr-15"></i>
                      </a>
                    </div>
                  </div>
                </HtmlLightTooltip>
              )}
            </div>
          </div>
        </Menu>
      </Sidebar>
    </>
  );
};

export const EventLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const { event_id } = useParams();
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
        <ReactSidebar
          open={drawerOpen}
          navigate={navigate}
          event_id={event_id}
        />
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
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
