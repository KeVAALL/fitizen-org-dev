import React from "react";
// React imports
import { useEffect, useMemo, useState } from "react";

// Third-party imports
// React Router and Redux imports
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useTable,
  usePagination,
  useGlobalFilter,
  useFilters,
  useRowSelect,
  useSortBy,
} from "react-table";
import Select from "react-select";
import Swal from "sweetalert2";

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
  TablePagination,
  StyledDotedTableCell,
} from "../../utils/ReactTable";
import { decryptData } from "../../utils/DataEncryption";
import { WhiteSingleTooltip } from "../../utils/Tooltip";
import { RestfulApiService } from "../../config/service";
import { customRoundedStyles } from "../../utils/ReactSelectStyles";
import EventTitle from "./EventTitle";
import Loader from "../../utils/BackdropLoader";
import TableLoader from "./TableLoader";

function Reviews() {
  const { event_id } = useParams();
  const user = useSelector((state) => state.user.userProfile);
  const [fetchingReview, setFetchingReview] = useState(false);
  const [fetchingReviewCat, setFetchingReviewCat] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [eventRating, setEventRating] = useState({});
  const [selectedReviewCategory, setSelectedReviewCat] = useState({
    label: "Pending",
    value: "GetPending",
  });
  const reviewCategory = [
    {
      label: "Pending",
      value: "GetPending",
    },
    {
      label: "Approved",
      value: "GetApproved",
    },
    {
      label: "Deleted",
      value: "GetDeleted",
    },
  ];
  const handleApprove = (review) => {
    Swal.fire({
      title: "Are you sure?",
      // text: "You won't be able to revert this!",
      icon: "success",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve!",
      preConfirm: async () => {
        // Show loading on the "Yes, delete it!" button
        Swal.showLoading();
        console.log(review);
        const reqdata = {
          Method_Name: "Approved",
          Event_Id: decryptData(event_id),
          Session_User_Id: user?.User_Id,
          Session_User_Name: user?.User_Display_Name,
          Session_Organzier_Id: user?.Organizer_Id,
          Review_Id: review?.Review_Id,
        };

        try {
          // Make the API call
          const result = await RestfulApiService(reqdata, "organizer/reviews");

          if (result) {
            return true;
          } else {
            // If the API response indicates failure, show a validation message
            Swal.showValidationMessage("Failed to approve the review.");
            return false;
          }
        } catch (error) {
          // If an error occurs, show an error message
          Swal.showValidationMessage("Request failed: " + error);
          return false;
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Show the success message after the deletion is confirmed
        Swal.fire({
          title: "Approved!",
          text: "Review has been approved.",
          icon: "success",
        });
        LoadReviews();
      }
    });
  };
  const handleDelete = (review) => {
    Swal.fire({
      title: "Are you sure?",
      // text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      preConfirm: async () => {
        // Show loading on the "Yes, delete it!" button
        Swal.showLoading();
        console.log(review);
        const reqdata = {
          Method_Name: "Delete",
          Event_Id: decryptData(event_id),
          Session_User_Id: user?.User_Id,
          Session_User_Name: user?.User_Display_Name,
          Session_Organzier_Id: user?.Organizer_Id,
          Review_Id: review?.Review_Id,
        };

        try {
          // Make the API call
          const result = await RestfulApiService(reqdata, "organizer/reviews");

          if (result) {
            // Assuming the API response includes a 'success' field
            // Return true if the API call is successful
            return true;
          } else {
            // If the API response indicates failure, show a validation message
            Swal.showValidationMessage("Failed to delete the review.");
            return false;
          }
        } catch (error) {
          // If an error occurs, show an error message
          Swal.showValidationMessage("Request failed: " + error);
          return false;
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Show the success message after the deletion is confirmed
        Swal.fire({
          title: "Deleted!",
          text: "Review has been deleted.",
          icon: "success",
        });
        LoadReviews();
      }
    });
  };
  const renderStars = (avgRating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(avgRating)) {
        // Filled star
        stars.push(<i key={i} className="fas fa-star"></i>);
      } else if (i < avgRating) {
        // Half star
        stars.push(<i key={i} className="fas fa-star-half-alt"></i>);
      } else {
        // Empty star
        stars.push(<i key={i} className="far fa-star"></i>);
      }
    }
    return stars;
  };
  async function LoadReviews() {
    const reqdata = {
      Method_Name: "GetPending",
      Event_Id: decryptData(event_id),
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
      Review_Id: "",
    };
    try {
      setFetchingReview(true);
      const result = await RestfulApiService(reqdata, "organizer/reviews");
      if (result) {
        setTableData(result?.data?.Result?.Table1);
        setEventRating(result?.data?.Result?.Table2[0]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setFetchingReview(false);
    }
  }
  const tableColumns = useMemo(
    () => [
      {
        Header: "Event Name",
        accessor: "Event_Name",
      },
      {
        Header: "Participant Name",
        accessor: "Created_By_Name",
      },
      {
        Header: "Rating",
        accessor: "Rating",
        Cell: ({ value }) => {
          const stars = [];
          for (let i = 0; i < 5; i++) {
            stars.push(
              <i
                key={i}
                className={`fas fa-star ${
                  i < value ? "text-primary" : "text-blue"
                }`}
                style={{ marginRight: "2px" }}
              ></i>
            );
          }
          return <div>{stars}</div>;
        },
      },
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
          console.log(row);

          return (
            <Stack direction="row" spacing={4}>
              <WhiteSingleTooltip placement="top" title="Delete">
                <i
                  className="fas fa-trash-alt text-18"
                  onClick={() => {
                    console.log(row?.original);
                    handleDelete(row?.original);
                  }}
                ></i>
              </WhiteSingleTooltip>

              <WhiteSingleTooltip placement="top" title="Approve Review">
                <i
                  className="far fa-calendar-check text-18"
                  onClick={() => {
                    console.log(row?.original);
                    // setReview(row?.original);
                    handleApprove(row?.original);
                  }}
                ></i>
              </WhiteSingleTooltip>
            </Stack>
          );
        },
      },
    ],
    [tableColumns] // Remove tableData from the dependencies if it's not used
  );
  const columns = useMemo(() => dataColumns, [dataColumns]);
  const data = useMemo(() => tableData, [tableData]);
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
  );
  useEffect(() => {
    if (event_id) {
      LoadReviews();
    }
  }, [event_id]);

  return (
    <div className="dashboard__main">
      <div className="dashboard__content pt-20">
        <section className="layout-pb-md">
          <div className="container">
            <div className="row y-gap-30">
              {fetchingReview ? (
                <Loader fetching={fetchingReview} />
              ) : (
                <>
                  <EventTitle />

                  <div className="py-20">
                    <div className="col-xl-12 col-md-12">
                      <div className="py-20 px-15 rounded-8 bg-white border-light">
                        <div className="row y-gap-20 justify-between items-center">
                          <div className="col-lg-3 text-center">
                            <div className="text-16 lh-16 fw-500">
                              Event Rating
                            </div>
                            <div className="text-18 lh-16 fw-600 text-primary mt-10">
                              {eventRating?.AvgRating}
                            </div>
                          </div>
                          <div className="col-lg-3 text-center">
                            <div className="text-16 lh-16 fw-500">
                              Total Reviews
                            </div>
                            <div className="text-18 lh-16 fw-600 text-primary mt-10">
                              {eventRating?.TotalReviews} Reviews
                            </div>
                          </div>
                          <div className="col-lg-3 text-center">
                            <div className="text-16 lh-16 fw-500">
                              Average Rating
                            </div>
                            <div className="text-20 lh-16 fw-500 text-green mt-10">
                              {/* <i className="fas fa-star"></i>{" "}
                              <i className="fas fa-star"></i>{" "}
                              <i className="fas fa-star"></i>{" "}
                              <i className="fas fa-star"></i>{" "}
                              <i className="fas fa-star-half-alt"></i> */}
                              {renderStars(eventRating?.AvgRating).map(
                                (star, index) => (
                                  <span key={index}>{star} </span>
                                )
                              )}
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="progressBar">
                              <div className="">
                                <div className="progressBar__bg bg-blue-2"></div>
                                <div
                                  className="progressBar__bar"
                                  style={{
                                    width: `${eventRating?.Rating5}%`,
                                    backgroundColor: "#15682C",
                                  }}
                                >
                                  <span className="text-12 fw-600">
                                    {eventRating?.Rating5}%
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="progressBar mt-10">
                              <div className="mt-20">
                                <div className="progressBar__bg bg-blue-2"></div>
                                <div
                                  className="progressBar__bar"
                                  style={{
                                    width: `${eventRating?.Rating4}%`,
                                    backgroundColor: "#FF986F",
                                  }}
                                >
                                  <span className="text-12 fw-600">
                                    {eventRating?.Rating4}%
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="progressBar mt-10">
                              <div className="mt-20">
                                <div className="progressBar__bg bg-blue-2"></div>
                                <div
                                  className="progressBar__bar"
                                  style={{
                                    width: `${eventRating?.Rating3}%`,
                                    backgroundColor: "#E9BA4F",
                                  }}
                                >
                                  <span className="text-12 fw-600">
                                    {eventRating?.Rating3}%
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="progressBar mt-10">
                              <div className="mt-20">
                                <div className="progressBar__bg bg-blue-2"></div>
                                <div
                                  className="progressBar__bar"
                                  style={{
                                    width: `${eventRating?.Rating2}%`,
                                    backgroundColor: "#FF986F",
                                  }}
                                >
                                  <span className="text-12 fw-600">
                                    {eventRating?.Rating2}%
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="progressBar mt-10">
                              <div className="mt-20">
                                <div className="progressBar__bg bg-blue-2"></div>
                                <div
                                  className="progressBar__bar"
                                  style={{
                                    width: `${eventRating?.Rating1}%`,
                                    backgroundColor: "#ff5722",
                                  }}
                                >
                                  <span className="text-12 fw-600">
                                    {eventRating?.Rating1}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-2 col-sm-12">
                    <Select
                      isSearchable={false}
                      styles={customRoundedStyles}
                      options={reviewCategory}
                      value={selectedReviewCategory}
                      onChange={async (e) => {
                        console.log(e);
                        setSelectedReviewCat(e);
                        const reqdata = {
                          Method_Name: e?.value,
                          Event_Id: decryptData(event_id),
                          Session_User_Id: user?.User_Id,
                          Session_User_Name: user?.User_Display_Name,
                          Session_Organzier_Id: user?.Organizer_Id,
                          Review_Id: "",
                        };
                        try {
                          setFetchingReviewCat(true);
                          const result = await RestfulApiService(
                            reqdata,
                            "organizer/reviews"
                          );
                          if (result) {
                            setTableData(result?.data?.Result?.Table1);
                            // setEventRating(result?.data?.Result?.Table2[0]);
                          }
                        } catch (err) {
                          console.log(err);
                        } finally {
                          setFetchingReviewCat(false);
                        }
                      }}
                    />
                  </div>

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
                                <StyledDotedTableCell
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
                                </StyledDotedTableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableHead>

                        {fetchingReviewCat ? (
                          <TableLoader columns={columns} />
                        ) : (
                          <TableBody
                            className="table_body_main"
                            {...getTableBodyProps()}
                          >
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
                                      bgcolor: row.isSelected
                                        ? "#FFFBEE"
                                        : "inherit",
                                    }}
                                  >
                                    {row.cells.map((cell) => (
                                      <StyledDotedTableCell
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
                                          <cell.column.customCell
                                            value={cell.value}
                                          />
                                        ) : (
                                          cell.render("Cell")
                                        )}
                                      </StyledDotedTableCell>
                                    ))}
                                  </TableRow>
                                );
                              })
                            ) : (
                              <TableRow>
                                <TableCell
                                  colSpan={columns.length + 1}
                                  align="center"
                                >
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
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Reviews;

/* <th>Profile</th>
                        <th>Name</th>
                        <th>Rating</th>
                        <th>Description</th>
                        <th>Comment</th>
                        <th>Action</th> */
/* <td className="text-yellow-2">
                          <i className="fas fa-star"></i>{" "}
                          <i className="fas fa-star"></i>{" "}
                          <i className="fas fa-star"></i>{" "}
                          <i className="fas fa-star"></i>{" "}
                          <i className="fas fa-star"></i>
                        </td> */

/* <td className="" style={{ color: "#aeaeae" }}>
                          <i className="fas fa-trash-alt text-18"></i>
                        </td> */
