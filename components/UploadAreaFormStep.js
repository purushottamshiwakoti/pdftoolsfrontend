import { useTranslation } from "next-i18next";
import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import { handlePreventDefault, notify } from "../helpers/utils";
import styles from "../styles/UploadContainer.module.css";
import Spinner from "./Spinner";
import { UploadFileImage, UploadImage } from "./icons/Icon";
import { Button } from "./ui/button";
const UploadAreaFormStep = React.memo(function UploadAreaFormStep({
  handleChange,
  isSpinnerActive,
  isMultipleInput,
  acceptedMimeType,
}) {
  const { t } = useTranslation();
  const formRef = useRef();
  const dropZone = useRef();
  const file = useRef();

  useEffect(() => {
    //save refs to remove events in clean up function
    const fileRef = file.current;
    const dropZoneRef = dropZone.current;
    const formRefCurrent = formRef.current;

    //cleanup function
    return () => {
      //removing event listeners
      fileRef?.removeEventListener("change", handleChange, false);
      dropZoneRef?.removeEventListener("drop", handleChange, false);
      dropZoneRef?.removeEventListener("dragover", handlePreventDefault, false);
      dropZoneRef?.removeEventListener(
        "dragenter",
        handlePreventDefault,
        false
      );
      formRefCurrent?.removeEventListener(
        "submit",
        handlePreventDefault,
        false
      );
    };
  }, []);

  const handleButtonClick = () => {
    file.current.click();
  };

  return (
    <section className={`${styles.toolbox} py-0 mt-0 ${styles.is_upload}`}>
      <form onSubmit={handlePreventDefault} ref={formRef}>
        <div
          id="drop-area"
          ref={dropZone}
          className={`${styles.toolbox_wrapper} d-flex`}
          onDragOver={handlePreventDefault}
          onDragEnter={handlePreventDefault}
          onDrop={(event) => {
            if (
              isMultipleInput === false &&
              event.dataTransfer.files.length > 1
            ) {
              event.preventDefault();
              notify(
                "error",
                "You can only drop one file at a time! Please select one file and try again."
              );
            } else {
              handleChange(event);
            }
          }}
        >
          <div className={`${styles.uploader} w-100`}>
            <label className={`${styles.input_file_label}`} htmlFor="inputFile">
              <div className="d-flex flex-column align-items-center">
                <input
                  type="file"
                  className={`${styles.input_file}`}
                  accept={acceptedMimeType}
                  id="inputFile"
                  name="file"
                  ref={file}
                  hidden
                  multiple={isMultipleInput}
                  onChange={handleChange}
                />

                <div className={`${styles.uploader}`}>
                  <div className={`${styles.uploader_image}`}>
                    {/* <FileEarmarkPdfFill /> */}
                    {UploadImage}
                  </div>
                  <div className={` mt-3 mb-3`}>
                    <Button
                      className={`bg-[#EE1B22] hover:bg-[#EE1B22]/80`}
                      onClick={handleButtonClick}
                    >
                      {UploadFileImage}
                      <div
                        className={`${styles.upload_option_description}`}
                        // title={t("common:select_files")}
                        title={t("common:select_files")}
                      >
                        {/* {t("common:select_files")} */}
                        Choose Files
                      </div>
                    </Button>
                  </div>
                  <h2 className={`text-[#6F6767] text-[14px] font-[400]`}>
                    {/* {t("common:drop_files")} */}
                    or drop PDFs here
                  </h2>
                </div>
              </div>
            </label>
          </div>
          <Spinner isSpinnerActive={isSpinnerActive} />
        </div>
      </form>
    </section>
  );
});

export default UploadAreaFormStep;

UploadAreaFormStep.propTypes = {
  handleChange: PropTypes.func.isRequired,
  isSpinnerActive: PropTypes.bool.isRequired,
  isMultipleInput: PropTypes.bool.isRequired,
};
