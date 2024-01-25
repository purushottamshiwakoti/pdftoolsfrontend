import React from "react";
import styles from "../styles/Feature.module.css";
import PropTypes from "prop-types";
import { icons } from "../lib/icons";
const Feature = React.memo(function Feature({ title, description, icon }) {
  const selectedIcon = icons.find((ico) => ico.name === icon)?.icon;

  return (
    <div className={`${styles.feature_wrapper}`}>
      <p>{selectedIcon && React.createElement(selectedIcon)}</p>
      <div className={`${styles.feature_title}`}>{title}</div>
      <div className={`${styles.feature_desc}`}>{description}</div>
    </div>
  );
});

export default Feature;

Feature.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
};
