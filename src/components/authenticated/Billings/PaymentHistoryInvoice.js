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

function PaymentHistoryInvoice() {
  const tableColumns = useMemo(
    () => [
      {
        Header: "Date",
        // Cell: ({ row }) => row.index + 1, // Hardcoded serial number starting from 1
        accessor: "Participant_ID",
      },
      {
        Header: "Amount",
        accessor: "Amount_paid",
      },
      {
        Header: "Invoice No",
        accessor: "Payment_time",
      },
      //   {
      //     Header: "Race Category",
      //     accessor: "Event_Category_Name",
      //     Filter: SelectColumnFilter,
      //     // filter: "includes", // Use the custom multiSelect filter
      //     filter: "multiSelect", // Use the custom multiSelect filter
      //   },
    ],
    [] // Empty dependency array as this data is static
  );
  // Memoize dataColumns, it doesn't need to depend on tableData unless you need it in the columns
  const dataColumns = useMemo(
    () => [
      ...tableColumns,
      {
        Header: "Actions",
        right: true,
        Cell: ({ value, row }) => {
          const [isEditing, setIsEditing] = useState(false);
          const [isResending, setIsResending] = useState(false);
          const [isDownloadingTicket, setIsDownloadingTicket] = useState(false);

          return (
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              {isResending ? (
                <CircularProgress
                  color="inherit"
                  style={{ height: "12px", width: "12px" }}
                />
              ) : (
                <WhiteSingleTooltip placement="top" title="Download">
                  <i
                    onClick={async () => {}}
                    className="fas fa-download action-button"
                  ></i>
                </WhiteSingleTooltip>
              )}
            </Stack>
          );
        },
      },
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
  );
}

export default PaymentHistoryInvoice;
