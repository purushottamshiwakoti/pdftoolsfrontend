import React from "react";
import Feature from "./Feature";
import styles from "../styles/Features.module.css";
import PropTypes from "prop-types";
import pageStyles from "../styles/Page.module.css";
const Features = React.memo(function Features({ title, featuresArray }) {
  return (
    <>
      <section className="page_section">
        <article className={`container banner ${styles.features_section}`}>
          <header className={`${styles.features_title}`}>
            <h3 className={`${pageStyles.title_section} text-3xl`}>{title}</h3>
            <div
              className={`${pageStyles.divider} ${pageStyles.mx_auto}`}
            ></div>
          </header>

          <section>
            <div className={`${styles.features_container}`}>
              <div className={`${styles.features_wrapper}`}>
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
