// React imports
import React, { useEffect, useState } from "react";

// Third-party imports
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

// MUI imports
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

// Icons imports
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

// Project imports
import { RestfulApiService } from "../../../config/service";
import { decryptData } from "../../../utils/DataEncryption";
import { selectCustomStyle } from "../../../utils/ReactSelectStyles";
import CheckboxCard from "../../../utils/CheckboxCard";

// DnD imports
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  arrayMove,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Loader from "../../../utils/BackdropLoader";

const DraggableQuestion = ({
  qkey,
  question,
  index,
  toggleChecked,
  fetchEditQuestion,
  handleDeleteClick,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    // useSortable({ id: question.Question_Id });
    useSortable({
      id: isNaN(Number(question.Question_Id))
        ? question.Question_Id
        : question.Event_Question_Id,
    });
  const [fetchingQuestion, setFetchingQuestion] = useState(false);
  const style = {
    transform: CSS.Transform.toString(transform),
    // transition,
    marginBottom: "8px",
    borderRadius: "8px",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div
        className="py-15 px-15 border-light rounded-8 row"
        style={{
          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
          // cursor: "move",
          cursor: "grab",
        }}
      >
        <div
          className={`${
            question.Question_Id ? "col-1" : "col-1"
          } d-flex justify-center items-center gap-15`}
        >
          {Number(question.Question_Id) === 0 ? (
            <>
              {fetchingQuestion ? (
                <CircularProgress
                  color="inherit"
                  style={{ height: "12px", width: "12px" }}
                />
              ) : (
                <i
                  className="fas fa-pen action-button text-12"
                  onClick={() => {
                    fetchEditQuestion(
                      question.Event_Question_Id,
                      setFetchingQuestion
                    );
                  }}
                ></i>
              )}
              <i
                className="fas fa-trash-alt action-button text-12"
                onClick={(e) => {
                  handleDeleteClick(e, question);
                }}
              ></i>
            </>
          ) : (
            <></>
          )}
          {Number(question.Question_Id) !== 0 ? (
            <Checkbox
              sx={{ paddingLeft: 0 }}
              className="other-info-checkbox"
              checked={question.checked}
              onChange={(e) => {
                e.stopPropagation();
                // toggleChecked(question.Question_Id);
                toggleChecked(
                  isNaN(Number(question.Question_Id))
                    ? question.Question_Id
                    : question.Event_Question_Id
                );
              }}
            />
          ) : (
            <></>
          )}
        </div>
        <div
          className={`${
            question.Question_Id ? "col-3" : "col-3"
          } drag-handle d-flex items-center`}
          {...listeners}
        >
          <div class="y-gap-5">
            <label class="text-13 fw-500">{question?.Question}</label>
          </div>
        </div>
        <div className="col-4 d-flex items-center drag-handle" {...listeners}>
          <div class="single-field w-full">
            <div class="form-control">
              <input
                disabled
                type="text"
                class="form-control"
                placeholder={question?.Question}
                name="name"
              />
            </div>
          </div>
        </div>
        <div
          className="col-4 d-flex items-center justify-end drag-handle"
          {...listeners}
        >
          <i
            class="fas fa-grip-vertical"
            style={{ color: "#adacae", fontSize: "24px" }}
          ></i>
        </div>
      </div>
    </div>
  );
};

function EventParticipant() {
  const { event_id } = useParams();
  const user = useSelector((state) => state.user.userProfile);
  const [isOtherInfoAccordion, setOtherInfoAccordion] = useState(false);
  const [personalInfoAccordion, setPersonalInfoAccordion] = useState(false);
  const [addressInfoAccordion, setAddressInfoAccordion] = useState(false);
  const toggleAccordion = (accordionType) => {
    setOtherInfoAccordion((prevState) =>
      accordionType === "otherInfo" ? !prevState : false
    );
    setPersonalInfoAccordion((prevState) =>
      accordionType === "personalInfo" ? !prevState : false
    );
    setAddressInfoAccordion((prevState) =>
      accordionType === "addressInfo" ? !prevState : false
    );
  };
  const [loadingQuestionForm, setLoadingQuestionForm] = useState(false);
  const [loadingPersonalForm, setLoadingPersonalForm] = useState(false);

  const [infoQuestions, setInfoQuestions] = useState([]);
  const [personalQuestions, setPersonalQuestions] = useState([
    {
      fieldName: "Participant Name",
      fieldPlaceholder: "Add Name",
      fieldType: "text",
      fieldId: "PQ001",
      Is_Mandatory: true,
    },
    {
      fieldName: "Email ID",
      fieldPlaceholder: "Add Email ID",
      fieldType: "text",
      fieldId: "PQ002",
      Is_Mandatory: true,
    },
    {
      fieldName: "Phone Number",
      fieldPlaceholder: "9893399393",
      fieldType: "text",
      fieldId: "PQ003",
      Is_Mandatory: true,
    },
    {
      fieldName: "Date of Birth",
      fieldPlaceholder: "Date of Birth",
      fieldType: "text",
      fieldId: "PQ004",
      Is_Mandatory: true,
    },
    {
      fieldName: "Gender",
      fieldPlaceholder: "Gender",
      fieldType: "select",
      fieldId: "PQ005",
      Is_Mandatory: true,
    },
    {
      fieldName: "Blood Group",
      fieldPlaceholder: "Add Blood Group",
      fieldType: "select",
      fieldId: "PQ006",
      Is_Mandatory: true,
    },
  ]);
  const [addressQuestions, setAddressQuestions] = useState([
    {
      fieldName: "Pincode",
      fieldPlaceholder: "Add Pincode",
      fieldType: "text",
      fieldId: "AQ001",
      Is_Mandatory: false,
    },
    {
      fieldName: "Country",
      fieldPlaceholder: "Country",
      fieldType: "select",
      fieldId: "AQ002",
      Is_Mandatory: false,
    },
    {
      fieldName: "Address",
      fieldPlaceholder: "Add Address",
      fieldType: "text",
      fieldId: "AQ003",
      Is_Mandatory: false,
    },
    {
      fieldName: "State",
      fieldPlaceholder: "State",
      fieldType: "select",
      fieldId: "AQ004",
      Is_Mandatory: false,
    },
    {
      fieldName: "City",
      fieldPlaceholder: "City",
      fieldType: "select",
      fieldId: "AQ005",
      Is_Mandatory: false,
    },
    {
      fieldName: "Street",
      fieldPlaceholder: "Add Street",
      fieldType: "text",
      fieldId: "AQ006",
      Is_Mandatory: false,
    },
    {
      fieldName: "Landmark",
      fieldPlaceholder: "Add Landmark",
      fieldType: "text",
      fieldId: "AQ007",
      Is_Mandatory: false,
    },
  ]);
  const [submitQuestionForm, setSubmitQuestionForm] = useState(false);
  const [submitPersonalForm, setSubmitPersonalForm] = useState(false);
  const [submitAddressForm, setSubmitAddressForm] = useState(false);
  // add new question
  const [addQuestionModal, setAddQuestionModal] = useState(false);
  const [submitAddQuestion, setSubmitAddQuestion] = useState(false);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const initialValues = {
    Question: "",
    Input_Type: null,
    Option_Fileds: [],
    Is_Mandatory: false,
    Mandatory_Msg: "",
  };
  const InputTypeOptions = [
    { label: "Text", value: "text" },
    { label: "Dropdown", value: "dropdown" },
    { label: "Radio", value: "radio" },
    { label: "Checkbox", value: "checkbox" },
  ];
  const [addQuestionValue, setAddQuestionValue] = useState(initialValues);
  const QuestionValidationSchema = Yup.object().shape({
    Question: Yup.string().required("Question Name is required"),
    Input_Type: Yup.object().required("Input Type is required"),
    Option_Fileds: Yup.array().when("Input_Type", {
      is: (value) => value?.value === "dropdown" || value?.value === "radio",
      then: () => Yup.array().min(1, "At least one option is required"),
      otherwise: () => Yup.array().notRequired(),
    }),

    Is_Mandatory: Yup.boolean(),
    Mandatory_Msg: Yup.string().when("Is_Mandatory", {
      is: (value) => value,
      then: () => Yup.string().required("Mandatory Name is required"),
      otherwise: () => Yup.string(),
    }),
  });

  // For dragging questions
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const handleDragEnd = (event) => {
    const { active, over } = event;
    console.log(active, over);
    if (active.id !== over.id) {
      const oldIndex = infoQuestions.findIndex(
        // (item) => item.Question_Id === active.id
        // (item) =>  item.Event_Question_Id === active.id
        (item) =>
          isNaN(Number(item.Question_Id))
            ? item.Question_Id === active.id
            : item.Event_Question_Id === active.id
      );
      const newIndex = infoQuestions.findIndex(
        // (item) => item.Question_Id === over.id
        // (item) => item.Event_Question_Id === over.id
        (item) =>
          isNaN(Number(item.Question_Id))
            ? item.Question_Id === over.id
            : item.Event_Question_Id === over.id
      );

      const updatedQuestions = arrayMove(infoQuestions, oldIndex, newIndex);
      console.log(updatedQuestions);

      // Update Display_Order_No based on new order
      updatedQuestions.forEach((question, index) => {
        question.Display_Order_No = index + 1;
      });

      setInfoQuestions(updatedQuestions); // Pass the updated order back to the parent component
    }
  };

  // For toggling personal form
  const togglePersonalMandatory = (index) => {
    setPersonalQuestions((prevQuestions) =>
      prevQuestions.map((question, idx) =>
        idx === index
          ? { ...question, Is_Mandatory: !question.Is_Mandatory }
          : question
      )
    );
  };
  // For toggling address form
  const toggleAddressMandatory = (index) => {
    setAddressQuestions((prevQuestions) =>
      prevQuestions.map((question, idx) =>
        idx === index
          ? { ...question, Is_Mandatory: !question.Is_Mandatory }
          : question
      )
    );
  };
  // For saving personal & address form
  const generatePersonalXMLData = (personalQuestions) => {
    let PersonalXMLData = "";

    // Filter questions where Is_Mandatory is true
    personalQuestions.forEach((question) => {
      if (question.Is_Mandatory) {
        PersonalXMLData += "<R>";
        PersonalXMLData += `<QID>${question.fieldId}</QID>`; // Assuming Question_Id exists
        PersonalXMLData += `<EQID></EQID>`; // Placeholder for additional data
        PersonalXMLData += `<ON></ON>`; // Placeholder for additional data
        PersonalXMLData += `<DOC></DOC>`; // Placeholder for additional data
        PersonalXMLData += "</R>";
      }
    });

    // Wrap the individual question XML strings into a root element
    PersonalXMLData = `<D>${PersonalXMLData}</D>`;
    console.log(PersonalXMLData);
    return PersonalXMLData;
  };
  const handlePersonalEditClick = async (event, eventCategoryId) => {
    const reqdata = {
      Method_Name: "QuestionMan",
      Event_Id: decryptData(event_id),
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
      Org_Id: user?.Org_Id,
      EventCategoryEntry_Id: eventCategoryId,
    };
    try {
      setLoadingPersonalForm(true);
      const result = await RestfulApiService(reqdata, "organizer/GetEvent");
      if (result) {
        console.log(result?.data?.Result?.Table1);
        setPersonalQuestions((prevQuestions) =>
          prevQuestions.map((question) => ({
            ...question,
            Is_Mandatory: result?.data?.Result?.Table1?.some(
              (data) => data.Question_Id === question.fieldId
            ),
          }))
        );
        setAddressQuestions((prevQuestions) =>
          prevQuestions.map((question) => ({
            ...question,
            Is_Mandatory: result?.data?.Result?.Table1?.some(
              (data) => data.Question_Id === question.fieldId
            ),
          }))
        );
        console.log(
          addressQuestions.map((question) => ({
            ...question,
            Is_Mandatory: result?.data?.Result?.Table1?.some(
              (data) => data.Question_Id === question.fieldId
            ),
          }))
        );

        // setPersonalInfoAccordion(true);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingPersonalForm(false);
    }
  };
  const handlePersonalInfoSave = async (e) => {
    e.preventDefault();

    const isAnyChecked =
      personalQuestions.some((question) => question.Is_Mandatory) ||
      addressQuestions.some((question) => question.Is_Mandatory);

    if (!isAnyChecked) {
      toast.error("At least one field should be mandatory");
      return;
    }

    const reqdata = {
      Method_Name: "QuestionMan",
      Event_Id: decryptData(event_id),
      Event_Name: "",
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
      Org_Id: user?.Org_Id,
      XMLData: "",
      TakeAwayXMLData: "",
      FacilityXMLData: "",
      QuestionXMLData: "",
      QuestionMandatoryXMLData: generatePersonalXMLData([
        ...personalQuestions,
        ...addressQuestions,
      ]), // Updated function
      Event_Description: "",
      Rules_Regulations: "",
      Refund_Cancellation: "",
    };

    try {
      if (personalInfoAccordion) {
        setSubmitPersonalForm(true);
      } else {
        setSubmitAddressForm(true);
      }

      const result = await RestfulApiService(reqdata, "organizer/SaveEvent");

      if (result?.data?.Result?.Table1[0]?.Result_Id === -1) {
        toast.error(result?.data?.Result?.Table1[0]?.Result_Description);
        return;
      }

      if (result) {
        toast.dismiss();
        toast.success(result?.data?.Result?.Table1[0]?.Result_Description);
        if (personalInfoAccordion) {
          toggleAccordion("personalInfo");
        } else {
          toggleAccordion("addressInfo");
        }
      }
    } catch (err) {
      toast.error(err?.Result?.Table1[0]?.Result_Description);
    } finally {
      setSubmitPersonalForm(false);
      setSubmitAddressForm(false);
    }
  };

  // For saving question form order
  const generateQuestionXMLData = (infoQuestions) => {
    let QuestionXMLData = "";

    infoQuestions.forEach((question) => {
      if (question.checked) {
        QuestionXMLData += "<R>";
        QuestionXMLData += `<QID>${question.Question_Id}</QID>`;
        QuestionXMLData += `<EQID>${question.Event_Question_Id}</EQID>`; // Assuming you want to keep this empty
        QuestionXMLData += `<ON>${question.Display_Order_No}</ON>`;
        QuestionXMLData += `<DOC>${question.Doc_Path}</DOC>`; // Update as needed
        QuestionXMLData += "</R>";
      }
    });

    QuestionXMLData = `<D>${QuestionXMLData}</D>`;
    return QuestionXMLData; // You can return or log this
  };
  const toggleChecked = (id) => {
    console.log(id);
    const updatedQuestions = infoQuestions.map((q) =>
      // q.Question_Id === id ? { ...q, checked: !q.checked } : q
      // q.Event_Question_Id === id ? { ...q, checked: !q.checked } : q
      isNaN(Number(q.Question_Id))
        ? q.Question_Id === id
          ? { ...q, checked: !q.checked }
          : q
        : q.Event_Question_Id === id
        ? { ...q, checked: !q.checked }
        : q
    );
    setInfoQuestions(updatedQuestions);
  };
  const handleCancelClick = (event) => {
    event.stopPropagation(); // Prevent accordion from toggling
    // setOtherInfoAccordion(false); // Close the accordion
    toggleAccordion("otherInfo");
  };
  const handleEditClick = async (event, eventCategoryId) => {
    event.stopPropagation(); // Prevent accordion from toggling

    const reqdata = {
      Method_Name: "Question",
      Event_Id: decryptData(event_id),
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
      Org_Id: user?.Org_Id,
      EventCategoryEntry_Id: eventCategoryId,
    };
    try {
      setLoadingQuestionForm(true);
      const result = await RestfulApiService(reqdata, "organizer/GetEvent");
      if (result) {
        const result1 = JSON.parse(
          result?.data?.Result?.Table1[0]?.Question
        )?.map((res) => {
          return { ...res, checked: res?.Event_Question_Id ? true : false };
        });
        setInfoQuestions(result1);

        // setOtherInfoAccordion(true);
        toggleAccordion("otherInfo");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingQuestionForm(false);
    }
  };
  const handleOtherInfoSaveClick = async (e) => {
    e.preventDefault();

    const isAnyChecked = infoQuestions.some((question) => question.checked);

    if (!isAnyChecked) {
      // Display error toast if no checkbox is checked
      toast.error("Please select at least one field");
      return;
    }

    const reqdata = {
      Method_Name: "Question",
      Event_Id: decryptData(event_id),
      Event_Name: "",
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
      Org_Id: user?.Org_Id,
      XMLData: "",
      TakeAwayXMLData: "",
      FacilityXMLData: "",
      QuestionMandatoryXMLData: "",
      QuestionXMLData: generateQuestionXMLData(infoQuestions),
      Event_Description: "",
      Rules_Regulations: "",
      Refund_Cancellation: "",
    };

    try {
      setSubmitQuestionForm(true);

      const result = await RestfulApiService(reqdata, "organizer/SaveEvent");

      if (result?.data?.Result?.Table1[0]?.Result_Id === -1) {
        toast.error(result?.data?.Result?.Table1[0]?.Result_Description);
        return;
      }

      if (result) {
        toast.dismiss();
        toast.success(result?.data?.Result?.Table1[0]?.Result_Description);
        setOtherInfoAccordion(false);
      }
    } catch (err) {
      toast.error(err?.Result?.Table1[0]?.Result_Description);
    } finally {
      setSubmitQuestionForm(false);
    }
  };

  // For adding new questions
  const fetchEditQuestion = async (Event_Question_Id, setFetchingQuestion) => {
    const reqdata = {
      Method_Name: "GetOne",
      Event_Id: decryptData(event_id),
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
      Org_Id: user?.Org_Id,
      Event_Question_Id: Event_Question_Id,
    };

    try {
      setFetchingQuestion(true);

      const result = await RestfulApiService(reqdata, "organizer/get_question");
      if (result?.data?.Result?.Table1[0]?.Result_Id === -1) {
        toast.error(result?.data?.Result?.Table1[0]?.Result_Description);
        return;
      }
      if (result) {
        console.log(result);

        const tableResult = result?.data?.Result?.Table1[0];

        setAddQuestionValue({
          ...tableResult,
          Input_Type: InputTypeOptions?.find(
            (op) => op.value === tableResult.Input_Type
          ),
          Option_Fileds: tableResult.Option_Fileds
            ? tableResult.Option_Fileds?.split(",")?.map((op) => {
                return {
                  label: op,
                  value: op,
                };
              })
            : [],
          Is_Mandatory: Boolean(tableResult.Is_Mandatory),
        });

        setIsEditingQuestion(true);
        setAddQuestionModal(true);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setFetchingQuestion(false);
    }
  };
  const handleDeleteClick = (event, question) => {
    event.stopPropagation(); // Prevent accordion from toggling
    // Perform delete action
    Swal.fire({
      title: "Are you sure?",
      // text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      preConfirm: async () => {
        // Show loading on the "Yes, delete it!" button
        Swal.showLoading();

        const reqdata = {
          Method_Name: "Delete",
          Session_User_Id: user?.User_Id,
          Session_User_Name: user?.User_Display_Name,
          Session_Organzier_Id: user?.Organizer_Id,
          Org_Id: user?.Org_Id,
          Event_Id: decryptData(event_id),
          Event_Question_Id: question.Event_Question_Id,
          Question: "",
          Input_Type: "",
          Option_Fileds: "",
          Is_Mandatory: 0,
          Mandatory_Msg: "",
        };

        try {
          // Make the API call
          const result = await RestfulApiService(
            reqdata,
            "organizer/save_question"
          );

          if (result) {
            // Assuming the API response includes a 'success' field
            // Return true if the API call is successful
            setInfoQuestions(result?.data?.Result?.Table2);
            return true;
          } else {
            // If the API response indicates failure, show a validation message
            Swal.showValidationMessage("Failed to delete the review.");
            return false;
          }
        } catch (error) {
          // If an error occurs, show an error message
          Swal.showValidationMessage("Request failed: " + error);
          return false;
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Show the success message after the deletion is confirmed
        Swal.fire({
          title: "Deleted!",
          text: "Question has been deleted.",
          icon: "success",
        });
      }
    });
  };
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling
    });
    handlePersonalEditClick();
  }, []);

  return (
    <div
      className="py-30 px-30 border-light rounded-8"
      style={{ boxShadow: "2px 2px 7.5px 0px #0000000D" }}
    >
      {loadingPersonalForm ? (
        <Loader fetching={loadingPersonalForm} />
      ) : (
        <div className="row y-gap-30 py-20">
          <div className="col-12">
            <Modal open={addQuestionModal}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 600,
                  bgcolor: "background.paper",
                  border: "none",
                  borderRadius: 2,
                  boxShadow: 24,
                  p: 3,
                }}
              >
                <Stack direction="column" alignItems="center" spacing={2}>
                  <Stack
                    style={{ width: "100%" }}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <div className="text-16 lh-16 fw-600 text-primary">
                      {isEditingQuestion ? "Edit" : "Add"} Question
                    </div>
                    <i
                      onClick={() => {
                        setAddQuestionModal(false);
                        setIsEditingQuestion(false);
                        setAddQuestionValue(initialValues);
                      }}
                      class="fas fa-times text-16 text-primary cursor-pointer"
                    ></i>
                  </Stack>

                  <Formik
                    enableReinitialize
                    initialValues={addQuestionValue}
                    validationSchema={QuestionValidationSchema}
                    onSubmit={async (values) => {
                      const reqdata = {
                        Method_Name: isEditingQuestion ? "Update" : "Create",
                        Session_User_Id: user?.User_Id,
                        Session_User_Name: user?.User_Display_Name,
                        Session_Organzier_Id: user?.Organizer_Id,
                        Org_Id: user?.Org_Id,
                        Event_Id: decryptData(event_id),
                        Question: values.Question,
                        Input_Type: values.Input_Type.value,
                        Option_Fileds:
                          values.Option_Fileds.length > 0
                            ? values.Option_Fileds?.map(
                                (field) => field.value
                              ).join(",")
                            : "",
                        Is_Mandatory: Number(values.Is_Mandatory),
                        Mandatory_Msg: values.Mandatory_Msg,
                        Event_Question_Id: isEditingQuestion
                          ? values.Event_Question_Id
                          : "",
                      };

                      try {
                        setSubmitAddQuestion(true);

                        const result = await RestfulApiService(
                          reqdata,
                          "organizer/save_question"
                        );
                        if (result?.data?.Result?.Table1[0]?.Result_Id === -1) {
                          toast.error(
                            result?.data?.Result?.Table1[0]?.Result_Description
                          );
                          return;
                        }
                        if (result) {
                          toast.success(
                            result?.data?.Result?.Table1[0]?.Result_Description
                          );
                          setIsEditingQuestion(false);
                          setAddQuestionModal(false);
                          setAddQuestionValue(initialValues);
                          const result1 = result?.data?.Result?.Table2?.map(
                            (res) => {
                              return {
                                ...res,
                                checked: isNaN(Number(res.Question_Id))
                                  ? res?.Question_Id
                                    ? true
                                    : false
                                  : res?.Event_Question_Id
                                  ? true
                                  : false,
                              };
                            }
                          );
                          setInfoQuestions(result1);
                        }
                      } catch (err) {
                        console.log(err);
                      } finally {
                        setSubmitAddQuestion(false);
                      }
                    }}
                  >
                    {({ setFieldValue, setFieldTouched, values }) => (
                      <Form
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          gap: "16px",
                        }}
                      >
                        <div className="single-field w-full y-gap-10">
                          <label className="text-13 text-reading fw-500">
                            Question Name <sup className="asc">*</sup>
                          </label>
                          <div className="form-control">
                            <Field
                              type="text"
                              name="Question"
                              className="form-control"
                              placeholder="Enter Question Name"
                              onChange={(e) => {
                                e.preventDefault();
                                const { value } = e.target;

                                const regex = /^[^\s].*$/;

                                if (
                                  !value ||
                                  (regex.test(value.toString()) &&
                                    value.length <= 50)
                                ) {
                                  setFieldValue("Question", value);
                                } else {
                                  return;
                                }
                              }}
                            />
                          </div>
                          <ErrorMessage
                            name="Question"
                            component="div"
                            className="text-error-2 text-13"
                          />
                        </div>

                        {/* Input Type */}
                        <div className="y-gap-10">
                          <label className="text-13 text-reading fw-500">
                            Input Type <sup className="asc">*</sup>
                          </label>
                          <div className="p-0">
                            <Select
                              isSearchable={false}
                              placeholder="Select Input Type"
                              options={InputTypeOptions}
                              styles={selectCustomStyle}
                              value={values.Input_Type}
                              onChange={(option) => {
                                setFieldValue("Input_Type", option);
                                if (
                                  option?.value === "dropdown" ||
                                  option?.value === "radio"
                                ) {
                                  setFieldValue("Options", []);
                                }
                              }}
                            />
                          </div>
                          <ErrorMessage
                            name="Input_Type"
                            component="div"
                            className="text-error-2 text-13"
                          />
                        </div>

                        {/* Options */}
                        {(values.Input_Type?.value === "dropdown" ||
                          values.Input_Type?.value === "radio") && (
                          <div className="y-gap-10">
                            <label className="text-13 text-reading fw-500">
                              Options <sup className="asc">*</sup>
                            </label>
                            <div className="p-0">
                              <CreatableSelect
                                placeholder="Type to add your own options"
                                isMulti
                                styles={{
                                  ...selectCustomStyle,
                                  multiValue: (base) => ({
                                    ...base,
                                    borderRadius: "4px",
                                    backgroundColor: "#fff9e1",
                                    color: "#000",
                                  }),
                                  multiValueLabel: (base) => ({
                                    ...base,
                                    padding: "0px 8px 0px 8px",
                                    fontSize: "80%",
                                  }),
                                }}
                                options={values.Option_Fileds}
                                value={values.Option_Fileds}
                                onChange={(options) =>
                                  setFieldValue("Option_Fileds", options)
                                }
                              />
                            </div>
                            <ErrorMessage
                              name="Option_Fileds"
                              component="div"
                              className="text-error-2 text-13"
                            />
                          </div>
                        )}

                        <div className="d-flex items-center gap-10">
                          <Checkbox
                            sx={{ paddingLeft: 0 }}
                            checked={values.Is_Mandatory}
                            onChange={(e) => {
                              e.stopPropagation();
                              setFieldValue(
                                "Is_Mandatory",
                                Number(e.target.checked)
                              );
                              if (!e.target.checked) {
                                setFieldValue("Mandatory_Msg", "");
                                setFieldTouched("Mandatory_Msg", false, false);
                              }
                            }}
                          />
                          <label className="text-14 fw-500">
                            Is Mandatory?
                          </label>
                        </div>

                        {/* Mandatory Name */}
                        {values.Is_Mandatory ? (
                          <div className="single-field w-full y-gap-10">
                            <label className="text-13 text-reading fw-500">
                              Error message <sup className="asc">*</sup>
                            </label>
                            <div className="form-control">
                              <Field
                                type="text"
                                name="Mandatory_Msg"
                                className="form-control"
                                placeholder="Enter Error message"
                                onChange={(e) => {
                                  e.preventDefault();
                                  const { value } = e.target;

                                  const regex = /^[^\s].*$/;

                                  if (
                                    !value ||
                                    (regex.test(value.toString()) &&
                                      value.length <= 50)
                                  ) {
                                    setFieldValue("Mandatory_Msg", value);
                                  } else {
                                    return;
                                  }
                                }}
                              />
                            </div>
                            <ErrorMessage
                              name="Mandatory_Msg"
                              component="div"
                              className="text-error-2 text-13"
                            />
                          </div>
                        ) : (
                          <></>
                        )}

                        <Stack
                          style={{ width: "100%" }}
                          direction="row"
                          justifyContent="flex-end"
                          alignItems="center"
                          className="mt-20"
                        >
                          <div className="col-auto relative">
                            <button
                              disabled={submitAddQuestion}
                              type="submit"
                              className="button bg-primary w-150 h-50 rounded-24 px-15 text-white border-light load-button"
                            >
                              {!submitAddQuestion ? (
                                `Save`
                              ) : (
                                <span className="btn-spinner"></span>
                              )}
                            </button>
                          </div>
                        </Stack>
                      </Form>
                    )}
                  </Formik>
                </Stack>
              </Box>
            </Modal>
            <Stack spacing={3}>
              <Accordion
                className="event-category-accordion"
                sx={{
                  borderRadius: 0, // Remove border radius
                  "&:before": {
                    display: "none", // Remove default MUI border line
                  },
                  boxShadow: "none", // Remove default box shadow
                }}
                expanded={personalInfoAccordion}
                onChange={() =>
                  // setPersonalInfoAccordion(!personalInfoAccordion)
                  toggleAccordion("personalInfo")
                }
              >
                <AccordionSummary
                  style={{
                    backgroundColor: "#FFF3C7", // Set the background color
                  }}
                  sx={{
                    pointerEvents: "none",
                  }}
                  expandIcon={
                    personalInfoAccordion ? (
                      <IconButton
                        size="small"
                        style={{
                          backgroundColor: "#949494",
                          padding: "4px",
                          borderRadius: 0,
                          pointerEvents: "auto",
                          "&:hover": {
                            backgroundColor: "#f05736",
                          },
                        }}
                        onClick={(event) => {
                          event.stopPropagation(); // Prevent accordion from toggling
                          // setPersonalInfoAccordion(false); // Close the accordion
                          toggleAccordion("personalInfo");
                        }}
                      >
                        <ClearOutlinedIcon
                          fontSize="inherit"
                          style={{
                            color: "#fff",
                          }}
                        />
                      </IconButton>
                    ) : (
                      <IconButton
                        size="small"
                        sx={{
                          backgroundColor: "#949494",
                          padding: "4px",
                          borderRadius: 0,
                          pointerEvents: "auto",
                          "&:hover": {
                            backgroundColor: "#f05736",
                          },
                        }}
                        onClick={(event) => {
                          // handlePersonalEditClick(e);
                          event.stopPropagation(); // Prevent accordion from toggling
                          // setPersonalInfoAccordion(true); // Close the accordion
                          toggleAccordion("personalInfo");
                        }}
                      >
                        <AddOutlinedIcon
                          fontSize="inherit"
                          style={{
                            color: "#fff",
                          }}
                        />
                      </IconButton>
                    )
                  }
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <div className="text-14 fw-600">Personal Information</div>
                </AccordionSummary>
                <AccordionDetails
                  style={{
                    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                  }}
                >
                  <div className="row y-gap-30 py-20">
                    {personalQuestions.map((question, index) => (
                      <CheckboxCard
                        key={index}
                        fieldName={question.fieldName}
                        fieldPlaceholder={question.fieldPlaceholder}
                        fieldType={question.fieldType}
                        isMandatory={question.Is_Mandatory}
                        onToggleMandatory={() => togglePersonalMandatory(index)}
                      />
                    ))}
                    <div className="col-12 d-flex justify-start">
                      <div className="row">
                        <div className="col-auto relative">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              // setPersonalInfoAccordion(false);
                              toggleAccordion("personalInfo");
                            }}
                            className="button bg-white w-150 h-40 rounded-24 px-15 text-primary border-primary fw-400 text-12"
                          >
                            Cancel
                          </button>
                        </div>
                        <div className="col-auto relative">
                          <button
                            disabled={submitPersonalForm}
                            onClick={handlePersonalInfoSave}
                            className="button bg-primary w-150 h-40 rounded-24 px-15 text-white border-light fw-400 text-12 d-flex gap-25 load-button"
                          >
                            {!submitPersonalForm ? (
                              `Save`
                            ) : (
                              <span className="btn-spinner"></span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>

              <Accordion
                className="event-category-accordion"
                sx={{
                  borderRadius: 0, // Remove border radius
                  "&:before": {
                    display: "none", // Remove default MUI border line
                  },
                  boxShadow: "none", // Remove default box shadow
                }}
                expanded={addressInfoAccordion}
                onChange={() =>
                  // setAddressInfoAccordion(!addressInfoAccordion)
                  toggleAccordion("addressInfo")
                }
              >
                <AccordionSummary
                  style={{
                    backgroundColor: "#FFF3C7", // Set the background color
                  }}
                  sx={{
                    pointerEvents: "none",
                  }}
                  expandIcon={
                    addressInfoAccordion ? (
                      <IconButton
                        size="small"
                        style={{
                          backgroundColor: "#949494",
                          padding: "4px",
                          borderRadius: 0,
                          pointerEvents: "auto",
                          "&:hover": {
                            backgroundColor: "#f05736",
                          },
                        }}
                        onClick={(event) => {
                          event.stopPropagation(); // Prevent accordion from toggling
                          // setAddressInfoAccordion(false); // Close the accordion
                          toggleAccordion("addressInfo");
                        }}
                      >
                        <ClearOutlinedIcon
                          fontSize="inherit"
                          style={{
                            color: "#fff",
                          }}
                        />
                      </IconButton>
                    ) : (
                      <IconButton
                        size="small"
                        sx={{
                          backgroundColor: "#949494",
                          padding: "4px",
                          borderRadius: 0,
                          pointerEvents: "auto",
                          "&:hover": {
                            backgroundColor: "#f05736",
                          },
                        }}
                        onClick={(event) => {
                          // handlePersonalEditClick(e);
                          event.stopPropagation(); // Prevent accordion from toggling
                          // setAddressInfoAccordion(false); // Close the accordion
                          toggleAccordion("addressInfo");
                        }}
                      >
                        <AddOutlinedIcon
                          fontSize="inherit"
                          style={{
                            color: "#fff",
                          }}
                        />
                      </IconButton>
                    )
                  }
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <div className="text-14 fw-600">Address Information</div>
                </AccordionSummary>
                <AccordionDetails
                  style={{
                    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                  }}
                >
                  <div className="row y-gap-30 py-20">
                    {addressQuestions.map((question, index) => (
                      <CheckboxCard
                        key={index}
                        fieldName={question.fieldName}
                        fieldPlaceholder={question.fieldPlaceholder}
                        fieldType={question.fieldType}
                        isMandatory={question.Is_Mandatory}
                        onToggleMandatory={() => toggleAddressMandatory(index)} // Pass toggle function
                      />
                    ))}
                    <div className="col-12 d-flex justify-start">
                      <div className="row">
                        <div className="col-auto relative">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              // setAddressInfoAccordion(false);
                              toggleAccordion("addressInfo");
                            }}
                            className="button bg-white w-150 h-40 rounded-24 px-15 text-primary border-primary fw-400 text-12"
                          >
                            Cancel
                          </button>
                        </div>
                        <div className="col-auto relative">
                          <button
                            disabled={submitAddressForm}
                            onClick={handlePersonalInfoSave}
                            className="button bg-primary w-150 h-40 rounded-24 px-15 text-white border-light fw-400 text-12 d-flex gap-25 load-button"
                          >
                            {!submitAddressForm ? (
                              `Save`
                            ) : (
                              <span className="btn-spinner"></span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>

              <Accordion
                className="event-category-accordion"
                sx={{
                  borderRadius: 0, // Remove border radius
                  "&:before": {
                    display: "none", // Remove default MUI border line
                  },
                  boxShadow: "none", // Remove default box shadow
                }}
                expanded={isOtherInfoAccordion}
                onChange={() =>
                  // setOtherInfoAccordion(!isOtherInfoAccordion)
                  toggleAccordion("otherInfo")
                }
              >
                <AccordionSummary
                  style={{
                    backgroundColor: "#FFF3C7", // Set the background color
                  }}
                  sx={{
                    pointerEvents: "none",
                  }}
                  expandIcon={
                    isOtherInfoAccordion ? (
                      <IconButton
                        size="small"
                        style={{
                          backgroundColor: "#949494",
                          padding: "4px",
                          borderRadius: 0,
                          pointerEvents: "auto",
                          "&:hover": {
                            backgroundColor: "#f05736",
                          },
                        }}
                        onClick={handleCancelClick}
                      >
                        <ClearOutlinedIcon
                          fontSize="inherit"
                          style={{
                            color: "#fff",
                          }}
                        />
                      </IconButton>
                    ) : (
                      <IconButton
                        size="small"
                        sx={{
                          backgroundColor: "#949494",
                          padding: "4px",
                          borderRadius: 0,
                          pointerEvents: "auto",
                          "&:hover": {
                            backgroundColor: "#f05736",
                          },
                        }}
                        onClick={(e) => {
                          handleEditClick(e);
                        }}
                      >
                        {loadingQuestionForm ? (
                          <CircularProgress
                            style={{
                              color: "#fff",
                              height: "1em",
                              width: "1em",
                            }}
                          />
                        ) : (
                          <AddOutlinedIcon
                            fontSize="inherit"
                            style={{
                              color: "#fff",
                            }}
                          />
                        )}
                      </IconButton>
                    )
                  }
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <div className="text-14 fw-600">Other Information</div>
                </AccordionSummary>
                <AccordionDetails
                  style={{
                    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                  }}
                >
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={infoQuestions?.map((q) =>
                        isNaN(Number(q.Question_Id))
                          ? q.Question_Id
                          : q.Event_Question_Id
                      )}
                    >
                      <div className="row y-gap-15 px-20 py-20">
                        {infoQuestions?.map((question, index) => {
                          return (
                            <DraggableQuestion
                              qkey={question.Question_Id}
                              question={question}
                              index={index}
                              toggleChecked={toggleChecked}
                              fetchEditQuestion={fetchEditQuestion}
                              setIsEditingQuestion={setIsEditingQuestion}
                              handleDeleteClick={handleDeleteClick}
                            />
                          );
                        })}
                      </div>
                    </SortableContext>
                  </DndContext>

                  <div className="mb-40 w-full d-flex justify-center">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setAddQuestionModal(true);
                      }}
                      className="button w-200 border-dark-1 fw-400 rounded-22 px-20 py-10 text-dark-1 text-14 -primary-1 d-flex justify-center gap-10"
                    >
                      <i className="fas fa-plus" /> Add Question
                    </button>
                  </div>

                  <div className="col-12 d-flex justify-start">
                    <div className="row">
                      <div className="col-auto relative">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            // setOtherInfoAccordion(false);
                            toggleAccordion("otherInfo");
                          }}
                          className="button bg-white w-150 h-40 rounded-24 px-15 text-primary border-primary fw-400 text-12"
                        >
                          Cancel
                        </button>
                      </div>
                      <div className="col-auto relative">
                        <button
                          disabled={submitQuestionForm}
                          onClick={handleOtherInfoSaveClick}
                          className="button bg-primary w-150 h-40 rounded-24 px-15 text-white border-light fw-400 text-12 d-flex gap-25 load-button"
                        >
                          {!submitQuestionForm ? (
                            `Save Order`
                          ) : (
                            <span className="btn-spinner"></span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
            </Stack>
          </div>

          {/* <div className="col-12">
          <div className="y-gap-10">
            <label className="text-14 fw-500">
              Would you like to make this a public event or a private event?
            </label>
            <div className="d-flex items-center gap-15">
              <div className="d-flex items-center gap-5">
                <Checkbox />
                <label className="text-15 text-reading fw-500">Public</label>
              </div>
              <div className="d-flex items-center gap-5">
                <Checkbox />
                <label className="text-15 text-reading fw-500">Private</label>
              </div>
            </div>
          </div>
        </div> */}
        </div>
      )}
    </div>
  );
}

export default EventParticipant;
