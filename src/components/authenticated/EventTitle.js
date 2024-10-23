import React from "react";
import Event5 from "../../assets/img/events/event5.png";
import { useSelector } from "react-redux";

function EventTitle() {
  const selectedEvent = useSelector(
    (state) => state.selectedEvent.currentEvent
  );
  return (
    <div>
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
                  <input type="checkbox" checked={selectedEvent?.Is_Active} />
                  <span className="switch__slider"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventTitle;
