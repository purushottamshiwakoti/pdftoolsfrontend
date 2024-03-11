import React, { useState, useEffect } from "react";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Share from "../components/Share";
import pageStyles from "../styles/Page.module.css";
import parse from "html-react-parser";

import { useRouter } from "next/router";
import { appUrl, dashboardUrl } from "@/lib/url";

export async function getStaticProps({ locale }) {
  const res = await fetch(`${dashboardUrl}/other/about`,{
    cache:"no-store"
  });
  const { page } = await res.json();

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "about"])),
      myData: page,
    },
  };
}

const About = ({ myData }) => {
  const { t } = useTranslation();

  const router = useRouter();
  const currentUrl = router.asPath;

  return (
    <>
      <Head>
        {/* Anything you add here will be added this page only */}
        <title>{myData?.metaTitle}</title>
        <meta name="description" content={myData?.metaDescription} />
        <link rel="canonical" href={`${appUrl}${currentUrl}`} key="canonical" />
        {myData && (
          <>
            <meta property="og:title" content={myData.ogTitle} />
            <meta property="og:description" content={myData.ogDescription} />
            <meta property="og:image" content={myData.ogImage} />
            <meta property="og:image:alt" content={myData.ogImageAlt} />
          </>
        )}
        <meta
          name="Keywords"
          content="PDF tools, PDF manipulation, PDF merge, PDF split, PDF compress, PDF convert"
        />
        <meta name="robots" content="noindex,nofollow" />
        {/* You can add your canonical here */}
        {/* You can add your alternate here */}
      </Head>

      <main>
        <header className="page_section header mb-0">
          <h1 className="title">{myData.title}</h1>
        </header>
        <section className="page_section mt-0">
          <article className="container">
            <section>
              <h2 className={`${pageStyles.paragraph_text}`}>
                {/* <p>{t("about:paragraph_01")}</p>

                <p>{t("about:paragraph_02")}</p>

                <p>{t("about:paragraph_03")}</p>

                <p>{t("about:paragraph_04")}</p> */}

                {myData?.description && parse(myData.description)}
              </h2>
            </section>
          </article>
        </section>

        <Share />
      </main>
    </>
  );
};

export default About;
