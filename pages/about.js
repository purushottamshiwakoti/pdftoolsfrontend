import React, { useState, useEffect } from "react";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Share from "../components/Share";
import pageStyles from "../styles/Page.module.css";
import parse from "html-react-parser";

import { useRouter } from "next/router";
import { appUrl } from "@/lib/url";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "about"])),
    },
  };
}

const About = () => {
  const [myData, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const { t } = useTranslation();

  const router = useRouter();
  const currentUrl = router.asPath;

  useEffect(() => {
    fetch(`/api/other/${"about"}`)
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
                {/* <p>{t("about:paragraph_01")}</p>

                <p>{t("about:paragraph_02")}</p>

                <p>{t("about:paragraph_03")}</p>

                <p>{t("about:paragraph_04")}</p> */}

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

        <Share />
      </main>
    </>
  );
};

export default About;
