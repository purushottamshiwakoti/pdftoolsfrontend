import React from "react";
import Feature from "./Feature";
import styles from "../styles/Features.module.css";
import PropTypes from "prop-types";
import pageStyles from "../styles/Page.module.css";
const Features = React.memo(function Features({ title, featuresArray }) {
  return (
    <>
      <section className="mt-[100px]">
        <article>
          <header className={``}>
            <h3 className={"text-[#262323] text-center text-[32px] font-[600]"}>
              {title}
            </h3>
            <div className={``}></div>
          </header>

          <section>
            <div className={``}>
              <div
                className={`mt-[32px] grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[12px]`}
              >
                {featuresArray &&
                  featuresArray.map((feature, i) => {
                    return (
                      <Feature
                        key={"feature" + i}
                        title={feature.title}
                        description={feature.description}
                        icon={feature.icon}
                      />
                    );
                  })}
              </div>
            </div>
          </section>
        </article>
      </section>
    </>
  );
});

export default Features;

Features.propTypes = {
  title: PropTypes.string.isRequired,
  featuresArray: PropTypes.array.isRequired,
};
