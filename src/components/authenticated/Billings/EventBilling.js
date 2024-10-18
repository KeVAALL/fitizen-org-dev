import React, { useCallback, useEffect, useState } from "react";

import Event5 from "../../../assets/img/events/event5.png";
import PY1 from "../../../assets/img/icons/py1.png";
import PY2 from "../../../assets/img/icons/py2.png";
import PY3 from "../../../assets/img/icons/py3.png";
import PY4 from "../../../assets/img/icons/py4.png";
import BankDetails from "./BankDetails";
import Payout from "./Payout";
import PaymentHistory from "./PaymentHistory";
import Transactions from "./Transactions";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { decryptData } from "../../../utils/storage";
import { RestfullApiService } from "../../../config/service";
import toast from "react-hot-toast";

function EventBilling() {
  const { event_id } = useParams();
  const user = useSelector((state) => state.user.userProfile);

  const [showBankDetails, setShowBankDetails] = useState(false);
  const [getData , setGetData] = useState([]);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
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
    const { data } = await RestfullApiService(
      bankDetails,
      "organizer/GetBank"
    );

    if (data?.Result?.Table1?.length === 0 || data?.Status !== 200) {
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

useEffect(()=>{
  handleGetData()
},[handleGetData, showPayout])

useEffect(()=>{
  handleGetData()
},[handleGetData])

  return showBankDetails && !showPayout ? (
      <BankDetails />
  ) : showPayout && !showBankDetails ? (
    <Payout setShowPayout={setShowPayout} getData={getData?.[0]}/>
  ) : (
    <div className="dashboard__main">
      <div className="dashboard__content pt-20">
        <section className="layout-pb-md">
          <div className="container">
            <div className="row y-gap-30">
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
            </div>
            <div className="row pt-30">
              {showPaymentHistory && !showTransactions ? (
                <PaymentHistory setShowPaymentHistory={setShowPaymentHistory} />
              ) : !showPaymentHistory && showTransactions ? (
                <Transactions setShowTransactions={setShowTransactions} />
              ) : (
                <>
                  <div className="col-xl-12 col-md-12 mb-30">
                   {
                    getData?.length>0 ? getData.map((curData)=>{
                      return  <div
                      className="py-30 px-30 border-light rounded-8 bg-skin"
                      style={{ boxShadow: "2px 2px 7.5px 0px #0000000D" }}
                    >
                      <div className="row y-gap-20 justify-between items-center">
                        <div className="col-lg-5">
                          <div className="fw-500 lh-14 text-11 text-light-1">
                            Next Payout On (Only for transactions till {curData?.transactiontill ?? ""})
                          </div>
                          <div className="text-15 text-primary lh-16 fw-600 mt-5">
{curData?.next_cycledate ?? ""}                          </div>
                        </div>
                        <div className="col-lg-5">
                          <div className="fw-500 lh-14 text-11 text-light-1">
                            Payout Cycle
                          </div>
                          <div className="text-15 text-primary lh-16 fw-600 mt-5">
                            {curData?.Payment_Feq ?? ""} to {curData?.Bank_Name ?? ""}{curData?.Account_Number
  ? `••••${curData.Account_Number.slice(-4)}`
  : ""}

                          </div>
                        </div>
                        <div className="col-lg-2">
                          <button
                            onClick={(e) => {
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
                    }):"No data found"
                   }
                  </div>

                  <div className="col-xl-3 col-md-6">
                    <div
                      className="py-20 px-15 border-light rounded-16 bg-white cursor-pointer -hover-shadow"
                      onClick={() => {
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
                    <div className="py-20 px-15 border-light rounded-16 bg-white cursor-pointer -hover-shadow">
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
}

export default EventBilling;
