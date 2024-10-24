// React imports
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

// Third-party imports
import {
  useTable,
  usePagination,
  useGlobalFilter,
  useFilters,
  useRowSelect,
  useSortBy,
} from "react-table";
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import Select from "react-select";

// Project imports
import {
  DefaultColumnFilter,
  renderFilterTypes,
  StyledTableCell,
  TablePagination,
} from "../../../utils/ReactTable";
import { RestfulApiService } from "../../../config/service";
import { decryptData } from "../../../utils/DataEncryption";
import { customRoundedStyles } from "../../../utils/ReactSelectStyles";
import PaymentHistoryInvoice from "./PaymentHistoryInvoice";
import { inrCurrency } from "../../../utils/UtilityFunctions";
import { downloadExcel } from "../../../utils/UtilityFunctions";
import TableLoader from "../TableLoader";
import dayjs from "dayjs";

function PaymentHistory({ setShowPaymentHistory }) {
  const user = useSelector((state) => state.user.userProfile);
  const { event_id } = useParams();

  const [fetchingHistory, setFetchingHistory] = useState(false);
  const [paymentHistoryData, setPaymentHistoryData] = useState([]);
  const [totalPayment, setTotalPayment] = useState(0);
  const [isShowingHistory, setIsShowingHistory] = useState(true);
  const [isShowingInvoice, setIsShowingInvoice] = useState(false);

  const eventTime = [
    { label: "All Time", value: "All" },
    {
      label: "Today",
      value: "Today",
    },
    {
      label: "Yesterday",
      value: "Yesterday",
    },
    {
      label: "This Week",
      value: "Week",
    },
    {
      label: "This Month",
      value: "Month",
    },
    {
      label: "This Year",
      value: "Year",
    },
  ];
  const [selectedTimeRange, setSelectedTimeRange] = useState(eventTime[0]);
  const tableColumns = useMemo(
    () => [
      {
        Header: "Payment ID",
        // Cell: ({ row }) => row.index + 1, // Hardcoded serial number starting from 1
        accessor: "Payment_Id",
      },
      {
        Header: "Amount Paid",
        accessor: "Amount_Paid",
        Cell: ({ row, value }) => inrCurrency(value), // Hardcoded serial number starting from 1
      },
      {
        Header: "Payment Date/ Time",
        accessor: "Payment_Date",
      },
    ],
    [] // Empty dependency array as this data is static
  );
  // Memoize dataColumns, it doesn't need to depend on tableData unless you need it in the columns
  const columns = useMemo(() => tableColumns, [tableColumns]);
  const data = useMemo(() => paymentHistoryData, [paymentHistoryData]);
  const filterTypes = useMemo(() => renderFilterTypes, []);
  const defaultColumn = useMemo(() => ({ Filter: DefaultColumnFilter }), []);

  const initialState = useMemo(
    () => ({
      filters: [{ id: "status", value: "" }],
      pageIndex: 0,
      pageSize: 10,
      selectedRowIds: {},
    }),
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    rows,
    gotoPage,
    setPageSize,
    preGlobalFilteredRows,
    setGlobalFilter,
    setHiddenColumns,
    allColumns,
    state: { pageIndex, pageSize, globalFilter, hiddenColumns, selectedRowIds },
    selectedFlatRows,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState,
      filterTypes,
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    usePagination,
    useRowSelect
    // (hooks) => {
    //   hooks.allColumns.push((columns) => [
    //     {
    //       id: "row-selection-chk",
    //       accessor: "Selection",
    //       disableFilters: true,
    //       disableSortBy: true,
    //       disableGroupBy: true,
    //       groupByBoundary: true,
    //       Header: ({ getToggleAllPageRowsSelectedProps }) => (
    //         <IndeterminateCheckbox
    //           indeterminate
    //           {...getToggleAllPageRowsSelectedProps()}
    //         />
    //       ),
    //       Cell: ({ row }) => (
    //         <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
    //       ),
    //     },
    //     ...columns,
    //   ]);
    // }
  );
  const handleSelectChange = (selectedOption) => {
    setSelectedTimeRange(selectedOption);
    handleDateFilter(selectedOption.value); // Pass the selected value to handleAPICall
  };
  const handleDateFilter = async (timeRange) => {
    let From_Date = "";
    let To_Date = "";

    const today = dayjs().format("YYYY-MM-DD"); // Current date
    if (timeRange === "Today") {
      From_Date = today;
      To_Date = today;
    } else if (timeRange === "Yesterday") {
      From_Date = dayjs().subtract(1, "day").format("YYYY-MM-DD");
      To_Date = From_Date;
    } else if (timeRange === "Week") {
      From_Date = dayjs().subtract(7, "day").format("YYYY-MM-DD");
      To_Date = today;
    } else if (timeRange === "Month") {
      From_Date = dayjs().subtract(1, "month").format("YYYY-MM-DD");
      To_Date = today;
    } else if (timeRange === "Year") {
      From_Date = dayjs().subtract(1, "year").format("YYYY-MM-DD");
      To_Date = today;
    }

    // API request data
    const reqdata = {
      Method_Name: "PaymentHistory",
      From_Date,
      To_Date,
      Event_Id: decryptData(event_id),
      Organizer_Id: user?.Organizer_Id,
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
    };

    try {
      setFetchingHistory(true);
      const result = await RestfulApiService(reqdata, "organizer/billings");
      if (result) {
        setPaymentHistoryData(result?.data?.Result?.Table1);
        const totalPayment = result?.data?.Result?.Table1.reduce(
          (accumulator, currentValue) => accumulator + currentValue.Amount_Paid,
          0
        );
        setTotalPayment(totalPayment);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setFetchingHistory(false);
    }
  };
  const handleDownloadData = () => {
    const tableData = paymentHistoryData?.map((item) => ({
      "Payment ID": item?.Payment_Id ?? "",
      "Amount Paid": inrCurrency(item.Amount_Paid) ?? 0,
      "Payment Date/ Time": item.Payment_Date ?? "",
    }));

    // Call the utility function to download the Excel file
    downloadExcel(tableData, "Payment History", "Payment_History");
  };
  async function LoadPaymentHistory() {
    const reqdata = {
      Method_Name: "PaymentHistory",
      From_Date: "",
      To_Date: "",
      Event_Id: decryptData(event_id),
      Organizer_Id: user?.Organizer_Id,
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
    };
    try {
      setFetchingHistory(true);
      const result = await RestfulApiService(reqdata, "organizer/billings");
      if (result) {
        setPaymentHistoryData(result?.data?.Result?.Table1);
        const totalPayment = result?.data?.Result?.Table1.reduce(
          (accumulator, currentValue) => accumulator + currentValue.Amount_Paid,
          0
        );
        setTotalPayment(totalPayment);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setFetchingHistory(false);
    }
  }
  useEffect(() => {
    LoadPaymentHistory();
  }, []);

  return (
    <div className="col-xl-12 col-md-12">
      <Stack
        direction="column"
        spacing={4}
        className="py-30 px-30 border-light rounded-8"
      >
        <Stack direction="row" spacing={2} justifyContent="space-between">
          {/* <GlobalFilter
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          /> */}
          <Stack direction="row" spacing={2}>
            <button
              onClick={(e) => {
                setShowPaymentHistory(false);
              }}
              className="button rounded-full py-12 px-15 w-40 h-40 text-reading border-light -primary-1 fw-400 text-12 d-flex gap-25"
            >
              <i className="fas fa-chevron-left text-14"></i>
            </button>
            <button
              className={`button rounded-24 w-170 h-40 py-3 px-20 border-light -primary-1 fw-400 text-12 d-flex gap-20${
                isShowingHistory ? " bg-primary text-white" : " text-reading"
              }`}
              onClick={() => {
                setIsShowingHistory(true);
                setIsShowingInvoice(false);
              }}
            >
              Payment History
            </button>
            <button
              className={`button rounded-24 w-170 h-40 py-3 px-20 border-light -primary-1 fw-400 text-12 d-flex gap-20${
                isShowingInvoice ? " bg-primary text-white" : " text-reading"
              }`}
              onClick={() => {
                setIsShowingHistory(false);
                setIsShowingInvoice(true);
              }}
            >
              Invoices
            </button>
            {!isShowingInvoice && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleDownloadData();
                }}
                className="button rounded-24 w-170 h-40 py-3 px-20 text-reading border-light -primary-1 fw-400 text-12 d-flex gap-20"
              >
                Download Data
                <i className="fas fa-download text-14"></i>
              </button>
            )}
            <div className="col-xl-3 col-md-6">
              <Select
                isSearchable={false}
                styles={customRoundedStyles}
                options={eventTime}
                value={selectedTimeRange}
                onChange={handleSelectChange}
              />
            </div>
          </Stack>

          <div className="text-16 lh-16 fw-600 mt-5">
            Total Amount Paid:{" "}
            <span className="text-16 fw-600 mt-5 text-primary">
              {inrCurrency(totalPayment)}
            </span>
          </div>
        </Stack>

        {isShowingInvoice ? (
          <PaymentHistoryInvoice isShowingInvoice={isShowingInvoice} />
        ) : (
          <>
            <Box
              sx={{
                width: "100%",
                overflowX: "auto",
                display: "block",
              }}
            >
              <Table {...getTableProps()}>
                <TableHead>
                  {headerGroups.map((headerGroup) => (
                    <TableRow
                      // className="last-header-right"
                      key={headerGroup.id}
                      {...headerGroup.getHeaderGroupProps()}
                      //   sx={{
                      //     "& > th:first-of-type": { width: "58px" },
                      //   }}
                    >
                      {headerGroup.headers.map((column) => (
                        <StyledTableCell
                          key={column.id}
                          {...column.getHeaderProps({
                            style: { minWidth: column.minWidth },
                          })}
                          sx={{
                            border: "1px solid #dbe0e5a6",
                          }}
                        >
                          {column.render("Header")}
                          {/* <HeaderSort column={column} /> */}
                        </StyledTableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableHead>

                {fetchingHistory ? (
                  <TableLoader columns={columns} />
                ) : (
                  <TableBody
                    className="table_body_main"
                    {...getTableBodyProps()}
                  >
                    {/* {headerGroups.map((group) => (
                <TableRow key={group} {...group.getHeaderGroupProps()}>
                  {group.headers.map((column) => (
                    <TableCell
                      key={column}
                      {...column.getHeaderProps([
                        { className: column.className },
                      ])}
                    >
                      {column.canFilter ? column.render("Filter") : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))} */}
                    {page.length > 0 ? (
                      page.map((row) => {
                        prepareRow(row);
                        return (
                          <TableRow
                            key={row.id}
                            {...row.getRowProps()}
                            // onClick={() => {
                            //   row.toggleRowSelected();
                            // }}
                            sx={{
                              cursor: "pointer",
                              bgcolor: row.isSelected ? "#FFFBEE" : "inherit",
                            }}
                          >
                            {row.cells.map((cell) => (
                              <StyledTableCell
                                key={cell.column.id}
                                {...cell.getCellProps({
                                  style: {
                                    minWidth: cell.column.minWidth,
                                  },
                                })}
                                sx={{
                                  border: "1px solid #dbe0e5a6",
                                }}
                              >
                                {cell.column.customCell ? (
                                  <cell.column.customCell value={cell.value} />
                                ) : (
                                  cell.render("Cell")
                                )}
                              </StyledTableCell>
                            ))}
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length + 1} align="center">
                          No Data Found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                )}
              </Table>
            </Box>
            <Box sx={{}}>
              <TablePagination
                gotoPage={gotoPage}
                rows={data}
                setPageSize={setPageSize}
                pageIndex={pageIndex}
                pageSize={pageSize}
              />
            </Box>
          </>
        )}
      </Stack>
    </div>
  );
}

export default PaymentHistory;

// initialState: {
//   pageIndex: 0,
//   pageSize: 10,
// },
//   {
//     Header: "Actions",
//     right: true,
//     Cell: ({ value, row }) => {
//       const [isEditing, setIsEditing] = useState(false);
//       const [isResending, setIsResending] = useState(false);
//       const [isDownloadingTicket, setIsDownloadingTicket] = useState(false);

//       return (
//         <Stack direction="row" justifyContent="space-between" spacing={4}>
//           {isResending ? (
//             <CircularProgress
//               color="inherit"
//               style={{ height: "12px", width: "12px" }}
//             />
//           ) : (
//             <WhiteSingleTooltip placement="top" title="Resend Ticket">
//               <i
//                 onClick={async () => {}}
//                 className="fas fa-file-upload action-button"
//               ></i>
//             </WhiteSingleTooltip>
//           )}
//         </Stack>
//       );
//     },
//   },
