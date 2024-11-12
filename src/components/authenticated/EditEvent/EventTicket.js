// React imports
import React, { useEffect, useState } from "react";

// Third-party imports
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

// MUI imports
import Stack from "@mui/material/Stack";

// Project imports
import { decryptData } from "../../../utils/DataEncryption";
import { RestfulApiService } from "../../../config/service";
import Loader from "../../../utils/BackdropLoader";
import CustomAccordion from "./CustomAccordion";

function EventTicket() {
  const { event_id } = useParams();
  const user = useSelector((state) => state.user.userProfile);
  const selectedCategory = useSelector(
    (state) => state.category.categorySelected
  );
  const [fetchingCategory, setFetchingCategory] = useState(false);
  const [isOneAccordionOpen, setIsOneAccordionOpen] = useState("");
  const [allCategory, setAllCategory] = useState([]);
  const [raceDistanceCategory, setRaceDistanceCategory] = useState([]);

  const handleNewItemDelete = (id) => {
    const updatedForms = allCategory.filter((form, catId) => catId !== id);
    setAllCategory(updatedForms);
  };
  const handleNewItemSubmit = (id) => {
    const updatedForms = allCategory.map((form, catId) => {
      if (catId === id) {
        return { ...form, isNew: false };
      } else {
        return form;
      }
    });
    setAllCategory(updatedForms);
  };
  async function LoadCategory() {
    const reqdata = {
      Method_Name: "Get_Category",
      Event_Id: decryptData(event_id),
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
      Org_Id: user?.Org_Id,
      EventCategoryEntry_Id: "",
    };
    try {
      setFetchingCategory(true);
      const result = await RestfulApiService(
        reqdata,
        "organizer/geteventcategory"
      );
      if (result) {
        const result1 = result?.data?.Result?.Table1?.map((category) => {
          return {
            ...category,
            isNew: false,
            // isOpen: false,
            // isFetching: false,
            // isEditing: false,
          };
        });
        console.log(result1);
        setAllCategory(result1);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setFetchingCategory(false);
    }
  }
  const FetchCategoryOptions = async () => {
    try {
      const reqdata = {
        Method_Name: "GetEventCategory",
        Session_User_Id: user?.User_Id,
        Org_Id: user?.Org_Id,
        ParentField_Id: selectedCategory?.value,
        SearchText: "",
      };
      const response = await RestfulApiService(reqdata, "master/Getdropdown");

      setRaceDistanceCategory(response.data.Result.Table1);
    } catch (error) {
      return [];
    }
  };
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling
    });
    if (event_id) {
      LoadCategory();
      FetchCategoryOptions();
    }
  }, [event_id]);

  return (
    <div
      className="py-30 px-30 border-light rounded-8"
      style={{ boxShadow: "2px 2px 7.5px 0px #0000000D" }}
    >
      {fetchingCategory ? (
        <Loader fetching={fetchingCategory} />
      ) : (
        <Stack spacing={4}>
          {allCategory?.map((category, id) => {
            return (
              <CustomAccordion
                id={id}
                category={category}
                LoadCategory={LoadCategory}
                raceDistanceCategory={raceDistanceCategory}
                isOneAccordionOpen={isOneAccordionOpen}
                setIsOneAccordionOpen={setIsOneAccordionOpen}
                handleNewItemDelete={handleNewItemDelete}
                handleNewItemSubmit={handleNewItemSubmit}
              />
            );
          })}
        </Stack>
      )}

      {!allCategory.some((item) => item.isNew) && (
        <div className="mt-30 w-full d-flex justify-center">
          <button
            onClick={(e) => {
              e.preventDefault();

              // if (allCategory.some(item => item.isNew)) {
              //   toast.error("Please complete and submit before proceeding.")
              // }

              setAllCategory([
                ...allCategory,
                {
                  EventCategory_Name: "",
                  EventCategory_Id: null,
                  Race_Distance: "",
                  Race_Distance_Unit: "",
                  Timed_Event: null,
                  Time_Limit: "",
                  Time_Limit_Unit: null,
                  Ticket_Sale_Start_Date: null,
                  Ticket_Sale_Start_Time: null,
                  Ticket_Sale_End_Date: null,
                  Ticket_Sale_End_Time: null,
                  Is_PriceMoneyAwarded: "", // Assuming 0 for boolean fields
                  Eligibility_Criteria_MinYear: "",
                  Eligibility_Criteria_MaxYear: "",
                  Is_Paid_Event: "", // Assuming 0 for boolean fields
                  Number_Of_Tickets: "",
                  BIB_Number: "",
                  Event_Price: 0,
                  Event_Start_Date: null,
                  Event_Start_Time: null,
                  Event_End_Date: null,
                  Event_End_Time: null,
                  Event_Prize: [],
                  Image_Name: "",
                  // isOpen: false,
                  // isFetching: false,
                  // isEditing: false,
                  isNew: true,
                },
              ]);
            }}
            className="button w-200 border-dark-1 fw-400 rounded-22 px-20 py-10 text-dark-1 text-14 -primary-1 d-flex justify-center gap-10"
          >
            <i className="fas fa-plus" /> Add Ticket
          </button>
        </div>
      )}
    </div>
  );
}

export default EventTicket;
