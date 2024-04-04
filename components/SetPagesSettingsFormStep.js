import React, { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Trash, ArrowClockwise, PlusLg } from "react-bootstrap-icons";
import { useTranslation } from "next-i18next";
import styles from "../styles/UploadContainer.module.css";
import PropTypes from "prop-types";
import Spinner from "./Spinner";
import ToolButton from "./ToolButton";
import { handlePreventDefault, rtlLanguages } from "../helpers/utils.js";

const SetPagesSettingsFormStep = React.memo(function SetPagesSettingsFormStep({
  acceptedMimeType,
  files,
  enableAddingMoreFiles,
  filesComponents,
  handleChange,
  isSpinnerActive,
  isMultipleInput,
  deleteFiles,
  rotateFilesToRight,
  action,
  actionTitle,
  handleCheckboxChange,
  handleMarginChange,
  handleOrientationChange,
  handlePageSizeChange,
  mergePages,
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const direction = rtlLanguages.includes(router.locale) ? "rtl" : "ltr";
  const langStyle = {
    direction: direction,
  };
  const file = useRef();
  const dropZone = useRef();
  const formRef = useRef();
  const selectMargin = useRef();
  const selectPageSize = useRef();
  const selectOrientation = useRef();
  const isMergeActive = useRef();

  useEffect(() => {
    //save refs to remove events in clean up function
    const fileRef = file.current;
    const dropZoneRef = dropZone.current;
    const formRefCurrent = formRef.current;
    const selectMarginCurrent = selectMargin.current;
    const selectPageSizeCurrent = selectPageSize.current;
    const selectOrientationCurrent = selectOrientation.current;
    const isMergeActiveCurrent = isMergeActive.current;

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

      selectMarginCurrent?.removeEventListener(
        "change",
        handleMarginChange,
        false
      );
      selectPageSizeCurrent?.removeEventListener(
        "change",
        handlePageSizeChange,
        false
      );
      selectOrientationCurrent?.removeEventListener(
        "change",
        handleOrientationChange,
        false
      );

      isMergeActiveCurrent?.removeEventListener(
        "change",
        handleCheckboxChange,
        false
      );
    };
  }, []);
  return (
    <section className={`${styles.toolbox} py-0 mt-0 ${styles.is_process}`}>
      <form onSubmit={handlePreventDefault} ref={formRef}>
        <div
          ref={dropZone}
          className={`${styles.toolbox_wrapper} d-flex`}
          onDragOver={handlePreventDefault}
          onDragEnter={handlePreventDefault}
          onDrop={enableAddingMoreFiles ? handleChange : handlePreventDefault}
        >
          <input
            type="file"
            id="inputFile"
            className={`${styles.input_file}`}
            accept={acceptedMimeType}
            name="file"
            ref={file}
            multiple={isMultipleInput}
            hidden
            onChange={handleChange}
          />

          <Spinner isSpinnerActive={isSpinnerActive} />

          <div className={`${styles.previewer} w-100`}>
            <div className={` `}>
              <div
                className={`${styles.panel_inner} justify-content-end justify-content-md-center justify-content-lg-end`}
              >
                {enableAddingMoreFiles && (
                  <div className={`${styles.panel_btn_left} mr-5`}>
                    <label
                      htmlFor="inputFile"
                      className={`${styles.btn_normal} bg-[#EE1B22] text-white hover:bg-[#EE1B22]/80`}
                      title={"Choose Files"}
                    >
                      <PlusLg />
                    </label>
                  </div>
                )}
                {rotateFilesToRight && (
                  <ToolButton
                    title={"Rotate Right"}
                    onClick={rotateFilesToRight}
                    isActive={files.length > 0}
                    buttonStyle={styles.btn_normal}
                  >
                    <ArrowClockwise />
                    <span>{"Rotate All"}</span>
                  </ToolButton>
                )}
                {deleteFiles && (
                  <ToolButton
                    title={"Delete All"}
                    onClick={deleteFiles}
                    isActive={
                      files.filter((file) => file.selected === true).length > 0
                    }
                    buttonStyle={styles.btn_normal}
                  >
                    <Trash />
                    <h2>{"Delete All"}</h2>
                  </ToolButton>
                )}
              </div>
            </div>
            <div className={`${styles.unset_margin}`}>{filesComponents}</div>

            <div className={` `}>
              <div
                className={`${styles.panel_inner} ${styles.upload_container}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  className={`${styles.buttom_buttons_settings_wrapper} lg:gap-4`}
                  style={langStyle}
                >
                  <select
                    ref={selectPageSize}
                    name="page-size"
                    id="page-size"
                    defaultValue={"A4"}
                    onChange={handlePageSizeChange}
                  >
                    <option value="A4">{"A4"}</option>
                    <option value="Letter">{"Letter"}</option>
                    <option value="Fit">{"Fit to Content"}</option>
                  </select>

                  <select
                    ref={selectOrientation}
                    name="page-orientation"
                    id="page-orientation"
                    value={
                      selectPageSize.current?.value === "Fit"
                        ? "auto"
                        : selectOrientation.current?.value
                    }
                    defaultValue={"auto"}
                    onChange={handleOrientationChange}
                    disabled={selectPageSize.current?.value === "Fit"}
                  >
                    <option value="portrait">{"Portrait"}</option>
                    <option value="landscape">{"Landscape"}</option>
                    <option value="auto">{"Automatic"}</option>
                  </select>

                  <select
                    ref={selectMargin}
                    name="margin"
                    id="margin"
                    defaultValue={"no-margin"}
                    onChange={handleMarginChange}
                  >
                    <option value="no-margin">{"No Margin"}</option>
                    <option value="small-margin">
                      {t("common:small_margin")}
                    </option>
                    <option value="big-margin">{"Big Margin"}</option>
                  </select>

                  <div className={`checkbox ${styles.merge_pages}`}>
                    <input
                      ref={isMergeActive}
                      type="checkbox"
                      name="merge_pages"
                      id="merge_pages"
                      checked={mergePages}
                      onChange={handleCheckboxChange}
                    />

                    <label htmlFor="merge_pages" className="text-[#EE1B22]">
                      {"Merge all images in one PDF file"}
                    </label>
                  </div>
                </div>

                <div className={`${styles.buttom_buttons_download_wrapper}`}>
                  <div
                    style={{
                      textAlign: "center",
                      fontSize: "22px",
                      color: "#EE1B22",
                      padding: "10px 19px",
                    }}
                  >
                    <span>
                      {files.filter((file) => file.selected === true).length}
                    </span>{" "}
                    {"Selected"}
                  </div>

                  <ToolButton
                    title={actionTitle}
                    onClick={action}
                    isActive={files.length > 0}
                    buttonStyle={styles.action}
                  >
                    {actionTitle}
                  </ToolButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
});

export default SetPagesSettingsFormStep;

SetPagesSettingsFormStep.propTypes = {
  files: PropTypes.array.isRequired,
  filesComponents: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  isSpinnerActive: PropTypes.bool.isRequired,
  isMultipleInput: PropTypes.bool.isRequired,
  action: PropTypes.func.isRequired,
};
