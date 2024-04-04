import React, { useEffect, useRef } from "react";
import {
  Trash,
  ArrowClockwise,
  PlusLg,
  ArrowCounterclockwise,
} from "react-bootstrap-icons";
import { useTranslation } from "next-i18next";
import styles from "../styles/UploadContainer.module.css";
import PropTypes from "prop-types";
import Spinner from "./Spinner";
import ToolButton from "./ToolButton";
import { handlePreventDefault } from "../helpers/utils";
const EditFilesFormStep = React.memo(function EditFilesFormStep({
  acceptedMimeType,
  showTitle,
  enableAddingMoreFiles,
  files,
  filesComponents,
  handleChange,
  isSpinnerActive,
  isMultipleInput,
  isFilesSelectionActive,
  isPanelTopSticky,
  isPanelBottomSticky,
  positionPanelBottomItems,
  deleteFiles,
  rotateFilesToLeft,
  rotateFilesToRight,
  action,
  actionTitle,
}) {
  const { t } = useTranslation();
  const deleteBtn = useRef();
  const submitBtn = useRef();
  const rotateLeftBtn = useRef();
  const rotateRightBtn = useRef();
  const file = useRef();
  const dropZone = useRef();
  const formRef = useRef();

  useEffect(() => {
    //save refs to remove events in clean up function
    const fileRef = file.current;
    const dropZoneRef = dropZone.current;
    const deleteBtnCurrent = deleteBtn.current;
    const rotateLeftBtnCurrent = rotateLeftBtn.current;
    const rotateRightBtnCurrent = rotateRightBtn.current;
    const formRefCurrent = formRef.current;
    const submitBtnCurrent = submitBtn.current;

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
      deleteBtnCurrent?.removeEventListener("click", deleteFiles, false);
      rotateLeftBtnCurrent?.removeEventListener(
        "click",
        rotateFilesToLeft,
        false
      );
      rotateRightBtnCurrent?.removeEventListener(
        "click",
        rotateFilesToRight,
        false
      );

      formRefCurrent?.removeEventListener(
        "submit",
        handlePreventDefault,
        false
      );

      submitBtnCurrent?.removeEventListener("click", action, false);
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
            <div
              className={`${
                isPanelTopSticky ? styles.panel_sticky : styles.panel
              } ${styles.panel_top} `}
            >
              <div
                className={`${styles.panel_inner} justify-content-end justify-content-md-center justify-content-lg-end`}
              >
                {enableAddingMoreFiles && (
                  <div className={`${styles.panel_btn_left} mr-5`}>
                    <label
                      htmlFor="inputFile"
                      className={`${styles.btn_normal} bg-[#EE1B22] text-white hover:bg-[#EE1B22]/80 cursor-pointer`}
                      // title={t("common:select_files")}
                      title={"Choose Files"}
                    >
                      <PlusLg />
                    </label>
                  </div>
                )}
                {rotateFilesToLeft && (
                  <ToolButton
                    title={"Rotate Left"}
                    onClick={rotateFilesToLeft}
                    isActive={files.length > 0}
                    buttonStyle={styles.btn_normal}
                  >
                    <ArrowCounterclockwise />
                    <h2>
                      {/* {t("common:rotate_all")} */}
                      Rotate Left
                    </h2>
                  </ToolButton>
                )}
                {rotateFilesToRight && (
                  <ToolButton
                    title={"Rotate Right"}
                    // title={t("common:rotate_right")}
                    onClick={rotateFilesToRight}
                    isActive={files.length > 0}
                    buttonStyle={styles.btn_normal}
                  >
                    <ArrowClockwise />
                    {/* <span>{t("common:rotate_all")}</span> */}
                    <span>Rotate Right</span>
                  </ToolButton>
                )}
                {deleteFiles && (
                  <ToolButton
                    // title={t("common:delete_all")}
                    title={"Delete All"}
                    onClick={deleteFiles}
                    isActive={
                      isFilesSelectionActive
                        ? files.filter((file) => file.selected === true)
                            .length > 0
                        : true
                    }
                    buttonStyle={styles.btn_normal}
                  >
                    <Trash />
                    <span>
                      {/* {t("common:delete_all")} */}
                      Delete All
                    </span>
                  </ToolButton>
                )}

                {showTitle && (
                  <span className={`${styles.select_title}`}>{showTitle}</span>
                )}
              </div>
            </div>
            <div className={`${isPanelTopSticky ? styles.unset_margin : ""}`}>
              {filesComponents}
            </div>

            <div
              className={`${
                isPanelBottomSticky ? styles.panel_sticky : styles.panel
              } ${styles.panel_bottom} `}
            >
              <div
                className={`${styles.panel_inner} ${styles.upload_container}  ${positionPanelBottomItems}`}
              >
                {isFilesSelectionActive && (
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
                    {/* {t("common:selected")} */}
                    Selected
                  </div>
                )}

                <ToolButton
                  title={actionTitle}
                  onClick={action}
                  isActive={files.length > 0}
                  buttonStyle={styles.btn_normal}
                >
                  {actionTitle}
                </ToolButton>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
});

export default EditFilesFormStep;

EditFilesFormStep.propTypes = {
  files: PropTypes.array.isRequired,
  filesComponents: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  isSpinnerActive: PropTypes.bool.isRequired,
  isMultipleInput: PropTypes.bool.isRequired,
  isPanelTopSticky: PropTypes.bool.isRequired,
  isPanelBottomSticky: PropTypes.bool.isRequired,
  action: PropTypes.func.isRequired,
};
