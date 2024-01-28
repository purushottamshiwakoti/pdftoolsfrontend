import React, { useState, useEffect } from "react";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import pageStyles from "../styles/Page.module.css";
import parse from "html-react-parser";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "privacy"])),
    },
  };
}

const PrivacyPolicy = () => {
  const [myData, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    fetch(`/api/other/${"privacy-policy"}`)
      .then((res) => res.json())
      .then((data) => {
        const { page } = data;
        setData(page);
        setLoading(false);
      });
  }, []);
  return (
    <>
      <Head>
        {/* Anything you add here will be added to this page only */}
        <title>{myData?.metaTitle}</title>
        <meta name="description" content={myData?.metaDescription} />
        <meta name="Keywords" content="" />
        <meta name="robots" content="noindex,nofollow" />
        {/* Anything you add here will be added this page only */}
        {/* You can add your canonical here */}
        {/* You can add your alternate here */}
      </Head>

      <main>
        <header className="page_section header mb-0">
          {/* <h1 className="title">{t("common:privacy")}</h1> */}
          {isLoading ? (
            <h1 className="title bg-slate-200 h-6  w-[12rem] lg:w-[25rem] animate-pulse"></h1>
          ) : (
            <h1 className="title">{myData.title}</h1>
          )}
        </header>
        <section className="page_section mt-0">
          <article className="container">
            <section>
              <div className={pageStyles.paragraph_text}>
                {/* <h3>{t("privacy:title_01")}</h3>
                <p>{t("privacy:paragraph_01")}</p>
                <h3>{t("privacy:title_02")}</h3>
                <p>{t("privacy:paragraph_02")}</p>
                <h3>{t("privacy:title_03")}</h3>
                <p>{t("privacy:paragraph_03")}</p>
                <h3>{t("privacy:title_04")}</h3>
                <p>{t("privacy:paragraph_04")}</p>
                <h3>{t("privacy:title_05")}</h3>
                <ul>
                  <li>{t("privacy:section_list_item_01")}</li>
                  <li>{t("privacy:section_list_item_02")}</li>
                  <li>{t("privacy:section_list_item_03")}</li>
                </ul> */}
                {isLoading ? (
                  <div className="space-y-4">
                    <p className="bg-slate-200 h-6  w-[15rem] lg:w-[25rem] animate-pulse"></p>
                    <p className="bg-slate-200 h-6  w-[15rem] lg:w-[25rem] animate-pulse"></p>
                    <p className="bg-slate-200 h-6  w-[15rem] lg:w-[25rem] animate-pulse"></p>
                  </div>
                ) : (
                  myData?.description && parse(myData.description)
                )}
              </div>
            </section>
          </article>
        </section>
      </main>
    </>
  );
};

export default PrivacyPolicy;
