import React from "react";
import styles from "../styles/Step.module.css";
import PropTypes from "prop-types";
const Step = React.memo(function Step({ number, description }) {
  return (
    <div className={`flex`}>
      <span
        className={`bg-[#EE1B22] min-w-[24px] max-w-[25px] min-h-[24px] max-h-[25px]  rounded-[3px] mr-2 text-white flex items-center justify-center  text-[18px] font-[600] p-1`}
      >
        {number}
      </span>
      <div
        className={`text-[#262323] font-[400] text-[16px] leading-[26px] tracking-wide`}
      >
        {description}
      </div>
    </div>
  );
});

export default Step;

Step.propTypes = {
  number: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
};
