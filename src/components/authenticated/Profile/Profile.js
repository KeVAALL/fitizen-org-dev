import React, { useState } from "react";

// Third-party imports
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

// Project component imports
import Personal from "./Personal";
import BankDetails from "./BankDetails";
import Social from "./Social";

// Utility imports
import { setOrgProfile } from "../../../redux/slices/profileSlice";
import { RestfulApiService } from "../../../config/service";

function Profile() {
  const [activeTab, setActiveTab] = useState(1);
  const user = useSelector((state) => state.user.userProfile);
  const orgProfile = useSelector((state) => state.orgProfile.profile);
  const dispatch = useDispatch();

  const updateTab = (tabNumber) => {
    setActiveTab(tabNumber);
  };
  function generateXML(data) {
    let XMLData = "";

    // Define the fields to include in the XML and their corresponding values from the data object
    const fields = [
      { field: "Organizer_Name", value: data.Organizer_Name },
      { field: "Has_GST_No", value: data.Has_GST_No === "no" ? "-1" : "1" },
      { field: "Mobile_Number", value: data.Mobile_Number },
      { field: "Email_Id", value: data.Email_Id },
      { field: "PAN_No", value: data.PAN_No },
      { field: "GST_No", value: data.GST_No },
      { field: "BankAccount_Name", value: data.BankAccount_Name },
      { field: "BankAccount_No", value: data.BankAccount_No },
      {
        field: "BankAccountType_Id",
        value: data.BankAccountType_Id?.value
          ? data.BankAccountType_Id?.value
          : data.BankAccountType_Id,
      },
      { field: "BankIFSC_Code", value: data.BankIFSC_Code },
      { field: "Bank_Name", value: data.Bank_Name },
      { field: "BankBranch_Name", value: data.BankBranch_Name },
      { field: "Org_Website", value: data.Org_Website },
      { field: "Org_Facebook", value: data.Org_Facebook },
      { field: "Org_Instagram", value: data.Org_Instagram },
      { field: "Org_LinkedIn", value: data.Org_LinkedIn },
      { field: "Org_Youtube", value: data.Org_Youtube },
      { field: "Logo_Path", value: data.Logo_Path },
      { field: "Is_Active", value: data.Is_Active },
      { field: "Is_Deleted", value: "0" }, // Set Is_Deleted to 0 as per your requirement
    ];

    // Loop through each field and add it to the XML structure
    fields.forEach(({ field, value }) => {
      XMLData += `<R><FN>${field}</FN><FV>${value}</FV><FT>Text</FT></R>`;
    });

    // Wrap XML data in the root element
    XMLData = `<D>${XMLData}</D>`;

    return XMLData;
  }
  async function UpdateProfile(values, currindex, nextIndex, setAdding) {
    console.log(values);

    const reqdata = {
      Method_Name: "Update",
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
      Org_Id: user?.Org_Id,
      Organizer_Name: "",
      XMLData: generateXML(values),
    };
    try {
      setAdding(true);

      const result = await RestfulApiService(
        reqdata,
        "organizer/updateorganizer"
      );
      if (result?.data?.Result?.Table1[0]?.Result_Id === -1) {
        toast.error(result?.data?.Result?.Table1[0]?.Result_Description);
        return;
      }
      if (result) {
        toast.dismiss();
        toast.success(result?.data?.Result?.Table1[0]?.Result_Description);
        const apiResponse = {
          orgProfile: {
            ...orgProfile,
            ...values,
          },
        };
        dispatch(setOrgProfile(apiResponse));
        if (currindex === 3) {
          return;
        }
        updateTab(nextIndex);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setAdding(false);
    }
  }
  // ${typeof value === "number" ? "Number" : "Text"}

  return (
    <div className="dashboard__main">
      <div className="dashboard__content pt-20">
        <section className="layout-pb-md">
          <div className="container">
            <div className="tabs -pills-2 js-tabs">
              <div className="row x-gap-40 y-gap-30 items-center tabs__controls js-tabs-controls">
                <div className="col-auto">
                  <div className="d-flex items-center">
                    <div
                      className={`size-40 rounded-full flex-center ${
                        activeTab === 1 ||
                        activeTab - 1 === 1 ||
                        activeTab - 2 === 1
                          ? "bg-primary"
                          : "bg-blue-1-05"
                      } tabs__button js-tabs-button is-tab-el-active`}
                      data-tab-target=".-tab-item-1"
                    >
                      <i className="fas fa-check text-16 text-white"></i>
                    </div>
                    <div>
                      <p className="text-14 fw-500 ml-10">Step 1</p>
                      <p className="text-12 fw-400 ml-10">
                        Personal Information
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col">
                  <div className="w-full h-1 bg-border"></div>
                </div>

                <div className="col-auto">
                  <div className="d-flex items-center">
                    <div
                      className={`size-40 rounded-full flex-center ${
                        activeTab === 2 || activeTab - 1 === 2
                          ? "bg-primary"
                          : "bg-blue-1-05"
                      } text-white fw-500 tabs__button js-tabs-button`}
                      data-tab-target=".-tab-item-2"
                    >
                      <i className="fas fa-check text-16 text-white"></i>
                    </div>
                    <div>
                      <p className="text-14 fw-500 ml-10">Step 2</p>
                      <p className="text-12 fw-400 ml-10">Bank Details</p>
                    </div>
                  </div>
                </div>

                <div className="col">
                  <div className="w-full h-1 bg-border"></div>
                </div>

                <div className="col-auto">
                  <div className="d-flex items-center">
                    <div
                      className={`size-40 rounded-full flex-center ${
                        activeTab === 3 ? "bg-primary" : "bg-blue-1-05"
                      } text-white fw-500 tabs__button js-tabs-button`}
                      data-tab-target=".-tab-item-3"
                    >
                      <i className="fas fa-check text-16 text-white"></i>
                    </div>
                    <div>
                      <p className="text-14 fw-500 ml-10">Step 3</p>
                      <p className="text-12 fw-400 ml-10">
                        Social Media Handles
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tabs__content pt-20 js-tabs-content">
                {activeTab === 1 && (
                  // <div
                  //   className={`tabs__pane${
                  //     activeTab === 1 ? " is-tab-el-active -tab-item-1" : ""
                  //   } px-40 rounded-8 border-light pb-20`}
                  // >
                  <Personal
                    updateTab={updateTab}
                    activeTab={activeTab}
                    nextIndex={2}
                    generateXML={generateXML}
                    UpdateProfile={UpdateProfile}
                  />
                  // </div>
                )}
                {activeTab === 2 && (
                  <div
                    className={`tabs__pane${
                      activeTab === 2 ? " is-tab-el-active -tab-item-2" : ""
                    } border-light px-40 rounded-8 pb-20`}
                  >
                    <BankDetails
                      updateTab={updateTab}
                      nextIndex={3}
                      prevIndex={1}
                      generateXML={generateXML}
                      UpdateProfile={UpdateProfile}
                    />
                  </div>
                )}
                {activeTab === 3 && (
                  <div
                    className={`tabs__pane${
                      activeTab === 3 ? " is-tab-el-active -tab-item-3" : ""
                    } border-light px-40 rounded-8 pb-20`}
                  >
                    <Social
                      updateTab={updateTab}
                      prevIndex={2}
                      generateXML={generateXML}
                      UpdateProfile={UpdateProfile}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profile;
