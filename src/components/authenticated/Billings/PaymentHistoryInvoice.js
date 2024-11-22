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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

// Project imports
import {
  DefaultColumnFilter,
  renderFilterTypes,
  StyledTableCell,
  TablePagination,
} from "../../../utils/ReactTable";
import { RestfulApiService } from "../../../config/service";
import { decryptData } from "../../../utils/DataEncryption";

import { inrCurrency } from "../../../utils/UtilityFunctions";
import TableLoader from "../TableLoader";

function PaymentHistoryInvoice({ isShowingInvoice }) {
  const user = useSelector((state) => state.user.userProfile);
  const { event_id } = useParams();
  const [fetchingInvoice, setFetchingInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState([]);
  const tableColumns = useMemo(
    () => [
      {
        Header: "Payment Date",
        // Cell: ({ row }) => row.index + 1, // Hardcoded serial number starting from 1
        accessor: "Payment_Date",
      },
      {
        Header: "Total Amount",
        accessor: "Total_Amount",
        Cell: ({ row, value }) => inrCurrency(Number(value)), // Hardcoded serial number starting from 1
      },
      {
        Header: "Invoice No.",
        accessor: "Invoice_Number",
      },
    ],
    [] // Empty dependency array as this data is static
  );
  // Memoize dataColumns, it doesn't need to depend on tableData unless you need it in the columns
  // const dataColumns = useMemo(
  //   () => [...tableColumns],
  //   [tableColumns] // Remove tableData from the dependencies if it's not used
  // );
  const columns = useMemo(() => tableColumns, [tableColumns]);
  const data = useMemo(() => invoiceData, [invoiceData]);
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

  useEffect(() => {
    async function LoadInvoice() {
      const reqdata = {
        Method_Name: "MonthlyInvoice",
        From_Date: "",
        To_Date: "",
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
          console.log(result?.data?.Result?.Table1);
          setInvoiceData(result?.data?.Result?.Table1);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setFetchingInvoice(false);
      }
    }
    LoadInvoice();
  }, []);

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
  );
}

export default PaymentHistoryInvoice;
