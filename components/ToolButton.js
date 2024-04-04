import React, { useRef, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/UploadContainer.module.css";
import PropTypes from "prop-types";
import { rtlLanguages } from "../helpers/utils";
import { Button } from "./ui/button";
const ToolButton = React.memo(function ToolButton({
  children,
  title,
  onClick,
  isActive,
  buttonStyle,
}) {
  const buttonRef = useRef();
  const router = useRouter();
  const direction = rtlLanguages.includes(router.locale) ? "rtl" : "ltr";
  const langStyle = {
    direction: direction,
  };
  useEffect(() => {
    //save refs to remove events in clean up function
    const buttonRefCurrent = buttonRef.current;

    //cleanup function
    return () => {
      //removing event listeners
      buttonRefCurrent?.removeEventListener("click", onClick, false);
    };
  }, []);
  return (
    <Button
      ref={buttonRef}
      className={`${buttonStyle} ${
        !isActive && styles.disabled
      } bg-[#EE1B22] hover:bg-[#EE1B22]/80 `}
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={!isActive}
      style={langStyle}
    >
      {children}
    </Button>
  );
});

export default ToolButton;

ToolButton.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
};
