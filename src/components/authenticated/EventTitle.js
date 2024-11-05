import React from "react";
import Event5 from "../../assets/img/events/event5.png";
import { useDispatch, useSelector } from "react-redux";
import { RestfulApiService } from "../../config/service";
import { useParams } from "react-router-dom";
import { setCurrentEvent } from "../../redux/slices/eventSlice";
import { decryptData } from "../../utils/DataEncryption";

function EventTitle() {
  const user = useSelector((state) => state.user.userProfile);
  const selectedEvent = useSelector(
    (state) => state.selectedEvent.currentEvent
  );
  const dispatch = useDispatch();
  const { event_id } = useParams();

  const toggleEvent = async (isActive, EventId) => {
    console.log(!isActive);
    console.log({
      ...selectedEvent,
      Is_Active: Number(!isActive),
    });
    const reqdata = {
      Method_Name: isActive ? "InActive" : "Active",
      SearchBy: "",
      TypeEvent: "",
      FromDate: "",
      ToDate: "",
      EventId: decryptData(EventId),
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
    };
    try {
      const result = await RestfulApiService(reqdata, "organizer/dashboard");

      // Check if result is successful and update state
      if (result) {
        const apiResponse = {
          currentEvent: {
            ...selectedEvent,
            Is_Active: Number(!isActive),
          },
        };
        dispatch(setCurrentEvent(apiResponse));
      } else {
        console.log("Action completed!");
      }
    } catch (error) {
      const errorMessage =
        error?.Result?.Table1[0]?.Result_Description || "Event update failed";
      console.error(errorMessage);
    }
  };
  return (
    // <div>
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
              {selectedEvent?.Display_Name}
            </div>
          </div>
          <div className="col-1">
            <div className="form-switch d-flex items-center">
              <div className="switch">
                <input
                  type="checkbox"
                  checked={selectedEvent?.Is_Active}
                  onChange={(e) => {
                    console.log(e.target.value);

                    toggleEvent(selectedEvent?.Is_Active, event_id);
                  }}
                />
                <span className="switch__slider"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
}

export default EventTitle;
