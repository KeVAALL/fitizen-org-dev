import {
  Backdrop,
  Box,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import Select from "react-select";
import { customRoundedStyles } from "../../utils/selectCustomStyle";
import { StyledTableCell } from "../../utils/ReactTable";
import {
  LineChart,
  lineElementClasses,
  markElementClasses,
  PieChart,
} from "@mui/x-charts";

function Reports() {
  const eventTime = [
    {
      label: "Today",
      value: "Today",
    },
    {
      label: "Tomorrow",
      value: "Tomorrow",
    },
  ];
  const eventType = [];

  return (
    <div className="dashboard__main">
      <div className="dashboard__content pt-20">
        <section className="layout-pb-md">
          <div className="container">
            <div className="row y-gap-30">
              {false ? (
                <div
                  className="col-xl-12"
                  style={{ position: "relative", height: "300px" }}
                >
                  <Backdrop
                    sx={{
                      color: "#f05736",
                      backgroundColor: "#fff",
                      position: "absolute", // Make Backdrop absolute to the row div
                      top: "50%", // Set the top position to 50%
                      left: "50%", // Set the left position to 50%
                      transform: "translate(-50%, -50%)", // Translate to center
                      width: "100%",
                      height: "100%",
                      zIndex: 1, // Ensure it's above the content inside the row div
                    }}
                    open={false}
                  >
                    <CircularProgress color="inherit" />
                  </Backdrop>
                </div>
              ) : (
                <>
                  <div className="col-xl-12 col-md-12">
                    <div className="row y-gap-30">
                      <div className="col-xl-2 col-md-6">
                        <Select
                          styles={customRoundedStyles}
                          options={eventTime}
                          value={eventTime[0]}
                        />
                      </div>

                      <div className="col-xl-2 col-md-6">
                        <Select
                          styles={customRoundedStyles}
                          options={eventType}
                          placeholder="Select Event"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-6">
                    <div
                      className="py-30 px-30 border-primary rounded-24 bg-skin"
                      style={{
                        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                      }}
                    >
                      <div className="row y-gap-20 justify-between items-center">
                        <div className="col-12">
                          <div className="fw-500 lh-14 text-16 text-reading">
                            Net Sales
                          </div>
                          <div className="text-26 lh-16 fw-700 mt-5 text-primary">
                            ₹ 1,98,653
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-6">
                    <div
                      className="py-30 px-30 border-primary rounded-16 bg-skin"
                      style={{
                        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                      }}
                    >
                      <div className="row y-gap-20 justify-between items-center">
                        <div className="col-12">
                          <div className="fw-500 lh-14 text-16 text-reading">
                            Net Earnings
                          </div>
                          <div className="text-26 lh-16 fw-700 mt-5 text-primary">
                            ₹ 1,98,653
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-6">
                    <div
                      className="py-30 px-30 border-primary rounded-16 bg-skin"
                      style={{
                        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                      }}
                    >
                      <div className="row y-gap-20 justify-between items-center">
                        <div className="col-12">
                          <div className="fw-500 lh-14 text-16 text-reading">
                            Refunds
                          </div>
                          <div className="text-26 lh-16 fw-700 mt-5 text-primary">
                            ₹ 1,98,653
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-6">
                    <div
                      className="py-30 px-30 border-primary rounded-16 bg-skin"
                      style={{
                        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                      }}
                    >
                      <div className="row y-gap-20 justify-between items-center">
                        <div className="col-12">
                          <div className="fw-500 lh-14 text-16 text-reading">
                            Registrations
                          </div>
                          <div className="text-26 lh-16 fw-700 mt-5 text-primary">
                            100
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-12 col-md-12">
                    <Stack
                      direction="column"
                      spacing={4}
                      className="py-30 px-30 border-light rounded-8"
                    >
                      <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="space-between"
                      >
                        <div className="text-16 lh-16 fw-600 mt-5">Summary</div>
                        <button className="button rounded-24 py-4 px-15 text-reading border-primary -primary-1 fw-400 text-12 d-flex gap-25">
                          Download
                        </button>
                      </Stack>

                      <Box
                        sx={{
                          width: "100%",
                          overflowX: "auto",
                          display: "block",
                        }}
                      >
                        <Table>
                          {/* Table Header */}
                          <TableHead>
                            <TableRow>
                              <StyledTableCell>Item</StyledTableCell>
                              <StyledTableCell>Quantity</StyledTableCell>
                              <StyledTableCell>Amount (INR)</StyledTableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody className="table_body_main">
                            <TableRow>
                              <StyledTableCell>
                                Online Ticket Sales
                              </StyledTableCell>
                              <StyledTableCell>141</StyledTableCell>
                              <StyledTableCell>93949.59</StyledTableCell>
                            </TableRow>
                            <TableRow>
                              <StyledTableCell>
                                Manual Ticket Sales
                              </StyledTableCell>
                              <StyledTableCell>0</StyledTableCell>
                              <StyledTableCell>0</StyledTableCell>
                            </TableRow>
                            <TableRow>
                              <StyledTableCell className="fw-700">
                                Net Earnings
                              </StyledTableCell>
                              <StyledTableCell>142</StyledTableCell>
                              <StyledTableCell>87617.15</StyledTableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>
                    </Stack>
                  </div>

                  <div className="col-xl-12 col-md-12 y-gap-30">
                    <Stack
                      direction="column"
                      spacing={4}
                      className="py-30 px-30 border-light rounded-8"
                    >
                      <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="space-between"
                      >
                        <div className="text-16 lh-16 fw-600 mt-5">
                          Number of Tickets Sold
                        </div>
                        <button className="button rounded-24 py-4 px-15 text-reading border-primary -primary-1 fw-400 text-12 d-flex gap-25">
                          Download
                        </button>
                      </Stack>

                      <Box
                        sx={{
                          width: "100%",
                          overflowX: "auto",
                          display: "block",
                        }}
                      >
                        <Table>
                          {/* Table Header */}
                          <TableHead>
                            <TableRow>
                              <StyledTableCell>Item</StyledTableCell>
                              <StyledTableCell>Quantity</StyledTableCell>
                              <StyledTableCell>Amount (INR)</StyledTableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody className="table_body_main">
                            <TableRow>
                              <StyledTableCell>
                                Online Ticket Sales
                              </StyledTableCell>
                              <StyledTableCell>141</StyledTableCell>
                              <StyledTableCell>93949.59</StyledTableCell>
                            </TableRow>
                            <TableRow>
                              <StyledTableCell>
                                Manual Ticket Sales
                              </StyledTableCell>
                              <StyledTableCell>0</StyledTableCell>
                              <StyledTableCell>0</StyledTableCell>
                            </TableRow>
                            <TableRow>
                              <StyledTableCell className="fw-700">
                                Net Earnings
                              </StyledTableCell>
                              <StyledTableCell>142</StyledTableCell>
                              <StyledTableCell>87617.15</StyledTableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>

                      <div className="row">
                        <div className="col-xl-6 col-md-6">
                          <Stack className="py-15 px-15 border-light rounded-8">
                            <LineChart
                              xAxis={[
                                {
                                  scaleType: "point",
                                  data: ["Jun", "July", "August", "Sep", "Oct"],
                                },
                              ]}
                              series={[
                                {
                                  data: [500, 600, 350, 200, 350],
                                  label: "Tickets Sold",
                                  color: "#f05736",
                                },
                              ]}
                              sx={{
                                [`& .${lineElementClasses.root}`]: {
                                  stroke: "#f05736",
                                  strokeWidth: 2,
                                },
                                [`& .${markElementClasses.root}`]: {
                                  stroke: "#f05736",
                                  scale: "0.6",
                                  fill: "#fff",
                                  strokeWidth: 2,
                                  border: "5px solid #fffbee",
                                },
                              }}
                              width={500}
                              height={300}
                              grid={{ vertical: false, horizontal: true }}
                            />
                          </Stack>
                        </div>

                        <div className="col-xl-6 col-md-6">
                          <Stack
                            direction="column"
                            alignItems="center"
                            spacing={4}
                            className="py-30 px-30 border-light rounded-8"
                          >
                            <div className="text-16 lh-16 fw-600 mt-5">
                              Breakup of Tickets Sold
                            </div>

                            <Stack direction="row" alignItems="center">
                              <PieChart
                                className="pie-chart-report w-300"
                                colors={["#FBCDC3", "#C0462B", "#F3795E"]}
                                series={[
                                  {
                                    data: [1, 2]?.map((g, id) => {
                                      return {
                                        id: id,
                                        value: 40,
                                        label: "10K",
                                      };
                                    }),
                                    innerRadius: 50,
                                    paddingAngle: 0,
                                  },
                                ]}
                                sx={{ margin: "auto !important" }}
                                width={400}
                                height={200}
                                slotProps={{ legend: { hidden: true } }}
                              />

                              <Stack direction="row" spacing={4}>
                                {[1, 2].map((age, index) => {
                                  // const randomColor = getRandomColor(); // Get random color for each category
                                  const ageColors = [
                                    "#FBCDC3",
                                    "#C0462B",
                                    "#F3795E",
                                  ][index % ["pink", "orange", "brown"].length];

                                  return (
                                    <div className="boxes" key={index}>
                                      <div
                                        // className={randomColor}
                                        className="color-box"
                                        style={{ backgroundColor: ageColors }}
                                      />
                                      <Stack spacing={0.5}>
                                        <p className="text-12">10K</p>
                                        <p className="text-12 fw-600">50%</p>
                                      </Stack>
                                    </div>
                                  );
                                })}
                              </Stack>
                            </Stack>
                          </Stack>
                        </div>
                      </div>
                    </Stack>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Reports;
