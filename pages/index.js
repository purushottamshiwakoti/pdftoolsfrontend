import { Button } from "@/components/ui/button";
import parse from "html-react-parser";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Quote, StarFill } from "react-bootstrap-icons";
import Share from "../components/Share";
import useToolsData from "../hooks/useToolsData";
import styles from "../styles/index.module.css";
import WhyChooseUs from "@/components/WhyChooseUs";
import Reviews from "@/components/Reviews";
import GoodCompany from "@/components/GoodCompany";

import { useRouter } from "next/router";
import { appUrl, dashboardUrl } from "@/lib/url";

export async function getStaticProps({ locale }) {
  const res = await fetch(`${dashboardUrl}/other/home`);
  const choose = await fetch(`${dashboardUrl}/choose-us`);
  const reviews = await fetch(`${dashboardUrl}/reviews`);
  const company = await fetch(`${dashboardUrl}/company-image`);

  let CompanyImagesData = await company.json();
  CompanyImagesData = CompanyImagesData.data;
  let reviewsData = await reviews.json();
  reviewsData = reviewsData.data;

  const { data } = await choose.json();

  const { page } = await res.json();

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      myData: page,
      chooseUsData: data,
      reviewsData: reviewsData,
      CompanyImagesData: CompanyImagesData,
    },
  };
}

const Home = ({ myData, chooseUsData, reviewsData, CompanyImagesData }) => {
  const toolsData = useToolsData();
  const router = useRouter();
  const currentUrl = router.asPath;

  const { t } = useTranslation();

  return (
    <>
      <Head>
        {/* Anything you add here will be added to this page only */}
        {/* <title>{myData?.metaTitle}</title>
        {myData && (
          <>
            <meta property="og:title" content={myData.ogTitle} />
            <meta property="og:description" content={myData.ogDescription} />
            <meta property="og:image" content={myData.ogImage} />
            <meta property="og:image:alt" content={myData.ogImageAlt} />
          </>
        )}
        <meta name="description" content={myData?.metaDescription} /> */}

        <meta
          name="Keywords"
          content="PDF tool, PDF converter, PDF editor, PDF compressor, online PDF tool, free PDF tool, PDF to Word, PDF to Excel, PDF to JPG, PDF to PNG, edit PDF online, compress PDF online."
        />
        {/* You can add your canonical here */}
        <link rel="canonical" href={`${appUrl}${currentUrl}`} key="canonical" />
        {/* You can add your alternate links here, example: */}
        {/* <link
          rel="alternate"
          href={`https://www.example.com/en`}
          hrefLang="en"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/es`}
          hrefLang="es"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/ar`}
          hrefLang="ar"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/zh`}
          hrefLang="zh"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/de`}
          hrefLang="de"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/fr`}
          hrefLang="fr"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/it`}
          hrefLang="it"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/pt`}
          hrefLang="pt"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/ru`}
          hrefLang="ru"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/uk`}
          hrefLang="uk"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/id`}
          hrefLang="id"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/da`}
          hrefLang="da"
        />

        <link
          rel="alternate"
          href={`https://www.example.com/nl`}
          hrefLang="nl"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/hi`}
          hrefLang="hi"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/ko`}
          hrefLang="ko"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/ja`}
          hrefLang="ja"
        /> */}
      </Head>

      <>
        <main>
          <section className={`hero mt-8 mb-8   mx-[1rem] md:mx-[3.8rem]`}>
            <div className=" space-y-7 lg:flex items-center justify-around">
              <div className="lg:space-y-7 space-y-5">
                <h1 className="text-[#7D64FF] font-bold tracking-wider text-2xl md:text-4xl ">
                  {myData.Settings[0]?.title}
                </h1>

                <p className="lg:w-[40rem] lg:mr-20 tracking-normal text-xl">
                  {myData.Settings[0]?.description}
                </p>

                <div className="md:space-x-6 space-y-2">
                  <Button asChild className="w-full md:w-auto " size="lg">
                    <Link href={myData.Settings[0]?.buttonHref}>
                      {myData.Settings[0]?.button}
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    asChild
                    className="w-full md:w-auto "
                  >
                    <Link href={myData.Settings[0]?.buttonTwoHref}>
                      {myData.Settings[0]?.buttonTwo}
                    </Link>
                  </Button>
                </div>
              </div>
              <div>
                <Image
                  src={myData.Settings[0]?.image}
                  alt={myData.Settings[0]?.imageAlt}
                  width={400}
                  height={200}
                />
              </div>
            </div>
          </section>
          <header className="page_section header mb-0">
            {/* <h1 className="title">{t("common:page_header_title")}</h1> */}
            <h2 className="title">{myData.title}</h2>
            {/* <p className="description">{t("common:page_header_text")}</p>  */}
            <div className="description">
              {myData?.description && parse(myData.description)}
            </div>
          </header>
          <section className="page_section mt-0">
            <article className="container">
              <section
                style={{
                  marginBottom: "10px",
                  marginTop: "10px",
                }}
              >
                <div className={styles.grid_container}>
                  {Object.keys(toolsData).map((key) => (
                    <Link
                      key={key}
                      className={styles.grid_item}
                      href={toolsData[key].href}
                      prefetch={false}
                    >
                      <div className={styles.grid_content}>
                        <div className={styles.grid_item_icon}>
                          {toolsData[key].icon}
                        </div>
                        <h2 className={styles.grid_item_title}>
                          {toolsData[key].title}
                        </h2>
                        <p className={styles.grid_item_description}>
                          {toolsData[key].description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </article>
          </section>

          {/* simple task start  */}

          <section
            className={`hero mt-8 mb-8 lg:mt-20 lg:mb-32  mx-[1rem] md:mx-[3.8rem]`}
          >
            <div className="space-y-3 mb-10">
              <h3 className="text-[#7D64FF] font-bold tracking-wider text-3xl md:text-4xl text-center ">
                {myData.Settings[0]?.tasksTitle}
              </h3>

              <p className="tracking-normal text-xl text-center text-black/70  ">
                {myData.Settings[0]?.tasksDescription}
              </p>
            </div>
            <div className=" space-y-7 lg:flex items-center justify-around">
              <div className="lg:space-y-7 space-y-5">
                <h3 className="text-[#7D64FF] font-bold tracking-wider text-xl md:text-3xl ">
                  {myData.Settings[0]?.tasksSubTitle}
                </h3>
                <p className="lg:w-[40rem] lg:mr-20 tracking-normal text-xl">
                  {myData.Settings[0]?.tasksSubDescription}
                </p>
                <div className="">
                  <Button
                    asChild
                    className="w-full md:w-auto "
                    size="lg"
                    variant="outline"
                  >
                    <Link href={myData.Settings[0]?.tasksButtonHref}>
                      {myData.Settings[0]?.tasksButton}

                      <ArrowRight className="ml-1 w-5 h-5" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div>
                <Image
                  src={myData.Settings[0]?.tasksImage}
                  alt={myData.Settings[0]?.tasksImageAlt}
                  width={400}
                  height={300}
                />
              </div>
            </div>
          </section>
          {/* simple task end */}
          {/* why choose us start  */}
          <section
            className={`hero mt-8 mb-8 lg:mt-20 lg:mb-32  mx-[1rem] md:mx-[3.8rem]`}
          >
            {chooseUsData && <WhyChooseUs data={chooseUsData} />}
          </section>
          {/* why choose us end */}

          {/* good company start  */}
          <section
            className={`hero mt-8 mb-8 lg:mt-20 lg:mb-32  mx-[1rem] md:mx-[3.8rem]`}
          >
            <div>
              <h3 className="text-[#7D64FF] font-bold tracking-wider text-3xl md:text-4xl  text-center mb-10">
                {myData.Settings[0].comapnyTitle}{" "}
              </h3>
              {CompanyImagesData && <GoodCompany data={CompanyImagesData} />}
            </div>
          </section>
          {/* good company end */}

          {/* review start  */}
          <section
            className={`hero mt-8 mb-8 lg:mt-20 lg:mb-32  mx-[1rem] md:mx-[3.8rem]`}
          >
            {reviewsData && <Reviews data={reviewsData} />}
          </section>
          {/* review end */}

          {/* share  */}
          <Share />
        </main>
      </>
    </>
  );
};
export default Home;
