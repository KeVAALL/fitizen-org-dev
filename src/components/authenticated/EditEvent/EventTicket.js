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
  const [allCategory, setAllCategory] = useState([]);
  const [raceDistanceCategory, setRaceDistanceCategory] = useState([]);

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
        console.log(result?.data?.Result?.Table1);

        const result1 = result?.data?.Result?.Table1?.map((category) => {
          return {
            ...category,
            isOpen: false,
            isFetching: false,
            isEditing: false,
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

      console.log(response.data.Result.Table1);

      setRaceDistanceCategory(response.data.Result.Table1);
    } catch (error) {
      return [];
    }
  };
  useEffect(() => {
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
          {allCategory?.map((category) => {
            return (
              <CustomAccordion
                category={category}
                raceDistanceCategory={raceDistanceCategory}
              />
            );
          })}
        </Stack>
      )}
    </div>
  );
}

export default EventTicket;
