// React imports
import React, { useCallback, useEffect, useState } from "react";

// Third-party imports
import { Box, Modal, Stack } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import toast from "react-hot-toast";
import Select from "react-select";
import Swal from "sweetalert2";

// Project imports
import { RestfulApiService } from "../../../config/service";
import { decryptData } from "../../../utils/DataEncryption";
import { selectCustomStyle } from "../../../utils/ReactSelectStyles";
import EventTitle from "../EventTitle";

const dropDownAccountType = [
  {
    label: "Saving",
    value: "saving",
  },
  {
    label: "Current",
    value: "current",
  },
];

function BankDetails({ handleShowBankDetails }) {
  const { event_id } = useParams();
  const user = useSelector((state) => state.user.userProfile);

  // Validation Schema
  const validationSchema = Yup.object().shape({
    Bank_Name: Yup.string().required("Bank Name is required"),
    Account_Holder_Name: Yup.string().required(
      "Account Holder Name is required"
    ),
    Account_Number: Yup.string()
      .required("Account Number is required")
      .matches(/^\d+$/, "Account Number must be numeric"),
    Bank_IFSC_Code: Yup.string()
      .required("Bank IFSC Code is required")
      .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"),
    Account_Type: Yup.object().required("Account Type is required"),
    Branch_Name: Yup.string().required("Branch Name is required"),
  });

  const [showBankModal, setShowBankModal] = useState(false);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [bankDetails, setShowBankDetails] = useState([]);
  const [editData, setEditData] = useState({
    Bank_Id: "",
    Bank_Name: "",
    Account_Holder_Name: "",
    Account_Number: "",
    Bank_IFSC_Code: "",
    Account_Type: {
      label: "Saving",
      value: "saving",
    },
    Branch_Name: "",
  });

  const handleEdit = (values) => {
    setEditData({
      Bank_Id: values?.Bank_Id ?? "",
      Bank_Name: values?.Bank_Name ?? "",
      Account_Holder_Name: values?.Account_Holder_Name ?? "",
      Account_Number: values?.Account_Number ?? "",
      Bank_IFSC_Code: values?.IFSC_Code ?? "",
      Account_Type: values?.Account_Type
        ? dropDownAccountType.find(
            (option) => option.value === values.Account_Type
          )
        : {
            label: "Saving",
            value: "saving",
          },
      Branch_Name: values?.Branch_Name ?? "",
    });
  };
  const handleGetBankDetails = useCallback(async () => {
    const bankDetails = {
      Method_Name: "Get",
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
      Org_Id: user?.Org_Id,
      Event_Id: decryptData(event_id),
      Bank_Id: "", // this will empty for the get as well
    };

    try {
      const { data } = await RestfulApiService(
        bankDetails,
        "organizer/GetBank"
      );

      if (data?.Status !== 200) {
        toast.error(data?.Result?.Table1?.[0]?.Result_Description);
        return;
      }
      setShowBankDetails(data?.Result?.Table1);
    } catch (err) {
      toast.error("Something went wrong");
      console.log(err);
    } finally {
    }
  }, [
    event_id,
    user?.Org_Id,
    user?.Organizer_Id,
    user?.User_Display_Name,
    user?.User_Id,
  ]);
  const handleDelete = useCallback(
    async (Bank_Id) => {
      // Create the request data first
      const reqdata = {
        Method_Name: "Delete",
        Session_User_Id: user?.User_Id,
        Session_User_Name: user?.User_Display_Name,
        Session_Organzier_Id: user?.Organizer_Id,
        Org_Id: user?.Org_Id,
        Event_Id: decryptData(event_id),
        Bank_Id: Bank_Id ?? 0,
        IFSC_Code: "",
        Account_Number: "",
        Account_Type: "",
        Branch_Name: "",
        Bank_Name: "",
        Account_Holder_Name: "",
        Is_Active: 1,
      };

      try {
        // Check if the bank can be deleted before showing the confirmation
        const { data } = await RestfulApiService(reqdata, "organizer/SaveBank");
        // If the bank cannot be deleted, show a message and exit
        if (data?.Result?.Table1?.[0]?.Result_Id !== 1) {
          Swal.fire({
            title: "Error",
            text:
              data?.Result?.Table1?.[0]?.Result_Description ||
              "Cannot delete this bank; it is set in payout.",
            icon: "error",
          });
          return; // Exit the function to prevent further execution
        }
        // Trigger the SweetAlert confirmation only if the deletion is valid
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

            // Perform the actual deletion
            try {
              const deleteResponse = await RestfulApiService(
                reqdata,
                "organizer/SaveBank"
              );

              // Check the result of the deletion
              if (deleteResponse?.data?.Result?.Table1?.[0]?.Result_Id === 1) {
                return true; // Deletion was successful
              } else {
                // Show validation message if deletion fails
                Swal.showValidationMessage(
                  deleteResponse?.data?.Result?.Table1?.[0]
                    ?.Result_Description ||
                    "Cannot delete this bank; it is set in payout."
                );
                return false; // Indicate that the deletion was not successful
              }
            } catch (error) {
              // Handle the error by showing a validation message
              Swal.showValidationMessage("Request failed: " + error.message);
              return false; // Indicate that the deletion was not successful
            }
          },
        }).then((result) => {
          if (result.isConfirmed) {
            // If deletion is confirmed and successful
            Swal.fire({
              title: "Deleted!",
              text: "Bank details have been deleted.",
              icon: "success",
            });

            // Reload the list after successful deletion
            handleGetBankDetails();
          }
        });
      } catch (error) {
        // Handle the error if the initial check fails
        Swal.fire({
          title: "Error",
          text: "Request failed: " + error.message,
          icon: "error",
        });
      }
    },
    [
      event_id,
      handleGetBankDetails,
      user?.Org_Id,
      user?.Organizer_Id,
      user?.User_Display_Name,
      user?.User_Id,
    ]
  );

  useEffect(() => {
    handleGetBankDetails();
  }, [handleGetBankDetails]);

  return (
    <>
      {/* ========== for the bank ========= */}
      <Modal open={showBankModal}>
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
                Add Bank Details
              </div>
              <i
                onClick={() => {
                  setIsEditingBank(false);
                  setShowBankModal((prevState) => !prevState);
                  setEditData({
                    Bank_Id: "",
                    Bank_Name: "",
                    Account_Holder_Name: "",
                    Account_Number: "",
                    Bank_IFSC_Code: "",
                    Account_Type: {
                      label: "Saving",
                      value: "saving",
                    },
                    Branch_Name: "",
                  });
                }}
                class="fas fa-times text-16 text-primary cursor-pointer"
              ></i>
            </Stack>
            <Formik
              // initialValues={{
              //   Bank_Id: editData?.Bank_Id ?? "",
              //   Bank_Name: editData?.Bank_Name ?? "",
              //   Account_Holder_Name: editData?.Account_Holder_Name ?? "",
              //   Account_Number: editData?.Account_Number ?? "",
              //   Bank_IFSC_Code: editData?.IFSC_Code ?? "",
              //   Account_Type: editData?.Account_Type ?? "",
              //   Branch_Name: editData?.Bank_Name ?? "",
              // }}
              enableReinitialize
              initialValues={editData}
              validationSchema={validationSchema}
              onSubmit={async (values) => {
                const bankDetails = {
                  Method_Name: isEditingBank ? "Update" : "Create",
                  Session_User_Id: user?.User_Id,
                  Session_User_Name: user?.User_Display_Name,
                  Session_Organzier_Id: user?.Organizer_Id,
                  Org_Id: user?.Org_Id,
                  Event_Id: decryptData(event_id),
                  Bank_Id: values?.Bank_Id ?? "", // this will empty for the create
                  IFSC_Code: values?.Bank_IFSC_Code ?? "",
                  Account_Number: values?.Account_Number ?? "",
                  Account_Type: values?.Account_Type?.value ?? "",
                  Branch_Name: values?.Branch_Name ?? "",
                  Bank_Name: values?.Bank_Name ?? "",
                  Account_Holder_Name: values?.Account_Holder_Name ?? "",
                  Is_Active: 1,
                };
                try {
                  const { data } = await RestfulApiService(
                    bankDetails,
                    "organizer/SaveBank"
                  );
                  if (
                    data?.Status === 200 &&
                    data?.Result?.Table1?.[0]?.Result_Id === 1
                  ) {
                    toast.success(
                      data?.Result?.Table1?.[0]?.Result_Description ||
                        "Bank created successfully."
                    );
                    handleGetBankDetails();
                    setShowBankModal((previous) => !previous);
                  } else {
                    toast.error(
                      data?.Result?.Table1?.[0]?.Result_Description ||
                        "Something went wrong"
                    );
                  }
                } catch (err) {
                  toast.error("Something went wrong");
                  console.log(err);
                }
              }}
            >
              {({
                setFieldValue,
                setFieldTouched,
                validateField,
                errors,
                values,
                touched,
              }) => (
                <Form style={{ width: "100%" }}>
                  <div>
                    <div
                      id="_main_parent"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <div
                        id="_first-row"
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "16px",
                        }}
                      >
                        <div id="_first_child">
                          <div className="single-field w-full md:w-1/2 pr-2">
                            <label className="text-13 text-reading fw-500">
                              Bank Name
                            </label>
                            <div className="form-control">
                              <Field
                                type="text"
                                name="Bank_Name"
                                className="form-control"
                                placeholder="Bank Name"
                                onChange={(e) => {
                                  e.preventDefault();
                                  const { value } = e.target;

                                  const regex = /^[A-Za-z][A-Za-z ]*$/;

                                  if (
                                    !value ||
                                    (regex.test(value.toString()) &&
                                      value.length <= 100)
                                  ) {
                                    setFieldValue("Bank_Name", value);
                                  } else {
                                    return;
                                  }
                                }}
                              />
                            </div>
                            <ErrorMessage
                              name="Bank_Name"
                              component="div"
                              className="text-error-2 text-13 mt-5"
                            />
                          </div>
                        </div>

                        <div id="_second_child">
                          <div className="single-field w-full md:w-1/2 pr-2">
                            <label className="text-13 text-reading fw-500">
                              Account Holder Name
                            </label>
                            <div className="form-control">
                              <Field
                                type="text"
                                name="Account_Holder_Name"
                                className="form-control"
                                placeholder="Account Holder Name"
                                onChange={(e) => {
                                  e.preventDefault();
                                  const { value } = e.target;

                                  const regex = /^[^\s].*$/;

                                  if (
                                    !value ||
                                    (regex.test(value.toString()) &&
                                      value.length <= 50)
                                  ) {
                                    setFieldValue("Account_Holder_Name", value);
                                  } else {
                                    return;
                                  }
                                }}
                              />
                            </div>
                            <ErrorMessage
                              name="Account_Holder_Name"
                              component="div"
                              className="text-error-2 text-13 mt-5"
                            />
                          </div>
                        </div>
                      </div>

                      <div
                        id="_second-row"
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "16px",
                        }}
                      >
                        <div id="_first_child">
                          <div className="single-field w-full md:w-1/2 pr-2">
                            <label className="text-13 text-reading fw-500">
                              Account Number
                            </label>
                            <div className="form-control">
                              <Field
                                type="text"
                                name="Account_Number"
                                className="form-control"
                                placeholder="Account Number"
                                onChange={(e) => {
                                  const { value } = e.target;
                                  const regex = /^[a-zA-Z0-9]+$/;
                                  if (
                                    !value ||
                                    (regex.test(value) && value.length <= 15)
                                  ) {
                                    setFieldValue(
                                      "Account_Number",
                                      value.toUpperCase()
                                    );
                                  }
                                }}
                              />
                            </div>
                            <ErrorMessage
                              name="Account_Number"
                              component="div"
                              className="text-error-2 text-13 mt-5"
                            />
                          </div>
                        </div>

                        <div id="_second_child">
                          <div className="single-field w-full md:w-1/2 pr-2">
                            <label className="text-13 text-reading fw-500">
                              Bank IFSC Code
                            </label>
                            <div className="form-control">
                              <Field
                                type="text"
                                name="Bank_IFSC_Code"
                                className="form-control"
                                placeholder="Bank IFSC Code"
                                onChange={(e) => {
                                  e.preventDefault();
                                  const { value } = e.target;

                                  const regex = /^[A-Za-z0-9]+$/;

                                  if (
                                    !value ||
                                    (regex.test(value.toString()) &&
                                      value.length <= 12)
                                  ) {
                                    setFieldValue("Bank_IFSC_Code", value);
                                  } else {
                                    return;
                                  }
                                }}
                              />
                            </div>
                            <ErrorMessage
                              name="Bank_IFSC_Code"
                              component="div"
                              className="text-error-2 text-13 mt-5"
                            />
                          </div>
                        </div>
                      </div>

                      <div
                        id="_third-row"
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "16px",
                        }}
                      >
                        <div id="_first_child">
                          <div className="w-full md:w-1/2 pr-2">
                            <label className="text-13 text-reading fw-500">
                              Account Type
                            </label>
                            <div className="">
                              <Select
                                isSearchable={false}
                                styles={selectCustomStyle}
                                options={dropDownAccountType}
                                value={values.Account_Type}
                                onChange={(event) => {
                                  setFieldValue("Account_Type", event); // Set the value in Formik
                                }}
                              />
                            </div>
                            <ErrorMessage
                              name="Account_Type"
                              component="div"
                              className="text-error-2 text-13 mt-5"
                            />
                          </div>
                        </div>

                        <div id="_second_child">
                          <div className="single-field w-full md:w-1/2 pr-2">
                            <label className="text-13 text-reading fw-500">
                              Branch Name
                            </label>
                            <div className="form-control">
                              <Field
                                type="text"
                                name="Branch_Name"
                                className="form-control"
                                placeholder="Branch Name"
                                onChange={(e) => {
                                  e.preventDefault();
                                  const { value } = e.target;

                                  const regex = /^[^\s].*$/;

                                  if (
                                    !value ||
                                    (regex.test(value.toString()) &&
                                      value.length <= 50)
                                  ) {
                                    setFieldValue("Branch_Name", value);
                                  } else {
                                    return;
                                  }
                                }}
                              />
                            </div>
                            <ErrorMessage
                              name="Branch_Name"
                              component="div"
                              className="text-error-2 text-13 mt-5"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Stack
                    style={{ width: "100%" }}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    className="mt-20"
                  >
                    <div
                      className="col-auto relative"
                      style={{ margin: "auto" }}
                    >
                      <button
                        type="submit"
                        className="button bg-primary w-350 h-50 rounded-24 py-15 px-15 text-white border-light fw-400 text-12 d-flex gap-25 load-button"
                      >
                        {isEditingBank ? "Update Details" : "Add Details"}
                      </button>
                    </div>
                  </Stack>
                </Form>
              )}
            </Formik>
          </Stack>
        </Box>
      </Modal>
      <div className="dashboard__main">
        <div className="dashboard__content pt-20">
          <section className="layout-pb-md">
            <div className="container">
              <div className="row y-gap-30">
                <EventTitle />
                <div className="col-lg-6 pb-5">
                  <button
                    onClick={(e) => {
                      handleShowBankDetails(false);
                    }}
                    className="button rounded-full py-12 px-15 w-40 h-40 text-reading border-light -primary-1 fw-400 text-12 d-flex gap-25"
                  >
                    <i className="fas fa-chevron-left text-14"></i>
                  </button>
                </div>
                <div className="col-lg-6 text-right pb-5">
                  <button
                    onClick={() => {
                      if (user?.Organizer_Role_Id !== "MU05001") {
                        toast.dismiss();
                        toast.error(
                          "You do not have permission to edit these details. Please contact your organizer for assistance"
                        );
                        return;
                      }
                      setIsEditingBank(false);
                      setEditData({
                        Bank_Id: "",
                        Bank_Name: "",
                        Account_Holder_Name: "",
                        Account_Number: "",
                        Bank_IFSC_Code: "",
                        Account_Type: {
                          label: "Saving",
                          value: "saving",
                        },
                        Branch_Name: "",
                      });
                      setShowBankModal((previous) => !previous);
                    }}
                    className="w-150 button -primary-1 rounded-22 px-20 py-10 text-primary border-primary bg-white text-12 d-inline-block"
                  >
                    <span className="text-[16px] mr-[5px]">+</span> Add Bank
                  </button>
                </div>
                <div className="col-xl-12 col-lg-12">
                  <div className="overflow-scroll scroll-bar-1">
                    <table className="table-3 -border-bottom col-12 text-12 fw-500">
                      <thead className="bg-light-2">
                        <tr>
                          <th>Bank Name</th>
                          <th>Account Holder</th>
                          <th>Account Number</th>
                          <th>IFSC Code</th>
                          <th>Account Type</th>
                          <th>Branch Name</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bankDetails?.length > 0 ? (
                          bankDetails?.map((curBank, index) => {
                            return (
                              <tr key={index}>
                                <td className="">
                                  {curBank?.Bank_Name
                                    ? curBank?.Bank_Name
                                    : "No Bank"}
                                </td>
                                <td className="">
                                  {curBank?.Account_Holder_Name
                                    ? curBank?.Account_Holder_Name
                                    : "NA"}
                                </td>
                                <td className="">
                                  {curBank?.Account_Number
                                    ? curBank?.Account_Number
                                    : "NA"}
                                </td>
                                <td className="">
                                  {curBank?.IFSC_Code
                                    ? curBank?.IFSC_Code
                                    : "NA"}
                                </td>
                                <td className="">
                                  {curBank?.Account_Type
                                    ? curBank?.Account_Type
                                    : "NA"}
                                </td>
                                <td className="lh-14">
                                  {curBank?.Branch_Name
                                    ? curBank?.Branch_Name
                                    : "NA"}
                                </td>

                                <td className="" style={{ color: "#aeaeae" }}>
                                  <button
                                    className="px-10"
                                    onClick={() => {
                                      if (
                                        user?.Organizer_Role_Id !== "MU05001"
                                      ) {
                                        toast.dismiss();
                                        toast.error(
                                          "You do not have permission to edit these details. Please contact your organizer for assistance"
                                        );
                                        return;
                                      }
                                      setIsEditingBank(true);
                                      handleEdit(curBank);
                                      return setShowBankModal(
                                        (previous) => !previous
                                      );
                                    }}
                                  >
                                    <i className="fas fa-pen action-button"></i>
                                  </button>
                                  <button
                                    className="px-10"
                                    onClick={() => {
                                      if (
                                        user?.Organizer_Role_Id !== "MU05001"
                                      ) {
                                        toast.dismiss();
                                        toast.error(
                                          "You do not have permission to edit these details. Please contact your organizer for assistance"
                                        );
                                        return;
                                      }
                                      handleDelete(curBank?.Bank_Id);
                                    }}
                                  >
                                    <i className="far fa-trash-alt action-button"></i>
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td
                              colSpan={7}
                              style={{
                                fontFamily:
                                  '"Roboto", "Helvetica", "Arial", sans-serif',
                                fontWeight: 400,
                                fontSize: "0.875rem",
                                lineHeight: 1.43,
                                letterSpacing: "0.01071em",
                                display: "table-cell",
                                verticalAlign: "inherit",
                                borderBottom:
                                  "1px solid rgba(224, 224, 224, 1)",
                                textAlign: "center",
                                padding: "16px",
                                color: "rgba(0, 0, 0, 0.87)",
                              }}
                            >
                              {" "}
                              No Bank Found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default BankDetails;
