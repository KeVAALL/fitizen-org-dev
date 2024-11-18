// React imports
import React, { useEffect, useState } from "react";

// Project-specific imports
import DIcon1 from "../../assets/img/icons/dicon1.png";
import DIcon2 from "../../assets/img/icons/dicon2.png";
import DIcon3 from "../../assets/img/icons/dicon3.png";
import DIcon4 from "../../assets/img/icons/dicon4.png";
import DIcon5 from "../../assets/img/icons/dicon5.png";
import { RestfulApiService } from "../../config/service";
import { decryptData } from "../../utils/DataEncryption";
import { setCurrentEvent } from "../../redux/slices/eventSlice";
import EventTitle from "./EventTitle";
import Loader from "../../utils/BackdropLoader";

// React Router imports
import { useNavigate, useParams } from "react-router-dom";

// Redux imports
import { useDispatch, useSelector } from "react-redux";
import { inrCurrency } from "../../utils/UtilityFunctions";

function EventMain() {
  const { event_id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userProfile);
  const selectedEvent = useSelector(
    (state) => state.selectedEvent.currentEvent
  );
  const [fetchingDetails, setFetchingDetails] = useState(false);

  useEffect(() => {
    async function LoadEvent() {
      const reqdata = {
        Method_Name: "GetOne",
        SearchBy: "",
        TypeEvent: "",
        EventId: decryptData(event_id),
        Session_User_Id: user?.User_Id,
        Session_User_Name: user?.User_Display_Name,
        Session_Organzier_Id: user?.Organizer_Id,
      };
      try {
        setFetchingDetails(true);
        const result = await RestfulApiService(reqdata, "organizer/dashboard");
        if (result) {
          // setEvent(result?.data?.Result?.Table1[0]);
          const apiResponse = {
            currentEvent: result?.data?.Result?.Table1[0],
          };
          dispatch(setCurrentEvent(apiResponse));
        }
      } catch (err) {
        console.log(err);
      } finally {
        setFetchingDetails(false);
      }
    }

    if (event_id) {
      LoadEvent();
    }
  }, [event_id]);

  return (
    <div className="dashboard__main">
      <div className="dashboard__content pt-20">
        <section className="layout-pb-md">
          <div className="container">
            <div className="row y-gap-30">
              {fetchingDetails ? (
                <Loader fetching={fetchingDetails} />
              ) : (
                <>
                  {/* <div className="col-xl-12 col-md-12">
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
                            {event?.Display_Name}
                          </div>
                        </div>
                        <div className="col-1">
                          <div className="form-switch d-flex items-center">
                            <div className="switch">
                              <input
                                type="checkbox"
                                checked={event?.Is_Active}
                              />
                              <span className="switch__slider"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  <EventTitle />

                  <div className="col-xl-4 col-md-6">
                    <div className="py-30 px-15 border-light rounded-16 bg-white">
                      <div className="row y-gap-20 justify-between items-center">
                        <div className="col-4">
                          <img src={DIcon1} alt="icon" />
                        </div>
                        <div className="col-8">
                          <div className="fw-500 lh-14 text-12">
                            Total Tickets sold till date
                          </div>
                          <div className="text-20 lh-16 fw-700 mt-5">
                            {selectedEvent?.TicketSaleCount}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-4 col-md-6">
                    <div className="py-30 px-15 border-light rounded-16 bg-white">
                      <div className="row y-gap-20 justify-between items-center">
                        <div className="col-4">
                          <img src={DIcon2} alt="icon" />
                        </div>
                        <div className="col-8">
                          <div className="fw-500 lh-14 text-12">
                            Sales Value
                          </div>
                          <div className="text-20 lh-16 fw-700 mt-5">
                            {selectedEvent?.TicketSaleAmount
                              ? inrCurrency(selectedEvent?.TicketSaleAmount)
                              : 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-4 col-md-6">
                    <div className="py-30 px-15 border-light rounded-16 bg-white">
                      <div className="row y-gap-20 justify-between items-center">
                        <div className="col-4">
                          <img src={DIcon3} alt="icon" />
                        </div>
                        <div className="col-8">
                          <div className="fw-500 lh-14 text-12">Page Views</div>
                          <div className="text-20 lh-16 fw-700 mt-5">
                            {selectedEvent?.PageCount}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-10 col-md-10 mx-auto">
                    <div className="py-20 px-15 border-light rounded-16 bg-white">
                      <div className="row y-gap-20 justify-between items-center">
                        <div className="col-2">
                          <img src={DIcon5} alt="icon" />
                        </div>
                        <div className="col-8">
                          <a
                            href="#"
                            className="button w-150 border-primary rounded-22 px-20 py-10 text-primary text-12 -primary-1 mx-auto mb-10"
                          >
                            Promote Event
                          </a>
                          <div className="text-16 lh-16 fw-500 text-center">
                            Lorem ipsum dolor sit amet consectetur. Fermentum
                            sed facilisis urna feugiat fringilla{" "}
                          </div>
                        </div>
                        <div className="col-2">
                          <img src={DIcon4} alt="icon" />
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

export default EventMain;
