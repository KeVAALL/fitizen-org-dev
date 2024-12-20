// React imports
// React imports
import React, { useCallback, useEffect, useState } from "react";

// Third-party imports
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

// Project imports
import PY1 from "../../../assets/img/icons/py1.png";
import PY2 from "../../../assets/img/icons/py2.png";
import PY3 from "../../../assets/img/icons/py3.png";
import PY4 from "../../../assets/img/icons/py4.png";
import { decryptData } from "../../../utils/DataEncryption";
import { RestfulApiService } from "../../../config/service";
import BankDetails from "./BankDetails";
import Payout from "./Payout";
import PaymentHistory from "./PaymentHistory";
import Transactions from "./Transactions";
import MonthlyInvoice from "./MonthlyInvoice";
import EventTitle from "../EventTitle";

function BillingMain() {
  const { event_id } = useParams();
  const user = useSelector((state) => state.user.userProfile);

  const [showBankDetails, setShowBankDetails] = useState(false);
  const [getData, setGetData] = useState([]);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [showMonthlyInvoice, setShowMonthlyInvoice] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [showPayout, setShowPayout] = useState(false);

  const handleGetData = useCallback(async () => {
    const bankDetails = {
      Method_Name: "GetPayout",
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
        toast.error(
          data?.Result?.Table1?.[0]?.Result_Description ||
            "Something went wrong"
        );
        return;
      }
      setGetData(data?.Result?.Table1 ?? []);
      console.log(data?.Result?.Table1);
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

  useEffect(() => {
    handleGetData();
  }, [handleGetData, showPayout]);

  useEffect(() => {
    handleGetData();
  }, [handleGetData]);

  return showBankDetails ? (
    <BankDetails handleShowBankDetails={setShowBankDetails} />
  ) : showPayout ? (
    <Payout setShowPayout={setShowPayout} getData={getData?.[0]} />
  ) : (
    <div className="dashboard__main">
      <div className="dashboard__content pt-20">
        <section className="layout-pb-md">
          <div className="container">
            <div className="row y-gap-30">
              <EventTitle />
            </div>
            <div className="row pt-30">
              {showPaymentHistory ? (
                <PaymentHistory setShowPaymentHistory={setShowPaymentHistory} />
              ) : showTransactions ? (
                <Transactions setShowTransactions={setShowTransactions} />
              ) : showMonthlyInvoice ? (
                <MonthlyInvoice setShowMonthlyInvoice={setShowMonthlyInvoice} />
              ) : (
                <>
                  <div className="col-xl-12 col-md-12 mb-30">
                    <div
                      className="py-30 px-30 border-light rounded-8 bg-skin"
                      style={{
                        boxShadow: "2px 2px 7.5px 0px #0000000D",
                      }}
                    >
                      <div className="row y-gap-20 justify-between items-center">
                        {getData[0] ? (
                          <>
                            <div className="col-lg-5">
                              <div className="fw-500 lh-14 text-11 text-light-1">
                                Next Payout On (Only for transactions till{" "}
                                {getData[0]?.transactiontill ?? ""})
                              </div>
                              <div className="text-15 text-primary lh-16 fw-600 mt-5">
                                {getData[0]?.next_cycledate ?? ""}{" "}
                              </div>
                            </div>
                            <div className="col-lg-5">
                              <div className="fw-500 lh-14 text-11 text-light-1">
                                Payout Cycle
                              </div>
                              <div className="text-15 text-primary lh-16 fw-600 mt-5">
                                {getData[0]?.Payment_Feq ?? ""} to{" "}
                                {getData[0]?.Bank_Name ?? ""}
                                {getData[0]?.Account_Number
                                  ? `••••${getData[0].Account_Number.slice(-4)}`
                                  : ""}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="col-lg-10">
                            <div className="text-18 text-primary lh-16 fw-600 mt-5">
                              Please setup Payout Cycle!
                            </div>
                          </div>
                        )}
                        <div className="col-lg-2">
                          <button
                            onClick={(e) => {
                              if (user?.Organizer_Role_Id !== "MU05001") {
                                toast.dismiss();
                                toast.error(
                                  "You do not have permission to edit these details. Please contact your organizer for assistance"
                                );
                                return;
                              }
                              e.preventDefault();
                              setShowPayout(true);
                            }}
                            className="button -primary-1 rounded-22 px-20 py-10 text-primary border-primary bg-white text-12 mx-auto"
                          >
                            Manage Payout
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-6">
                    <div
                      className="py-20 px-15 border-light rounded-16 bg-white cursor-pointer -hover-shadow"
                      onClick={() => {
                        console.log("CLick");
                        setShowPaymentHistory(true);
                      }}
                    >
                      <div className="row justify-between items-center">
                        <div className="col-5">
                          <img src={PY1} alt="icon" />
                        </div>
                        <div className="col-7 pl-0">
                          <div className="fw-600 lh-14 text-13">
                            Payment History
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-6">
                    <div
                      className="py-20 px-15 border-light rounded-16 bg-white cursor-pointer -hover-shadow"
                      onClick={() => {
                        setShowMonthlyInvoice(true);
                      }}
                    >
                      <div className="row justify-between items-center">
                        <div className="col-5">
                          <img src={PY2} alt="icon" />
                        </div>
                        <div className="col-7 pl-0">
                          <div className="fw-600 lh-14 text-13">
                            Monthly Invoices
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-6">
                    <div
                      className="py-20 px-15 border-light rounded-16 bg-white cursor-pointer -hover-shadow"
                      onClick={() => {
                        setShowBankDetails(true);
                      }}
                    >
                      <div className="row justify-between items-center">
                        <div className="col-5">
                          <img src={PY3} alt="icon" />
                        </div>
                        <div className="col-7 pl-0">
                          <div className="fw-600 lh-14 text-13">
                            Bank Details
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-6">
                    <div
                      className="py-20 px-15 border-light rounded-16 bg-white cursor-pointer -hover-shadow"
                      onClick={() => {
                        setShowTransactions(true);
                      }}
                    >
                      <div className="row justify-between items-center">
                        <div className="col-5">
                          <img src={PY4} alt="icon" />
                        </div>
                        <div className="col-7 pl-0">
                          <div className="fw-600 lh-14 text-13">
                            Transactions
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
  // );
}

export default BillingMain;
