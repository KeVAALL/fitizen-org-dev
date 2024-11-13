import React, { useEffect, useState } from "react";

// Third-party component imports
import Select from "react-select";
import { useSelector } from "react-redux";
import { Form, Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Custom style imports
import { selectCustomStyle } from "../../../utils/ReactSelectStyles";

function BankDetails({ updateTab, nextIndex, prevIndex, UpdateProfile }) {
  const orgProfile = useSelector((state) => state.orgProfile.profile);
  const [formValues, setFormValues] = useState(null);
  const [addingBank, setAddingBank] = useState(false);
  const accountType = [
    {
      label: "Current",
      value: "C005001",
    },
    {
      label: "Saving",
      value: "C005002",
    },
  ];
  const validationSchema = Yup.object({
    BankAccount_Name: Yup.string().required("Required"),
    Bank_Name: Yup.string().required("Required"),
    BankAccount_No: Yup.string().required("Required"),
    BankAccountType_Id: Yup.object().required("Required"),
    BankIFSC_Code: Yup.string().required("Required"),
    BankBranch_Name: Yup.string().required("Required"),
  });

  useEffect(() => {
    setFormValues({
      ...orgProfile,
      BankAccountType_Id: orgProfile.BankAccountType_Id?.value
        ? accountType?.filter(
            (acc) => acc.value === orgProfile.BankAccountType_Id.value
          )[0]
        : accountType?.filter(
            (acc) => acc.value === orgProfile.BankAccountType_Id
          )[0],
    });
  }, [orgProfile]);

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={formValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log(values);
          //   updateTab(nextIndex);
          UpdateProfile(values, 2, nextIndex, setAddingBank);
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <div className="row y-gap-30 py-20">
              <div className="col-lg-4">
                <div className="single-field y-gap-10">
                  <label className="text-13 fw-500">
                    Name of Account Holder <sup className="asc">*</sup>
                  </label>
                  <div className="form-control">
                    <Field
                      type="text"
                      name="BankAccount_Name"
                      placeholder="Account Holder Name"
                      className="form-control"
                      onChange={(e) => {
                        e.preventDefault();
                        const { value } = e.target;

                        const regex = /^[A-Za-z][A-Za-z ]*$/;

                        if (
                          !value ||
                          (regex.test(value.toString()) && value.length <= 100)
                        ) {
                          setFieldValue("BankAccount_Name", value);
                        } else {
                          return;
                        }
                      }}
                    />
                  </div>
                  <ErrorMessage
                    name="BankAccount_Name"
                    component="div"
                    className="text-error-2 text-13"
                  />
                </div>
              </div>
              <div className="col-lg-4">
                <div className="single-field y-gap-10">
                  <label className="text-13 fw-500">
                    Bank Name <sup className="asc">*</sup>
                  </label>
                  <div className="form-control">
                    <Field
                      type="text"
                      name="Bank_Name"
                      placeholder="Bank Name"
                      className="form-control"
                      onChange={(e) => {
                        e.preventDefault();
                        const { value } = e.target;

                        const regex = /^[A-Za-z][A-Za-z ]*$/;

                        if (
                          !value ||
                          (regex.test(value.toString()) && value.length <= 100)
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
                    className="text-error-2 text-13"
                  />
                </div>
              </div>
              <div className="col-lg-4">
                <div className="single-field y-gap-10">
                  <label className="text-13 fw-500">
                    Account Number <sup className="asc">*</sup>
                  </label>
                  <div className="form-control">
                    <Field
                      type="text"
                      name="BankAccount_No"
                      placeholder="Account Number"
                      className="form-control"
                      onChange={(e) => {
                        const { value } = e.target;
                        const regex = /^[a-zA-Z0-9]+$/;
                        if (
                          !value ||
                          (regex.test(value) && value.length <= 15)
                        ) {
                          setFieldValue("BankAccount_No", value.toUpperCase());
                        }
                      }}
                    />
                  </div>
                  <ErrorMessage
                    name="BankAccount_No"
                    component="div"
                    className="text-error-2 text-13"
                  />
                </div>
              </div>
              <div className="col-lg-4">
                <div className="y-gap-5">
                  <label className="text-13 fw-500">
                    Account Type <sup className="asc">*</sup>
                  </label>

                  <Select
                    isSearchable={false}
                    styles={selectCustomStyle}
                    options={accountType}
                    value={values?.BankAccountType_Id}
                    onChange={(value) =>
                      setFieldValue("BankAccountType_Id", value)
                    }
                  />
                  <ErrorMessage
                    name="BankAccountType_Id"
                    component="div"
                    className="text-error-2 text-13"
                  />
                </div>
              </div>
              <div className="col-lg-4">
                <div className="single-field y-gap-10">
                  <label className="text-13 fw-500">
                    IFSC Code <sup className="asc">*</sup>
                  </label>
                  <div className="form-control">
                    <Field
                      type="text"
                      name="BankIFSC_Code"
                      placeholder="IFSC Code"
                      className="form-control"
                      onChange={(e) => {
                        e.preventDefault();
                        const { value } = e.target;

                        const regex = /^[A-Za-z0-9]+$/;

                        if (
                          !value ||
                          (regex.test(value.toString()) && value.length <= 12)
                        ) {
                          setFieldValue("BankIFSC_Code", value);
                        } else {
                          return;
                        }
                      }}
                    />
                  </div>
                  <ErrorMessage
                    name="BankIFSC_Code"
                    component="div"
                    className="text-error-2 text-13"
                  />
                </div>
              </div>
              <div className="col-lg-4">
                <div className="single-field y-gap-10">
                  <label className="text-13 fw-500">
                    Branch Name <sup className="asc">*</sup>
                  </label>
                  <div className="form-control">
                    <Field
                      type="text"
                      name="BankBranch_Name"
                      placeholder="Branch Name"
                      className="form-control"
                    />
                  </div>
                  <ErrorMessage
                    name="BankBranch_Name"
                    component="div"
                    className="text-error-2 text-13"
                  />
                </div>
              </div>
            </div>

            {/* <div className="row justify-between">
            <div className="col-lg-4">
              <div className="single-field py-10 upload">
                <label className="text-13 fw-500">
                  Upload Cancelled Cheque Image
                </label>
                <div className="form-control mt-10">
                  <button className="upload__btn">Upload Image</button>
                  <input
                    type="file"
                    name="idproof"
                    className="form-control upload__input"
                    onChange={(event) => {
                      setFieldValue("Logo_Path", event.currentTarget.files[0]);
                    }}
                  />
                </div>
              </div>
            </div>
          </div> */}

            <div className="col-lg-12 d-flex pt-20 justify-end">
              <div className="col-auto relative">
                <button
                  type="button"
                  className="button w-150 h-40 text-12 px-15 border-primary text-primary rounded-22 -primary-1 mr-10"
                  onClick={() => updateTab(prevIndex)}
                >
                  Previous
                </button>
              </div>
              <div className="col-auto relative">
                <button
                  disabled={addingBank}
                  type="submit"
                  className="button bg-primary w-150 h-40 rounded-24 px-15 text-white border-light load-button"
                >
                  {!addingBank ? `Next` : <span className="btn-spinner"></span>}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default BankDetails;
