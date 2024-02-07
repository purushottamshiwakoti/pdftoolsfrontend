import React, { useState, useEffect } from "react";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import pageStyles from "../styles/Page.module.css";
import parse from "html-react-parser";
import ContactForm from "@/components/ContactForm";

import { useRouter } from "next/router";
import { appUrl } from "@/lib/url";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "contact"])),
    },
  };
}

const Contacts = () => {
  const [isWindows, setIsWindows] = useState(false);

  const [myData, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const { t } = useTranslation();

  const router = useRouter();
  const currentUrl = router.asPath;

  useEffect(() => {
    fetch(`/api/other/${"contact-us"}`)
      .then((res) => res.json())
      .then((data) => {
        const { page } = data;
        setData(page);
        setLoading(false);
        setIsWindows(navigator.userAgent.includes("Windows"));
      });
  }, []);

  return (
    <>
      <Head>
        {/* Anything you add here will be added this page only */}
        <title>{myData?.metaTitle}</title>
        <meta name="description" content={myData?.metaDescription} />
        {myData && (
          <>
            <meta property="og:title" content={myData.ogTitle} />
            <meta property="og:description" content={myData.ogDescription} />
            <meta property="og:image" content={myData.ogImage} />
            <meta property="og:image:alt" content={myData.ogImageAlt} />
          </>
        )}
        <meta name="Keywords" content="" />
        <link rel="canonical" href={`${appUrl}${currentUrl}`} key="canonical" />

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
              {/* <p className={`${pageStyles.paragraph_text}`}>
                {t("contact:contact_text")}
              </p> */}

              {isLoading ? (
                <div className="space-y-4">
                  <p className="bg-slate-200 h-6  w-[15rem] lg:w-[25rem] animate-pulse"></p>
                  <p className="bg-slate-200 h-6  w-[15rem] lg:w-[25rem] animate-pulse"></p>
                  <p className="bg-slate-200 h-6  w-[15rem] lg:w-[25rem] animate-pulse"></p>
                </div>
              ) : (
                myData?.description && parse(myData.description)
              )}
            </section>
          </article>
          <section
            className={`hero mt-8 mb-8 lg:mt-10 lg:mb-32 ${
              isWindows ? "lg:mx-[11rem]" : "lg:mx-[5rem]"
            } mx-[1rem] md:mx-[3.8rem]`}
          >
            <div>
              <h2 className="text-[#7D64FF] font-bold tracking-wider text-xl md:text-3xl ">
                Contact Us
              </h2>
              <div className="mt-2">
                <ContactForm />
              </div>
            </div>
          </section>
        </section>
      </main>
    </>
  );
};

export default Contacts;
