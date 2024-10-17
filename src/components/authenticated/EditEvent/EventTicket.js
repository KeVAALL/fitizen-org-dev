import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Checkbox,
  Chip,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  DesktopDatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Select from "react-select";
import { selectCustomStyle } from "../../../utils/selectCustomStyle";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { decryptData } from "../../../utils/storage";
import { RestfullApiService } from "../../../config/service";
import Loader from "../../../utils/Loader";
import CustomAccordion from "./CustomAccordion";

function EventTicket() {
  const { event_id } = useParams();
  const user = useSelector((state) => state.user.userProfile);
  const [initialValues, setInitialValues] = useState({});
  const [fetchingCategory, setFetchingCategory] = useState(false);
  const [allCategory, setAllCategory] = useState([]);
  const [submitForm, setSubmitForm] = useState(false);

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
      const result = await RestfullApiService(
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
  useEffect(() => {
    if (event_id) {
      LoadCategory();
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
            return <CustomAccordion category={category} />;
          })}
        </Stack>
      )}
    </div>
  );
}

export default EventTicket;
