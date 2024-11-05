import { useCallback, useContext, useEffect, useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  StepIconProps,
  Typography,
  Stack,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import AddEventDetails from "./AddEventDetails";
import AddEventDescription from "./AddEventDescription";
import AddEventTicket from "./AddEventTicket";
import AddEventParticipant from "./AddEventParticipant";
import AddEventBanner from "./AddEventBanner";
import {
  useNavigate,
  UNSAFE_NavigationContext as NavigationContext,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeCurrentEventId } from "../../../redux/slices/addEventSlice";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const steps = [
  "Event Details",
  "Event Description",
  "Event Ticket",
  "Participant Form",
  "Banner Image",
];

const StepIconComponent = (props) => {
  const { active, completed, className } = props;
  return (
    <div
      className={className}
      style={{
        color: completed ? "#FFF" : "#000",
        backgroundColor: completed ? "#eb6400" : active ? "#eb6400" : "#ccc",
        borderRadius: "50%",
        width: 40,
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* {completed ? <CheckIcon style={{ color: "#FFF", fontSize: 20 }} /> : ""} */}
      <CheckIcon style={{ color: "#FFF", fontSize: 20 }} />
    </div>
  );
};

export default function AddEventMain() {
  const [activeStep, setActiveStep] = useState(0);
  const dispatch = useDispatch();

  const handleStep = (step) => {
    console.log(step);
    setActiveStep(step);
  };

  // const clearLocalStorageItems = () => {
  //   console.log("clearing");

  //   dispatch(removeCurrentEventId());
  // };

  // // Show confirmation dialog for beforeunload (refresh or tab close)
  // const handleBeforeUnload = async (event) => {
  //   event.preventDefault();
  //   console.log("yes ");

  //   // event.returnValue =
  //   //   "Are you sure you want to leave? Your changes won't be saved.";
  //   const confirmation = window.confirm(
  //     "Are you sure you want to leave this page? Your changes won't be saved."
  //   );
  //   if (confirmation) {
  //     console.log("yes confirm");
  //     clearLocalStorageItems();
  //   }
  // };

  // useEffect(() => {
  //   // Add beforeunload event listener
  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     // Cleanup beforeunload event listener
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);

  return (
    <>
      <div className="dashboard__main">
        <div className="dashboard__content pt-20">
          <section className="layout-pb-md">
            <div className="container">
              <div className="row y-gap-30">
                <div className="col-xl-12 col-md-12">
                  <div
                    className="py-20 px-20 border-light rounded-8"
                    style={{ boxShadow: " 2px 2px 13px 0px #00000021" }}
                  >
                    <Stepper
                      activeStep={activeStep}
                      sx={{
                        "& .MuiStepLabel-label": {
                          color: "#000", // Label color
                          fontWeight: 500,
                          fontSize: "12px",
                          fontFamily: "Montserrat, sans-serif",
                          textTransform: "capitalize",
                        },
                        "& .MuiStepConnector-line": {
                          borderColor: "#eb6400", // Connector line color
                        },
                      }}
                    >
                      {steps.map((label, index) => (
                        <Step
                          key={label}
                          onClick={() => {
                            console.log(index);
                            // handleStep(index);
                          }}
                        >
                          <StepLabel
                            StepIconComponent={StepIconComponent}
                            sx={{
                              "& .MuiStepLabel-labelContainer": {
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "start",
                                gap: "8px",
                                paddingRight: "16px",
                              },
                            }}
                          >
                            <Stack direction="column" alignItems="flex-start">
                              <Typography
                                variant="caption"
                                sx={{
                                  color:
                                    activeStep === index || activeStep > index
                                      ? "#eb6400"
                                      : "#949494",
                                  fontFamily: "Montserrat, sans-serif",
                                  fontSize: "12px",
                                  fontWeight: 500,
                                }}
                              >
                                Step {index + 1}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color:
                                    activeStep === index || activeStep > index
                                      ? "#000"
                                      : "#949494",
                                  //   fontWeight: activeStep === index ? 600 : 500,
                                  fontFamily: "Montserrat, sans-serif",
                                  fontSize: "11px",
                                  fontWeight: 500,
                                }}
                              >
                                {label}
                              </Typography>
                            </Stack>
                          </StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </div>
                </div>
                {activeStep === 0 && (
                  <div className="col-xl-12 col-md-12">
                    <AddEventDetails handleStep={handleStep} index={1} />
                  </div>
                )}
                {activeStep === 1 && (
                  <div className="col-xl-12 col-md-12">
                    <AddEventDescription
                      handleStep={handleStep}
                      prevIndex={0}
                      nextIndex={2}
                    />
                  </div>
                )}
                {activeStep === 2 && (
                  <div className="col-xl-12 col-md-12">
                    <AddEventTicket
                      handleStep={handleStep}
                      prevIndex={1}
                      nextIndex={3}
                    />
                  </div>
                )}
                {activeStep === 3 && (
                  <div className="col-xl-12 col-md-12">
                    <AddEventParticipant
                      handleStep={handleStep}
                      prevIndex={2}
                      nextIndex={4}
                    />
                  </div>
                )}
                {activeStep === 4 && (
                  <div className="col-xl-12 col-md-12">
                    <AddEventBanner handleStep={handleStep} prevIndex={3} />
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
