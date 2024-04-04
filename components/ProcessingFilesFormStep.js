import React from "react";
import PropTypes from "prop-types";
import { GearWide } from "react-bootstrap-icons";
import styles from "../styles/UploadContainer.module.css";

const ProcessingFilesFormStep = React.memo(function ProcessingFilesFormStep({
  progress,
}) {
  return (
    <section className={`${styles.toolbox} py-0 mt-0`}>
      <div className="d-flex">
        <div className="w-100 pt-3 pb-3 d-flex flex-column align-items-center">
          <div className="row w-100 d-flex justify-content-center text-center mt-2">
            <h2 className={`${styles.container_title}`}>{progress}</h2>
          </div>

          <div className="row w-100 d-flex justify-content-center text-center mt-5 mb-5">
            <GearWide
              className={`${styles.process_circle}`}
              size={130}
              color="#EE1B22"
            />
          </div>

          <div className="row w-100 d-flex justify-content-center text-center mt-5 mb-5">
            <span style={{ color: "#2d3748" }}>
              {
                "Do not close your browser. Wait until your files are processed! This might take a few minutes."
              }
            </span>
          </div>
        </div>
      </div>
    </section>
  );
});

export default ProcessingFilesFormStep;

ProcessingFilesFormStep.propTypes = {
  progress: PropTypes.string.isRequired,
};
