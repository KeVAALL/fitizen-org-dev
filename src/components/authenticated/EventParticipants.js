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
import { PieChart } from "@mui/x-charts";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

// Project imports
import Event5 from "../../assets/img/events/event5.png";
import {
  DefaultColumnFilter,
  GlobalFilter,
  renderFilterTypes,
  SelectColumnFilter,
  StyledTableCell,
  TablePagination,
  IndeterminateCheckbox,
} from "../../utils/ReactTable";
import { WhiteSingleTooltip, WhiteTooltip } from "../../utils/Tooltip";
import {
  RestfulApiServiceDownload,
  RestfullApiService,
} from "../../config/service";
import { decryptData } from "../../utils/storage";
import { MEDIA_URL } from "../../config/url";
import { selectCustomStyle } from "../../utils/selectCustomStyle";

function EventParticipants() {
  const { event_id } = useParams();
  const user = useSelector((state) => state.user.userProfile);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [submitForm, setSubmitForm] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [ageCategory, setAgeCategory] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [openDate, setDateOpen] = useState(false);
  const [announceModal, setAnnounceModal] = useState(false);
  const [sendingAnnouncement, setSendingAnnouncement] = useState(false);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [downloadingMaster, setDownloadingMaster] = useState(false);
  const [downloadingPersonal, setDownloadingPersonal] = useState(false);
  const categoryColor = ["#FBCDC3", "#C0462B", "#F3795E"];
  const cityColors = ["#FBCDC3", "#C0462B", "#F3795E", "#903420"];
  const [dynamicValidationSchema, setDynamicValidationSchema] = useState([]);
  const [dynamicFormValues, setDynamicFormValues] = useState([]);
  const [otherFormation, setOtherFormation] = useState({});
  const [value, setValue] = useState("");
  const [initialValues, setInitialValues] = useState({
    Participant_Name: "",
    Participant_Email: "",
    Phone_Number: "",
    Date_Of_Birth: "",
    Blood_Group: null,
    Address: "",
    Pincode: "",
    City: "",
    State: "",
    other_fields: [],
  });
  const staticValidationSchema = {
    Participant_Name: Yup.string().required("Required"),
    Participant_Email: Yup.string().email("Invalid email").required("Required"),
    Phone_Number: Yup.string().required("Required"),
    Date_Of_Birth: Yup.string().required("Required"),
    Blood_Group: Yup.object().required("Required"),
    Address: Yup.string().required("Required"),
    Pincode: Yup.string().required("Required"),
    City: Yup.string().required("Required"),
    State: Yup.string().required("Required"),
  };
  const blood_group = [
    { label: "A+", value: "A+" },
    { label: "A-", value: "A-" },
    { label: "B+", value: "B+" },
    { label: "B-", value: "B-" },
    { label: "O+", value: "O+" },
    { label: "O-", value: "O-" },
    { label: "AB+", value: "AB+" },
    { label: "AB-", value: "AB-" },
  ];
  const generateDynamicValidationSchema = (fields) => {
    // console.log(schemaFields); // For debugging
    const fieldSchema = fields.reduce((schema, question) => {
      const { Question_Id, Is_Mandatory, Input_Type, Mandatory_Msg } = question;

      let fieldValidation = Yup.string(); // Default to string validation

      // Handle required fields
      if (Is_Mandatory === 1) {
        if (Input_Type === "checkbox") {
          fieldValidation = Yup.boolean().oneOf([true], Mandatory_Msg); // Checkbox must be true
        } else if (Input_Type === "phone") {
          fieldValidation = Yup.string()
            .matches(/^[0-9]{10}$/, "Phone number is not valid") // Phone number validation (10 digits)
            .required(Mandatory_Msg)
            .test(
              "uniquePhoneNumber",
              "Emergency contact number must be different from the Participant number",
              (value) => {
                return value !== user?.Phone_Number; // Custom test to check the phone number against the participant's number
              }
            );
        } else if (Input_Type === "File") {
          fieldValidation = Yup.string().required(Mandatory_Msg); // File should not be empty
        } else if (Input_Type === "select") {
          fieldValidation = Yup.string().required(Mandatory_Msg); // Select fields need to be selected
        } else {
          // Default to string validation for text and other input types
          fieldValidation = Yup.string().required(Mandatory_Msg);
        }
      }

      return {
        ...schema,
        [Question_Id]: fieldValidation,
      };
    }, {});

    // Update the dynamic validation schema state
    setDynamicValidationSchema(fieldSchema);

    return fieldSchema;
  };
  const validationSchema = Yup.object().shape({
    ...staticValidationSchema,
    other_fields: Yup.object().shape({
      ...dynamicValidationSchema,
    }),
  });
  // console.log(validationSchema);

  const generatePersonalXML = (data) => {
    let xmlString = `<BookTicket>\n`;
    xmlString += `<PersonalInfo>\n`;
    xmlString += `  <Event_Booking_Participant_Id>${
      data?.Transaction_Number ?? ""
    }</Event_Booking_Participant_Id>\n`;
    xmlString += `  <Event_Category_Id>${
      data?.Event_Category_Id ?? ""
    }</Event_Category_Id>\n`;
    xmlString += `  <First_Name>${data?.Participant_Name ?? ""}</First_Name>\n`;
    xmlString += `  <Last_Name>${""}</Last_Name>\n`;
    xmlString += `  <Phone>${data?.Phone_Number ?? ""}</Phone>\n`;
    xmlString += `  <Email>${data?.Participant_Email ?? ""}</Email>\n`;
    xmlString += `  <Gender>${data.Gender}</Gender>\n`;
    xmlString += `  <BloodGroup>${
      data?.Blood_Group?.value ?? ""
    }</BloodGroup>\n`;
    xmlString += `  <DateofBirth>${
      new Date(data.Date_Of_Birth).toISOString().split("T")[0]
    }</DateofBirth>\n`;
    xmlString += `  <Address>${data?.Address ?? ""}</Address>\n`;
    xmlString += `  <Country>${data?.Country ?? ""}</Country>\n`;
    xmlString += `  <State>${data?.State ?? ""}</State>\n`;
    xmlString += `  <City>${data?.City ?? ""}</City>\n`;
    xmlString += `  <Pincode>${data?.Pincode ?? ""}</Pincode>\n`;
    xmlString += `</PersonalInfo>\n`;
    xmlString += `</BookTicket>`;

    return xmlString;
  };
  const generateQuestionXml = (data) => {
    let xml = "<BookTicket>\n";

    // Loop over the other_fields object and generate XML
    Object.entries(data.other_fields).forEach(([key, value]) => {
      xml += `  <QuestionInfo>\n`;
      xml += `    <Event_Booking_Participant_Id>${data.Transaction_Number}</Event_Booking_Participant_Id>\n`;
      xml += `    <Event_Question_Id>${decryptData(
        event_id
      )}${key}</Event_Question_Id>\n`;
      xml += `    <Answer>${value}</Answer>\n`;
      xml += `  </QuestionInfo>\n`;
    });

    xml += "</BookTicket>";
    return xml;
  };
  function generateEmailXML(data) {
    let xml = `<EmailDetails>\n`;

    data.forEach((participant) => {
      xml += `  <Emails>\n`;
      xml += `    <ToName>${participant.Attendee_Name}</ToName>\n`;
      xml += `    <ToEmail>${participant.Attendee_Email}</ToEmail>\n`;
      xml += `    <CCName></CCName>\n`;
      xml += `    <CCEmail></CCEmail>\n`;
      xml += `    <BCCName></BCCName>\n`;
      xml += `    <BCCEmail></BCCEmail>\n`;
      xml += `  </Emails>\n`;
    });

    xml += `</EmailDetails>`;
    return xml;
  }

  const tableColumns = useMemo(
    () => [
      {
        Header: "Name",
        // Cell: ({ row }) => row.index + 1, // Hardcoded serial number starting from 1
        accessor: "Participant_Name",
      },
      {
        Header: "Email ID",
        accessor: "Participant_Email",
      },
      {
        Header: "Phone Number",
        accessor: "Phone_Number",
      },
      {
        Header: "Race Category",
        accessor: "Event_Category_Name",
        Filter: SelectColumnFilter,
        // filter: "includes", // Use the custom multiSelect filter
        filter: "multiSelect", // Use the custom multiSelect filter
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
                <WhiteSingleTooltip placement="top" title="Resend Ticket">
                  <i
                    onClick={async () => {
                      if (isResending) {
                        return;
                      }

                      const reqdata = {
                        Participant_Id:
                          row?.original?.Event_Booking_Participant_Id,
                      };
                      try {
                        setIsResending(true);

                        const result = await RestfullApiService(
                          reqdata,
                          "organizer/resendticket"
                        );
                        if (result?.data?.Result?.Table1[0]?.Result_Id === -1) {
                          toast.error(
                            result?.data?.Result?.Table1[0]?.Result_Description
                          );
                          return;
                        }
                        if (result) {
                          toast.success(
                            result?.data?.Result?.Table1[0]?.Result_Description
                          );
                        }
                      } catch (err) {
                        console.log(err);
                      } finally {
                        setIsResending(false);
                      }
                    }}
                    className="fas fa-file-upload action-button"
                  ></i>
                </WhiteSingleTooltip>
              )}
              {isEditing ? (
                <CircularProgress
                  color="inherit"
                  style={{ height: "12px", width: "12px" }}
                />
              ) : (
                <i
                  className="fas fa-pen action-button"
                  onClick={async () => {
                    if (isEditing) {
                      return;
                    }

                    const reqdata = {
                      Method_Name: "GetOne",
                      Event_Id: decryptData(event_id),
                      Session_User_Id: user?.User_Id,
                      Session_User_Name: user?.User_Display_Name,
                      Session_Organzier_Id: user?.Organizer_Id,
                      Participant_Id:
                        row?.original?.Event_Booking_Participant_Id,
                    };
                    try {
                      setIsEditing(true);

                      const result = await RestfullApiService(
                        reqdata,
                        "organizer/geteventparticipant"
                      );
                      if (result?.data?.Result?.Table1[0]?.Result_Id === -1) {
                        toast.error(
                          result?.data?.Result?.Table1[0]?.Result_Description
                        );
                        return;
                      }
                      if (result) {
                        setOtherFormation(result?.data?.Result?.Table1[0]);
                        setDynamicFormValues(
                          result?.data?.Result?.Table2?.map((field) => ({
                            ...field,
                            questionId: field.Question_Id,
                            question: field.Question,
                            answer: field.Answer,
                            participantId: field.Event_Booking_Participant_Id,
                          }))
                        );
                        const mandatoryFields = result?.data?.Result?.Table1[0];
                        setInitialValues({
                          ...mandatoryFields,
                          Blood_Group: {
                            label: mandatoryFields?.Blood_Group,
                            value: mandatoryFields?.Blood_Group,
                          },
                          other_fields:
                            // [
                            result?.data?.Result?.Table2?.reduce(
                              (acc, field) => {
                                acc[field.Question_Id] = field.Answer || "";
                                return acc;
                              },
                              {}
                            ),
                          // ],
                        });
                        generateDynamicValidationSchema(
                          result?.data?.Result?.Table2
                        );
                        setShowForm(true);
                      }
                    } catch (err) {
                      console.log(err);
                    } finally {
                      setIsEditing(false);
                    }
                  }}
                ></i>
              )}
              {/* <i className="far fa-trash-alt action-button"></i> */}
              <WhiteTooltip
                placement="left"
                title={
                  <Stack spacing={2}>
                    <Stack
                      className="action-button"
                      direction="row"
                      alignItems="center"
                      spacing={2}
                    >
                      <i
                        className="far fa-envelope"
                        style={{ marginRight: "12px" }}
                      ></i>
                      Send Message
                    </Stack>
                    <Stack
                      className="action-button"
                      direction="row"
                      alignItems="center"
                      spacing={2}
                    >
                      <i
                        className="fas fa-random"
                        style={{ marginRight: "12px" }}
                      ></i>
                      Transfer Ticket
                    </Stack>
                    <Stack
                      className="action-button"
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      onClick={async () => {
                        if (isDownloadingTicket) {
                          return;
                        }
                        toast.promise(
                          new Promise(async (resolve, reject) => {
                            try {
                              setIsDownloadingTicket(true);

                              const result = await RestfulApiServiceDownload(
                                `organizer/downloadticket?Tran_Id=${row?.original?.Event_Booking_Participant_Id}`
                              );

                              if (result) {
                                const base64PDF = result.data; // assuming result.data contains the base64 string

                                // Decode base64 string to binary string
                                const binaryString = atob(base64PDF);

                                // Convert binary string to Uint8Array
                                const arrayBuffer = new Uint8Array(
                                  binaryString.length
                                );
                                for (let i = 0; i < binaryString.length; i++) {
                                  arrayBuffer[i] = binaryString.charCodeAt(i);
                                }

                                // Create Blob from Uint8Array
                                const blob = new Blob([arrayBuffer], {
                                  type: "application/pdf",
                                });

                                // Create URL for the Blob
                                const url = window.URL.createObjectURL(blob);

                                // Create a link element, set the href and download attributes
                                const link = document.createElement("a");
                                link.href = url;
                                link.setAttribute(
                                  "download",
                                  `ticket${row?.original?.Event_Booking_Participant_Id}.pdf`
                                );

                                // Append the link to the DOM and trigger the download
                                document.body.appendChild(link);
                                link.click();

                                // Clean up: remove the link from the DOM
                                document.body.removeChild(link);

                                // Resolve the promise to trigger the success toast
                                resolve();
                              } else {
                                // If the result is not valid, reject the promise to show the error toast
                                reject(new Error("Failed to download ticket"));
                              }
                            } catch (err) {
                              // Reject the promise to trigger the error toast
                              reject(err);
                            } finally {
                              setIsDownloadingTicket(false);
                            }
                          }),
                          {
                            loading: "Downloading ticket...",
                            success: "Ticket downloaded successfully!",
                            error:
                              "Failed to download ticket. Please try again later.",
                          }
                        );
                      }}
                    >
                      <i
                        className="fas fa-download"
                        style={{ marginRight: "12px" }}
                      ></i>
                      Download Ticket
                    </Stack>
                  </Stack>
                }
                arrow
              >
                <i className="fas fa-ellipsis-v action-button"></i>
              </WhiteTooltip>
            </Stack>
          );
        },
      },
    ],
    [tableColumns] // Remove tableData from the dependencies if it's not used
  );
  // Memoize columns and data as they are now stable
  const columns = useMemo(() => dataColumns, [dataColumns]);
  const data = useMemo(() => participants, [participants]);
  // The rest of your useTable hook stays the same
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
    useRowSelect,
    (hooks) => {
      hooks.allColumns.push((columns) => [
        {
          id: "row-selection-chk",
          accessor: "Selection",
          disableFilters: true,
          disableSortBy: true,
          disableGroupBy: true,
          groupByBoundary: true,
          Header: ({ getToggleAllPageRowsSelectedProps }) => (
            <IndeterminateCheckbox
              indeterminate
              {...getToggleAllPageRowsSelectedProps()}
            />
          ),
          Cell: ({ row }) => (
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          ),
        },
        ...columns,
      ]);
    }
  );
  const colors = ["pink", "orange", "brown"]; // Array of color className

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [showForm]);
  useEffect(() => {
    async function LoadParticipants() {
      const reqdata = {
        Method_Name: "Get",
        Event_Id: decryptData(event_id),
        Session_User_Id: user?.User_Id,
        Session_User_Name: user?.User_Display_Name,
        Session_Organzier_Id: user?.Organizer_Id,
      };
      try {
        setFetchingDetails(true);
        const result = await RestfullApiService(
          reqdata,
          "organizer/geteventparticipant"
        );
        if (result) {
          console.log(result?.data?.Result?.Table1);
          setParticipants(result?.data?.Result?.Table1);
          setAgeCategory(result?.data?.Result?.Table6);
          setGenderData(result?.data?.Result?.Table2);
          setCategoryData(result?.data?.Result?.Table3);
          setCityData(result?.data?.Result?.Table4);
          setStateData(result?.data?.Result?.Table5);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setFetchingDetails(false);
      }
    }

    if (event_id) {
      LoadParticipants();
    }
  }, [event_id]);
  // useEffect(() => {
  //   console.log(
  //     "Filtered Data: ",
  //     rows.map((row) => row.original)
  //   );
  // }, [rows]);
  // useEffect(() => {
  //   console.log(selectedFlatRows.map((d) => d.original));
  // }, [selectedFlatRows]);

  return (
    <div className="dashboard__main">
      <div className="dashboard__content pt-20">
        <section className="layout-pb-md">
          <div className="container">
            <div className="row y-gap-30">
              {fetchingDetails ? (
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
                    open={fetchingDetails}
                  >
                    <CircularProgress color="inherit" />
                  </Backdrop>
                </div>
              ) : (
                <>
                  <div className="col-xl-12 col-md-12">
                    <div className="py-10 px-15 rounded-8 bg-white border-light">
                      <div className="row y-gap-20 justify-between items-center">
                        <div className="col-1">
                          <div className="w-50 h-50 rounded-full overflow-hidden">
                            <img
                              src={Event5}
                              className="w-full h-full object-cover"
                              alt="icon"
                            />
                          </div>
                        </div>
                        <div className="col-10">
                          <div className="text-16 lh-16 fw-500">
                            Golden Triangle Challenge: Run through India's Rich
                            Heritage
                          </div>
                        </div>
                        <div className="col-1">
                          <div className="form-switch d-flex items-center">
                            <div className="switch">
                              <input type="checkbox" />
                              <span className="switch__slider"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {showForm ? (
                    <Formik
                      enableReinitialize
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={async (values) => {
                        console.log("Form Data", values);

                        const reqdata = {
                          Method_Name: "Update",
                          Event_Id: decryptData(event_id),
                          Session_User_Id: user?.User_Id,
                          Session_User_Name: user?.User_Display_Name,
                          Session_Organzier_Id: user?.Organizer_Id,
                          Participant_Id: values?.Transaction_Number,
                          Booking_Id: values?.Booking_Number,
                          xmlData: generatePersonalXML(values),
                          QuestionXMLData: generateQuestionXml(values),
                        };
                        try {
                          setSubmitForm(true);

                          const result = await RestfullApiService(
                            reqdata,
                            "organizer/updateeventparticipant"
                          );
                          if (
                            result?.data?.Result?.Table1[0]?.Result_Id === -1
                          ) {
                            toast.error(
                              result?.data?.Result?.Table1[0]
                                ?.Result_Description
                            );
                            return;
                          }
                          if (result) {
                            toast.success(
                              result?.data?.Result?.Table1[0]
                                ?.Result_Description
                            );
                            setShowForm(false);
                            const reqdata = {
                              Method_Name: "Get",
                              Event_Id: decryptData(event_id),
                              Session_User_Id: user?.User_Id,
                              Session_User_Name: user?.User_Display_Name,
                              Session_Organzier_Id: user?.Organizer_Id,
                            };
                            try {
                              setFetchingDetails(true);
                              const result = await RestfullApiService(
                                reqdata,
                                "organizer/geteventparticipant"
                              );
                              if (result) {
                                console.log(result?.data?.Result?.Table1);
                                setParticipants(result?.data?.Result?.Table1);
                                setAgeCategory(result?.data?.Result?.Table6);
                                setGenderData(result?.data?.Result?.Table2);
                                setCategoryData(result?.data?.Result?.Table3);
                                setCityData(result?.data?.Result?.Table4);
                                setStateData(result?.data?.Result?.Table5);
                              }
                            } catch (err) {
                              console.log(err);
                            } finally {
                              setFetchingDetails(false);
                            }
                            // window.location.reload();
                          }
                        } catch (err) {
                          console.log(err);
                        } finally {
                          setSubmitForm(false);
                        }
                      }}
                    >
                      {({
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        values,
                        setFieldValue,
                        errors,
                      }) => (
                        <form onSubmit={handleSubmit}>
                          <div className="col-xl-12 col-md-12">
                            <Stack
                              direction="column"
                              spacing={2}
                              className="border-light rounded-8"
                            >
                              <div className="row">
                                <div className="col-xl-12 col-md-12 px-0">
                                  <Stack
                                    direction="column"
                                    className="py-30 px-30 border-bottom-light"
                                    spacing={4}
                                  >
                                    <div className="text-16 lh-16 fw-600 mt-5">
                                      Personal Details
                                    </div>
                                    <div className="row mt-16">
                                      <div className="col-xl-3 pl-0">
                                        <div className="single-field">
                                          {/* <label className="text-13 text-reading fw-500">
                                            Participant Name
                                          </label>
                                          <div className="form-control">
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Participant Name"
                                              name="pname"
                                            />
                                          </div> */}
                                          <label className="text-13 text-reading fw-500">
                                            Participant Name
                                          </label>
                                          <div className="form-control">
                                            <Field
                                              name="Participant_Name"
                                              className="form-control text-primary"
                                              placeholder="Participant Name"
                                            />
                                          </div>
                                          <ErrorMessage
                                            name="Participant_Name"
                                            component="div"
                                            className="text-error-2 text-13"
                                          />
                                        </div>
                                      </div>
                                      <div className="col-xl-3 pl-0">
                                        <div className="single-field">
                                          <label className="text-13 text-reading fw-500">
                                            Email ID
                                          </label>
                                          <div className="form-control">
                                            <Field
                                              name="Participant_Email"
                                              className="form-control text-primary"
                                              placeholder="Email ID"
                                            />
                                          </div>
                                          <ErrorMessage
                                            name="Participant_Email"
                                            component="div"
                                            className="text-error-2 text-13"
                                          />
                                        </div>
                                      </div>
                                      <div className="col-xl-3 pl-0">
                                        <div className="single-field">
                                          <label className="text-13 text-reading fw-500">
                                            Phone Number
                                          </label>
                                          <div className="form-control">
                                            <Field
                                              name="Phone_Number"
                                              className="form-control text-primary auto-fill-field"
                                              placeholder="Phone Number"
                                            />
                                          </div>{" "}
                                          <ErrorMessage
                                            name="Phone_Number"
                                            component="div"
                                            className="text-error-2 text-13"
                                          />
                                        </div>
                                      </div>
                                      <div className="col-xl-3 pl-0">
                                        <div className="single-field">
                                          <label className="text-13 text-reading fw-500">
                                            Date of Birth
                                          </label>
                                          <div className="form-control">
                                            <LocalizationProvider
                                              dateAdapter={AdapterDayjs}
                                            >
                                              <DesktopDatePicker
                                                className="form-control text-primary primary-label"
                                                name="Date_Of_Birth"
                                                format="DD/MM/YYYY"
                                                inputFormat="DD/MM/YYYY"
                                                disableFuture
                                                value={
                                                  values.Date_Of_Birth
                                                    ? dayjs(
                                                        values.Date_Of_Birth
                                                      )
                                                    : null
                                                }
                                                onChange={(newValue) => {
                                                  setFieldValue(
                                                    "Date_Of_Birth",
                                                    newValue
                                                  );
                                                }}
                                                open={openDate}
                                                onOpen={() => setDateOpen(true)}
                                                onClose={() =>
                                                  setDateOpen(false)
                                                }
                                                renderInput={(params) => (
                                                  <TextField
                                                    {...params}
                                                    sx={{
                                                      fontFamily:
                                                        "Inter, sans-serif !important",
                                                      "& .MuiButtonBase-root": {
                                                        color:
                                                          "#f3795e !important",
                                                      },
                                                    }}
                                                    fullWidth
                                                    className="form-control primary-label text-primary"
                                                  />
                                                )}
                                                slotProps={{
                                                  inputAdornment: {
                                                    position: "end",
                                                  },
                                                  textField: {
                                                    onClick: () =>
                                                      setDateOpen(true),
                                                  },
                                                  field: {
                                                    // disabled: true,
                                                    readOnly: true,
                                                  },
                                                  // To change styles
                                                  openPickerIcon: {
                                                    sx: {
                                                      color: "#f05736",
                                                    },
                                                  },
                                                }}
                                                // ref={dobRef}
                                              />
                                            </LocalizationProvider>
                                          </div>
                                          <ErrorMessage
                                            name="Date_Of_Birth"
                                            component="div"
                                            className="text-error-2 text-13"
                                          />
                                        </div>
                                      </div>
                                      <div className="col-xl-3 pl-0 pt-20">
                                        <div className="single-field">
                                          <label className="text-13 text-reading fw-500">
                                            Blood Group
                                          </label>
                                          <div className="p-0">
                                            <Field name="Blood_Group">
                                              {({ field }) => (
                                                <Select
                                                  placeholder="Select"
                                                  styles={selectCustomStyle}
                                                  onChange={(e) => {
                                                    setFieldValue(
                                                      field.name,
                                                      e
                                                    );
                                                  }}
                                                  options={blood_group}
                                                  value={values?.Blood_Group}
                                                />
                                              )}
                                            </Field>
                                          </div>
                                          {/* <div className="form-control">
                                            <Field
                                              as="select"
                                              name="Blood_Group"
                                              className="form-control text-primary"
                                            >
                                              <option
                                                value=""
                                                label="Select Blood Group"
                                              />
                                              <option value="A+" label="A+" />
                                              <option value="A-" label="A-" />
                                              <option value="B+" label="B+" />
                                              <option value="B-" label="B-" />
                                              <option value="AB+" label="AB+" />
                                              <option value="AB-" label="AB-" />
                                              <option value="O+" label="O+" />
                                              <option value="O-" label="O-" />
                                            </Field>
                                          </div> */}
                                          <ErrorMessage
                                            name="Blood_Group"
                                            component="div"
                                            className="text-error-2 text-13"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </Stack>
                                </div>
                                <div className="col-xl-12 col-md-12 px-0">
                                  <Stack
                                    direction="column"
                                    className="py-30 px-30 border-bottom-light"
                                    spacing={4}
                                  >
                                    <div className="text-16 lh-16 fw-600 mt-5">
                                      Address Details
                                    </div>
                                    <div className="row mt-16">
                                      <div className="col-xl-3 pl-0">
                                        <div className="single-field">
                                          <label className="text-13 text-reading fw-500">
                                            Address
                                          </label>
                                          <div className="form-control">
                                            <Field
                                              name="Address"
                                              className="form-control text-primary auto-fill-field"
                                              placeholder="Address"
                                            />
                                          </div>
                                          <ErrorMessage
                                            name="Address"
                                            component="div"
                                            className="text-error-2 text-13"
                                          />
                                        </div>
                                      </div>
                                      <div className="col-xl-3 pl-0">
                                        <div className="single-field">
                                          <label className="text-13 text-reading fw-500">
                                            Pincode
                                          </label>
                                          <div className="form-control">
                                            <Field
                                              name="Pincode"
                                              className="form-control text-primary auto-fill-field"
                                              placeholder="Pincode"
                                            />
                                          </div>
                                          <ErrorMessage
                                            name="Pincode"
                                            component="div"
                                            className="text-error-2 text-13"
                                          />
                                        </div>
                                      </div>
                                      <div className="col-xl-3 pl-0">
                                        <div className="single-field">
                                          <label className="text-13 text-reading fw-500">
                                            City
                                          </label>
                                          <div className="form-control">
                                            <Field
                                              name="City"
                                              className="form-control text-primary auto-fill-field"
                                              placeholder="City"
                                            />
                                          </div>
                                          <ErrorMessage
                                            name="City"
                                            component="div"
                                            className="text-error-2 text-13"
                                          />
                                        </div>
                                      </div>
                                      <div className="col-xl-3 pl-0">
                                        <div className="single-field">
                                          <label className="text-13 text-reading fw-500">
                                            State
                                          </label>
                                          <div className="form-control">
                                            <Field
                                              name="State"
                                              className="form-control text-primary auto-fill-field"
                                              placeholder="State"
                                            />
                                          </div>
                                          <ErrorMessage
                                            name="State"
                                            component="div"
                                            className="text-error-2 text-13"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </Stack>
                                </div>
                                <div className="col-xl-12 col-md-12 px-0">
                                  <Stack
                                    direction="column"
                                    className="py-30 px-30 border-bottom-light"
                                    spacing={4}
                                  >
                                    <div className="text-16 lh-16 fw-600 mt-5">
                                      Other Details
                                    </div>
                                    <div className="row mt-16 y-gap-20">
                                      {dynamicFormValues &&
                                        dynamicFormValues.map(
                                          (field, index) => {
                                            const inputProps = {
                                              name: `other_fields.${field.Question_Id}`,
                                              onChange: handleChange,
                                              onBlur: handleBlur,
                                              value:
                                                values.other_fields[
                                                  field.Question_Id
                                                ],
                                              label: field.Question,
                                            };

                                            return (
                                              <div
                                                className="col-xl-3 pl-0"
                                                key={field.questionId}
                                              >
                                                <div
                                                  className={`single-field y-gap-20 ${
                                                    field.Input_Type ===
                                                      "File" &&
                                                    "upload overflow-visible"
                                                  }`}
                                                >
                                                  <label
                                                    className="text-13 text-reading fw-500"
                                                    style={{
                                                      display:
                                                        field.Input_Type ===
                                                        "checkbox"
                                                          ? // ? "none"
                                                            "block"
                                                          : "block",
                                                    }}
                                                  >
                                                    {field.Option_Fileds ===
                                                    "TC" ? (
                                                      <>
                                                        I agree to the{" "}
                                                        <span className="text-12">
                                                          <Link
                                                            href={`${MEDIA_URL}${field.Doc_Path}`}
                                                            underline="always"
                                                            color="#f05736"
                                                          >
                                                            TERMS & CONDITIONS
                                                          </Link>
                                                        </span>
                                                      </>
                                                    ) : (
                                                      // field.field
                                                      field.question
                                                    )}{" "}
                                                    {field.Is_Mandatory ? (
                                                      <sup className="asc">
                                                        *
                                                      </sup>
                                                    ) : null}
                                                  </label>
                                                  <div
                                                    className={`${
                                                      field.Input_Type !==
                                                        "radio" &&
                                                      field.Input_Type !==
                                                        "checkbox"
                                                        ? "form-control"
                                                        : ""
                                                    }`}
                                                  >
                                                    {/* <Field
                                                    type="text"
                                                    // name={`other_fields.0.${field.questionId}`} // Bind to the question ID
                                                    name={`other_fields.${field.questionId}`} // Bind to the question ID
                                                    className="form-control"
                                                    placeholder={`Enter ${field.question}`} // Dynamic Placeholder
                                                    defaultValue={
                                                      values.other_fields[
                                                        field.questionId
                                                      ]
                                                    } // Match initial value by questionId
                                                  /> */}

                                                    {field.Input_Type ===
                                                      "text" && (
                                                      <Field
                                                        type="text"
                                                        className="form-control text-primary auto-fill-field"
                                                        name={`other_fields.${field.Question_Id}`}
                                                        maxLength="50"
                                                        onChange={(e) => {
                                                          e.preventDefault();
                                                          const { value } =
                                                            e.target;

                                                          const regex =
                                                            /^[a-zA-Z][a-zA-Z\s]*$/;

                                                          if (
                                                            !value ||
                                                            regex.test(value)
                                                          ) {
                                                            console.log(value);
                                                            setFieldValue(
                                                              `other_fields.${field.Question_Id}`,
                                                              value
                                                            );
                                                          } else {
                                                            return;
                                                          }
                                                        }}
                                                        onBlur={handleBlur}
                                                      />
                                                    )}

                                                    {field.Input_Type ===
                                                      "checkbox" && (
                                                      <>
                                                        <Stack
                                                          direction="row"
                                                          gap={1}
                                                        >
                                                          <div
                                                            class="d-flex items-center"
                                                            style={{
                                                              width: "5%",
                                                            }}
                                                          >
                                                            <Field
                                                              className="w-full p-0"
                                                              type="checkbox"
                                                              {...inputProps}
                                                              checked={
                                                                values
                                                                  .other_fields[
                                                                  field
                                                                    .Question_Id
                                                                ]
                                                              }
                                                            />
                                                          </div>
                                                          <p className="text-14 fw-500">
                                                            Yes
                                                          </p>
                                                        </Stack>
                                                      </>
                                                    )}

                                                    {field.Input_Type ===
                                                      "radio" && (
                                                      <div className="d-flex gap-10">
                                                        {field.Option_Fileds?.split(
                                                          ","
                                                        ).map((option, idx) => (
                                                          <label
                                                            key={idx}
                                                            className="d-flex items-center gap-5 text-14"
                                                          >
                                                            <Field
                                                              type="radio"
                                                              className="form-check-input p-0"
                                                              {...inputProps}
                                                              value={option}
                                                              checked={
                                                                values
                                                                  .other_fields[
                                                                  field
                                                                    .Question_Id
                                                                ] === option
                                                              }
                                                            />
                                                            {option}
                                                          </label>
                                                        ))}
                                                      </div>
                                                    )}

                                                    {field.Input_Type ===
                                                      "select" && (
                                                      <Field
                                                        className="text-primary"
                                                        as="select"
                                                        {...inputProps}
                                                      >
                                                        <option value="">
                                                          Select
                                                        </option>
                                                        {field.Option_Fileds?.split(
                                                          ","
                                                        ).map((option, idx) => (
                                                          <option
                                                            key={idx}
                                                            value={option}
                                                          >
                                                            {option}
                                                          </option>
                                                        ))}
                                                      </Field>
                                                    )}

                                                    {field.Input_Type ===
                                                      "phone" && (
                                                      <Field
                                                        type="tel"
                                                        name={`other_fields.${field.Question_Id}`}
                                                        className="form-control text-primary auto-fill-field"
                                                        placeholder="000 000 0000"
                                                        maxLength="10"
                                                        value={
                                                          values.other_fields[
                                                            field.Question_Id
                                                          ]
                                                        }
                                                        onChange={(e) => {
                                                          const { value } =
                                                            e.target;
                                                          const regex =
                                                            /^[0-9\b]+$/; // Only numbers allowed
                                                          if (
                                                            !value ||
                                                            regex.test(value)
                                                          ) {
                                                            setFieldValue(
                                                              `other_fields.${field.Question_Id}`,
                                                              value
                                                            );
                                                          }
                                                        }}
                                                      />
                                                    )}

                                                    {field.Input_Type ===
                                                      "File" && (
                                                      <div className="d-flex items-center x-gap-10 pl-5">
                                                        <a
                                                          class="upload__btn d-flex items-center justify-center"
                                                          href={`${MEDIA_URL}${
                                                            values.other_fields[
                                                              field.Question_Id
                                                            ]
                                                          }`}
                                                          target="_blank"
                                                          rel="noreferrer"
                                                        >
                                                          View File
                                                        </a>
                                                      </div>
                                                    )}
                                                  </div>
                                                  <ErrorMessage
                                                    name={`other_fields.${field.questionId}`} // Error message for validation
                                                    component="div"
                                                    className="text-error-2 text-13"
                                                  />
                                                </div>
                                              </div>
                                            );
                                          }
                                        )}
                                    </div>
                                  </Stack>
                                </div>

                                <div className="col-xl-12 col-md-12 px-0">
                                  <Stack
                                    direction="column"
                                    className="py-30 px-30 border-bottom-light"
                                    spacing={4}
                                  >
                                    <div className="text-16 lh-16 fw-600 mt-5">
                                      Ticket Details
                                    </div>
                                    <div className="row mt-16 y-gap-20">
                                      <div className="col-xl-3 pl-0">
                                        <div className="d-flex flex-column">
                                          <label className="text-13 text-reading fw-500">
                                            Booking Number
                                          </label>
                                          <label className="text-13 text-primary fw-500 mt-10">
                                            {otherFormation?.Booking_Number}
                                          </label>
                                        </div>
                                      </div>
                                      <div className="col-xl-3 pl-0">
                                        <div className="d-flex flex-column">
                                          <label className="text-13 text-reading fw-500">
                                            Gender
                                          </label>
                                          <label className="text-13 text-primary fw-500 mt-10">
                                            {otherFormation?.Gender}
                                          </label>
                                        </div>
                                      </div>
                                      <div className="col-xl-3 pl-0">
                                        <div className="d-flex flex-column">
                                          <label className="text-13 text-reading fw-500">
                                            Ticket Price
                                          </label>
                                          <label className="text-13 text-primary fw-500 mt-10">
                                            ₹ {otherFormation?.Event_Price}
                                          </label>
                                        </div>
                                      </div>
                                      <div className="col-xl-3 pl-0">
                                        <div className="d-flex flex-column">
                                          <label className="text-13 text-reading fw-500">
                                            Category Name
                                          </label>
                                          <label className="text-13 text-primary fw-500 mt-10">
                                            {
                                              otherFormation?.Event_Category_Name
                                            }
                                          </label>
                                        </div>
                                      </div>
                                      <div className="col-xl-3 pl-0">
                                        <div className="d-flex flex-column">
                                          <label className="text-13 text-reading fw-500">
                                            Transaction Number
                                          </label>
                                          <label className="text-13 text-primary fw-500 mt-10">
                                            {otherFormation?.Transaction_Number}
                                          </label>
                                        </div>
                                      </div>
                                      <div className="col-xl-3 pl-0">
                                        <div className="d-flex flex-column">
                                          <label className="text-13 text-reading fw-500">
                                            Tickets Booked
                                          </label>
                                          <label className="text-13 text-primary fw-500 mt-10">
                                            1
                                          </label>
                                        </div>
                                      </div>
                                      <div className="col-xl-3 pl-0">
                                        <div className="d-flex flex-column">
                                          <label className="text-13 text-reading fw-500">
                                            Payment Mode
                                          </label>
                                          <label className="text-13 text-primary fw-500 mt-10">
                                            {otherFormation?.Payment_Mode}
                                          </label>
                                        </div>
                                      </div>
                                      <div className="col-xl-3 pl-0">
                                        <div className="d-flex flex-column">
                                          <label className="text-13 text-reading fw-500">
                                            Discount Name
                                          </label>
                                          <label className="text-13 text-primary fw-500 mt-10">
                                            {
                                              otherFormation?.Coupon_Discount_Type
                                            }
                                          </label>
                                        </div>
                                      </div>
                                      <div className="col-xl-3 pl-0">
                                        <div className="d-flex flex-column">
                                          <label className="text-13 text-reading fw-500">
                                            BIB Number
                                          </label>
                                          <label className="text-13 text-primary fw-500 mt-10">
                                            {otherFormation?.BIB_Number}
                                          </label>
                                        </div>
                                      </div>
                                      <div className="col-xl-3 pl-0">
                                        <div className="d-flex flex-column">
                                          <label className="text-13 text-reading fw-500">
                                            Registration Date
                                          </label>
                                          <label className="text-13 text-primary fw-500 mt-10">
                                            {otherFormation?.Registration_Date}
                                          </label>
                                        </div>
                                      </div>
                                      <div className="col-xl-3 pl-0">
                                        <div className="d-flex flex-column">
                                          <label className="text-13 text-reading fw-500">
                                            Registration Time
                                          </label>
                                          <label className="text-13 text-primary fw-500 mt-10">
                                            {otherFormation?.Registration_Time}
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </Stack>
                                </div>

                                <div className="col-xl-12 col-md-12 px-0">
                                  <Stack
                                    direction="column"
                                    className="py-30 px-30"
                                    spacing={4}
                                  >
                                    <div className="text-16 lh-16 fw-600 mt-5">
                                      Payment Details
                                    </div>
                                    <div className="row mt-16 y-gap-20">
                                      <div className="col-xl-3 pl-0">
                                        <div className="d-flex flex-column">
                                          <label className="text-13 text-reading fw-500">
                                            Billing Amount
                                          </label>
                                          <label className="text-13 text-primary fw-500 mt-10">
                                            ₹{" "}
                                            {otherFormation?.Total_Amount_Paid}
                                          </label>
                                        </div>
                                      </div>
                                      <div className="col-xl-3 pl-0">
                                        <div className="d-flex flex-column">
                                          <label className="text-13 text-reading fw-500">
                                            Organizer fees
                                          </label>
                                          <label className="text-13 text-primary fw-500 mt-10">
                                            ₹{" "}
                                            {
                                              otherFormation?.Organizer_Platform_Fee
                                            }
                                          </label>
                                        </div>
                                      </div>
                                      <div className="col-xl-3 pl-0">
                                        <div className="d-flex flex-column">
                                          <label className="text-13 text-reading fw-500">
                                            Fitizen fees
                                          </label>
                                          <label className="text-13 text-primary fw-500 mt-10">
                                            ₹{" "}
                                            {
                                              otherFormation?.Participant_Platform_Fee
                                            }
                                          </label>
                                        </div>
                                      </div>

                                      <div className="col-xl-3 pl-0">
                                        <div className="d-flex flex-column">
                                          <label className="text-13 text-reading fw-500">
                                            Payment Gateway Charges
                                          </label>
                                          <label className="text-13 text-primary fw-500 mt-10">
                                            ₹{" "}
                                            {
                                              otherFormation?.Organizer_Payment_Gateway_Charges
                                            }
                                          </label>
                                        </div>
                                      </div>
                                      <div className="col-xl-3 pl-0">
                                        <div className="d-flex flex-column">
                                          <label className="text-13 text-reading fw-500">
                                            Platform Fee
                                          </label>
                                          <label className="text-13 text-primary fw-500 mt-10">
                                            ₹{" "}
                                            {
                                              otherFormation?.Organizer_Platform_Fee
                                            }
                                          </label>
                                        </div>
                                      </div>
                                      <div className="col-xl-3 pl-0">
                                        <div className="d-flex flex-column">
                                          <label className="text-13 text-reading fw-500">
                                            Organizer GST Amount
                                          </label>
                                          <label className="text-13 text-primary fw-500 mt-10">
                                            ₹ {otherFormation?.GST_Amount_Org}
                                          </label>
                                        </div>
                                      </div>
                                      <div className="col-xl-3 pl-0">
                                        <div className="d-flex flex-column">
                                          <label className="text-13 text-reading fw-500">
                                            Platform GST Amount
                                          </label>
                                          <label className="text-13 text-primary fw-500 mt-10">
                                            ₹ {otherFormation?.GST_Amount_PAR}
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </Stack>
                                </div>
                              </div>
                            </Stack>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              sx={{ width: "100%", marginTop: "16px" }}
                            >
                              <Stack
                                direction="row"
                                spacing={2}
                                sx={{ width: "100%", marginTop: "16px" }}
                              >
                                <button
                                  className="button w-150 rounded-24 py-15 px-15 text-reading border-light -primary-1 fw-400 text-12 d-flex gap-25"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    window.location.reload();
                                  }}
                                >
                                  Cancel
                                </button>

                                <div className="col-auto relative">
                                  <button
                                    type="submit"
                                    className="button bg-primary w-150 h-50 rounded-24 py-15 px-15 text-white border-light fw-400 text-12 d-flex gap-25 load-button"
                                  >
                                    {!submitForm ? (
                                      "Save"
                                    ) : (
                                      <span className="btn-spinner"></span>
                                    )}
                                  </button>
                                </div>
                              </Stack>

                              <button
                                style={{ marginTop: "16px" }}
                                className="button w-220 h-50 rounded-24 py-4 px-15 text-reading border-light -primary-1 fw-400 text-12 d-flex gap-25"
                              >
                                Download File
                                <i className="fas fa-download text-14"></i>
                              </button>
                            </Stack>
                          </div>
                        </form>
                      )}
                    </Formik>
                  ) : (
                    <>
                      <Modal open={announceModal}>
                        <Box
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 600,
                            bgcolor: "background.paper",
                            border: "none",
                            borderRadius: 2,
                            boxShadow: 24,
                            p: 3,
                          }}
                        >
                          <Stack
                            direction="column"
                            alignItems="center"
                            spacing={1}
                          >
                            <Stack
                              style={{ width: "100%" }}
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <div className="text-16 lh-16 fw-600 text-primary">
                                Send Announcement to Participants
                              </div>
                              <i
                                onClick={() => {
                                  setAnnounceModal(false);
                                }}
                                class="fas fa-times text-16 text-primary cursor-pointer"
                              ></i>
                            </Stack>

                            <Formik
                              initialValues={{
                                Subject: "",
                                Message: "", // This will be controlled by ReactQuill
                                Attach_Details: null,
                              }}
                              validationSchema={Yup.object({
                                Subject: Yup.string().required(
                                  "Subject is required"
                                ),
                                Message: Yup.string().required(
                                  "Message is required"
                                ),
                                Attach_Details: Yup.object().required(
                                  "Please attach a document"
                                ),
                              })}
                              onSubmit={async (values) => {
                                console.log(
                                  values.Message.replace(/<\/?[^>]+(>|$)/g, "")
                                );
                                const uniqueEmails = selectedFlatRows
                                  ?.map((row) => row.original)
                                  .reduce((acc, current) => {
                                    const email = current.Attendee_Email;

                                    // Check if the email is already in the accumulator
                                    const exists = acc.some(
                                      (participant) =>
                                        participant.Attendee_Email === email
                                    );

                                    // If not, push the current object to the accumulator
                                    if (!exists) {
                                      acc.push(current);
                                    }

                                    return acc;
                                  }, []);

                                const reqdata = {
                                  Method_Name: "Send",
                                  To_Email_Id_Xml:
                                    generateEmailXML(uniqueEmails),
                                  Attachment_Path:
                                    values?.Attach_Details?.Description,
                                  Attachment_Name:
                                    values?.Attach_Details?.Result,
                                  Subject: values.Subject,
                                  Html_Body: values.Message,
                                  Text_Body: values.Message.replace(
                                    /<\/?[^>]+(>|$)/g,
                                    ""
                                  ),
                                };
                                try {
                                  setSendingAnnouncement(true);

                                  const result = await RestfullApiService(
                                    reqdata,
                                    "organizer/announcement"
                                  );
                                  if (
                                    result?.data?.Result?.Table1[0]
                                      ?.Result_Id === -1
                                  ) {
                                    toast.error(
                                      result?.data?.Result?.Table1[0]
                                        ?.Result_Description
                                    );
                                    return;
                                  }
                                  if (result) {
                                    toast.success(
                                      result?.data?.Result?.Table1[0]
                                        ?.Result_Description
                                    );
                                    setAnnounceModal(false);
                                  }
                                } catch (err) {
                                  console.log(err);
                                } finally {
                                  setSendingAnnouncement(false);
                                }
                              }}
                            >
                              {({ setFieldValue, values }) => (
                                <Form style={{ width: "100%" }}>
                                  <div className="single-field w-full">
                                    <label className="text-13 text-reading fw-500">
                                      Subject
                                    </label>
                                    <div className="form-control">
                                      <Field
                                        name="Subject"
                                        className="form-control"
                                        placeholder="BIB Expo Announcement"
                                        onChange={(e) => {
                                          e.preventDefault();
                                          const { value } = e.target;

                                          const regex = /^[a-zA-Z][a-zA-Z\s]*$/;

                                          if (
                                            !value ||
                                            (regex.test(value.toString()) &&
                                              value.length <= 50)
                                          ) {
                                            setFieldValue("Subject", value);
                                          } else {
                                            return;
                                          }
                                        }}
                                      />
                                    </div>
                                    <ErrorMessage
                                      name="Subject"
                                      component="div"
                                      className="text-error-2 text-13 mt-5"
                                    />
                                  </div>

                                  {/* Message Field (ReactQuill) */}
                                  <div className="single-field w-full">
                                    <label className="text-13 text-reading fw-500">
                                      Enter Message
                                    </label>
                                    <ReactQuill
                                      theme="snow"
                                      value={values.Message}
                                      onChange={(content) => {
                                        setFieldValue("Message", content);
                                      }}
                                      placeholder="Add rules and regulations"
                                    />
                                    <ErrorMessage
                                      name="Message"
                                      component="div"
                                      className="text-error-2 text-13 mt-5"
                                    />
                                  </div>

                                  {/* Attach File Button */}
                                  <div className="d-flex flex-column w-full mt-20">
                                    <div className="d-flex items-center gap-10">
                                      <Button
                                        component="label"
                                        variant="outlined"
                                        sx={{
                                          width: "50%",
                                          backgroundColor: "#ffffff",
                                          color: "#f05736",
                                          border: "2px solid #f05736",
                                          borderRadius: "0px",
                                          "&:hover": {
                                            border: "2px solid #f05736",
                                          },
                                        }}
                                      >
                                        Attach file
                                        <input
                                          disabled={uploadingAttachment}
                                          type="file"
                                          style={{ display: "none" }}
                                          onChange={async (event) => {
                                            const file =
                                              event.currentTarget.files[0];

                                            // Check if the file size is above 2MB (2 * 1024 * 1024 bytes)
                                            const maxSize = 2 * 1024 * 1024;
                                            if (file && file.size > maxSize) {
                                              toast.error(
                                                "File size should not exceed 2MB."
                                              );
                                              event.target.value = ""; // Reset the input value
                                              return;
                                            }

                                            const reqdata = new FormData();
                                            reqdata.append(
                                              "ModuleName",
                                              "Announcement"
                                            );
                                            reqdata.append("File", file);

                                            // Start uploading
                                            setUploadingAttachment(true);

                                            try {
                                              await toast.promise(
                                                RestfullApiService(
                                                  reqdata,
                                                  "master/uploadfile"
                                                ),
                                                {
                                                  loading: "Uploading...",
                                                  success: (result) => {
                                                    if (result) {
                                                      console.log(result);
                                                      setFieldValue(
                                                        "Attach_Details",
                                                        result?.data
                                                      );
                                                    }
                                                    return "Uploaded successfully!";
                                                  },
                                                  error: (err) => {
                                                    const errorMessage =
                                                      err?.Result?.Table1[0]
                                                        ?.Result_Description ||
                                                      "Upload failed";
                                                    return errorMessage;
                                                  },
                                                },
                                                {
                                                  success: {
                                                    duration: 2000,
                                                  },
                                                }
                                              );
                                            } catch (error) {
                                              console.error(
                                                "Upload failed:",
                                                error
                                              );
                                            } finally {
                                              // End uploading
                                              setUploadingAttachment(false);
                                              event.target.value = "";
                                            }
                                          }}
                                          multiple
                                        />
                                      </Button>
                                      {values?.Attach_Details ? (
                                        <div className="text-14">
                                          {values?.Attach_Details?.Result}
                                        </div>
                                      ) : (
                                        <></>
                                      )}
                                    </div>
                                    <ErrorMessage
                                      name="Attach_Details"
                                      component="div"
                                      className="text-error-2 text-13 mt-10"
                                    />
                                  </div>

                                  {/* Submit Button */}
                                  <Stack
                                    style={{ width: "100%" }}
                                    direction="row"
                                    justifyContent="flex-start"
                                    alignItems="center"
                                    className="mt-20"
                                  >
                                    <div className="col-auto relative">
                                      <button
                                        type="submit"
                                        className="button bg-primary w-350 h-50 rounded-24 py-15 px-15 text-white border-light fw-400 text-12 d-flex gap-25 load-button"
                                      >
                                        {!sendingAnnouncement ? (
                                          `Send announcement to ${selectedFlatRows.length} Participants`
                                        ) : (
                                          <span className="btn-spinner"></span>
                                        )}
                                      </button>
                                    </div>
                                  </Stack>
                                </Form>
                              )}
                            </Formik>
                          </Stack>
                        </Box>
                      </Modal>
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
                              Participants Data
                            </div>
                            <div className="text-16 lh-16 fw-600 mt-5">
                              Total Participants:{" "}
                              <span className="text-16 fw-600 mt-5 text-primary">
                                {participants?.length}
                              </span>
                            </div>
                          </Stack>

                          <Stack
                            direction="row"
                            spacing={2}
                            justifyContent="space-between"
                          >
                            <GlobalFilter
                              globalFilter={globalFilter}
                              setGlobalFilter={setGlobalFilter}
                            />
                            <div className="d-flex gap-15">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (selectedFlatRows?.length < 1) {
                                    toast.error("Please select participants");
                                    return;
                                  }
                                  setAnnounceModal(true);
                                }}
                                className="button rounded-24 py-4 px-15 text-reading border-light -primary-1 fw-400 text-12 d-flex gap-25"
                              >
                                Send Announcement
                                <i className="far fa-envelope text-14"></i>
                              </button>
                              <WhiteTooltip
                                // open={true}
                                placement="bottom-start"
                                title={
                                  <Stack spacing={2}>
                                    <Stack
                                      className="text-14 cursor-pointer"
                                      direction="row"
                                      alignItems="center"
                                      justifyContent="space-between"
                                      spacing={2}
                                      onClick={async () => {
                                        console.log("click");
                                        if (downloadingMaster) {
                                          return;
                                        }
                                        toast.promise(
                                          new Promise(
                                            async (resolve, reject) => {
                                              try {
                                                setDownloadingMaster(true);

                                                const result =
                                                  await RestfulApiServiceDownload(
                                                    `organizer/exportparticipantdata?Tran_Id=${decryptData(
                                                      event_id
                                                    )}&Typeexport=MasterFile`
                                                  );

                                                if (result) {
                                                  const base64PDF = result.data; // assuming result.data contains the base64 string

                                                  // Decode base64 string to binary string
                                                  const binaryString =
                                                    atob(base64PDF);

                                                  // Convert binary string to Uint8Array
                                                  const arrayBuffer =
                                                    new Uint8Array(
                                                      binaryString.length
                                                    );
                                                  for (
                                                    let i = 0;
                                                    i < binaryString.length;
                                                    i++
                                                  ) {
                                                    arrayBuffer[i] =
                                                      binaryString.charCodeAt(
                                                        i
                                                      );
                                                  }

                                                  // Create Blob from Uint8Array
                                                  const blob = new Blob(
                                                    [arrayBuffer],
                                                    {
                                                      type: "application/xlsx",
                                                    }
                                                  );

                                                  // Create URL for the Blob
                                                  const url =
                                                    window.URL.createObjectURL(
                                                      blob
                                                    );

                                                  // Create a link element, set the href and download attributes
                                                  const link =
                                                    document.createElement("a");
                                                  link.href = url;
                                                  link.setAttribute(
                                                    "download",
                                                    `Master.xlsx`
                                                  );

                                                  // Append the link to the DOM and trigger the download
                                                  document.body.appendChild(
                                                    link
                                                  );
                                                  link.click();

                                                  // Clean up: remove the link from the DOM
                                                  document.body.removeChild(
                                                    link
                                                  );

                                                  // Resolve the promise to trigger the success toast
                                                  resolve();
                                                } else {
                                                  // If the result is not valid, reject the promise to show the error toast
                                                  reject(
                                                    new Error(
                                                      "Failed to download ticket"
                                                    )
                                                  );
                                                }
                                              } catch (err) {
                                                // Reject the promise to trigger the error toast
                                                reject(err);
                                              } finally {
                                                setDownloadingMaster(false);
                                              }
                                            }
                                          ),
                                          {
                                            loading: "Downloading...",
                                            success: "Downloaded successfully!",
                                            error:
                                              "Failed to download. Please try again later.",
                                          }
                                        );
                                      }}
                                    >
                                      <div>Download Master File</div>
                                      <i className="fas fa-download text-primary"></i>
                                    </Stack>
                                    <Stack
                                      className="text-14 cursor-pointer"
                                      direction="row"
                                      alignItems="center"
                                      justifyContent="space-between"
                                      spacing={2}
                                      onClick={async () => {
                                        if (downloadingPersonal) {
                                          return;
                                        }
                                        toast.promise(
                                          new Promise(
                                            async (resolve, reject) => {
                                              try {
                                                setDownloadingPersonal(true);

                                                const result =
                                                  await RestfulApiServiceDownload(
                                                    `organizer/exportparticipantdata?Tran_Id=${decryptData(
                                                      event_id
                                                    )}&Typeexport=PersonalFile`
                                                  );

                                                if (result) {
                                                  const base64PDF = result.data; // assuming result.data contains the base64 string

                                                  // Decode base64 string to binary string
                                                  const binaryString =
                                                    atob(base64PDF);

                                                  // Convert binary string to Uint8Array
                                                  const arrayBuffer =
                                                    new Uint8Array(
                                                      binaryString.length
                                                    );
                                                  for (
                                                    let i = 0;
                                                    i < binaryString.length;
                                                    i++
                                                  ) {
                                                    arrayBuffer[i] =
                                                      binaryString.charCodeAt(
                                                        i
                                                      );
                                                  }

                                                  // Create Blob from Uint8Array
                                                  const blob = new Blob(
                                                    [arrayBuffer],
                                                    {
                                                      type: "application/xlsx",
                                                    }
                                                  );

                                                  // Create URL for the Blob
                                                  const url =
                                                    window.URL.createObjectURL(
                                                      blob
                                                    );

                                                  // Create a link element, set the href and download attributes
                                                  const link =
                                                    document.createElement("a");
                                                  link.href = url;
                                                  link.setAttribute(
                                                    "download",
                                                    `Personal.xlsx`
                                                  );

                                                  // Append the link to the DOM and trigger the download
                                                  document.body.appendChild(
                                                    link
                                                  );
                                                  link.click();

                                                  // Clean up: remove the link from the DOM
                                                  document.body.removeChild(
                                                    link
                                                  );

                                                  // Resolve the promise to trigger the success toast
                                                  resolve();
                                                } else {
                                                  // If the result is not valid, reject the promise to show the error toast
                                                  reject(
                                                    new Error(
                                                      "Failed to download ticket"
                                                    )
                                                  );
                                                }
                                              } catch (err) {
                                                // Reject the promise to trigger the error toast
                                                reject(err);
                                              } finally {
                                                setDownloadingPersonal(false);
                                              }
                                            }
                                          ),
                                          {
                                            loading: "Downloading...",
                                            success: "Downloaded successfully!",
                                            error:
                                              "Failed to download. Please try again later.",
                                          }
                                        );
                                      }}
                                    >
                                      <div>Download Personal Info</div>
                                      <i className="fas fa-download text-primary"></i>
                                    </Stack>
                                    {/* <Stack
                                      className="action-button"
                                      direction="row"
                                      alignItems="center"
                                      spacing={2}
                                      onClick={async () => {
                                        // if (isDownloadingTicket) {
                                        //   return;
                                        // }
                                        // toast.promise(
                                        //   new Promise(async (resolve, reject) => {
                                        //     try {
                                        //       // setIsDownloadingTicket(true);
                                        //       const result = await RestfulApiServiceDownload(
                                        //         `organizer/downloadticket?Tran_Id=${row?.original?.Event_Booking_Participant_Id}`
                                        //       );
                                        //       if (result) {
                                        //         const base64PDF = result.data; // assuming result.data contains the base64 string
                                        //         // Decode base64 string to binary string
                                        //         const binaryString = atob(base64PDF);
                                        //         // Convert binary string to Uint8Array
                                        //         const arrayBuffer = new Uint8Array(
                                        //           binaryString.length
                                        //         );
                                        //         for (let i = 0; i < binaryString.length; i++) {
                                        //           arrayBuffer[i] = binaryString.charCodeAt(i);
                                        //         }
                                        //         // Create Blob from Uint8Array
                                        //         const blob = new Blob([arrayBuffer], {
                                        //           type: "application/pdf",
                                        //         });
                                        //         // Create URL for the Blob
                                        //         const url = window.URL.createObjectURL(blob);
                                        //         // Create a link element, set the href and download attributes
                                        //         const link = document.createElement("a");
                                        //         link.href = url;
                                        //         link.setAttribute(
                                        //           "download",
                                        //           `ticket${row?.original?.Event_Booking_Participant_Id}.pdf`
                                        //         );
                                        //         // Append the link to the DOM and trigger the download
                                        //         document.body.appendChild(link);
                                        //         link.click();
                                        //         // Clean up: remove the link from the DOM
                                        //         document.body.removeChild(link);
                                        //         // Resolve the promise to trigger the success toast
                                        //         resolve();
                                        //       } else {
                                        //         // If the result is not valid, reject the promise to show the error toast
                                        //         reject(new Error("Failed to download ticket"));
                                        //       }
                                        //     } catch (err) {
                                        //       // Reject the promise to trigger the error toast
                                        //       reject(err);
                                        //     } finally {
                                        //       // setIsDownloadingTicket(false);
                                        //     }
                                        //   }),
                                        //   {
                                        //     loading: "Downloading ticket...",
                                        //     success: "Ticket downloaded successfully!",
                                        //     error:
                                        //       "Failed to download ticket. Please try again later.",
                                        //   }
                                        // );
                                      }}
                                    >
                                      <i
                                        className="fas fa-download"
                                        style={{ marginRight: "12px" }}
                                      ></i>
                                      Download Ticket
                                    </Stack> */}
                                  </Stack>
                                }
                                arrow
                              >
                                <button className="button rounded-24 py-4 px-15 text-reading border-light -primary-1 fw-400 text-12 d-flex gap-25">
                                  Download File
                                  <i className="fas fa-angle-down text-14"></i>
                                </button>
                              </WhiteTooltip>
                            </div>
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
                                    sx={{
                                      "& > th:first-of-type": { width: "58px" },
                                    }}
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

                              <TableBody
                                className="table_body_main"
                                {...getTableBodyProps()}
                              >
                                {headerGroups.map((group) => (
                                  <TableRow
                                    key={group}
                                    {...group.getHeaderGroupProps()}
                                  >
                                    {group.headers.map((column) => (
                                      <TableCell
                                        key={column}
                                        {...column.getHeaderProps([
                                          { className: column.className },
                                        ])}
                                      >
                                        {column.canFilter
                                          ? column.render("Filter")
                                          : null}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))}
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
                                          bgcolor: row.isSelected
                                            ? "#FFFBEE"
                                            : "inherit",
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
                                              <cell.column.customCell
                                                value={cell.value}
                                              />
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
                                    <TableCell
                                      colSpan={columns.length + 1}
                                      align="center"
                                    >
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
                        </Stack>
                      </div>

                      <div className="col-xl-4 col-md-4">
                        <Stack
                          direction="column"
                          alignItems="center"
                          spacing={4}
                          className="py-15 px-30 border-light rounded-24"
                        >
                          <div className="text-16 lh-16 fw-600 mt-5">
                            Participant Age Group
                          </div>

                          <PieChart
                            className="pie-chart"
                            colors={categoryColor}
                            series={[
                              {
                                data: ageCategory?.map((g, id) => {
                                  return {
                                    id: id,
                                    value: g?.year_differenceCount,
                                    label: g?.year_difference,
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

                          {ageCategory?.length > 0 && (
                            <>
                              <Stack direction="row" spacing={4}>
                                {ageCategory.map((age, index) => {
                                  // const randomColor = getRandomColor(); // Get random color for each category
                                  const ageColors =
                                    categoryColor[index % colors.length];

                                  return (
                                    <div className="boxes" key={index}>
                                      <div
                                        // className={randomColor}
                                        className="color-box"
                                        style={{ backgroundColor: ageColors }}
                                      />
                                      <Stack spacing={0.5}>
                                        <p className="text-12">
                                          {age.year_difference}
                                        </p>
                                        <p className="text-12 fw-600">
                                          {age.year_differencePercentage}%
                                        </p>
                                      </Stack>
                                    </div>
                                  );
                                })}
                              </Stack>

                              <button className="button w-full rounded-24 py-15 px-15 text-reading border-light -primary-1 fw-400 text-12 d-flex gap-25">
                                View Participants
                              </button>
                            </>
                          )}
                        </Stack>
                      </div>

                      <div className="col-xl-4 col-md-4">
                        <Stack
                          direction="column"
                          alignItems="center"
                          spacing={4}
                          className="py-15 px-30 border-light rounded-24"
                        >
                          <div className="text-16 lh-16 fw-600 mt-5">
                            Gender Wise Participation
                          </div>

                          <PieChart
                            className="pie-chart"
                            colors={["#FBCDC3", "#C0462B", "#F3795E"]}
                            series={[
                              {
                                // data: [
                                //   { id: 0, value: 10, label: "Male" },
                                //   { id: 1, value: 15, label: "Female" },
                                //   { id: 2, value: 20, label: "Other" },
                                // ],
                                data: genderData?.map((g, id) => {
                                  return {
                                    id: id,
                                    value: g?.GenderCount,
                                    label: g?.Gender,
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

                          {genderData?.length > 0 && (
                            <>
                              <Stack direction="row" spacing={4}>
                                <div className="boxes">
                                  <div className="pink" />
                                  <Stack spacing={0.5}>
                                    <p className="text-12">Male</p>
                                    <p className="text-12 fw-600">
                                      {genderData[0]?.Percentage}%
                                    </p>
                                  </Stack>
                                </div>
                                <div className="boxes">
                                  <div className="orange" />
                                  <Stack spacing={0.5}>
                                    <p className="text-12">Female</p>
                                    <p className="text-12 fw-600">
                                      {genderData[1]?.Percentage}%
                                    </p>
                                  </Stack>
                                </div>
                                <div className="boxes">
                                  <div className="brown" />
                                  <Stack spacing={0.5}>
                                    <p className="text-12">Other</p>
                                    <p className="text-12 fw-600">
                                      {genderData[2]?.Percentage}%
                                    </p>
                                  </Stack>
                                </div>
                              </Stack>

                              <button className="button w-full rounded-24 py-15 px-15 text-reading border-light -primary-1 fw-400 text-12 d-flex gap-25">
                                View Participants
                              </button>
                            </>
                          )}
                        </Stack>
                      </div>

                      <div className="col-xl-4 col-md-4">
                        <Stack
                          direction="column"
                          alignItems="center"
                          spacing={4}
                          className="py-15 px-30 border-light rounded-24"
                        >
                          <div className="text-16 lh-16 fw-600 mt-5">
                            City wise Participation
                          </div>

                          <PieChart
                            className="pie-chart"
                            colors={cityColors}
                            series={[
                              {
                                data: cityData?.map((c, id) => {
                                  return {
                                    id: id,
                                    value: c?.CityCount,
                                    label: c?.City_Id,
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

                          {cityData?.length > 0 && (
                            <>
                              <Stack direction="row" spacing={3}>
                                {cityData.map((city, index) => {
                                  // const randomColor = getRandomColor(); // Get random color for each category

                                  const cityColor =
                                    cityColors[index % cityColors.length]; // Assign color for first two cities

                                  return (
                                    <div className="boxes" key={city.City_Id}>
                                      <div
                                        className="color-box"
                                        style={{
                                          backgroundColor: cityColor,
                                        }}
                                      />
                                      <Stack spacing={0.5}>
                                        <p className="text-12">
                                          {city.City_Id}
                                        </p>
                                        <p className="text-12 fw-600">
                                          {city.CityPercentage}%
                                        </p>
                                      </Stack>
                                    </div>
                                  );
                                })}
                              </Stack>
                              <button className="button w-full rounded-24 py-15 px-15 text-reading border-light -primary-1 fw-400 text-12 d-flex gap-25">
                                View Participants
                              </button>{" "}
                            </>
                          )}
                        </Stack>
                      </div>

                      <div className="col-xl-12 col-md-4">
                        <Stack
                          direction="column"
                          alignItems="flex-start"
                          spacing={4}
                          className="py-15 px-30 border-light rounded-24"
                        >
                          <div className="text-16 lh-16 fw-600 mt-5">
                            Category wise Participation
                          </div>

                          <div className="row w-full">
                            <div className="col-xl-4 col-md-6">
                              <PieChart
                                // className="pie-chart"
                                colors={categoryColor}
                                series={[
                                  {
                                    data: categoryData?.map((c, id) => {
                                      return {
                                        id: id,
                                        value: c?.CategoryCount,
                                        label: c?.CategoryName,
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
                            </div>

                            {/* <Stack spacing={4} sx={{ width: "50%" }}> */}
                            <div className="col-xl-8 col-md-6">
                              <Stack spacing={2}>
                                <Stack spacing={2}>
                                  <div className="row y-gap-10">
                                    {categoryData.map((category, index) => {
                                      // const randomColor = getRandomColor(); // Get random color for each category
                                      const categoryColors =
                                        categoryColor[index % colors.length];

                                      return (
                                        <div className="col-4">
                                          <div className="boxes" key={index}>
                                            <div
                                              className="color-box"
                                              style={{
                                                backgroundColor: categoryColors,
                                              }}
                                            />
                                            <Stack
                                              spacing={0.5}
                                              className="w-full"
                                            >
                                              <p className="text-11 trim-1">
                                                {category.CategoryName}
                                              </p>
                                              <p className="text-12 fw-600 mt-0">
                                                {category.Percentage}%
                                              </p>
                                            </Stack>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </Stack>

                                <div className="w-full d-flex justify-end mt-40">
                                  {categoryData?.length > 0 && (
                                    <button className="button w-200 rounded-24 py-15 px-15 text-reading border-light -primary-1 fw-400 text-12 d-flex gap-25">
                                      View Participants
                                    </button>
                                  )}
                                </div>
                              </Stack>
                            </div>
                          </div>
                        </Stack>
                      </div>

                      <div className="col-xl-12 col-md-4">
                        <Stack
                          direction="column"
                          alignItems="flex-start"
                          spacing={4}
                          className="py-15 px-30 border-light rounded-24"
                        >
                          <div className="text-16 lh-16 fw-600 mt-5">
                            State wise Participation
                          </div>

                          <div className="row w-full">
                            <div className="col-xl-4 col-md-6">
                              <PieChart
                                // className="pie-chart"
                                colors={categoryColor}
                                series={[
                                  {
                                    data: stateData?.map((c, id) => {
                                      return {
                                        id: id,
                                        value: c?.StateCount,
                                        label: c?.State_Id,
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
                            </div>

                            <div className="col-xl-8 col-md-6">
                              <Stack spacing={2}>
                                <Stack spacing={2}>
                                  <div className="row y-gap-10">
                                    {stateData.map((state, index) => {
                                      // const randomColor = getRandomColor(); // Get random color for each category
                                      const categoryColors =
                                        categoryColor[index % colors.length];

                                      return (
                                        <div className="col-4">
                                          <div className="boxes" key={index}>
                                            <div
                                              className="color-box"
                                              style={{
                                                backgroundColor: categoryColors,
                                              }}
                                            />
                                            <Stack
                                              spacing={0.5}
                                              className="w-full"
                                            >
                                              <p className="text-11 trim-1">
                                                {state.State_Id}
                                              </p>
                                              <p className="text-12 fw-600 mt-0">
                                                {state.StatePercentage}%
                                              </p>
                                            </Stack>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </Stack>

                                <div className="w-full d-flex justify-end mt-40">
                                  {stateData?.length > 0 && (
                                    <button className="button w-200 rounded-24 py-15 px-15 text-reading border-light -primary-1 fw-400 text-12 d-flex gap-25">
                                      View Participants
                                    </button>
                                  )}
                                </div>
                              </Stack>
                            </div>
                          </div>
                        </Stack>
                      </div>

                      <div className="col-xl-4 col-md-4">
                        <Stack
                          direction="column"
                          alignItems="center"
                          spacing={6}
                          className="py-35 px-30 border-light rounded-24"
                        >
                          <Stack spacing={4} textAlign="center">
                            <div className="text-20 lh-16 fw-500">
                              Event Rating
                            </div>
                            <div className="text-60 lh-16 fw-600 text-primary mt-10">
                              4.5
                            </div>
                          </Stack>

                          <Stack spacing={6} textAlign="center">
                            <div className="text-20 lh-16 fw-500">
                              Average Rating
                            </div>
                            <div className="text-30 lh-16 fw-500 text-green mt-10">
                              <i className="fas fa-star"></i>{" "}
                              <i className="fas fa-star"></i>{" "}
                              <i className="fas fa-star text-45"></i>{" "}
                              <i className="fas fa-star"></i>{" "}
                              <i className="fas fa-star-half-alt"></i>
                            </div>
                          </Stack>
                        </Stack>
                      </div>

                      <div className="col-xl-8 col-md-4">
                        <Stack
                          direction="column"
                          spacing={2}
                          className="py-15 px-30 border-light rounded-24"
                        >
                          <div className="text-16 lh-16 fw-600 mt-5">
                            Total Reviews
                          </div>

                          <div className="text-24 lh-16 fw-600 mt-10">
                            300 Reviews
                          </div>

                          <div className="py-20">
                            <div className="progressBar">
                              <div className="">
                                <div
                                  className="progressBar__bg bg-blue-2"
                                  style={{ height: "12px" }}
                                ></div>
                                <div
                                  className="progressBar__bar"
                                  style={{
                                    width: "80%",
                                    backgroundColor: "#15682C",
                                  }}
                                >
                                  <span className="text-12 fw-600">80%</span>
                                </div>
                              </div>
                            </div>
                            <div className="progressBar mt-30">
                              <div className="mt-20">
                                <div
                                  className="progressBar__bg bg-blue-2"
                                  style={{ height: "12px" }}
                                >
                                  {" "}
                                </div>
                                <div
                                  className="progressBar__bar"
                                  style={{
                                    width: "70%",
                                    backgroundColor: "#3DAF58",
                                  }}
                                >
                                  <span className="text-12 fw-600">70%</span>
                                </div>
                              </div>
                            </div>
                            <div className="progressBar mt-30">
                              <div className="mt-20">
                                <div
                                  className="progressBar__bg bg-blue-2"
                                  style={{ height: "12px" }}
                                ></div>
                                <div
                                  className="progressBar__bar"
                                  style={{
                                    width: "30%",
                                    backgroundColor: "#E9BA4F",
                                  }}
                                >
                                  <span className="text-12 fw-600">35%</span>
                                </div>
                              </div>
                            </div>
                            <div className="progressBar mt-30">
                              <div className="mt-20">
                                <div
                                  className="progressBar__bg bg-blue-2"
                                  style={{ height: "12px" }}
                                ></div>
                                <div
                                  className="progressBar__bar"
                                  style={{
                                    width: "10%",
                                    backgroundColor: "#F19B67",
                                  }}
                                >
                                  <span className="text-12 fw-600">10%</span>
                                </div>
                              </div>
                            </div>
                            <div className="progressBar mt-30">
                              <div className="mt-20">
                                <div
                                  className="progressBar__bg bg-blue-2"
                                  style={{ height: "12px" }}
                                ></div>
                                <div
                                  className="progressBar__bar"
                                  style={{
                                    width: "10%",
                                    backgroundColor: "#EB4556",
                                  }}
                                >
                                  <span className="text-12 fw-600">5%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Stack>
                      </div>
                    </>
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

export default EventParticipants;

/* {categoryData?.length > 3 ? (
                                    <>
                                       First two cities in a row with spacing of 15
                                      <Stack direction="row" spacing={15}>
                                        {categoryData
                                          .slice(0, 2)
                                          .map((category, index) => {
                                            const categoryColors =
                                              categoryColor[
                                                index % colors.length
                                              ];

                                            return (
                                              <Stack
                                                direction="row"
                                                spacing={2}
                                                key={category.Event_Category_Id}
                                              >
                                                <div
                                                  className="color-box"
                                                  style={{
                                                    backgroundColor:
                                                      categoryColors,
                                                  }}
                                                />
                                                <Stack spacing={0.5}>
                                                  <p className="text-12">
                                                    {category.CategoryName}
                                                  </p>
                                                  <p className="text-12 fw-600">
                                                    {category.Percentage}%
                                                  </p>
                                                </Stack>
                                              </Stack>
                                            );
                                          })}
                                      </Stack>

                                     Remaining cities placed in a vertical stack 
                                      {categoryData
                                        .slice(2)
                                        .map((category, index) => {
                                          const categoryColors =
                                            categoryColor[
                                              (index + 2) % colors.length
                                            ];

                                          return (
                                            <Stack
                                              direction="row"
                                              spacing={2}
                                              key={category.Event_Category_Id}
                                            >
                                              <div
                                                className="color-box"
                                                style={{
                                                  backgroundColor:
                                                    categoryColors,
                                                }}
                                              />
                                              <Stack spacing={0.5}>
                                                <p className="text-12">
                                                  {category.CategoryName}
                                                </p>
                                                <p className="text-12 fw-600">
                                                  {category.Percentage}%
                                                </p>
                                              </Stack>
                                            </Stack>
                                          );
                                        })}
                                    </>
                                  ) : (
                                    categoryData.map((category, index) => {
                                      // const randomColor = getRandomColor(); // Get random color for each category
                                      const categoryColors =
                                        categoryColor[index % colors.length];

                                      return (
                                        <div className="boxes" key={index}>
                                          <div
                                            className="color-box"
                                            style={{
                                              backgroundColor: categoryColors,
                                            }}
                                          />
                                          <Stack spacing={0.5}>
                                            <p className="text-12">
                                              {category.CategoryName}
                                            </p>
                                            <p className="text-12 fw-600">
                                              {category.Percentage}%
                                            </p>
                                          </Stack>
                                        </div>
                                      );
                                    })
                                  )} */
