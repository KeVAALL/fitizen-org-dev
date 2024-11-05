// React imports
import React, { useState } from "react";

// Third-party imports
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

// MUI imports
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";

// Icons imports
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

// Project imports
import { RestfulApiService } from "../../../config/service";
import { decryptData } from "../../../utils/DataEncryption";

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
import CheckboxCard from "../../../utils/CheckboxCard";

const DraggableQuestion = ({ qkey, question, index, toggleChecked }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: question.Question_Id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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
        <div className="col-1 d-flex">
          <Checkbox
            checked={question.checked}
            onChange={(e) => {
              e.stopPropagation();
              console.log(question.Question_Id);
              toggleChecked(question.Question_Id);
            }}
          />
        </div>
        <div className="col-3 drag-handle" {...listeners}>
          <div class="y-gap-5">
            <label class="text-13 fw-500">
              {question?.Question} <sup className="asc">*</sup>
            </label>
            <div class="d-flex gap-20">
              <label class="text-error-2 text-13">Mandatory Field</label>
              <div className="form-switch d-flex">
                <div className="switch">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      console.log(e);
                    }}
                  />
                  <span className="switch__slider"></span>
                </div>
              </div>
            </div>
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
      </div>
    </div>
  );
};

function AddEventParticipant({ handleStep, prevIndex, nextIndex }) {
  const newEventId = useSelector((state) => state.newEvent.currentEventId);
  const user = useSelector((state) => state.user.userProfile);
  const [isOtherInfoAccordion, setOtherInfoAccordion] = useState(false);
  const [loadingQuestionForm, setLoadingQuestionForm] = useState(false);
  const [infoQuestions, setInfoQuestions] = useState([]);
  const [submitQuestionForm, setSubmitQuestionForm] = useState(false);

  const handleCancelClick = (event) => {
    event.stopPropagation(); // Prevent accordion from toggling
    setOtherInfoAccordion(false); // Close the accordion
  };
  const handleEditClick = async (event, eventCategoryId) => {
    event.stopPropagation(); // Prevent accordion from toggling

    const reqdata = {
      Method_Name: "Question",
      Event_Id: newEventId,
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

        setOtherInfoAccordion(true);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingQuestionForm(false);
    }
  };
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = infoQuestions.findIndex(
        (item) => item.Question_Id === active.id
      );
      const newIndex = infoQuestions.findIndex(
        (item) => item.Question_Id === over.id
      );

      const updatedQuestions = arrayMove(infoQuestions, oldIndex, newIndex);

      // Update Display_Order_No based on new order
      updatedQuestions.forEach((question, index) => {
        question.Display_Order_No = index + 1;
      });

      setInfoQuestions(updatedQuestions); // Pass the updated order back to the parent component
    }
  };
  const toggleChecked = (id) => {
    const updatedQuestions = infoQuestions.map((q) =>
      q.Question_Id === id ? { ...q, checked: !q.checked } : q
    );
    setInfoQuestions(updatedQuestions);
  };
  const generateQuestionXMLData = (infoQuestions) => {
    let QuestionXMLData = "";

    infoQuestions.forEach((question) => {
      if (question.checked) {
        QuestionXMLData += "<R>";
        QuestionXMLData += `<QID>${question.Question_Id}</QID>`;
        QuestionXMLData += `<EQID></EQID>`; // Assuming you want to keep this empty
        QuestionXMLData += `<ON>${question.Display_Order_No}</ON>`;
        QuestionXMLData += `<DOC>${question.Doc_Path}</DOC>`; // Update as needed
        QuestionXMLData += "</R>";
      }
    });

    QuestionXMLData = `<D>${QuestionXMLData}</D>`;
    return QuestionXMLData; // You can return or log this
  };
  const handleSaveClick = async (e) => {
    e.preventDefault();

    const isAnyChecked = infoQuestions.some((question) => question.checked);

    if (!isAnyChecked) {
      // Display error toast if no checkbox is checked
      toast.error("Please select at least one field");
      return;
    }

    const reqdata = {
      Method_Name: "Question",
      Event_Id: newEventId,
      Event_Name: "",
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
      Org_Id: user?.Org_Id,
      XMLData: "",
      TakeAwayXMLData: "",
      FacilityXMLData: "",
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
        // toast.success(result?.data?.Result?.Table1[0]?.Result_Description);
        toast.success("Saved");
      }
    } catch (err) {
      toast.error(err?.Result?.Table1[0]?.Result_Description);
    } finally {
      setSubmitQuestionForm(false);
    }
  };

  return (
    <div
      className="py-30 px-30 border-light rounded-8"
      style={{ boxShadow: "2px 2px 7.5px 0px #0000000D" }}
    >
      <div className="row y-gap-30 py-20">
        {/* <div className="col-12 d-flex justify-center">
          <button
            onClick={(e) => {
              e.preventDefault();
            }}
            className="button w-250 rounded-24 py-10 px-15 text-reading border-light -primary-1 fw-400 text-16 d-flex gap-10"
          >
            <i className="far fa-edit text-16"></i>
            Edit Participant Form
          </button>
        </div> */}
        <div className="col-12">
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
            >
              <AccordionSummary
                style={{
                  backgroundColor: "#FFF3C7", // Set the background color
                }}
                sx={{
                  pointerEvents: "none",
                }}
                expandIcon={
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
                  >
                    <AddOutlinedIcon
                      fontSize="inherit"
                      style={{
                        color: "#fff",
                      }}
                    />
                  </IconButton>
                }
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <div className="text-14 fw-600">
                  Personal Information <sup className="asc">*</sup>
                </div>
              </AccordionSummary>
              <AccordionDetails
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                }}
              >
                <div className="row y-gap-30 py-20">
                  <CheckboxCard
                    fieldName="Participant Name"
                    fieldPlaceholder="Add Name"
                    fieldType="text"
                  />
                  <CheckboxCard
                    fieldName="Email ID"
                    fieldPlaceholder="Add Email ID"
                    fieldType="text"
                  />
                  <CheckboxCard
                    fieldName="Phone Number"
                    fieldPlaceholder="9893399393"
                    fieldType="text"
                  />
                  <CheckboxCard
                    fieldName="Date of Birth"
                    fieldPlaceholder="Date of Birth"
                    fieldType="text"
                  />
                  <CheckboxCard
                    fieldName="Gender"
                    fieldPlaceholder="Gender"
                    fieldType="select"
                  />
                  <CheckboxCard
                    fieldName="Blood Group"
                    fieldPlaceholder="Add Blood Group"
                    fieldType="select"
                  />
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
            >
              <AccordionSummary
                style={{
                  backgroundColor: "#FFF3C7", // Set the background color
                }}
                sx={{
                  pointerEvents: "none",
                }}
                expandIcon={
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
                  >
                    <AddOutlinedIcon
                      fontSize="inherit"
                      style={{
                        color: "#fff",
                      }}
                    />
                  </IconButton>
                }
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <div className="text-14 fw-600">
                  Address Information <sup className="asc">*</sup>
                </div>
              </AccordionSummary>
              <AccordionDetails
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                }}
              >
                <div className="row y-gap-30 py-20">
                  <CheckboxCard
                    fieldName="Pincode"
                    fieldPlaceholder="Add Pincode"
                    fieldType="text"
                  />
                  <CheckboxCard
                    fieldName="Country"
                    fieldPlaceholder="Country"
                    fieldType="select"
                  />
                  <CheckboxCard
                    fieldName="Address"
                    fieldPlaceholder="Add Address"
                    fieldType="text"
                  />
                  <CheckboxCard
                    fieldName="State"
                    fieldPlaceholder="State"
                    fieldType="select"
                  />
                  <CheckboxCard
                    fieldName="City"
                    fieldPlaceholder="City"
                    fieldType="select"
                  />
                  <CheckboxCard
                    fieldName="Street"
                    fieldPlaceholder="Add Street"
                    fieldType="text"
                  />
                  <CheckboxCard
                    fieldName="Landmark"
                    fieldPlaceholder="Add Landmark"
                    fieldType="text"
                  />
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
              onChange={() => setOtherInfoAccordion(!isOtherInfoAccordion)}
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
                          style={{ color: "#fff", height: "1em", width: "1em" }}
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
                <div className="text-14 fw-600">
                  Other Information <sup className="asc">*</sup>
                </div>
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
                    items={infoQuestions.map((q) => q.Question_Id)}
                  >
                    <div className="row y-gap-15 px-20 py-20">
                      {infoQuestions?.map((question, index) => {
                        return (
                          <DraggableQuestion
                            qkey={question.Question_Id}
                            question={question}
                            index={index}
                            toggleChecked={toggleChecked}
                          />
                        );
                      })}
                    </div>
                  </SortableContext>
                </DndContext>

                <div className="col-12 d-flex justify-end">
                  <div className="row">
                    <div className="col-auto relative">
                      <button
                        disabled={submitQuestionForm}
                        onClick={handleSaveClick}
                        className="button bg-primary w-150 h-40 rounded-24 px-15 text-white text-12 border-light load-button"
                      >
                        {!submitQuestionForm ? (
                          `Save`
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

        <div className="col-12">
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
        </div>

        <div className="col-12 d-flex justify-end">
          <div className="row">
            <div className="col-auto relative">
              <button
                type="button"
                onClick={() => {
                  handleStep(prevIndex);
                }}
                className="button bg-white w-150 h-40 rounded-24 px-15 text-primary border-primary fw-400 text-12 d-flex gap-25 load-button"
              >
                Back
              </button>
            </div>
            <div className="col-auto relative">
              <button
                onClick={() => {
                  handleStep(nextIndex);
                }}
                type="submit"
                className="button bg-primary w-150 h-40 rounded-24 px-15 text-white border-light fw-400 text-12 d-flex gap-25 load-button"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddEventParticipant;
