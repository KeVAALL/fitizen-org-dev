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
import { decryptData } from "../../../utils/storage";
import {
  customRoundedStyles,
  selectCustomStyle,
} from "../../../utils/selectCustomStyle";
import PaymentHistoryInvoice from "./PaymentHistoryInvoice";

function PaymentHistory({ setShowPaymentHistory }) {
  const [isShowingHistory, setIsShowingHistory] = useState(true);
  const [isShowingInvoice, setIsShowingInvoice] = useState(false);

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
  const tableColumns = useMemo(
    () => [
      {
        Header: "Payment ID",
        // Cell: ({ row }) => row.index + 1, // Hardcoded serial number starting from 1
        accessor: "Participant_ID",
      },
      {
        Header: "Amount Paid",
        accessor: "Amount_paid",
      },
      {
        Header: "Payment Date/ Time",
        accessor: "Payment_time",
      },
    ],
    [] // Empty dependency array as this data is static
  );
  // Memoize dataColumns, it doesn't need to depend on tableData unless you need it in the columns
  const dataColumns = useMemo(
    () => [
      ...tableColumns,
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
    ],
    [tableColumns] // Remove tableData from the dependencies if it's not used
  );
  const columns = useMemo(() => dataColumns, [dataColumns]);
  const data = useMemo(() => [], []);
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
      // initialState: {
      //   pageIndex: 0,
      //   pageSize: 10,
      // },
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
              <button className="button rounded-24 w-170 h-40 py-3 px-20 text-reading border-light -primary-1 fw-400 text-12 d-flex gap-20">
                Download Data
                <i className="fas fa-download text-14"></i>
              </button>
            )}
            <div className="col-xl-3 col-md-6">
              <Select
                isSearchable={false}
                styles={customRoundedStyles}
                options={eventTime}
                value={eventTime[0]}
              />
            </div>
          </Stack>

          <div className="text-16 lh-16 fw-600 mt-5">
            Total Amount Paid:{" "}
            <span className="text-16 fw-600 mt-5 text-primary">
              ₹ 2649993.73
            </span>
          </div>
        </Stack>

        {isShowingInvoice ? (
          <PaymentHistoryInvoice />
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
                          onClick={() => {
                            row.toggleRowSelected();
                          }}
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
