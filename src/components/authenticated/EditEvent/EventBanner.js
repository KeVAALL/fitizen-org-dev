import React from "react";

function EventBanner() {
  return (
    <div
      className="py-30 px-30 border-light rounded-8"
      style={{ boxShadow: "2px 2px 7.5px 0px #0000000D" }}
    >
      <div className="row y-gap-30 py-20">
        <div className="col-12 d-flex">
          <div className="text-18 text-reading fw-600">Upload Banner Image</div>
        </div>

        <div className="col-7">
          <div className="banner-parent w-full">
            <div className="file-upload-banner">
              <p className="text-14 text-reading fw-600">
                Desktop Cover Image : (Size 1920X1080)
              </p>
              <i className="fas fa-upload text-80 text-primary mt-30"></i>
              <p className="text-16 text-reading fw-600 mt-20">
                Click box to upload
              </p>
              <p className="text-14 text-reading fw-500">
                JPEG or PNGS smaller than 10mb
              </p>
              <input type="file" />
            </div>
          </div>
        </div>

        <div className="col-5">
          <div className="banner-parent w-full">
            <div className="file-upload-banner">
              <p className="text-14 text-reading fw-600">
                Thumbnail Image : (Size 1920X1080)
              </p>
              <i className="fas fa-upload text-80 text-primary mt-30"></i>
              <p className="text-16 text-reading fw-600 mt-20">
                Click box to upload
              </p>
              <p className="text-14 text-reading fw-500">
                JPEG or PNGS smaller than 10mb
              </p>
              <input type="file" />
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="single-field y-gap-20">
            <label className="text-13 fw-600">
              Upload Event Category Routes
            </label>
            <div class="form-control">
              <input
                type="text"
                class="form-control"
                value="5k Marathon"
                // placeholder="Winner"
                name="discountname"
              />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="y-gap-20">
            <label className="text-13 text-white fw-600 p-0">
              Upload Event Category Routes
            </label>
            {/* <div className="d-flex"> */}
            <div className="parent">
              <div className="file-upload-ticket">
                <i className="fas fa-upload text-20 text-primary"></i>

                <p className="text-reading mt-0">jpg, png, gif</p>
                <input type="file" />
              </div>
            </div>
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventBanner;
