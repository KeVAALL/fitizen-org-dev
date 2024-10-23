import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Event5 from "../../assets/img/events/event5.png";
import Select from "react-select";
import { selectCustomStyle } from "../../utils/ReactSelectStyles";
import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  DesktopDatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { decryptData } from "../../utils/DataEncryption";
import { RestfulApiService } from "../../config/service";
import { Category } from "@mui/icons-material";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import EventTitle from "./EventTitle";

function Discount() {
  const initialValues = useMemo(
    () => ({
      Discount_Name: "",
      Discount_Type: "",
      Category_Type: "",
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
  const hanldeGetList = useCallback(async () => {
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
  const hanldeEdit = useCallback(
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
            Discount_Type: value?.DiscountMainType_Id,
            Category_Type: value?.DiscountType_Id,
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
        debugger;
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

  //   const handleDelete=useCallback(async(EventDiscount_Id)=>{
  //     setShowLoader(true);
  //     const reqdata = {
  //       Method_Name: "Delete",
  //       Session_User_Id: user?.User_Id,
  //       Session_User_Name: user?.User_Display_Name,
  //       Session_Organzier_Id: user?.Organizer_Id,
  //       Org_Id: user?.Org_Id,
  //       EventDiscount_Id, //
  //       Event_Id: decryptData(event_id),
  //     };
  //     try {
  //       const result = await RestfulApiService(
  //         reqdata,
  //         "organizer/SaveEventDiscount"
  //       );
  // debugger
  //       if ( result?.data?.Status) {
  //         toast.success("Deleted Successfully");
  //         hanldeGetList();
  //       }
  //     } catch (err) {
  //       debugger
  //       toast.error(err.message || "Something went wrong");
  //       console.log(err);
  //     } finally {
  //       setShowLoader(false);
  //     }
  //   },[event_id, hanldeGetList, user?.Org_Id, user?.Organizer_Id, user?.User_Display_Name, user?.User_Id])

  const handleDelete = useCallback(
    async (EventDiscount_Id) => {
      // Trigger the SweetAlert confirmation
      Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        preConfirm: async () => {
          // Show loading spinner on the confirm button
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
            hanldeGetList();
          }
        })
        .finally(() => {
          setShowLoader(false); // Ensure loader is hidden after the process
        });
    },
    [
      event_id,
      hanldeGetList,
      user?.Org_Id,
      user?.Organizer_Id,
      user?.User_Display_Name,
      user?.User_Id,
    ]
  );

  const handleSubmit = useCallback(async () => {
    const formatDate = (date) => dayjs(date).format("DD MMM YYYY");

    const eventCategories = getOneData?.Event_Category || [];
    const categoryXMLData = `<D>${eventCategories
      .map((cat) => `<R><ECEI>${cat}</ECEI></R>`)
      .join("")}</D>`;
    console.log("Category XML Data:", categoryXMLData);

    const fields = [
      {
        name: "DiscountMainType_Id",
        value: getOneData.Discount_Type ?? "",
        type: "Text",
      },
      {
        name: "Discount_Name",
        value: getOneData.Discount_Name ?? "",
        type: "Text",
      },
      {
        name: "Discount_Value",
        value: getOneData.Discount_Amount ?? "",
        type: "Text",
      },
      {
        name: "Discount_MaxCount",
        value: getOneData.Max_count_for_Discount ?? 0,
        type: "Text",
      },
      {
        name: "Discount_Start_Date",
        value: formatDate(getOneData.Discount_Start_Date),
        type: "Date",
      },
      {
        name: "Discount_End_Date",
        value: formatDate(getOneData.Discount_End_Date),
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
    debugger;
    console.log("Final XML Data:", XMLData);
    setShowDiscountForm(false);

    // calling the api
    const reqdata = {
      Method_Name: getOneData.EventDiscount_Id ? "Update" : "Create",
      Event_Id: decryptData(event_id),
      DiscountType_Id: getOneData.Category_Type, //%
      EventDiscount_Id: getOneData.EventDiscount_Id ?? "", //EventDiscount_Id blank for add
      XMLData: XMLData,
      CategoryXMLData: categoryXMLData,
      Discount_Name: getOneData.Discount_Name,
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
      Org_Id: user?.Org_Id,
    };
    console.log({ reqdata });

    try {
      const result = await RestfulApiService(
        reqdata,
        "organizer/SaveEventDiscount"
      );
      if (result) {
        console.log(result?.data?.Result?.Table1);
        const { Result_Id } = result?.data?.Result?.Table1?.[0];
        debugger;
        if (Result_Id === 1) {
          hanldeGetList();
          setGetOneData(initialValues);
        } else {
          toast.error(result?.data?.Result?.Table1?.[0]?.Result_Description);
        }
      }
    } catch (err) {
      debugger;
      toast.error(err.message || "Something went wrong");
      console.log(err);
    }
  }, [
    getOneData,
    event_id,
    hanldeGetList,
    initialValues,
    user?.Org_Id,
    user?.Organizer_Id,
    user?.User_Display_Name,
    user?.User_Id,
  ]);

  useEffect(() => {
    hanldeGetList();
  }, [hanldeGetList]);

  return (
    <div class="dashboard__main">
      <div class="dashboard__content pt-20">
        <section class="layout-pb-md">
          <div class="container">
            <div class="row y-gap-30">
              <EventTitle />

              {showDiscountForm ? (
                <div class="col-xl-12 col-md-12">
                  <div class="row y-gap-20 justify-between items-center">
                    <div class="col-lg-4 col-md-6">
                      <div class="single-field">
                        <label class="text-13 fw-500">Discount Name </label>
                        <div class="form-control">
                          <input
                            type="text"
                            // value={getOneData?.Discount_Name}
                            value={
                              getOneData.Discount_Name ||
                              getOneData?.Discount_Name
                            }
                            onChange={(event) =>
                              setGetOneData({
                                ...getOneData,
                                Discount_Name: event.target.value,
                              })
                            }
                            class="form-control"
                            placeholder="Discount Name"
                            name="discountname"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-4 col-md-6">
                      <div class="y-gap-10">
                        <label class="text-13 fw-500">
                          Discount Type <sup class="asc">*</sup>
                        </label>
                        <div className="col-xl-3 col-md-6 w-full">
                          <Select
                            isSearchable={false}
                            styles={selectCustomStyle}
                            options={disCountType}
                            value={disCountType.find(
                              (option) =>
                                option.value === getOneData?.Discount_Type
                            )}
                            onChange={(event) => {
                              setGetOneData({
                                ...getOneData,
                                Discount_Type: event.value, // Ensure that you set the correct value from the selected option
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-4 col-md-6">
                      <div class="y-gap-10">
                        <label class="text-13 fw-500">
                          Calculation Type <sup class="asc">*</sup>
                        </label>
                        <div className="col-xl-3 col-md-6 w-full">
                          <Select
                            isSearchable={false}
                            styles={selectCustomStyle}
                            options={calculationType}
                            value={calculationType.find(
                              (option) =>
                                option.value === getOneData?.Category_Type
                            )}
                            onChange={(event) => {
                              setGetOneData({
                                ...getOneData,
                                Category_Type: event.value,
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    {/* <div class="col-lg-4 col-md-4">
                      <div class="single-field">
                        <label class="text-13 fw-500">
                          Enter Discount Percentage (%) <sup class="asc">*</sup>
                        </label>
                        <div class="form-control">
                          <input
                            type="text"

                            class="form-control"
                            placeholder="Add Percentage"
                            name="discpercent"
                          />
                        </div>
                      </div>
                    </div> */}
                    <div class="col-lg-4 col-md-4">
                      <div class="single-field">
                        <label class="text-13 fw-500">
                          Enter Discount Amount (₹) <sup class="asc">*</sup>
                        </label>
                        <div class="form-control">
                          <input
                            type="text"
                            class="form-control"
                            value={
                              getOneData.Discount_Amount ||
                              getOneData?.Discount_Value
                            }
                            onChange={(event) =>
                              setGetOneData({
                                ...getOneData,
                                Discount_Amount: event.target.value,
                              })
                            }
                            placeholder="Enter Discount Amount"
                            name="discamount"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-4 col-md-4">
                      <div class="single-field">
                        <label class="text-13 fw-500">
                          Max Counts For Discount <sup class="asc">*</sup>
                        </label>
                        <div class="form-control">
                          <input
                            type="text"
                            value={
                              getOneData.Max_count_for_Discount ||
                              getOneData?.Discount_MaxCount
                            }
                            onChange={(event) =>
                              setGetOneData({
                                ...getOneData,
                                Max_count_for_Discount: event.target.value,
                              })
                            }
                            class="form-control"
                            placeholder="40"
                            name="disccount"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-3 col-md-3">
                      <div class="single-field">
                        <label class="text-13 fw-500">
                          Discount Start Date{" "}
                        </label>
                        <div className="form-control">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                              className="form-control"
                              name="Date_Of_Birth"
                              format="DD/MM/YYYY"
                              inputFormat="DD/MM/YYYY"
                              disableFuture
                              // value={getOneData?.Discount_Start_Date ?? null}
                              value={
                                getOneData?.Discount_Start_Date
                                  ? dayjs(getOneData.Discount_Start_Date)
                                  : null
                              } // Convert ISO string to Dayjs
                              onChange={(newValue) =>
                                setGetOneData({
                                  ...getOneData,
                                  Discount_Start_Date: newValue,
                                })
                              }
                              // value={"2024-09-30T18:30:00.000Z"}
                              // onChange={(newValue) =>{
                              //   console.log(newValue)
                              // }}
                              // onChange={(newValue) =>
                              //   setGetOneData({
                              //     ...getOneData,
                              //     Discount_Start_Date: newValue,
                              //   })

                              // open={open}
                              // onOpen={() => setOpen(true)}
                              // onClose={() => setOpen(false)}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  sx={{
                                    fontFamily:
                                      "Montserrat, sans-serif !important",
                                    "& .MuiButtonBase-root": {
                                      color: "orange",
                                    },
                                  }}
                                  fullWidth
                                  className="form-control"
                                />
                              )}
                              slotProps={{
                                inputAdornment: {
                                  position: "end",
                                },
                                // textField: {
                                //   onClick: () => setOpen(true),
                                // },
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
                            />
                          </LocalizationProvider>
                        </div>
                      </div>
                    </div>
                    {/* <div class="col-lg-3 col-md-3">
                      <div class="single-field">
                        <label class="text-13 fw-500">
                          Discount Start Time{" "}
                        </label>
                        <div className="form-control">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                              className="form-control"
                              placeholder="--/--"
                              // value={time.expoStartTime1}
                              // onChange={(newValue) =>
                              //   setFieldValue(
                              //     `times[${index}].expoStartTime1`,
                              //     newValue
                              //   )
                              // }

                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="--/--"
                                  sx={{
                                    fontFamily:
                                      "Montserrat, sans-serif !important",
                                    "& .MuiButtonBase-root": {
                                      color: "orange",
                                    },
                                  }}
                                  fullWidth
                                  className="form-control"
                                />
                              )}
                              slotProps={{
                                inputAdornment: {
                                  position: "end",
                                },
                                // textField: {
                                //   onClick: () => setOpen(true),
                                // },
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
                            />
                          </LocalizationProvider>
                        </div>
                      </div>
                    </div> */}
                    <div class="col-lg-3 col-md-3">
                      <div class="single-field">
                        <label class="text-13 fw-500">Discount End Date </label>
                        {/* <div class="form-control">
                          <input
                            type="date"
                            class="form-control"
                            placeholder="Day one"
                            name="dedate"
                          />
                        </div> */}
                        <div className="form-control">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                              className="form-control"
                              name="Date_Of_Birth"
                              format="DD/MM/YYYY"
                              inputFormat="DD/MM/YYYY"
                              disableFuture
                              value={
                                getOneData?.Discount_End_Date
                                  ? dayjs(getOneData.Discount_End_Date)
                                  : null
                              }
                              // value={getOneData?.Discount_End_Date}
                              onChange={(newValue) =>
                                setGetOneData({
                                  ...getOneData,
                                  Discount_End_Date: newValue,
                                })
                              }
                              // maxDate={dayjs().subtract(8, "year")}
                              // value={
                              //   values.Date_Of_Birth
                              //     ? dayjs(values.Date_Of_Birth)
                              //     : null
                              // }
                              // onChange={(newValue) => {
                              //   setFieldValue("Date_Of_Birth", newValue);
                              // }}
                              // open={open}
                              // onOpen={() => setOpen(true)}
                              // onClose={() => setOpen(false)}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  sx={{
                                    fontFamily:
                                      "Montserrat, sans-serif !important",
                                    "& .MuiButtonBase-root": {
                                      color: "orange",
                                    },
                                  }}
                                  fullWidth
                                  className="form-control"
                                />
                              )}
                              slotProps={{
                                inputAdornment: {
                                  position: "end",
                                },
                                // textField: {
                                //   onClick: () => setOpen(true),
                                // },
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
                            />
                          </LocalizationProvider>
                        </div>
                      </div>
                    </div>
                    {/* <div class="col-lg-3 col-md-3">
                      <div class="single-field">
                        <label class="text-13 fw-500">Discount End Time </label>
                        <div className="form-control">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                              className="form-control"
                              placeholder="--/--"
                              // value={time.expoStartTime1}
                              // onChange={(newValue) =>
                              //   setFieldValue(
                              //     `times[${index}].expoStartTime1`,
                              //     newValue
                              //   )
                              // }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="--/--"
                                  sx={{
                                    fontFamily:
                                      "Montserrat, sans-serif !important",
                                    "& .MuiButtonBase-root": {
                                      color: "orange",
                                    },
                                  }}
                                  fullWidth
                                  className="form-control"
                                />
                              )}
                              slotProps={{
                                inputAdornment: {
                                  position: "end",
                                },
                                // textField: {
                                //   onClick: () => setOpen(true),
                                // },
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
                            />
                          </LocalizationProvider>
                        </div>
                      </div>
                    </div> */}
                    <div class="col-lg-12 col-md-12">
                      <div class="y-gap-10">
                        <label class="text-13 fw-500">
                          Event Categories <sup class="asc">*</sup>
                        </label>
                        <div className="col-xl-3 col-md-6 w-full">
                          {/* <Select
                            isSearchable={false}
                            isMulti
                            styles={selectCustomStyle}
                            options={eventCategories}
                            // value={getOneData.Event_Category} // Should be an array
                            value={ eventCategories.find(
                              (option) =>
                                option.value ===
                                getOneData?.Event_Category
                            )
                      }
                            onChange={(selectedOptions) => {
                              setGetOneData((prevData) => {
                                return {
                                  ...prevData,
                                  Event_Category: selectedOptions,
                                };
                              });

                            }}
                          /> */}
                          <Select
                            isSearchable={false}
                            isMulti
                            styles={selectCustomStyle}
                            options={eventCategories}
                            value={eventCategories.filter((option) =>
                              getOneData?.Event_Category?.includes(option.value)
                            )} // Update value to match the selected options
                            onChange={(selectedOptions) => {
                              // Extract the values from the selected options
                              const selectedValues = selectedOptions.map(
                                (option) => option.value
                              );

                              setGetOneData((prevData) => {
                                return {
                                  ...prevData,
                                  Event_Category: selectedValues, // Set the selected values as an array
                                };
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-12 mt-10">
                      <button
                        onClick={() => {
                          handleSubmit();
                        }}
                        class="button bg-primary rounded-22 px-30 py-10 text-white text-12 -grey-1 w-100"
                      >
                        Save
                      </button>
                    </div>
                  </div>
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
                                      //
                                      hanldeEdit(cur?.EventDiscount_Id);
                                    }}
                                  ></i>
                                  <i
                                    className="far fa-trash-alt action-button"
                                    onClick={() => {
                                      //
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
                      class="button bg-primary rounded-22 px-30 py-10 text-white text-16 -grey-1 w-100 d-flex gap-10"
                    >
                      ADD
                      <i className="fas fa-plus text-16"></i>
                    </button>
                  </div>{" "}
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
