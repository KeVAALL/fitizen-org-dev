// React imports
import React, { createRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Third-party imports
import * as Yup from "yup";
import { ErrorMessage, Form, Formik } from "formik";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Modal } from "@mui/material";
import toast from "react-hot-toast";

// Project-specific imports
import { RestfulApiService } from "../../../config/service";
import { decryptData } from "../../../utils/DataEncryption";
import Loader from "../../../utils/BackdropLoader";
import { MEDIA_URL } from "../../../config/url";
import Swal from "sweetalert2";
import { removeCurrentEventId } from "../../../redux/slices/addEventSlice";

function AddEventBanner({ handleStep, prevIndex }) {
  const user = useSelector((state) => state.user.userProfile);
  const newEventId = useSelector((state) => state.newEvent.currentEventId);
  const [loadingBanner, setLoadingBanner] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [openCropper, setOpenCropper] = useState(false);
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [submitForm, setSubmitForm] = useState(false);
  const [initialValues, setInitialValues] = useState({
    Image_Path: "",
    Image_Name: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cropperRef = createRef();

  const handleCreate = () => {
    Swal.fire({
      title: "Are you sure you want to publish event?",
      // text: "You won't be able to revert this!",
      icon: "success",
      showCancelButton: true,
      confirmButtonColor: "#eb6400",
      // cancelButtonColor: "#fff",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      preConfirm: async () => {
        // Show loading on the "Yes, delete it!" button
        Swal.showLoading();

        navigate("/dashboard/all-events");
        dispatch(removeCurrentEventId());
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Show the success message after the deletion is confirmed
        Swal.fire({
          title: "Event Created!",
          text: "Event has been created.",
          icon: "success",
        });
      }
    });
  };
  const handleFileChange = async (event) => {
    const file = event.currentTarget.files[0];

    // Check if the file is an image
    if (file && !file.type.startsWith("image/")) {
      toast.error("Please upload an image.");
      event.target.value = ""; // Reset the input value
      return;
    }
    // Check if the file size is above 2MB (2 * 1024 * 1024 bytes)
    const maxSize = 2 * 1024 * 1024;
    if (file && file.size > maxSize) {
      toast.error("File size should not exceed 2MB.");
      event.target.value = ""; // Reset the input value
      return;
    }

    if (file instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageName(file.name);
        setImage(reader.result);
        setOpenCropper(true); // Open the modal
      };
      reader.readAsDataURL(file);
    } else {
      return;
    }
  };
  const zoomIn = () => {
    if (cropperRef.current) {
      cropperRef.current.cropper.zoom(0.1); // Zoom in by 0.1
    }
  };
  const zoomOut = () => {
    if (cropperRef.current) {
      cropperRef.current.cropper.zoom(-0.1); // Zoom out by 0.1
    }
  };
  const getCropData = async (setFieldValue, setUploadingImage) => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      const croppedImage = cropperRef.current?.cropper
        .getCroppedCanvas()
        .toDataURL();

      // Convert base64 to file
      const blob = await (await fetch(croppedImage)).blob();
      const croppedFile = new File([blob], imageName, {
        type: "image/png",
      });

      const reqdata = new FormData();
      reqdata.append("ModuleName", "EventBanner");
      reqdata.append("File", croppedFile);

      // Start uploading
      setUploadingImage(true);

      try {
        await toast.promise(
          RestfulApiService(reqdata, "master/uploadfile"),
          {
            loading: "Uploading Image...",
            success: (result) => {
              if (result) {
                console.log(result);
                setFieldValue("Image_Path", result?.data?.Description);
                setFieldValue("Image_Name", result?.data?.Result);
                const formValues = {
                  Image_Path: result?.data?.Description,
                  Image_Name: result?.data?.Result,
                };
                submitBannerForm(formValues);
              }
              return "Image uploaded successfully!";
            },
            error: (err) => {
              const errorMessage =
                err?.Result?.Table1[0]?.Result_Description || "Upload failed";
              return errorMessage;
            },
          },
          {
            success: {
              duration: 5000,
            },
          }
        );
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        // End uploading
        setUploadingImage(false);
        setOpenCropper(false); // Close the modal
      }
    }
  };
  const submitBannerForm = async (values) => {
    const reqdata = {
      Method_Name: "Create",
      Event_Id: newEventId,
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
      Org_Id: user?.Org_Id,
      EventAssetType_Id: "Banner",
      Image_Path: values.Image_Path,
      Image_Name: values.Image_Name,
    };

    try {
      setSubmitForm(true);

      const result = await RestfulApiService(reqdata, "organizer/eventassets");

      if (result?.data?.Result?.Table1[0]?.Result_Id === -1) {
        toast.error(result?.data?.Result?.Table1[0]?.Result_Description);
        return;
      }

      if (result) {
        toast.success(result?.data?.Result?.Table1[0]?.Result_Description);
      }
    } catch (err) {
      toast.error(err?.Result?.Table1[0]?.Result_Description);
    } finally {
      setSubmitForm(false);
    }
  };
  async function LoadBanners() {
    const reqdata = {
      Method_Name: "Assets",
      Event_Id: newEventId,
      Session_User_Id: user?.User_Id,
      Session_User_Name: user?.User_Display_Name,
      Session_Organzier_Id: user?.Organizer_Id,
      Org_Id: user?.Org_Id,
      Event_Name: "",
      Event_Period: "",
      EventType_Id: "",
    };
    try {
      setLoadingBanner(true);
      const result = await RestfulApiService(reqdata, "organizer/GetEvent");
      if (result) {
        const result1 = result?.data?.Result?.Table1[0];
        console.log(result1);

        setInitialValues({
          Image_Path: result1.Image_Path,
          Image_Name: result1.Image_Name,
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingBanner(false);
    }
  }
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling
    });
    if (newEventId) {
      LoadBanners();
    }
  }, [newEventId]);

  return (
    <div
      className="py-30 px-30 border-light rounded-8"
      style={{ boxShadow: "2px 2px 7.5px 0px #0000000D" }}
    >
      {loadingBanner ? (
        <Loader fetching={loadingBanner} />
      ) : (
        <div className="row y-gap-30">
          <div className="col-12 d-flex">
            <div className="text-18 text-reading fw-600">
              Upload Banner Image
            </div>
          </div>

          <Formik
            enableReinitialize
            initialValues={initialValues} // Set initial values
            validationSchema={Yup.object().shape({
              Image_Path: Yup.string().required("Image path is required."),
              Image_Name: Yup.string().required("Please upload event banner."),
            })}
            onSubmit={(values) => {
              // Handle form submission
              console.log(values);
              submitBannerForm(values);
            }}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <div className="row y-gap-30">
                  <Modal open={openCropper} onClose={() => {}}>
                    <div
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "20%",
                        width: "650px",
                        maxWidth: "100%",
                        height: "auto",
                        transform: "translateX(-50%)",
                        padding: "20px",
                        backgroundColor: "white",
                      }}
                    >
                      <div className="d-flex flex-column items-end mb-10">
                        <button
                          className="pointer"
                          onClick={() => {
                            setOpenCropper(false);
                          }}
                        >
                          <i className="far fa-times-circle text-primary text-25"></i>
                        </button>
                      </div>
                      <div
                        style={{
                          position: "relative",
                          height: "300px",
                        }}
                      >
                        <Cropper
                          style={{
                            maxWidth: "100%",
                            height: "300px", // Set a fixed height for the cropper
                            objectFit: "contain", // Ensures the image fits within the cropper
                          }}
                          ref={cropperRef}
                          zoomTo={0.5}
                          initialAspectRatio={16 / 9} // Set the initial aspect ratio to 16:9
                          aspectRatio={16 / 9} // Maintain a landscape aspect ratio of 16:9
                          minCropBoxWidth={400} // Set to a reasonable width for landscape images
                          minCropBoxHeight={200} // Set to a reasonable height
                          preview=".img-preview"
                          src={image}
                          viewMode={1}
                          background={false}
                          responsive={true}
                          autoCropArea={1}
                          checkOrientation={false}
                          guides={true}
                        />

                        {/* Zoom buttons positioned at the top right corner */}
                        <div
                          style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                          }}
                        >
                          <div className="d-flex gap-10">
                            <button
                              onClick={zoomIn}
                              className="button h-30 w-30 px-5 text-black bg-white -grey-1 rounded-8"
                            >
                              <i className="fas fa-search-plus text-primary text-14"></i>
                            </button>
                            <button
                              onClick={zoomOut}
                              className="button h-30 w-30 px-5 text-black bg-white -grey-1 rounded-8"
                            >
                              <i className="fas fa-search-minus text-primary text-14"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex flex-column items-end mb-10">
                        <button
                          disabled={uploadingImage}
                          onClick={async (e) => {
                            getCropData(setFieldValue, setUploadingImage);
                          }}
                          type="submit"
                          className="button h-40 px-30 text-white bg-primary -grey-1 rounded-16 load-button relative w-200 mt-20"
                        >
                          {!uploadingImage && "Crop & Upload"}
                          {uploadingImage && (
                            <span className="btn-spinner"></span>
                          )}
                        </button>
                      </div>
                    </div>
                  </Modal>

                  <div className="col-12">
                    <div
                      className={`banner-parent w-full${
                        values.Image_Name ? " p-0" : ""
                      }`}
                    >
                      {values.Image_Name ? (
                        <div className="d-flex flex-column gap-10">
                          <img
                            className="w-full"
                            style={{ borderRadius: "25px", height: "450px" }}
                            src={`${MEDIA_URL}/${values.Image_Path}`}
                            alt="banner"
                          />
                        </div>
                      ) : (
                        <div className="file-upload-banner">
                          <p className="text-14 text-reading fw-600">
                            Desktop Cover Image : (Size 1920X1080)
                          </p>
                          <i className="fas fa-upload text-80 text-primary mt-30"></i>
                          <p className="text-16 text-reading fw-600 mt-20">
                            Click box to upload
                          </p>
                          <p className="text-14 text-reading fw-500">
                            JPEG or PNGS smaller than 2mb
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {values.Image_Name && (
                    <div className="col-12">
                      <div className="parent">
                        <div className="file-upload-ticket">
                          <i className="fas fa-upload text-20 text-primary"></i>

                          <p className="text-reading mt-0">Upload New Banner</p>
                          <input
                            type="file"
                            accept="image/*"
                            // disabled={uploadingRoute}
                            onChange={handleFileChange}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="col-md-4">
                    <div className="single-field y-gap-20">
                      <label className="text-13 fw-600">Event Banner</label>
                      <div className="form-control">
                        <input
                          disabled
                          type="text"
                          className="form-control"
                          value={values.Image_Name}
                          placeholder="Event Banner"
                          name="Image_Name"
                        />
                      </div>
                      <ErrorMessage
                        name="Image_Name"
                        component="div"
                        className="text-error-2 text-13"
                      />
                    </div>
                  </div>

                  <div className="col-md-8"></div>

                  <div className="col-12 d-flex justify-end">
                    <div className="row">
                      <div className="col-auto relative">
                        <button
                          type="button"
                          onClick={() => {
                            handleStep(prevIndex);
                          }}
                          className="button bg-white w-150 h-40 rounded-24 px-15 text-primary text-12 border-primary load-button"
                        >
                          Back
                        </button>
                      </div>
                      <div className="col-auto relative">
                        <button
                          // disabled={submitForm}
                          // type="submit"
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleCreate();
                          }}
                          className="button bg-primary w-150 h-40 rounded-24 px-15 text-white text-12 border-light load-button"
                        >
                          {!submitForm ? (
                            `Publish Now`
                          ) : (
                            <span className="btn-spinner"></span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
}

export default AddEventBanner;
