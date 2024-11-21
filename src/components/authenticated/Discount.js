// React imports
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

// Third-party imports
// React Router and Redux imports
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Select from "react-select";
import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Formik, Form, Field, ErrorMessage } from "formik";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import * as Yup from "yup";

// Project imports
import { selectCustomStyle } from "../../utils/ReactSelectStyles";
import { decryptData } from "../../utils/DataEncryption";
import { RestfulApiService } from "../../config/service";
import EventTitle from "./EventTitle";

function Discount() {
  const validationSchema = Yup.object({
    Discount_Name: Yup.string().required("Discount Name is required"),
    Discount_Type: Yup.object().required("Discount Type is required"),
    Category_Type: Yup.object().required("Calculation Type is required"),
    Discount_Amount: Yup.number()
      .required("Discount Amount is required")
      .positive("Must be a positive number"),
    Max_count_for_Discount: Yup.number()
      .required("Max Count is required")
      .positive("Must be a positive number")
      .integer("Must be an integer"),
    Discount_Start_Date: Yup.date().required("Start Date is required"),
    Discount_End_Date: Yup.date()
      .required("End Date is required")
      .min(
        Yup.ref("Discount_Start_Date"),
        "End Date cannot be before Start Date"
      ),
    Event_Category: Yup.array()
      .of(Yup.string())
      .min(1, "At least one category must be selected"),
  });
  const initialValues = useMemo(
    () => ({
      Discount_Name: "",
      Discount_Type: null,
      Category_Type: null,
      Discount_Amount: "",
      Max_count_for_Discount: "",
      Discount_Start_Date: null,
      Discount_End_Date: null,
      Event_Category: [],
    }),
    []
  );
  const { event_id } = useParams();
  const user = useSelector((state) => state.user.userProfile);
  const [showDiscountForm, setShowDiscountForm] = useState(false);
  const [eventCategories, setEventCategories] = useState([]);
  const [getOneData, setGetOneData] = useState(initialValues);
  const [showLoader, setShowLoader] = useState(false);
  const [submittingForm, setSubmitForm] = useState(false);
  const [eventDetailsList, setEventDetailsList] = useState([]);

  // const [getOneData, setGetOneData] = useState(initialValues);

  const disCountType = [
    {
      label: "Coupon Code Based",
      value: "CCB",
    },
    {
      label: "Flat Discount",
      value: "FD",
    },
  ];
  const calculationType = [
    {
      label: "Amount Based",
      value: "C008002",
    },
    {
      label: "Percent Based",
      value: "C008001",
    },
  ];

  // async function
  const GetEventCategory = useCallback(async () => {
    const reqdata = {
      Method_Name: "GetOneEventCategory",
      Org_Id: user?.Org_Id,
      ParentField_Id: decryptData(event_id),
      SearchText: "",
      Session_User_Id: user?.User_Id,
    };

    try {
      const result = await RestfulApiService(reqdata, "master/Getdropdown");
      if (result) {
        console.log(result?.data?.Result?.Table1);
        setEventCategories(result?.data?.Result?.Table1);
      }
    } catch (err) {
      console.log(err);
    }
  }, [user, event_id]);

  useEffect(() => {
    GetEventCategory();
  }, [GetEventCategory]);

  // function to map the list
  const handleGetList = useCallback(async () => {
    setShowLoader(true);
    const reqdata = {
      Method_Name: "Get_Discount",
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
      Org_Id: user?.Org_Id,
      EventDiscount_Id: "",
      Event_Id: decryptData(event_id),
    };

    try {
      const result = await RestfulApiService(
        reqdata,
        "organizer/EventDiscount"
      );
      if (result) {
        console.log(result?.data?.Result?.Table1);
        setEventDetailsList(result?.data?.Result?.Table1);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setShowLoader(false);
    }
  }, [
    user?.User_Id,
    user?.User_Display_Name,
    user?.Organizer_Id,
    user?.Org_Id,
    event_id,
  ]);
  //hanlde Edit call
  const handleEdit = useCallback(
    async (EventDiscount_Id) => {
      setShowLoader(true);
      const reqdata = {
        Method_Name: "GetOne",
        Session_User_Id: user?.User_Id,
        Session_User_Name: user?.User_Display_Name,
        Session_Organzier_Id: user?.Organizer_Id,
        Org_Id: user?.Org_Id,
        EventDiscount_Id, //
        Event_Id: decryptData(event_id),
      };
      try {
        const result = await RestfulApiService(
          reqdata,
          "organizer/EventDiscount"
        );
        if (result) {
          console.log("testutl", result?.data?.Result?.Table1?.[0]);
          // setGetOneData(result?.data?.Result?.Table1?.[0] ?? {});
          let value = result?.data?.Result?.Table1?.[0] ?? {};
          // debugger
          // if(value?.Result_Id!==1){
          //   toast.error(value.Result_Description || "Something went wrong");
          //   return
          // }
          setGetOneData({
            EventDiscount_Id: value?.EventDiscount_Id,
            Discount_Name: value?.Discount_Name,
            // Discount_Type: value?.DiscountMainType_Id, //
            Discount_Type: disCountType.find(
              (option) => option.value === value.DiscountMainType_Id
            ),
            // Category_Type: value?.DiscountType_Id,
            Category_Type: calculationType.find(
              (option) => option.value === value.DiscountType_Id
            ),
            Discount_Amount: value?.Discount_Value,
            Max_count_for_Discount: value?.Discount_MaxCount,
            Discount_Start_Date: value?.Discount_Start_Date,
            Discount_End_Date: value?.Discount_End_Date,
            Event_Category: JSON.parse(value.EventCategoryEntry_Id),
          });

          console.log(typeof value?.EventCategoryEntry_Id);
          setShowDiscountForm(true);
        }
      } catch (err) {
        toast.error(err.message || "Something went wrong");
        console.log(err);
      } finally {
        setShowLoader(false);
      }
    },
    [
      event_id,
      user?.Org_Id,
      user?.Organizer_Id,
      user?.User_Display_Name,
      user?.User_Id,
    ]
  );
  const handleDelete = useCallback(
    async (EventDiscount_Id) => {
      Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        preConfirm: async () => {
          Swal.showLoading();

          const reqdata = {
            Method_Name: "Delete",
            Session_User_Id: user?.User_Id,
            Session_User_Name: user?.User_Display_Name,
            Session_Organzier_Id: user?.Organizer_Id,
            Org_Id: user?.Org_Id,
            EventDiscount_Id, // passing EventDiscount_Id directly
            Event_Id: decryptData(event_id),
          };

          try {
            const result = await RestfulApiService(
              reqdata,
              "organizer/SaveEventDiscount"
            );

            // Check if the deletion is successful
            if (result?.data?.Status) {
              return true; // Return true to proceed with the success alert
            } else {
              // Show validation message if the delete operation fails
              Swal.showValidationMessage("Failed to delete the discount.");
              return false;
            }
          } catch (error) {
            // Handle the error by showing a validation message
            Swal.showValidationMessage("Request failed: " + error.message);
            return false;
          }
        },
      })
        .then((result) => {
          if (result.isConfirmed) {
            // If deletion is confirmed and successful, show the success message
            Swal.fire({
              title: "Deleted!",
              text: "Event discount has been deleted.",
              icon: "success",
            });

            // Reload the list after successful deletion
            handleGetList();
          }
        })
        .finally(() => {
          setShowLoader(false); // Ensure loader is hidden after the process
        });
    },
    [
      event_id,
      handleGetList,
      user?.Org_Id,
      user?.Organizer_Id,
      user?.User_Display_Name,
      user?.User_Id,
    ]
  );
  const handleSubmit = useCallback(
    async (values) => {
      const formatDate = (date) => dayjs(date).format("DD MMM YYYY");

      const eventCategories = values?.Event_Category || [];
      const categoryXMLData = `<D>${eventCategories
        .map((cat) => `<R><ECEI>${cat}</ECEI></R>`)
        .join("")}</D>`;
      console.log("Category XML Data:", categoryXMLData);

      const fields = [
        {
          name: "DiscountMainType_Id",
          value: values.Discount_Type?.value ?? "",
          type: "Text",
        },
        {
          name: "Discount_Name",
          value: values.Discount_Name ?? "",
          type: "Text",
        },
        {
          name: "Discount_Value",
          value: values.Discount_Amount ?? 0,
          type: "Text",
        },
        {
          name: "Discount_MaxCount",
          value: values.Max_count_for_Discount ?? 0,
          type: "Text",
        },
        {
          name: "Discount_Start_Date",
          value: formatDate(values.Discount_Start_Date),
          type: "Date",
        },
        {
          name: "Discount_End_Date",
          value: formatDate(values.Discount_End_Date),
          type: "Date",
        },
        { name: "Is_Active", value: 1, type: "Text" },
        { name: "Is_Deleted", value: 0, type: "Text" },
      ];

      const XMLData = `<D>${fields
        .map(
          (field) =>
            `<R><FN>${field.name}</FN><FV>${field.value}</FV><FT>${field.type}</FT></R>`
        )
        .join("")}</D>`;
      setShowDiscountForm(false);

      // calling the api
      const reqdata = {
        Method_Name: values.EventDiscount_Id ? "Update" : "Create",
        Event_Id: decryptData(event_id),
        DiscountType_Id: values.Category_Type.value, //%
        EventDiscount_Id: values.EventDiscount_Id ?? "", //EventDiscount_Id blank for add
        XMLData: XMLData,
        CategoryXMLData: categoryXMLData,
        Discount_Name: values.Discount_Name,
        Session_User_Id: user?.User_Id,
        Session_User_Name: user?.User_Display_Name,
        Session_Organzier_Id: user?.Organizer_Id,
        Org_Id: user?.Org_Id,
      };
      console.log({ reqdata });

      try {
        setSubmitForm(true);
        const result = await RestfulApiService(
          reqdata,
          "organizer/SaveEventDiscount"
        );
        if (result) {
          const { Result_Id } = result?.data?.Result?.Table1?.[0];
          if (Result_Id === 1) {
            handleGetList();
            setGetOneData(initialValues);
          } else {
            toast.error(result?.data?.Result?.Table1?.[0]?.Result_Description);
          }
        }
      } catch (err) {
        toast.error(err.message || "Something went wrong");
      } finally {
        setSubmitForm(false);
      }
    },
    [
      event_id,
      handleGetList,
      initialValues,
      user?.Org_Id,
      user?.Organizer_Id,
      user?.User_Display_Name,
      user?.User_Id,
    ]
  );

  useEffect(() => {
    handleGetList();
  }, [handleGetList]);

  return (
    <div class="dashboard__main">
      <div class="dashboard__content pt-20">
        <section class="layout-pb-md">
          <div class="container">
            <div class="row y-gap-30">
              <EventTitle />

              {showDiscountForm ? (
                <div class="col-xl-12 col-md-12">
                  <Formik
                    initialValues={getOneData}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ values, setFieldValue }) => (
                      <Form>
                        <div className="row y-gap-20">
                          {/* Discount Name */}
                          <div className="col-lg-4 col-md-6">
                            <div className="single-field y-gap-20">
                              <label className="text-13 fw-500">
                                Discount Name <sup className="asc">*</sup>
                              </label>
                              <div class="form-control">
                                <Field
                                  type="text"
                                  name="Discount_Name"
                                  className="form-control"
                                  placeholder="Discount Name"
                                  onChange={(e) => {
                                    e.preventDefault();
                                    const { value } = e.target;

                                    const regex = /^[^\s].*$/;

                                    if (
                                      !value ||
                                      (regex.test(value.toString()) &&
                                        value.length <= 50)
                                    ) {
                                      setFieldValue("Discount_Name", value);
                                    } else {
                                      return;
                                    }
                                  }}
                                />
                              </div>
                              <ErrorMessage
                                name="Discount_Name"
                                component="div"
                                className="text-error-2 text-13"
                              />
                            </div>
                          </div>

                          {/* Discount Type */}
                          <div className="col-lg-4 col-md-6">
                            <div className="y-gap-10">
                              <label className="text-13 fw-500">
                                Discount Type <sup className="asc">*</sup>
                              </label>
                              <Select
                                isSearchable={false}
                                options={disCountType}
                                styles={selectCustomStyle}
                                // value={disCountType.find(
                                //   (option) =>
                                //     option.value === values.Discount_Type
                                // )}
                                value={values.Discount_Type}
                                onChange={(option) =>
                                  setFieldValue("Discount_Type", option)
                                }
                              />
                              <ErrorMessage
                                name="Discount_Type"
                                component="div"
                                className="text-error-2 text-13"
                              />
                            </div>
                          </div>

                          {/* Calculation Type */}
                          <div className="col-lg-4 col-md-6">
                            <div className="y-gap-10">
                              <label className="text-13 fw-500">
                                Calculation Type <sup className="asc">*</sup>
                              </label>
                              <Select
                                isSearchable={false}
                                options={calculationType}
                                styles={selectCustomStyle}
                                // value={calculationType.find(
                                //   (option) =>
                                //     option.value === values.Category_Type
                                // )}
                                value={values.Category_Type}
                                onChange={(option) =>
                                  setFieldValue("Category_Type", option)
                                }
                              />
                              <ErrorMessage
                                name="Category_Type"
                                component="div"
                                className="text-error-2 text-13"
                              />
                            </div>
                          </div>

                          {/* Discount Amount */}
                          <div className="col-lg-4 col-md-4">
                            <div className="single-field y-gap-10">
                              <label className="text-13 fw-500">
                                Discount Amount (₹) <sup className="asc">*</sup>
                              </label>
                              <div class="form-control">
                                <Field
                                  type="number"
                                  name="Discount_Amount"
                                  className="form-control"
                                  placeholder="Enter Discount Amount"
                                  onWheel={(e) => e.target.blur()}
                                  onChange={(e) => {
                                    if (
                                      e.target.value < 0 ||
                                      e.target.value === "e" ||
                                      e.target.value === "E"
                                    ) {
                                      return;
                                    }
                                    setFieldValue(
                                      "Discount_Amount",
                                      e.target.value
                                    );
                                  }}
                                />
                              </div>
                              <ErrorMessage
                                name="Discount_Amount"
                                component="div"
                                className="text-error-2 text-13"
                              />
                            </div>
                          </div>

                          {/* Max Count */}
                          <div className="col-lg-4 col-md-4">
                            <div className="single-field y-gap-10">
                              <label className="text-13 fw-500">
                                Max Counts For Discount{" "}
                                <sup className="asc">*</sup>
                              </label>
                              <div class="form-control">
                                <Field
                                  type="number"
                                  name="Max_count_for_Discount"
                                  className="form-control"
                                  placeholder="Enter Max Count"
                                  onWheel={(e) => e.target.blur()}
                                  onChange={(e) => {
                                    if (
                                      e.target.value < 0 ||
                                      e.target.value === "e" ||
                                      e.target.value === "E"
                                    ) {
                                      return;
                                    }
                                    setFieldValue(
                                      "Max_count_for_Discount",
                                      e.target.value
                                    );
                                  }}
                                />
                              </div>
                              <ErrorMessage
                                name="Max_count_for_Discount"
                                component="div"
                                className="text-error-2 text-13"
                              />
                            </div>
                          </div>

                          {/* Discount Start Date */}
                          <div className="col-lg-4 col-md-4">
                            <div className="single-field y-gap-10">
                              <label className="text-13 fw-500">
                                Discount Start Date <sup className="asc">*</sup>
                              </label>
                              <div class="form-control">
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DesktopDatePicker
                                    className="form-control"
                                    value={
                                      values.Discount_Start_Date
                                        ? dayjs(values.Discount_Start_Date)
                                        : null
                                    }
                                    onChange={(newValue) =>
                                      setFieldValue(
                                        "Discount_Start_Date",
                                        newValue
                                      )
                                    }
                                    format="DD/MM/YYYY"
                                    disablePast
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        fullWidth
                                        className="form-control"
                                      />
                                    )}
                                  />
                                </LocalizationProvider>
                              </div>
                              <ErrorMessage
                                name="Discount_Start_Date"
                                component="div"
                                className="text-error-2 text-13"
                              />
                            </div>
                          </div>

                          <div className="col-lg-4 col-md-4">
                            <div className="single-field y-gap-10">
                              <label className="text-13 fw-500">
                                Discount End Date <sup className="asc">*</sup>
                              </label>
                              <div class="form-control">
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DesktopDatePicker
                                    className="form-control"
                                    value={
                                      values.Discount_End_Date
                                        ? dayjs(values.Discount_End_Date)
                                        : null
                                    }
                                    onChange={(newValue) =>
                                      setFieldValue(
                                        "Discount_End_Date",
                                        newValue
                                      )
                                    }
                                    format="DD/MM/YYYY"
                                    disablePast
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        fullWidth
                                        className="form-control"
                                      />
                                    )}
                                  />
                                </LocalizationProvider>
                              </div>
                              <ErrorMessage
                                name="Discount_End_Date"
                                component="div"
                                className="text-error-2 text-13"
                              />
                            </div>
                          </div>

                          {/* Event Categories */}
                          <div className="col-lg-8">
                            <div className="y-gap-5">
                              <label className="text-13 fw-500">
                                Event Categories <sup className="asc">*</sup>
                              </label>
                              <Select
                                isMulti
                                options={eventCategories}
                                styles={selectCustomStyle}
                                value={eventCategories.filter((option) =>
                                  values.Event_Category.includes(option.value)
                                )}
                                onChange={(selectedOptions) => {
                                  const selectedValues = selectedOptions.map(
                                    (option) => option.value
                                  );
                                  setFieldValue(
                                    "Event_Category",
                                    selectedValues
                                  );
                                }}
                              />
                              <ErrorMessage
                                name="Event_Category"
                                component="div"
                                className="text-error-2 text-13"
                              />
                            </div>
                          </div>

                          <div className="col-12 mt-10">
                            <div className="d-flex gap-15 items-center">
                              <button
                                disabled={submittingForm}
                                type="submit"
                                className="button bg-primary w-150 h-40 rounded-24 px-15 text-white text-12 border-light"
                              >
                                Save
                              </button>

                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  setShowDiscountForm(false);
                                  setGetOneData({
                                    Discount_Name: "",
                                    Discount_Type: null,
                                    Category_Type: null,
                                    Discount_Amount: "",
                                    Max_count_for_Discount: "",
                                    Discount_Start_Date: null,
                                    Discount_End_Date: null,
                                    Event_Category: [],
                                  });
                                }}
                                className="button bg-white w-150 h-40 rounded-24 px-15 text-primary border-primary fw-400 text-12"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              ) : (
                <>
                  <div className="col-xl-12 col-md-12">
                    <div
                      className="py-20 px-5 lg:px-10 rounded-16 bg-white"
                      style={{
                        boxShadow: "2.46px 2.46px 15.99px 0px #00000021",
                      }}
                    >
                      <div className="row y-gap-20 justify-between items-center">
                        <div className="col-lg-2 col-md-2 text-center">
                          <div className="text-13 text-primary lh-16 fw-600">
                            Discount Name
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-2 text-center">
                          <div className="text-13 text-primary lh-16 fw-600">
                            Discount Type
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-2 text-center">
                          <div className="text-13 text-primary lh-16 fw-600">
                            Discount Amount (₹)
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-2 text-center">
                          <div className="text-13 text-primary lh-16 fw-600">
                            Max Counts
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-2 text-center">
                          <div className="text-13 text-primary lh-16 fw-600">
                            Discount Date
                          </div>
                        </div>
                        {/* TODO : UNCOMMENT IT  */}
                        {/* <div className="col-lg-2 col-md-2 text-center">
                          <div className="text-13 text-primary lh-16 fw-600">
                          Category Name
                          </div>
                        </div> */}
                        <div className="col-lg-2 col-md-2 text-center">
                          <div className="text-13 text-primary lh-16 fw-600">
                            Actions
                          </div>
                        </div>
                        {/* ====== starting ====== */}
                        {eventDetailsList.map((cur) => {
                          return (
                            <Fragment key={cur?.EventDiscount_Id}>
                              <div className="col-lg-2 col-md-2 text-center">
                                <div className="text-14 text-reading lh-16 fw-500">
                                  {cur?.Discount_Name}
                                </div>
                              </div>

                              <div className="col-lg-2 col-md-2 text-center pt-0">
                                <div className="text-14 text-reading lh-16 fw-500">
                                  {cur?.DiscountType_Name}
                                </div>
                              </div>
                              <div className="col-lg-2 col-md-2 text-center pt-0">
                                <div className="text-14 text-reading lh-16 fw-500">
                                  {cur?.Discount_MaxCount}
                                </div>
                              </div>
                              <div className="col-lg-2 col-md-2 text-center pt-0">
                                <div className="text-14 text-reading lh-16 fw-500">
                                  {cur?.Discount_Value}
                                </div>
                              </div>
                              <div className="col-lg-2 col-md-2 text-center pt-0">
                                <div className="text-14 text-reading lh-16 fw-500">
                                  {cur?.Discount_Period}
                                </div>
                              </div>
                              {/* TODO : uncomment it  */}
                              {/* <div className="col-lg-2 col-md-2 text-center pt-0">
                                <div className="text-14 text-reading lh-16 fw-500">
                                  {cur?.EventCategoryName}
                                </div>
                              </div> */}
                              <div className="col-lg-2 col-md-2 text-center pt-0">
                                <div
                                  className="text-14 text-reading lh-16 fw-500"
                                  style={{
                                    display: "flex",
                                    gap: "12px",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                  }}
                                >
                                  <i
                                    className="fas fa-pencil-alt"
                                    onClick={() => {
                                      handleEdit(cur?.EventDiscount_Id);
                                    }}
                                  ></i>
                                  <i
                                    className="far fa-trash-alt action-button"
                                    onClick={() => {
                                      handleDelete(cur?.EventDiscount_Id);
                                    }}
                                  ></i>{" "}
                                </div>
                              </div>
                            </Fragment>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-12 col-md-12 d-flex justify-end">
                    <button
                      onClick={() => {
                        setShowDiscountForm(true);
                      }}
                      class="button bg-primary w-150 h-40 px-30 rounded-24 text-white text-16 -grey-1 d-flex gap-10"
                    >
                      ADD
                      <i className="fas fa-plus text-16"></i>
                    </button>
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

export default Discount;
