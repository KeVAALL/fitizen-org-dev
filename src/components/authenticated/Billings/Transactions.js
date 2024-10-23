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
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Link,
  Modal,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import Select from "react-select";
import toast from "react-hot-toast";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

// Project imports
import {
  DefaultColumnFilter,
  GlobalFilter,
  renderFilterTypes,
  SelectColumnFilter,
  StyledTableCell,
  TablePagination,
  IndeterminateCheckbox,
} from "../../../utils/ReactTable";
import { WhiteSingleTooltip, WhiteTooltip } from "../../../utils/Tooltip";
import {
  RestfulApiServiceDownload,
  RestfulApiService,
} from "../../../config/service";
import { decryptData } from "../../../utils/DataEncryption";
import {
  customRoundedStyles,
  selectCustomStyle,
} from "../../../utils/ReactSelectStyles";
import TableLoader from "../TableLoader";
import { downloadExcel, inrCurrency } from "../../../utils/UtilityFunctions";
import dayjs from "dayjs";

function Transactions({ setShowTransactions }) {
  const user = useSelector((state) => state.user.userProfile);
  const { event_id } = useParams();
  const [fetchingTransaction, setFetchingTransaction] = useState(false);
  const [transactionData, setTransactionData] = useState([]);

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
        Header: "Name",
        // Cell: ({ row }) => row.index + 1, // Hardcoded serial number starting from 1
        accessor: "Name",
      },
      {
        Header: "Email ID",
        accessor: "Email_Id",
      },
      {
        Header: "Amount",
        accessor: "Amount",
        Cell: ({ row, value }) => inrCurrency(value),
      },
    ],
    [] // Empty dependency array as this data is static
  );
  // Memoize dataColumns, it doesn't need to depend on tableData unless you need it in the columns
  const columns = useMemo(() => tableColumns, [tableColumns]);
  const data = useMemo(() => transactionData, [transactionData]);
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
    }

    // API request data
    const reqdata = {
      Method_Name: "Transaction",
      From_Date,
      To_Date,
      Event_Id: decryptData(event_id),
      Organizer_Id: user?.Organizer_Id,
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
    };
    try {
      setFetchingTransaction(true);
      const result = await RestfulApiService(reqdata, "organizer/billings");
      if (result) {
        setTransactionData(result?.data?.Result?.Table1);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setFetchingTransaction(false);
    }
  };
  const handleDownloadData = () => {
    const tableData = transactionData?.map((item) => ({
      Name: item?.Name ?? "",
      "Email ID": item?.Email_Id ?? 0,
      Amount: inrCurrency(item.Amount) ?? "",
    }));

    // Call the utility function to download the Excel file
    downloadExcel(tableData, "Transaction", "Transaction_History");
  };
  async function LoadTransactions() {
    const reqdata = {
      Method_Name: "Transaction",
      From_Date: "",
      To_Date: "",
      Event_Id: decryptData(event_id),
      Organizer_Id: user?.Organizer_Id,
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
    };
    try {
      setFetchingTransaction(true);
      const result = await RestfulApiService(reqdata, "organizer/billings");
      if (result) {
        setTransactionData(result?.data?.Result?.Table1);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setFetchingTransaction(false);
    }
  }
  useEffect(() => {
    LoadTransactions();
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
                setShowTransactions(false);
              }}
              className="button rounded-full py-12 px-15 w-40 h-40 text-reading border-light -primary-1 fw-400 text-12 d-flex gap-25"
            >
              <i className="fas fa-chevron-left text-14"></i>
            </button>
            {/* 
            <button className="button rounded-24 w-250 h-40 py-3 px-20 text-reading border-light -primary-1 fw-400 text-12 d-flex gap-20">
              Download Transactions List
              <i className="fas fa-download text-14"></i>
            </button> */}

            <button
              onClick={(e) => {
                e.preventDefault();
                handleDownloadData();
              }}
              className="button rounded-24 w-200 h-40 py-3 px-20 text-reading border-light -primary-1 fw-400 text-12 d-flex gap-20"
            >
              Download Invoices
              <i className="fas fa-download text-14"></i>
            </button>

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

          <GlobalFilter
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            sx={{ borderRadius: "50% !important" }}
          />
        </Stack>

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

            {fetchingTransaction ? (
              <TableLoader columns={columns} />
            ) : (
              <TableBody className="table_body_main" {...getTableBodyProps()}>
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
      </Stack>
    </div>
  );
}

export default Transactions;
