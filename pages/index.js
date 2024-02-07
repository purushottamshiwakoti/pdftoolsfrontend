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
import { appUrl } from "@/lib/url";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const Home = () => {
  const [isWindows, setIsWindows] = useState(false);
  const toolsData = useToolsData();
  const [myData, setData] = useState(null);
  const [settingsArray, setSettingsArray] = useState(null);
  const [chooseUsData, setChooseUsData] = useState(null);
  const [reviewsData, setReviewsData] = useState(null);
  const [CompanyImagesData, setCompanyImageData] = useState(null);

  const router = useRouter();
  const currentUrl = router.asPath;

  const [isLoading, setLoading] = useState(true);
  const { t } = useTranslation();
  useEffect(() => {
    fetch(`/api/other/${"home"}`)
      .then((res) => res.json())
      .then((data) => {
        const { page } = data;
        setData(page);
        setSettingsArray(page.Settings[0]);
        setLoading(false);
        setIsWindows(navigator.userAgent.includes("Windows"));
      });
    fetch(`/api/choose-us`)
      .then((res) => res.json())
      .then((data) => {
        setChooseUsData(data.data);
      });
    fetch(`/api/reviews`)
      .then((res) => res.json())
      .then((data) => {
        setReviewsData(data.data);
      });
    fetch(`/api/company-image`)
      .then((res) => res.json())
      .then((data) => {
        setCompanyImageData(data.data);
      });
  }, []);

  return (
    <>
      <Head>
        {/* Anything you add here will be added to this page only */}
        <title>{myData?.metaTitle}</title>
        {myData && (
          <>
            <meta property="og:title" content={myData.ogTitle} />
            <meta property="og:description" content={myData.ogDescription} />
            <meta property="og:image" content={myData.ogImage} />
            <meta property="og:image:alt" content={myData.ogImageAlt} />
          </>
        )}
        <meta name="description" content={myData?.metaDescription} />

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
          <section
            className={`hero mt-8 mb-8 lg:mt-20 lg:mb-32 ${
              isWindows ? "lg:mx-[12rem]" : "lg:mx-[5rem]"
            } mx-[1rem] md:mx-[3.8rem]`}
          >
            <div className=" space-y-7 lg:flex items-center justify-around">
              <div className="lg:space-y-7 space-y-5">
                {isLoading ? (
                  <div className="bg-slate-200 h-6  w-[12rem] lg:w-[25rem] animate-pulse"></div>
                ) : (
                  <h1 className="text-[#7D64FF] font-bold tracking-wider text-2xl md:text-4xl ">
                    {settingsArray?.title}
                  </h1>
                )}
                {isLoading ? (
                  <div className="space-y-1">
                    <div className="bg-slate-200 h-6  w-[12rem] lg:w-[25rem] animate-pulse" />
                    <div className="bg-slate-200 h-6  w-[12rem] lg:w-[25rem] animate-pulse" />
                  </div>
                ) : (
                  <p className="lg:w-[40rem] lg:mr-20 tracking-normal text-xl">
                    {settingsArray?.description}
                  </p>
                )}
                <div className="md:space-x-6 space-y-2">
                  {isLoading ? (
                    <div className="h-[30px] w-[20px] md:w-auto bg-slate-200 flex animate-pulse" />
                  ) : (
                    <Button asChild className="w-full md:w-auto " size="lg">
                      <Link href={settingsArray?.buttonHref}>
                        {settingsArray?.button}
                      </Link>
                    </Button>
                  )}
                  {isLoading ? (
                    <div className="h-[30px] flex w-[20px] md:w-auto bg-slate-200 animate-pulse" />
                  ) : (
                    <Button
                      variant="outline"
                      asChild
                      className="w-full md:w-auto "
                    >
                      <Link href={settingsArray?.buttonTwoHref}>
                        {settingsArray?.buttonTwo}
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
              <div>
                {isLoading ? (
                  <div className="w-[500px] h-[500px] bg-slate-200 animate-pulse"></div>
                ) : (
                  <Image
                    src={settingsArray?.image}
                    alt={settingsArray?.imageAlt}
                    width={700}
                    height={400}
                  />
                )}
              </div>
            </div>
          </section>
          <header className="page_section header mb-0">
            {/* <h1 className="title">{t("common:page_header_title")}</h1> */}
            {isLoading ? (
              <h2 className="title bg-slate-200 h-6  w-[12rem] lg:w-[25rem] animate-pulse"></h2>
            ) : (
              <h2 className="title">{myData.title}</h2>
            )}
            {/* <p className="description">{t("common:page_header_text")}</p>  */}
            {isLoading ? (
              <p className="title bg-slate-200 h-6  w-[15rem] lg:w-[25rem] animate-pulse"></p>
            ) : (
              <p className="description">
                {myData?.description && parse(myData.description)}
              </p>
            )}
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
            className={`hero mt-8 mb-8 lg:mt-20 lg:mb-32 ${
              isWindows ? "lg:mx-[12rem]" : "lg:mx-[5rem]"
            } mx-[1rem] md:mx-[3.8rem]`}
          >
            <div className="space-y-3 mb-10">
              {isLoading ? (
                <h3 className="w-[30px] h-[10px] bg-slate-200 animate-pulse font-bold tracking-wider text-3xl md:text-4xl text-center "></h3>
              ) : (
                <h3 className="text-[#7D64FF] font-bold tracking-wider text-3xl md:text-4xl text-center ">
                  {settingsArray?.tasksTitle}
                </h3>
              )}
              {isLoading ? (
                <p className="tracking-normal text-xl text-center text-black/70 w-[50px] h-[10px] bg-slate-200  "></p>
              ) : (
                <p className="tracking-normal text-xl text-center text-black/70  ">
                  {settingsArray?.tasksDescription}
                </p>
              )}
            </div>
            <div className=" space-y-7 lg:flex items-center justify-around">
              <div className="lg:space-y-7 space-y-5">
                <h3 className="text-[#7D64FF] font-bold tracking-wider text-xl md:text-3xl ">
                  {settingsArray?.tasksSubTitle}
                </h3>
                <p className="lg:w-[40rem] lg:mr-20 tracking-normal text-xl">
                  {settingsArray?.tasksSubDescription}
                </p>
                <div className="">
                  <Button
                    asChild
                    className="w-full md:w-auto "
                    size="lg"
                    variant="outline"
                  >
                    {settingsArray && (
                      <Link href={settingsArray?.tasksButtonHref}>
                        {settingsArray?.tasksButton}

                        <ArrowRight className="ml-1 w-5 h-5" />
                      </Link>
                    )}
                  </Button>
                </div>
              </div>
              <div>
                <Image
                  src={settingsArray?.tasksImage}
                  alt={settingsArray?.tasksImageAlt}
                  width={700}
                  height={400}
                />
              </div>
            </div>
          </section>
          {/* simple task end */}
          {/* why choose us start  */}
          <section
            className={`hero mt-8 mb-8 lg:mt-20 lg:mb-32 ${
              isWindows ? "lg:mx-[12rem]" : "lg:mx-[5rem]"
            } mx-[1rem] md:mx-[3.8rem]`}
          >
            {chooseUsData && <WhyChooseUs data={chooseUsData} />}
          </section>
          {/* why choose us end */}

          {/* good company start  */}
          <section
            className={`hero mt-8 mb-8 lg:mt-20 lg:mb-32 ${
              isWindows ? "lg:mx-[12rem]" : "lg:mx-[5rem]"
            } mx-[1rem] md:mx-[3.8rem]`}
          >
            <div>
              <h3 className="text-[#7D64FF] font-bold tracking-wider text-3xl md:text-4xl  text-center mb-10">
                {myData && myData.Settings[0].comapnyTitle}{" "}
              </h3>
              {CompanyImagesData && <GoodCompany data={CompanyImagesData} />}
            </div>
          </section>
          {/* good company end */}

          {/* review start  */}
          <section
            className={`hero mt-8 mb-8 lg:mt-20 lg:mb-32 ${
              isWindows ? "lg:mx-[12rem]" : "lg:mx-[5rem]"
            } mx-[1rem] md:mx-[3.8rem]`}
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
