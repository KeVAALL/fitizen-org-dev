// React imports
import React, { useState } from "react";

// MUI imports
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

// Project imports
import EventTicket from "./EventTicket";
import EventDetails from "./EventDetails";
import EventDescription from "./EventDescription";
import EventParticipant from "./EventParticipant";
import EventBanner from "./EventBanner";

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
                    "& .MuiTabs-flexContainer": {
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                    },
                  }}
                >
                  <Tab
                    value="one"
                    label="Event Details"
                    sx={{
                      backgroundColor:
                        value === "one" ? "#FFF3C787" : "transparent", // Background color for active tab
                      width: 200, // Increase width
                      paddingY: 1, // Reduce vertical padding
                      textTransform: "capitalize", // Capitalize only the first letter
                    }}
                    style={{
                      color: value === "one" ? "#000" : "#000",
                      paddingBottom: "0px",
                      paddingTop: "4px",
                      height: "30px",
                      minHeight: "30px",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  />
                  <Tab
                    value="two"
                    label="Event Description"
                    sx={{
                      backgroundColor:
                        value === "two" ? "#FFF3C787" : "transparent",
                      width: 200, // Increase width
                      paddingY: 1, // Reduce vertical padding
                      textTransform: "capitalize", // Capitalize only the first letter
                    }}
                    style={{
                      color: value === "two" ? "#000" : "#000",
                      paddingBottom: "0px",
                      paddingTop: "4px",
                      height: "30px",
                      minHeight: "30px",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  />
                  <Tab
                    value="three"
                    label="Event Ticket"
                    sx={{
                      backgroundColor:
                        value === "three" ? "#FFF3C787" : "transparent",
                      width: 200, // Increase width
                      paddingY: 1, // Reduce vertical padding
                      textTransform: "capitalize", // Capitalize only the first letter
                    }}
                    style={{
                      color: value === "three" ? "#000 !important" : "#000",
                      paddingBottom: "0px",
                      paddingTop: "4px",
                      height: "30px",
                      minHeight: "30px",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  />
                  <Tab
                    value="four"
                    label="Participant Form"
                    sx={{
                      backgroundColor:
                        value === "four" ? "#FFF3C787" : "transparent",
                      width: 200, // Increase width
                      paddingY: 1, // Reduce vertical padding
                      textTransform: "capitalize", // Capitalize only the first letter
                    }}
                    style={{
                      color: value === "four" ? "#000" : "#000",
                      paddingBottom: "0px",
                      paddingTop: "4px",
                      height: "30px",
                      minHeight: "30px",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  />
                  <Tab
                    value="five"
                    label="Banner Image"
                    sx={{
                      backgroundColor:
                        value === "five" ? "#FFF3C787" : "transparent",
                      width: 200, // Increase width
                      paddingY: 1, // Reduce vertical padding
                      textTransform: "capitalize", // Capitalize only the first letter
                    }}
                    style={{
                      color: value === "five" ? "#000" : "#000",
                      paddingBottom: "0px",
                      paddingTop: "4px",
                      height: "30px",
                      minHeight: "30px",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  />
                </Tabs>
                <CustomTabPanel value={value} index="one">
                  <EventDetails />
                </CustomTabPanel>
                <CustomTabPanel value={value} index="two">
                  <EventDescription />
                </CustomTabPanel>
                <CustomTabPanel value={value} index="three">
                  <EventTicket />
                </CustomTabPanel>
                <CustomTabPanel value={value} index="four">
                  <EventParticipant />
                </CustomTabPanel>
                <CustomTabPanel value={value} index="five">
                  <EventBanner />
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
