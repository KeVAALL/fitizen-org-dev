import { TabContext } from "@mui/lab";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { ErrorMessage, Field } from "formik";
import React, { useState } from "react";
import EventTicket from "./EventTicket";
import EventDetails from "./EventDetails";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Main() {
  // State to manage the selected tab value
  const [value, setValue] = useState("one");

  // Function to handle tab change
  const handleChange = (event, newValue) => {
    setValue(newValue); // Update the selected tab value
  };

  return (
    <div className="dashboard__main">
      <div className="dashboard__content pt-20">
        <section className="layout-pb-md">
          <div className="container">
            <div className="row y-gap-30">
              <div className="col-xl-12 col-md-12">
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="secondary tabs example"
                  sx={{
                    "& .MuiTabs-indicator": {
                      backgroundColor: "#000", // Indicator color to black
                      top: "30px",
                      height: "1px",
                    },
                  }}
                >
                  <Tab
                    value="one"
                    label="Event Details"
                    sx={{
                      backgroundColor:
                        value === "one" ? "#FFF3C787" : "transparent", // Background color for active tab
                      width: 250, // Increase width
                      paddingY: 1, // Reduce vertical padding
                      textTransform: "capitalize", // Capitalize only the first letter
                    }}
                    style={{
                      color: value === "one" ? "#000" : "#000",
                      paddingBottom: "0px",
                      paddingTop: "4px",
                      height: "30px",
                      minHeight: "30px",
                    }}
                  />
                  <Tab
                    value="two"
                    label="Event Description"
                    sx={{
                      backgroundColor:
                        value === "two" ? "#FFF3C787" : "transparent",
                      width: 250, // Increase width
                      paddingY: 1, // Reduce vertical padding
                      textTransform: "capitalize", // Capitalize only the first letter
                    }}
                    style={{
                      color: value === "two" ? "#000" : "#000",
                      paddingBottom: "0px",
                      paddingTop: "4px",
                      height: "30px",
                      minHeight: "30px",
                    }}
                  />
                  <Tab
                    value="three"
                    label="Event Ticket"
                    sx={{
                      backgroundColor:
                        value === "three" ? "#FFF3C787" : "transparent",
                      width: 250, // Increase width
                      paddingY: 1, // Reduce vertical padding
                      textTransform: "capitalize", // Capitalize only the first letter
                    }}
                    style={{
                      color: value === "three" ? "#000 !important" : "#000",
                      paddingBottom: "0px",
                      paddingTop: "4px",
                      height: "30px",
                      minHeight: "30px",
                    }}
                  />
                  <Tab
                    value="four"
                    label="Participant Form"
                    sx={{
                      backgroundColor:
                        value === "four" ? "#FFF3C787" : "transparent",
                      width: 250, // Increase width
                      paddingY: 1, // Reduce vertical padding
                      textTransform: "capitalize", // Capitalize only the first letter
                    }}
                    style={{
                      color: value === "four" ? "#000" : "#000",
                      paddingBottom: "0px",
                      paddingTop: "4px",
                      height: "30px",
                      minHeight: "30px",
                    }}
                  />
                  <Tab
                    value="five"
                    label="Banner Image"
                    sx={{
                      backgroundColor:
                        value === "five" ? "#FFF3C787" : "transparent",
                      width: 250, // Increase width
                      paddingY: 1, // Reduce vertical padding
                      textTransform: "capitalize", // Capitalize only the first letter
                    }}
                    style={{
                      color: value === "five" ? "#000" : "#000",
                      paddingBottom: "0px",
                      paddingTop: "4px",
                      height: "30px",
                      minHeight: "30px",
                    }}
                  />
                </Tabs>
                <CustomTabPanel value={value} index="one">
                  <EventDetails />
                </CustomTabPanel>
                <CustomTabPanel value={value} index="two">
                  Item Two
                </CustomTabPanel>
                <CustomTabPanel value={value} index="three">
                  <EventTicket />
                </CustomTabPanel>
                <CustomTabPanel value={value} index="four">
                  Item Four
                </CustomTabPanel>
                <CustomTabPanel value={value} index="five">
                  Item Five
                </CustomTabPanel>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Main;
