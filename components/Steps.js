import React from "react";
import Step from "./Step";
import styles from "../styles/Steps.module.css";
import PropTypes from "prop-types";
import pageStyles from "../styles/Page.module.css";
const Steps = React.memo(function Steps({ title, stepsArray }) {
  return (
    <section className="-mt-14 -px-[30rem]">
      <article className={``}>
        <header>
          <h2 className={` text-[32px] font-[600] text-[#262323] text-center`}>
            {title}
          </h2>
          <div className={` `}></div>
        </header>
        <section className="w-100">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 mt-[40px] grid-cols-1 gap-[48px]">
            {stepsArray &&
              stepsArray.map((step, i) => {
                return (
                  <Step
                    key={"step" + i}
                    number={step.number}
                    description={step.description}
                  />
                );
              })}
          </div>
        </section>
      </article>
    </section>
  );
});

export default Steps;

Steps.propTypes = {
  title: PropTypes.string.isRequired,
  stepsArray: PropTypes.array.isRequired,
};
