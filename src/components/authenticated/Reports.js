// React imports
import React, { useCallback, useEffect, useState } from "react";

// MUI imports (separated)
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

// Third-party imports
import Select from "react-select";
import toast from "react-hot-toast";

// MUI X-Chart imports (separated)
import {
  LineChart,
  lineElementClasses,
  markElementClasses,
  PieChart,
} from "@mui/x-charts";

// Project-specific imports
import { customRoundedStyles } from "../../utils/ReactSelectStyles";
import { StyledTableCell } from "../../utils/ReactTable";
import { RestfulApiService } from "../../config/service";
import { useSelector } from "react-redux";
import { downloadExcel, inrCurrency } from "../../utils/UtilityFunctions";
import Loader from "../../utils/BackdropLoader";
import dayjs from "dayjs";

const initialValues = {
  Select_Event: { value: "All", label: "All" },
};
function Reports() {
  const user = useSelector((state) => state.user.userProfile);

  const [loading, setLoading] = useState(false);
  const [getData, setGetData] = useState({});
  const [getEventData, setGetEventData] = useState([]);
  const [storeData, setStoreData] = useState(initialValues);
  const [selectedTimeline, setSelectedTimeline] = useState({
    label: "All-time",
    value: "All-time",
  });
  const eventFilter = [
    {
      label: "Today",
      value: "Today",
    },
    {
      label: "1 Year",
      value: "1 Year",
    },
    {
      label: "6 Months",
      value: "6 Months",
    },
    {
      label: "3 Months",
      value: "3 Months",
    },
    {
      label: "All-time",
      value: "All-time",
    },
  ];

  const handleGetEvent = useCallback(async () => {
    setLoading(true);
    const reqdata = {
      Method_Name: "GetOrganizerEvent",
      Org_Id: user?.Org_Id,
      ParentField_Id: user?.Organizer_Id,
      SearchText: "",
      Session_User_Id: user?.User_Id,
    };
    try {
      setLoading(true);

      const {
        data: {
          Status,
          Result: { Table1 },
          Description,
        },
      } = await RestfulApiService(reqdata, "master/Getdropdown");
      if (Status !== 200) {
        toast.error(Description || "Something went wrong");
        return;
      }

      let newTable = Table1?.map((curItem) => ({
        label: curItem.Item_Name,
        value: curItem.Item_Id,
      }));
      newTable = [
        ...newTable,
        {
          label: "All",
          value: "All",
        },
      ];
      // setGetEventData(
      //   Table1?.map((curItem) => ({
      //     label: curItem.Item_Name,
      //     value: curItem.Item_Id,
      //   }))
      // );
      setGetEventData(newTable);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [user?.Org_Id, user?.Organizer_Id, user?.User_Id]);

  useEffect(() => {
    handleGetEvent();
  }, [handleGetEvent]);

  const handleGetData = useCallback(async () => {
    setLoading(true);

    let From_Date = "";
    let To_Date = "";

    const today = dayjs().format("YYYY-MM-DD");

    switch (selectedTimeline.value) {
      case "Today":
        From_Date = today;
        To_Date = today;
        break;
      case "1 Year":
        From_Date = dayjs().subtract(1, "year").format("YYYY-MM-DD");
        To_Date = today;
        break;
      case "6 Months":
        From_Date = dayjs().subtract(6, "months").format("YYYY-MM-DD");
        To_Date = today;
        break;
      case "3 Months":
        From_Date = dayjs().subtract(3, "months").format("YYYY-MM-DD");
        To_Date = today;
        break;
      case "All-time":
        From_Date = dayjs().subtract(3, "years").format("YYYY-MM-DD");
        To_Date = today;
        break;
      default:
        From_Date = "";
        To_Date = "";
    }

    const reqdata = {
      Method_Name: "toufiq_report",
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
      Org_Id: user?.Org_Id,
      Event_Id:
        storeData?.Select_Event?.value !== "All"
          ? storeData?.Select_Event?.value
          : "",
      From_Date,
      To_Date,
    };

    try {
      setLoading(true);

      const { data } = await RestfulApiService(reqdata, "organizer/reports");
      console.log(data?.Result);
      setGetData(data?.Result ?? {});
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [
    selectedTimeline,
    storeData?.Select_Event,
    user?.Org_Id,
    user?.Organizer_Id,
    user?.User_Display_Name,
    user?.User_Id,
  ]);

  useEffect(() => {
    handleGetData();
  }, [handleGetData]);

  const handleDownloadSummary = () => {
    const tableData = getData?.Table2?.map((item) => ({
      "Event Name": item?.Event_Name ?? "",
      Item: item?.Item ?? "",
      Quantity: item.Quantity ?? 0,
      "Amount (INR)": item.Amount ?? 0,
    }));

    // Call the utility function to download the Excel file
    downloadExcel(tableData, "Page Summary Data", "Page_Summary_Data");
  };
  const handleNumberOfTicketSold = () => {
    const tableData = getData?.Table3?.map((item) => ({
      "Event Name": item?.Event_Name ?? "",
      Item: item?.Ticket_Name ?? "",
      Quantity: item.Quantity ?? 0,
      "Amount (INR)": item.Sales ?? 0,
    }));
    // Call the utility function to download the Excel file
    downloadExcel(tableData, "Page Views Data", "Page_Views_Data");
  };

  const handleDownload = () => {
    const tableData = getData?.Table4?.map((item) => ({
      "Ticket Name": item.Event_Name ?? "",
      "Page Views": item.Number_count ?? 0,
    }));
    // Call the utility function to download the Excel file
    downloadExcel(tableData, "Page Views Data", "Page_Views_Data");
  };

  return (
    <div className="dashboard__main">
      <div className="dashboard__content pt-20">
        <section className="layout-pb-md">
          <div className="container">
            <div className="row y-gap-30">
              {false ? (
                <Loader fetching={false} />
              ) : (
                <>
                  <div className="col-xl-12 col-md-12">
                    <div className="row y-gap-30">
                      {/* <div className="col-xl-2 col-md-6">
                        <Select
                          styles={customRoundedStyles}
                          options={eventTime}
                          value={eventTime[0]}
                        />
                      </div> */}

                      <div className="col-xl-2 col-md-6">
                        <Select
                          styles={customRoundedStyles}
                          options={getEventData}
                          value={storeData.Select_Event}
                          placeholder="Select Event"
                          onChange={(selectedOption) => {
                            setStoreData((prevState) => ({
                              ...prevState,
                              Select_Event: selectedOption,
                            }));
                          }}
                        />
                      </div>

                      <div className="col-xl-2 col-md-6">
                        <Select
                          isSearchable={false}
                          styles={customRoundedStyles}
                          options={eventFilter}
                          value={selectedTimeline}
                          onChange={async (e) => {
                            setSelectedTimeline(e);
                            // handleDateFilter(e.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {getData?.Table1?.map((curData, index) => {
                    return (
                      <React.Fragment key={index}>
                        <div className="col-xl-3 col-md-6">
                          <div
                            className="py-30 px-30 border-primary rounded-24 bg-skin"
                            style={{
                              boxShadow:
                                "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                            }}
                          >
                            <div className="row y-gap-20 justify-between items-center">
                              <div className="col-12">
                                <div className="fw-500 lh-14 text-16 text-reading">
                                  Net Sales
                                </div>
                                <div className="text-26 lh-16 fw-700 mt-5 text-primary">
                                  {curData?.NetSales
                                    ? inrCurrency(curData?.NetSales)
                                    : `₹ 0`}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-xl-3 col-md-6">
                          <div
                            className="py-30 px-30 border-primary rounded-16 bg-skin"
                            style={{
                              boxShadow:
                                "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                            }}
                          >
                            <div className="row y-gap-20 justify-between items-center">
                              <div className="col-12">
                                <div className="fw-500 lh-14 text-16 text-reading">
                                  Net Earnings
                                </div>
                                <div className="text-26 lh-16 fw-700 mt-5 text-primary">
                                  {curData?.NetEarning
                                    ? inrCurrency(curData?.NetEarning)
                                    : `₹ 0`}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-xl-3 col-md-6">
                          <div
                            className="py-30 px-30 border-primary rounded-16 bg-skin"
                            style={{
                              boxShadow:
                                "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                            }}
                          >
                            <div className="row y-gap-20 justify-between items-center">
                              <div className="col-12">
                                <div className="fw-500 lh-14 text-16 text-reading">
                                  Refunds
                                </div>
                                <div className="text-26 lh-16 fw-700 mt-5 text-primary">
                                  {curData?.Refunds
                                    ? inrCurrency(curData?.Refunds)
                                    : `₹ 0`}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-xl-3 col-md-6">
                          <div
                            className="py-30 px-30 border-primary rounded-16 bg-skin"
                            style={{
                              boxShadow:
                                "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                            }}
                          >
                            <div className="row y-gap-20 justify-between items-center">
                              <div className="col-12">
                                <div className="fw-500 lh-14 text-16 text-reading">
                                  Registrations
                                </div>
                                <div className="text-26 lh-16 fw-700 mt-5 text-primary">
                                  {curData?.Registration
                                    ? curData?.Registration
                                    : 0}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}

                  {getData?.Table2?.length > 0 ? (
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
                          <div className="text-16 lh-16 fw-600 mt-5">
                            Summary
                          </div>
                          <button
                            className="button rounded-24 py-4 px-15 text-reading border-primary -primary-1 fw-400 text-12 d-flex gap-25"
                            onClick={handleDownloadSummary}
                          >
                            <i className="fas fa-download"></i>
                          </button>
                        </Stack>
                        {getData?.Table2?.length > 0 && (
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
                                  <StyledTableCell>Event Name</StyledTableCell>
                                  <StyledTableCell>Item</StyledTableCell>
                                  <StyledTableCell>Quantity</StyledTableCell>
                                  <StyledTableCell>
                                    Amount (INR)
                                  </StyledTableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody className="table_body_main">
                                {getData?.Table2?.length &&
                                  getData?.Table2?.map((curData, index) => {
                                    return (
                                      <TableRow key={index}>
                                        <StyledTableCell>
                                          {curData?.Event_Name ?? ""}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                          {curData?.Item ?? ""}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                          {curData?.Quantity ?? 0}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                          {curData?.Amount
                                            ? inrCurrency(curData?.Amount)
                                            : 0}
                                        </StyledTableCell>
                                      </TableRow>
                                    );
                                  })}
                              </TableBody>
                            </Table>
                          </Box>
                        )}
                      </Stack>
                    </div>
                  ) : (
                    <></>
                  )}

                  {/* ====== extra ======= */}
                  {getData?.Table4?.length > 0 && (
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
                          <div className="text-16 lh-16 fw-600 mt-5">
                            Page Views
                          </div>
                          <button
                            className="button rounded-24 py-4 px-15 text-reading border-primary -primary-1 fw-400 text-12 d-flex gap-25"
                            onClick={handleDownload}
                          >
                            <i className="fas fa-download"></i>
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
                                <StyledTableCell>Ticket Name</StyledTableCell>
                                <StyledTableCell>Page Views</StyledTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody className="table_body_main">
                              {getData?.Table4?.length &&
                                getData?.Table4?.map((curData, index) => {
                                  return (
                                    <TableRow key={index}>
                                      <StyledTableCell>
                                        {curData?.Event_Name ?? ""}
                                      </StyledTableCell>
                                      <StyledTableCell>
                                        {curData?.Number_count ?? 0}
                                      </StyledTableCell>
                                    </TableRow>
                                  );
                                })}
                            </TableBody>
                          </Table>
                        </Box>
                      </Stack>
                    </div>
                  )}

                  {getData?.Table3?.length > 0 && (
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
                          <button
                            className="button rounded-24 py-4 px-15 text-reading border-primary -primary-1 fw-400 text-12 d-flex gap-25"
                            onClick={handleNumberOfTicketSold}
                          >
                            <i className="fas fa-download"></i>
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
                                <StyledTableCell>Event Name</StyledTableCell>
                                <StyledTableCell>Item</StyledTableCell>
                                <StyledTableCell>Quantity</StyledTableCell>
                                <StyledTableCell>Amount (INR)</StyledTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody className="table_body_main">
                              {getData?.Table3?.length &&
                                getData?.Table3?.map((curData) => {
                                  return (
                                    <TableRow>
                                      <StyledTableCell>
                                        {curData?.Event_Name ?? ""}
                                      </StyledTableCell>
                                      <StyledTableCell>
                                        {curData?.Ticket_Name ?? ""}
                                      </StyledTableCell>
                                      <StyledTableCell>
                                        {curData?.Quantity
                                          ? curData?.Quantity
                                          : 0}
                                      </StyledTableCell>
                                      <StyledTableCell>
                                        {curData?.Sales
                                          ? inrCurrency(curData?.Sales)
                                          : 0}
                                      </StyledTableCell>
                                    </TableRow>
                                  );
                                })}
                            </TableBody>
                          </Table>
                        </Box>

                        <div className="row">
                          <div className="col-xl-12 col-md-12">
                            <Stack className="py-15 px-15 border-light rounded-8 w-full">
                              <LineChart
                                className="w-full"
                                xAxis={[
                                  {
                                    scaleType: "point",
                                    // data: [
                                    //   "Jun",
                                    //   "July",
                                    //   "August",
                                    //   "Sep",
                                    //   "Oct",
                                    // ],
                                    data: getData?.Table3?.map(
                                      (curData) => curData?.Ticket_Name
                                    ), // Dynamic x-axis labels
                                  },
                                ]}
                                series={[
                                  {
                                    // data: [500, 600, 350, 200, 350],
                                    data: getData?.Table3?.map(
                                      (curData) => curData?.Quantity
                                    ),

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

                          <div className="col-xl-12 col-md-12 mt-20">
                            <Stack
                              direction="column"
                              alignItems="flex-start"
                              spacing={4}
                              className="py-30 px-30 border-light rounded-8"
                            >
                              <div className="text-16 lh-16 fw-600 mt-5">
                                Breakup of Tickets Sold
                              </div>

                              <Stack
                                direction="column"
                                alignItems="flex-start"
                                className="w-full"
                              >
                                <PieChart
                                  className="pie-chart-report w-200"
                                  colors={["#FBCDC3", "#C0462B", "#F3795E"]}
                                  series={[
                                    {
                                      data: getData?.Table3?.map((g, id) => {
                                        return {
                                          id: id,
                                          value: g?.Quantity,
                                          label: g?.Ticket_Name,
                                        };
                                      }),
                                      innerRadius: 60,
                                      paddingAngle: 0,
                                    },
                                  ]}
                                  sx={{ margin: "auto !important" }}
                                  width={300}
                                  height={200}
                                  slotProps={{ legend: { hidden: true } }}
                                />

                                <div className="row y-gap-20 mt-20 w-full">
                                  {getData?.Table3?.map((curData, index) => {
                                    // const randomColor = getRandomColor(); // Get random color for each category
                                    const ageColors = [
                                      "#FBCDC3",
                                      "#C0462B",
                                      "#F3795E",
                                    ][
                                      index % ["pink", "orange", "brown"].length
                                    ];

                                    return (
                                      <div className="col-3">
                                        <div className="boxes" key={index}>
                                          <div
                                            // className={randomColor}
                                            className="color-box"
                                            style={{
                                              backgroundColor: ageColors,
                                            }}
                                          />

                                          <Stack>
                                            <p
                                              className="text-12"
                                              style={{
                                                // whiteSpace: "nowrap",
                                                // overflow: "hidden",
                                                // textOverflow: "ellipsis",
                                                // width: "50px",
                                                display: "inline-block",
                                                position: "relative",
                                              }}
                                              title={curData?.Event_Name} // Tooltip effect on hover
                                            >
                                              {curData?.Event_Name}
                                              {/* {curData?.Event_Name?.length > 5
                                                ? `${curData?.Event_Name.slice(
                                                    0,
                                                    curData?.Event_Name[4] ===
                                                      " "
                                                      ? 4
                                                      : 5
                                                  )}...`
                                                : curData?.Event_Name ?? ""} */}
                                            </p>
                                            <p
                                              className="text-12"
                                              style={{
                                                // whiteSpace: "nowrap",
                                                // overflow: "hidden",
                                                // textOverflow: "ellipsis",
                                                // width: "50px",
                                                display: "inline-block",
                                                position: "relative",
                                              }}
                                              title={curData?.Ticket_Name} // Tooltip effect on hover
                                            >
                                              {curData?.Ticket_Name}
                                              {/* {curData?.Ticket_Name?.length > 5
                                                ? `${curData?.Ticket_Name.slice(
                                                    0,
                                                    curData?.Ticket_Name[4] ===
                                                      " "
                                                      ? 4
                                                      : 5
                                                  )}...`
                                                : curData?.Ticket_Name ?? ""} */}
                                            </p>

                                            <p className="text-12 fw-600">
                                              Tickets Sold:{" "}
                                              {curData?.Quantity ?? 0}
                                            </p>
                                          </Stack>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </Stack>
                            </Stack>
                          </div>
                        </div>
                      </Stack>
                    </div>
                  )}
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
