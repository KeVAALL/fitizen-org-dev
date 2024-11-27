import React, { useEffect, useState } from "react";

// Asset imports
import UploadIcon from "../../../assets/img/icons/upload.png";

// Form and validation imports
import { Form, Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Third-party imports
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import toast from "react-hot-toast";

// Utility imports
import Loader from "../../../utils/BackdropLoader";
import { setOrgProfile } from "../../../redux/slices/profileSlice";
import { RestfulApiService } from "../../../config/service";
import { MEDIA_URL } from "../../../config/url";
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from "@mui/material";
import { StyledTableCell } from "../../../utils/ReactTable";
import Modal from "@mui/material/Modal";
import { selectCustomStyle } from "../../../utils/ReactSelectStyles";
import Swal from "sweetalert2";

function Personal({
  updateTab,
  activeTab,
  nextIndex,
  generateXML,
  UpdateProfile,
}) {
  const [fetchingProfile, setFetchingProfile] = useState(false);
  const [addingPersonal, setAddingPersonal] = useState(false);
  const [organizerUserModal, setOrganizerUserModal] = useState(false);
  const [allUserDetails, setAllUserDetails] = useState([]);
  const [addingUserDetails, setAddingUserDetails] = useState(false);
  const [editingUserDetails, setEditingUserDetails] = useState(false);
  const [eventDropdown, setEventDropdown] = useState([]);
  const userRoleDropdown = [
    {
      label: "Organizer Admin",
      value: "MU05001",
    },
    {
      label: "Organizer User",
      value: "MU05002",
    },
  ];
  const userDetailsValues = {
    User_Display_Name: "",
    mobile_number: "",
    email_id: "",
    Organizer_Role_Id: null,
    Event_List: [],
  };
  function generateUserDetailsXML(data) {
    let xml = "<D>";

    xml +=
      "<R><FN>User_Display_Name</FN><FV>" +
      data?.User_Display_Name +
      "</FV><FT>Text</FT></R>";
    xml +=
      "<R><FN>mobile_number</FN><FV>" +
      data?.mobile_number +
      "</FV><FT>Text</FT></R>";
    xml +=
      "<R><FN>email_id</FN><FV>" + data?.email_id + "</FV><FT>Text</FT></R>";
    xml +=
      "<R><FN>Organizer_Role_Id</FN><FV>" +
      data?.Organizer_Role_Id.value +
      "</FV><FT>Text</FT></R>";

    // Add additional static fields
    xml += "<R><FN>Is_Active</FN><FV>1</FV><FT>Text</FT></R>";
    xml += "<R><FN>Is_Deleted</FN><FV>0</FV><FT>Text</FT></R>";

    xml += "</D>";
    return xml;
  }
  const [userDetailsInitialValues, setUserDetailsInitialValues] =
    useState(userDetailsValues);
  const user = useSelector((state) => state.user.userProfile);
  const orgProfile = useSelector((state) => state.orgProfile.profile);
  const dispatch = useDispatch();

  const orgUserValidation = Yup.object({
    User_Display_Name: Yup.string().required("User name is required"),
    mobile_number: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Mobile number is not valid")
      .test(
        "uniquePhoneNumber",
        "Mobile number must be different from the Organizer number",
        (value) => {
          return value !== user?.Mobile_Number;
        }
      )
      .required("Mobile number is required"),
    email_id: Yup.string()
      .email("Invalid email address")
      .required("User email is required"),
    Organizer_Role_Id: Yup.object().required("Please select Organizer role"),
    Event_List: Yup.array(),
  });
  const validationSchema = Yup.object({
    Organizer_Name: Yup.string().required("Organizer Name is required"),
    Mobile_Number: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Phone number is not valid")
      //   .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Contact Number is required"),
    Email_Id: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    Logo_Path: Yup.string().required("Profile image is required"),
    PAN_No: Yup.string()
      .matches(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/, "Invalid PAN format")
      .required("Pan Number is required"),
    Has_GST_No: Yup.string().required("Please select"),
    GST_No: Yup.string().when("Has_GST_No", {
      is: (value) => value === "yes", // When Has_GST_No is '1' (i.e., "yes")
      then: (schema) =>
        schema
          .matches(
            /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/,
            "Invalid GST"
          )
          .required("GST Number is required"),
      otherwise: (schema) => schema.nullable(), // Make it nullable when Has_GST_No is not '1'
    }),
  });

  const handleDelete = (userDetails) => {
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
        const reqdata = {
          Method_Name: "Delete",
          Session_User_Id: user?.User_Id,
          Session_User_Name: user?.User_Display_Name,
          Session_Organzier_Id: user?.Organizer_Id,
          Org_Id: user?.Org_Id,
          User_Id: userDetails.User_Id,
          XMLData: "",
        };

        try {
          // Make the API call
          const result = await RestfulApiService(
            reqdata,
            "organizer/SaveOrganizerUser"
          );

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
          text: "User has been deleted.",
          icon: "success",
        });
        LoadUserDetails();
      }
    });
  };
  async function LoadProfile() {
    const reqdata = {
      Method_Name: "Get_One",
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
      Org_Id: user?.Org_Id,
      Organizer_Name: "",
    };
    try {
      setFetchingProfile(true);
      const result = await RestfulApiService(
        reqdata,
        "organizer/getorganierdetails"
      );
      if (result) {
        console.log(result);
        const formResult = result?.data?.Result?.Table1[0];
        const apiResponse = {
          orgProfile: {
            ...formResult,
            Has_GST_No: formResult.Has_GST_No === -1 ? "no" : "yes",
          },
        };
        dispatch(setOrgProfile(apiResponse));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setFetchingProfile(false);
    }
  }
  async function LoadUserDetails() {
    const reqdata = {
      Method_Name: "Get",
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
      Organizer_User_Id: user?.Organizer_Role_Id,
    };
    try {
      const result = await RestfulApiService(
        reqdata,
        "organizer/GetOrganizerUser"
      );
      if (result) {
        console.log(result);
        const formResult = result?.data?.Result?.Table1;
        setAllUserDetails(formResult);
      }
    } catch (err) {
      console.log(err);
    } finally {
    }
  }
  async function LoadEventDropdown() {
    const reqdata = {
      Method_Name: "Event",
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
      Organizer_User_Id: user?.Organizer_Role_Id,
    };
    try {
      const result = await RestfulApiService(
        reqdata,
        "organizer/GetOrganizerUser"
      );
      if (result) {
        console.log(result);
        const formResult = result?.data?.Result?.Table1;
        setEventDropdown(formResult);
      }
    } catch (err) {
      console.log(err);
    } finally {
    }
  }

  useEffect(() => {
    LoadProfile();
    LoadUserDetails();
    LoadEventDropdown();
  }, []);

  return (
    <>
      {fetchingProfile ? (
        <Loader fetching={fetchingProfile} />
      ) : (
        <div className="row y-gap-40 pt-20 px-15">
          <div
            className={`tabs__pane${
              activeTab === 1 ? " is-tab-el-active -tab-item-1" : ""
            } px-40 rounded-8 border-light pb-20`}
          >
            <Formik
              initialValues={orgProfile}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                console.log(values);
                // updateTab(nextIndex);
                console.log(generateXML(values));
                UpdateProfile(values, 1, nextIndex, setAddingPersonal);
              }}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <div className="row y-gap-30 pt-20">
                    <div className="col-lg-8">
                      <div className="row justify-between pt-20">
                        <div className="col-lg-6">
                          <div className="single-field py-10 y-gap-10">
                            <label className="text-13 fw-500">
                              Organizer Name <sup className="asc">*</sup>
                            </label>
                            <div className="form-control">
                              <Field
                                type="text"
                                name="Organizer_Name"
                                className="form-control"
                                placeholder="Full name"
                                onChange={(e) => {
                                  e.preventDefault();
                                  const { value } = e.target;

                                  const regex = /^[^\s].*$/;

                                  if (
                                    !value ||
                                    (regex.test(value.toString()) &&
                                      value.length <= 100)
                                  ) {
                                    setFieldValue("Organizer_Name", value);
                                  } else {
                                    return;
                                  }
                                }}
                              />
                            </div>
                            <ErrorMessage
                              name="Organizer_Name"
                              component="div"
                              className="text-error-2 text-13"
                            />
                          </div>
                        </div>
                        {/* <div className="col-lg-6">
                      <div className="single-field py-10 y-gap-10">
                        <label className="text-13 fw-500">
                          Name of Organization <sup className="asc">*</sup>
                        </label>
                        <div className="form-control">
                          <Field
                            type="text"
                            name="organization"
                            className="form-control"
                            placeholder="Full name"
                          />
                        </div>
                        <ErrorMessage
                          name="organization"
                          component="div"
                          className="text-error-2 text-13"
                        />
                      </div>
                    </div> */}
                        <div className="col-lg-6">
                          <div className="single-field py-10 y-gap-10">
                            <label className="text-13 fw-500">
                              Contact Number <sup className="asc">*</sup>
                            </label>
                            <div className="form-control">
                              <Field
                                type="tel"
                                name="Mobile_Number"
                                className="form-control"
                                placeholder="000 000 0000"
                                maxLength="10"
                                onChange={(e) => {
                                  const { value } = e.target;
                                  const regex = /^[0-9\b]+$/; // Only numbers allowed

                                  if (!value || regex.test(value)) {
                                    setFieldValue("Mobile_Number", value);
                                  }
                                }}
                              />
                            </div>
                            <ErrorMessage
                              name="Mobile_Number"
                              component="div"
                              className="text-error-2 text-13"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="single-field py-10 y-gap-10">
                            <label className="text-13 fw-500">
                              Email Id <sup className="asc">*</sup>
                            </label>
                            <div className="form-control">
                              <Field
                                type="email"
                                name="Email_Id"
                                className="form-control"
                                placeholder="info@yourgmail.com"
                                onChange={(e) => {
                                  e.preventDefault();
                                  const { value } = e.target;

                                  const regex = /[^-\s]/;

                                  if (!value || regex.test(value.toString())) {
                                    setFieldValue("Email_Id", value);
                                  } else {
                                    return;
                                  }
                                }}
                              />
                            </div>
                            <ErrorMessage
                              name="Email_Id"
                              component="div"
                              className="text-error-2 text-13"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="single-field py-10 y-gap-10">
                            <label className="text-13 fw-500">
                              Pan Number <sup className="asc">*</sup>
                            </label>
                            <div className="form-control">
                              <Field
                                type="text"
                                name="PAN_No"
                                className="form-control"
                                placeholder="Pan Number"
                                onChange={(e) => {
                                  e.preventDefault();
                                  const { value } = e.target;

                                  const regex = /^[A-Za-z0-9]+$/;

                                  if (
                                    !value ||
                                    (regex.test(value.toString()) &&
                                      value.length <= 10)
                                  ) {
                                    setFieldValue(
                                      "PAN_No",
                                      value.toUpperCase()
                                    );
                                  } else {
                                    return;
                                  }
                                }}
                              />
                            </div>
                            <ErrorMessage
                              name="PAN_No"
                              component="div"
                              className="text-error-2 text-13"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="row justify-center pt-50 text-center">
                        {/* <div className="d-flex w-150 overflow-hidden profile-img"> */}
                        <div className="d-flex w-150 h-140 rounded-full border-primary overflow-hidden profile-img pl-0 pr-0">
                          <img
                            src={
                              values?.Logo_Path
                                ? `${MEDIA_URL}${values?.Logo_Path}`
                                : UploadIcon
                            }
                            alt="image-upload"
                            className="w-full"
                          />
                          <input
                            type="file"
                            name="Logo_Path"
                            className="upload-pf"
                            // onChange={(event) => {
                            //   setFieldValue(
                            //     "Logo_Path",
                            //     event.currentTarget.files[0]
                            //   );
                            //                           }}
                            onChange={async (event) => {
                              const file = event.currentTarget.files[0];

                              if (file && !file.type.startsWith("image/")) {
                                toast.error("Please upload an image.");
                                event.target.value = ""; // Reset the input value
                                return;
                              }
                              // Check if the file size is above 2MB (2 * 1024 * 1024 bytes)
                              const maxSize = 2 * 1024 * 1024;
                              if (file && file.size > maxSize) {
                                toast.error("File size should not exceed 2MB.");
                                event.target.value = ""; // Reset the input value
                                return;
                              }

                              const reqdata = new FormData();
                              reqdata.append(
                                "ModuleName",
                                "OrganizationProfile"
                              );
                              reqdata.append("File", file);

                              // Start uploading

                              try {
                                await toast.promise(
                                  RestfulApiService(
                                    reqdata,
                                    "master/uploadfile"
                                  ),
                                  {
                                    loading: "Uploading...",
                                    success: (result) => {
                                      if (result) {
                                        console.log(
                                          result?.data?.Result,
                                          result?.data?.Description
                                        );

                                        // setFieldTouched("Image_Name", true);
                                        setFieldValue(
                                          "Logo_Path",
                                          result?.data?.Description
                                        );
                                        // setFieldTouched("ImagePath", true);
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
                                console.error("Upload failed:", error);
                              } finally {
                                // End uploading
                                event.target.value = "";
                              }
                            }}
                          />
                        </div>
                        {/* {!values?.Logo_Path && ( */}
                        <div className="w-full text-center">
                          <i
                            class="text-light-1 text-10 fas fa-upload"
                            style={{ display: "inline" }}
                          ></i>
                          <p
                            className="text-light-1 text-10 text-center"
                            style={{ display: "inline", marginLeft: "5px" }}
                          >
                            Upload Square Logo at least 200px by 200px
                          </p>
                        </div>
                        {/* )} */}
                        {values?.Logo_Path && (
                          <p className="text-light-1 text-10 text-center">
                            {values?.Logo_Path?.split("/")[3]}
                          </p>
                        )}
                        <ErrorMessage
                          name="Logo_Path"
                          component="div"
                          className="text-error-2 text-13 "
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row pt-10">
                    <div
                      className={`${
                        values?.Has_GST_No === "yes" ? "col-lg-4 " : "col-lg-8 "
                      }d-flex justify-start`}
                    >
                      <div className="single-field py-10 y-gap-10">
                        <label className="text-13 fw-500">GST Applicable</label>
                        <div className="d-flex gap-15 mt-10">
                          <div className="form-radio d-flex items-center">
                            <Field type="radio" name="Has_GST_No" value="yes" />
                            <div className="text-14 lh-1 ml-10">Yes</div>
                          </div>
                          <div className="form-radio d-flex items-center">
                            <Field
                              type="radio"
                              name="Has_GST_No"
                              value="no"
                              onChange={(e) => {
                                setFieldValue("Has_GST_No", e.target.value);
                                setFieldValue("GST_No", "");
                              }}
                            />
                            <div className="text-14 lh-1 ml-10">No</div>
                          </div>
                        </div>
                        <ErrorMessage
                          name="Has_GST_No"
                          component="div"
                          className="text-error-2 text-13 mt-10"
                        />
                      </div>
                    </div>

                    {values?.Has_GST_No === "yes" && (
                      <div className="col-lg-4">
                        <div className="single-field py-10 y-gap-10">
                          <label className="text-13 fw-500">
                            Add GST Number <sup className="asc">*</sup>
                          </label>
                          <div className="form-control">
                            <Field
                              autoComplete="off"
                              type="text"
                              name="GST_No"
                              className="form-control"
                              placeholder="GST Number"
                              onChange={(e) => {
                                e.preventDefault();
                                const { value } = e.target;

                                const regex = /^[A-Za-z0-9]+$/;

                                if (
                                  !value ||
                                  (regex.test(value.toString()) &&
                                    value.length <= 15)
                                ) {
                                  setFieldValue("GST_No", value);
                                } else {
                                  return;
                                }
                              }}
                            />
                          </div>
                          <ErrorMessage
                            name="GST_No"
                            component="div"
                            className="text-error-2 text-13"
                          />
                        </div>
                      </div>
                    )}

                    <div className="col-12 d-flex justify-end">
                      <div className="row">
                        <div className="col-auto relative">
                          <button
                            disabled={addingPersonal}
                            type="submit"
                            className="button bg-primary w-150 h-40 rounded-24 px-15 text-white border-light load-button"
                          >
                            {!addingPersonal ? (
                              `Next`
                            ) : (
                              <span className="btn-spinner"></span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
          <Modal open={organizerUserModal}>
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
              <Stack direction="column" alignItems="center" spacing={1}>
                <Stack
                  style={{ width: "100%" }}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <div className="text-16 lh-16 fw-600 text-primary">
                    User Details
                  </div>
                  <i
                    onClick={() => {
                      setOrganizerUserModal(false);
                      setUserDetailsInitialValues({
                        User_Display_Name: "",
                        mobile_number: "",
                        email_id: "",
                        Organizer_Role_Id: null,
                      });
                      setEditingUserDetails(false);
                    }}
                    class="fas fa-times text-16 text-primary cursor-pointer"
                  ></i>
                </Stack>

                <Formik
                  initialValues={userDetailsInitialValues}
                  validationSchema={orgUserValidation}
                  onSubmit={async (values) => {
                    console.log(values);
                    console.log(
                      values.Event_List?.map((event) => {
                        return event.value;
                      }).join(",")
                    );
                    console.log(generateUserDetailsXML(values));
                    const reqdata = {
                      Method_Name: editingUserDetails ? "Update" : "Create",
                      Session_User_Id: user?.User_Id,
                      Session_User_Name: user?.User_Display_Name,
                      Session_Organzier_Id: user?.Organizer_Id,
                      Org_Id: user?.Org_Id,
                      User_Id: editingUserDetails ? values.User_Id : "",
                      XMLData: generateUserDetailsXML(values),
                      Eevent_List: values.Event_List?.map((event) => {
                        return event.value;
                      }).join(","),
                    };
                    try {
                      setAddingUserDetails(true);

                      const result = await RestfulApiService(
                        reqdata,
                        "organizer/SaveOrganizerUser"
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
                        setOrganizerUserModal(false);
                        setUserDetailsInitialValues({
                          User_Display_Name: "",
                          mobile_number: "",
                          email_id: "",
                          Organizer_Role_Id: null,
                        });
                        setEditingUserDetails(false);
                        LoadUserDetails();
                      }
                    } catch (err) {
                      console.log(err);
                    } finally {
                      setAddingUserDetails(false);
                    }
                  }}
                >
                  {({ setFieldValue, values }) => (
                    <Form
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <div className="single-field py-10 y-gap-10">
                        <label className="text-13 fw-500">
                          User Name <sup className="asc">*</sup>
                        </label>
                        <div className="form-control">
                          <Field
                            type="text"
                            name="User_Display_Name"
                            className="form-control"
                            placeholder="User name"
                            onChange={(e) => {
                              e.preventDefault();
                              const { value } = e.target;

                              // const regex = /^[^\s].*$/;
                              const regex = /^[A-Za-z][A-Za-z\s]*$/;

                              if (
                                !value ||
                                (regex.test(value.toString()) &&
                                  value.length <= 100)
                              ) {
                                setFieldValue("User_Display_Name", value);
                              } else {
                                return;
                              }
                            }}
                          />
                        </div>
                        <ErrorMessage
                          name="User_Display_Name"
                          component="div"
                          className="text-error-2 text-13"
                        />
                      </div>

                      <div className="y-gap-10">
                        <label className="text-13 fw-500">
                          User Role <sup className="asc">*</sup>
                        </label>
                        <div className="p-0">
                          <Select
                            placeholder="Select User Role"
                            styles={selectCustomStyle}
                            onChange={(e) => {
                              setFieldValue("Organizer_Role_Id", e);
                            }}
                            isSearchable={false}
                            options={userRoleDropdown}
                            value={values.Organizer_Role_Id}
                          />
                        </div>
                        <ErrorMessage
                          name="Organizer_Role_Id"
                          component="div"
                          className="text-error-2 text-13 mt-5"
                        />
                      </div>

                      <div className="py-10 y-gap-10">
                        <label className="text-13 fw-500">Events List</label>
                        <CreatableSelect
                          isMulti
                          styles={{
                            ...selectCustomStyle,
                            multiValue: (base) => ({
                              ...base,
                              borderRadius: "4px",
                              backgroundColor: "#fff9e1",
                              color: "#000",
                            }),
                            multiValueLabel: (base) => ({
                              ...base,
                              fontSize: "75%",
                            }),
                          }}
                          options={eventDropdown}
                          value={values.Event_List}
                          onChange={(value) => {
                            console.log(value);
                            setFieldValue("Event_List", value);
                          }}
                        />
                        <ErrorMessage
                          name="Event_List"
                          component="div"
                          className="text-error-2 text-13"
                        />
                      </div>

                      <div className="single-field y-gap-10">
                        <label className="text-13 fw-500">
                          Mobile No <sup className="asc">*</sup>
                        </label>
                        <div className="form-control">
                          <Field
                            type="tel"
                            name="mobile_number"
                            className="form-control"
                            placeholder="000 000 0000"
                            maxLength="10"
                            onChange={(e) => {
                              const { value } = e.target;
                              const regex = /^[0-9\b]+$/; // Only numbers allowed

                              if (!value || regex.test(value)) {
                                setFieldValue("mobile_number", value);
                              }
                            }}
                          />
                        </div>
                        <ErrorMessage
                          name="mobile_number"
                          component="div"
                          className="text-error-2 text-13"
                        />
                      </div>

                      <div className="single-field py-10 y-gap-10">
                        <label className="text-13 fw-500">
                          User Email <sup className="asc">*</sup>
                        </label>
                        <div className="form-control">
                          <Field
                            type="email"
                            name="email_id"
                            className="form-control"
                            placeholder="info@yourgmail.com"
                            onChange={(e) => {
                              e.preventDefault();
                              const { value } = e.target;

                              const regex = /^\S+$/;

                              if (!value || regex.test(value.toString())) {
                                setFieldValue("email_id", value);
                              } else {
                                return;
                              }
                            }}
                          />
                        </div>
                        <ErrorMessage
                          name="email_id"
                          component="div"
                          className="text-error-2 text-13"
                        />
                      </div>

                      <Stack
                        style={{ width: "100%" }}
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                        className="mt-20"
                      >
                        <div className="col-auto relative">
                          <button
                            disabled={addingUserDetails}
                            type="submit"
                            className="button bg-primary w-150 h-40 rounded-24 px-15 text-white border-light load-button"
                          >
                            {!addingUserDetails ? (
                              `Save`
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
          <div className="d-flex flex-column gap-20 mt-20 px-20 rounded-8 border-light">
            <label className="text-16 fw-600" style={{ color: "#505050" }}>
              Organizer Users
            </label>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>User Name</StyledTableCell>
                  <StyledTableCell>Mobile No</StyledTableCell>
                  <StyledTableCell>Email ID</StyledTableCell>
                  <StyledTableCell>User Role</StyledTableCell>
                  <StyledTableCell>Active Status</StyledTableCell>
                  <StyledTableCell>Event List</StyledTableCell>
                  <StyledTableCell>
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setOrganizerUserModal(true);
                        }}
                        className="button w-100 fw-400 rounded-8 px-15 py-10 text-white text-14 bg-primary d-flex justify-center gap-10"
                      >
                        <i className="fas fa-plus text-12" /> Add
                      </button>
                    </div>
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody className="table_body_main">
                {allUserDetails?.length > 0 ? (
                  allUserDetails?.map((user) => {
                    return (
                      <TableRow>
                        <StyledTableCell>
                          {user?.User_Display_Name}
                        </StyledTableCell>
                        <StyledTableCell>{user?.Mobile_Number}</StyledTableCell>
                        <StyledTableCell>{user?.Email_Id}</StyledTableCell>
                        <StyledTableCell>
                          {
                            userRoleDropdown.filter(
                              (u) => u.value === user?.Organizer_Role_Id
                            )[0].label
                          }
                        </StyledTableCell>
                        <StyledTableCell>
                          {user?.Is_Active ? "Active" : "In-active"}
                        </StyledTableCell>
                        <StyledTableCell>
                          <div className="d-flex flex-column gap-5">
                            {user.Event_Names?.split(",").map((name) => {
                              return (
                                <div
                                  style={{
                                    minWidth: 0,
                                    backgroundColor: "#fff9e1",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    borderRadius: "2px",
                                    color: "hsl(0, 0%, 20%)",
                                    fontSize: "80%",
                                    padding: "3px",
                                    paddingLeft: "6px",
                                    boxSizing: "border-box",
                                  }}
                                >
                                  {name}
                                </div>
                              );
                            })}
                          </div>
                        </StyledTableCell>
                        <StyledTableCell>
                          <div
                            className="text-14 text-reading lh-16 fw-500"
                            style={{
                              display: "flex",
                              gap: "24px",
                              justifyContent: "flex-end",
                              cursor: "pointer",
                            }}
                          >
                            <i
                              className="fas fa-pencil-alt"
                              onClick={() => {
                                setEditingUserDetails(true);
                                console.log(user);
                                setUserDetailsInitialValues({
                                  ...user,
                                  mobile_number: user.Mobile_Number,
                                  email_id: user.Email_Id,
                                  Organizer_Role_Id: userRoleDropdown.filter(
                                    (u) => u.value === user?.Organizer_Role_Id
                                  )[0],
                                  Event_List: eventDropdown.filter((event) =>
                                    user?.Event_Id?.split(",").includes(
                                      event.value
                                    )
                                  ),
                                });
                                setOrganizerUserModal(true);
                              }}
                            ></i>
                            <i
                              className="far fa-trash-alt action-button"
                              onClick={(e) => {
                                e.preventDefault();
                                handleDelete(user);
                                //
                              }}
                            ></i>{" "}
                          </div>
                        </StyledTableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <></>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </>
  );
}

export default Personal;
