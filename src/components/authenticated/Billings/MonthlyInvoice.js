// React imports
import React, { useEffect, useMemo, useState } from "react";

// Third-party imports
import {
  useTable,
  usePagination,
  useGlobalFilter,
  useFilters,
  useRowSelect,
  useSortBy,
} from "react-table";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Select from "react-select";
import dayjs from "dayjs";

// MUI imports
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

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
import { inrCurrency } from "../../../utils/UtilityFunctions";
import TableLoader from "../TableLoader";

function MonthlyInvoice({ setShowMonthlyInvoice }) {
  const user = useSelector((state) => state.user.userProfile);
  const { event_id } = useParams();

  const [fetchingInvoice, setFetchingInvoice] = useState(false);
  const [monthlyInvoiceData, setMonthlyInvoiceData] = useState([]);
  const [totalPayment, setTotalPayment] = useState(0);
  const [isShowingInvoice, setIsShowingInvoice] = useState(true);

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
        Header: "Date",
        accessor: "Payment_Date",
      },
      {
        Header: "Amount Paid",
        accessor: "Total_Amount",
        Cell: ({ row, value }) => inrCurrency(Number(value)), // Hardcoded serial number starting from 1
      },
      {
        Header: "Invoice No",
        accessor: "Invoice_Number",
      },
      {
        Header: "Actions",
        Cell: ({ value, row }) => {
          const [isDownloadingTicket, setIsDownloadingTicket] = useState(false);

          return (
            <Stack direction="row" justifyContent="center">
              <Stack
                className="action-button"
                direction="row"
                alignItems="center"
              >
                <i className="fas fa-download text-18"></i>
              </Stack>
            </Stack>
          );
        },
      },
    ],
    [] // Empty dependency array as this data is static
  );
  // Memoize dataColumns, it doesn't need to depend on tableData unless you need it in the columns
  const columns = useMemo(() => tableColumns, [tableColumns]);
  const data = useMemo(() => monthlyInvoiceData, [monthlyInvoiceData]);
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
    } else if (timeRange === "All") {
      From_Date = dayjs().subtract(1, "year").format("YYYY-MM-DD");
      To_Date = today;
    }

    // API request data
    const reqdata = {
      Method_Name: "MonthlyInvoice",
      From_Date,
      To_Date,
      Event_Id: decryptData(event_id),
      Organizer_Id: user?.Organizer_Id,
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
    };

    try {
      setFetchingInvoice(true);
      const result = await RestfulApiService(reqdata, "organizer/billings");
      if (result) {
        setMonthlyInvoiceData(result?.data?.Result?.Table1);
        const totalPayment = result?.data?.Result?.Table1.reduce(
          (accumulator, currentValue) =>
            accumulator + currentValue.Total_Amount,
          0
        );
        setTotalPayment(totalPayment);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setFetchingInvoice(false);
    }
  };
  async function LoadMonthlyInvoice() {
    const reqdata = {
      Method_Name: "MonthlyInvoice",
      // From_Date: "",
      From_Date: dayjs().subtract(1, "year").format("YYYY-MM-DD"),
      // To_Date: "",
      To_Date: dayjs().format("YYYY-MM-DD"),
      Event_Id: decryptData(event_id),
      Organizer_Id: user?.Organizer_Id,
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
    };
    try {
      setFetchingInvoice(true);
      const result = await RestfulApiService(reqdata, "organizer/billings");
      if (result) {
        setMonthlyInvoiceData(result?.data?.Result?.Table1);
        const totalPayment = result?.data?.Result?.Table1.reduce(
          (accumulator, currentValue) =>
            accumulator + currentValue.Total_Amount,
          0
        );
        setTotalPayment(totalPayment);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setFetchingInvoice(false);
    }
  }
  useEffect(() => {
    LoadMonthlyInvoice();
  }, []);

  return (
    <div className="col-xl-12 col-md-12">
      <Stack
        direction="column"
        spacing={4}
        className="py-30 px-30 border-light rounded-8"
      >
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Stack direction="row" spacing={2}>
            <button
              onClick={(e) => {
                setShowMonthlyInvoice(false);
              }}
              className="button rounded-full py-12 px-15 w-40 h-40 text-reading border-light -primary-1 fw-400 text-12 d-flex gap-25"
            >
              <i className="fas fa-chevron-left text-14"></i>
            </button>

            <button
              className={`button rounded-24 w-170 h-40 py-3 px-20 border-light -primary-1 fw-400 text-12 d-flex gap-20${
                isShowingInvoice ? " bg-primary text-white" : " text-reading"
              }`}
              onClick={() => {
                setIsShowingInvoice(true);
              }}
            >
              Invoices
            </button>
            {/* <button
                onClick={(e) => {
                  e.preventDefault();
                  handleDownloadData();
                }}
                className="button rounded-24 w-170 h-40 py-3 px-20 text-reading border-light -primary-1 fw-400 text-12 d-flex gap-20"
              >
                Download Data
                <i className="fas fa-download text-14"></i>
              </button> */}
            <div className="col-xl-4 col-md-6">
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
              {inrCurrency(Number(totalPayment))}
            </span>
          </div>
        </Stack>

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
                    className="last-header-center"
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
                      </StyledTableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>

              {fetchingInvoice ? (
                <TableLoader columns={columns} />
              ) : (
                <TableBody className="table_body_main" {...getTableBodyProps()}>
                  {page.length > 0 ? (
                    page.map((row) => {
                      prepareRow(row);
                      return (
                        <TableRow
                          key={row.id}
                          {...row.getRowProps()}
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
      </Stack>
    </div>
  );
}

export default MonthlyInvoice;
