import React, { useState, useEffect } from "react";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import pageStyles from "../styles/Page.module.css";
import parse from "html-react-parser";
import { useRouter } from "next/router";
import { appUrl, dashboardUrl } from "@/lib/url";

export async function getStaticProps({ locale }) {
  const res = await fetch(`${dashboardUrl}/other/terms-and-conditions`, {
    cache: "no-store",
  });
  const { page } = await res.json();

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "terms"])),
      myData: page,
    },
  };
}

const TermsOfUse = ({ myData }) => {
  const isLoading = false;
  const { t } = useTranslation();
  const router = useRouter();
  const currentUrl = router.asPath;

  return (
    <>
      <Head>
        {/* Anything you add here will be added to this page only */}
        <title>{myData?.metaTitle}</title>
        <meta name="description" content={myData?.metaDescription} />
        <meta name="Keywords" content="" />
        {myData && (
          <>
            <meta property="og:title" content={myData.ogTitle} />
            <meta property="og:description" content={myData.ogDescription} />
            <meta property="og:image" content={myData.ogImage} />
            <meta property="og:image:alt" content={myData.ogImageAlt} />
          </>
        )}
        <link rel="canonical" href={`${appUrl}${currentUrl}`} key="canonical" />
        {/* Anything you add here will be added this page only */}
        {/* You can add your canonical here */}
        {/* You can add your alternate here */}
      </Head>

      <main>
        <header className="page_section header mb-0">
          {/* <h1 className="title">{t("common:terms")}</h1> */}
          {isLoading ? (
            <h1 className="title bg-slate-200 h-6  w-[12rem] lg:w-[25rem] animate-pulse"></h1>
          ) : (
            <h1 className="title">{myData.title}</h1>
          )}
        </header>
        <section className="page_section mt-0">
          <article className="container">
            <section>
              <div className={`${pageStyles.paragraph_text}`}>
                {/* <h3>{t("terms:title_01")}</h3>
                <p>{t("terms:paragraph_01")}</p>
                <h3>{t("terms:title_02")}</h3>
                <p>{t("terms:paragraph_02")}</p>
                <h3>{t("terms:title_03")}</h3>
                <p>{t("terms:paragraph_03")}</p>
                <h3>{t("terms:title_04")}</h3>
                <p>{t("terms:paragraph_04")}</p>
                <h3>{t("terms:title_05")}</h3>
                <ul>
                  <li>{t("terms:section_list_item_01")}</li>
                  <li>{t("terms:section_list_item_02")}</li>
                  <li>{t("terms:section_list_item_03")}</li>
                </ul> */}
                {isLoading ? (
                  <div className="space-y-4">
                    <p className="bg-slate-200 h-6  w-[15rem] lg:w-[25rem] animate-pulse"></p>
                    <p className="bg-slate-200 h-6  w-[15rem] lg:w-[25rem] animate-pulse"></p>
                    <p className="bg-slate-200 h-6  w-[15rem] lg:w-[25rem] animate-pulse"></p>
                  </div>
                ) : (
                  <>
                    <h2>{myData?.description && parse(myData.description)}</h2>
                  </>
                )}
              </div>
            </section>
          </article>
        </section>
      </main>
    </>
  );
};

export default TermsOfUse;
