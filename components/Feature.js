import React from "react";
import styles from "../styles/Feature.module.css";
import PropTypes from "prop-types";
import { icons } from "../lib/icons";
const Feature = React.memo(function Feature({ title, description, icon }) {
  const selectedIcon = icons.find((ico) => ico.name === icon)?.icon;

  return (
    <div className={"bg-[#f9f8f8] border-1 border-[#000]/10 p-[24px]"}>
      <p className="mb-[24px] text-[#EE1B22]">
        {selectedIcon && React.createElement(selectedIcon)}
      </p>
      <div className={`text-[##262323] text-[18px] font-[600] mb-[12px]`}>
        {title}
      </div>
      <div className={`text-[14px] font-[400] leading-[20px] text-[#6F6767]`}>
        {description}
      </div>
    </div>
  );
});

export default Feature;

Feature.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
};
