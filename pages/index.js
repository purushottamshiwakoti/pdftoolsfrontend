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

  console.log(settingsArray);
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
  }, []);

  return (
    <>
      <Head>
        {/* Anything you add here will be added to this page only */}
        <title>{myData?.metaTitle}</title>
        <meta name="description" content={myData?.metaDescription} />
        <meta
          name="Keywords"
          content="PDF tool, PDF converter, PDF editor, PDF compressor, online PDF tool, free PDF tool, PDF to Word, PDF to Excel, PDF to JPG, PDF to PNG, edit PDF online, compress PDF online."
        />
        {/* You can add your canonical here */}
        <link
          rel="canonical"
          href={`https://www.example.com/`}
          key="canonical"
        />
        {/* You can add your alternate links here, example: */}
        <link
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
        />
      </Head>

      <>
        <main>
          <header className="page_section header mb-0">
            {/* <h1 className="title">{t("common:page_header_title")}</h1> */}
            {isLoading ? (
              <h1 className="title bg-slate-200 h-6  w-[12rem] lg:w-[25rem] animate-pulse"></h1>
            ) : (
              <h1 className="title">{myData.title}</h1>
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
                  <h1 className="text-[#7D64FF] font-bold tracking-wider text-3xl md:text-5xl ">
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

          <Share />
          {/* simple task start  */}

          <section
            className={`hero mt-8 mb-8 lg:mt-20 lg:mb-32 ${
              isWindows ? "lg:mx-[12rem]" : "lg:mx-[5rem]"
            } mx-[1rem] md:mx-[3.8rem]`}
          >
            <div className="space-y-3 mb-10">
              {isLoading ? (
                <h2 className="w-[30px] h-[10px] bg-slate-200 animate-pulse font-bold tracking-wider text-3xl md:text-4xl text-center "></h2>
              ) : (
                <h2 className="text-[#7D64FF] font-bold tracking-wider text-3xl md:text-4xl text-center ">
                  {settingsArray?.tasksTitle}
                </h2>
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
                <h2 className="text-[#7D64FF] font-bold tracking-wider text-3xl md:text-5xl ">
                  {settingsArray?.tasksSubTitle}
                </h2>
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
            <div>
              <h2 className="text-[#7D64FF] font-bold tracking-wider text-3xl md:text-4xl  text-center mb-10">
                Why Choose Us
              </h2>
              <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
                <div className="space-y-3 mb-10">
                  <Image
                    src={"/img/banner.jpg"}
                    alt="img"
                    width={100}
                    height={100}
                  />
                  <h2 className="text-xl font-medium">People Trust Us</h2>
                  <p className="text-black/60">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Recusandae alias est laudantium sit aut accusamus quos,
                    eligendi quam placeat possimus!
                  </p>
                </div>
                <div className="space-y-4">
                  <Image
                    src={"/img/banner.jpg"}
                    alt="img"
                    width={100}
                    height={100}
                  />
                  <h2 className="text-xl font-medium">People Trust Us</h2>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Recusandae alias est laudantium sit aut accusamus quos,
                    eligendi quam placeat possimus!
                  </p>
                </div>
                <div className="space-y-4">
                  <Image
                    src={"/img/banner.jpg"}
                    alt="img"
                    width={100}
                    height={100}
                  />
                  <h2 className="text-xl font-medium">People Trust Us</h2>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Recusandae alias est laudantium sit aut accusamus quos,
                    eligendi quam placeat possimus!
                  </p>
                </div>
                <div className="space-y-4">
                  <Image
                    src={"/img/banner.jpg"}
                    alt="img"
                    width={100}
                    height={100}
                  />
                  <h2 className="text-xl font-medium">People Trust Us</h2>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Recusandae alias est laudantium sit aut accusamus quos,
                    eligendi quam placeat possimus!
                  </p>
                </div>
                <div className="space-y-4">
                  <Image
                    src={"/img/banner.jpg"}
                    alt="img"
                    width={100}
                    height={100}
                  />
                  <h2 className="text-xl font-medium">People Trust Us</h2>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Recusandae alias est laudantium sit aut accusamus quos,
                    eligendi quam placeat possimus!
                  </p>
                </div>
                <div className="space-y-4">
                  <Image
                    src={"/img/banner.jpg"}
                    alt="img"
                    width={100}
                    height={100}
                  />
                  <h2 className="text-xl font-medium">People Trust Us</h2>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Recusandae alias est laudantium sit aut accusamus quos,
                    eligendi quam placeat possimus!
                  </p>
                </div>
              </div>
            </div>
          </section>
          {/* why choose us end */}

          {/* good company start  */}
          <section
            className={`hero mt-8 mb-8 lg:mt-20 lg:mb-32 ${
              isWindows ? "lg:mx-[12rem]" : "lg:mx-[5rem]"
            } mx-[1rem] md:mx-[3.8rem]`}
          >
            <div>
              <h2 className="text-[#7D64FF] font-bold tracking-wider text-3xl md:text-4xl  text-center mb-10">
                You are in a good company
              </h2>
              <div className="grid lg:grid-cols-4 space-y-3 md:gap-y-3 md:space-y-0 md:gap-x-4 md:grid-cols-2 grid-cols-1">
                <Image
                  src={"/img/facebook.jpg"}
                  alt="facebook"
                  width={300}
                  height={300}
                />
                <Image
                  src={"/img/col.svg"}
                  alt="facebook"
                  width={300}
                  height={300}
                />
                <Image
                  src={"/img/facebook.jpg"}
                  alt="facebook"
                  width={300}
                  height={300}
                />
                <Image
                  src={"/img/facebook.jpg"}
                  alt="facebook"
                  width={300}
                  height={300}
                />
              </div>
            </div>
          </section>
          {/* good company end */}

          {/* review start  */}
          <section
            className={`hero mt-8 mb-8 lg:mt-20 lg:mb-32 ${
              isWindows ? "lg:mx-[12rem]" : "lg:mx-[5rem]"
            } mx-[1rem] md:mx-[3.8rem]`}
          >
            <div>
              <h2 className="text-[#7D64FF] font-bold tracking-wider text-3xl md:text-4xl  text-center mb-10">
                Reviews
              </h2>
              <div className="grid gap-6 text-center md:grid-cols-3 lg:gap-12">
                <div className="mb-12 md:mb-0">
                  <h5 className="mb-4 text-xl font-semibold">Maria Smantha</h5>
                  <h6 className="mb-4 font-semibold text-primary dark:text-primary-500">
                    Web Developer
                  </h6>

                  <p className="mb-4 flex">
                    <span className="w-7 h-7 ">
                      <Quote />
                    </span>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Quod eos id officiis hic tenetur quae quaerat ad velit ab
                    hic tenetur.
                  </p>
                  <div className="flex space-x-1 justify-center items-center">
                    <StarFill color="#EAB308" className="w-5 h-5" />
                    <StarFill color="#EAB308" className="w-5 h-5" />
                    <StarFill color="#EAB308" className="w-5 h-5" />
                    <StarFill color="#EAB308" className="w-5 h-5" />
                    <StarFill color="#EAB308" className="w-5 h-5" />
                  </div>
                </div>
                <div className="mb-12 md:mb-0">
                  <h5 className="mb-4 text-xl font-semibold">Maria Smantha</h5>
                  <h6 className="mb-4 font-semibold text-primary dark:text-primary-500">
                    Web Developer
                  </h6>

                  <p className="mb-4 flex">
                    <span className="w-7 h-7 ">
                      <Quote />
                    </span>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Quod eos id officiis hic tenetur quae quaerat ad velit ab
                    hic tenetur.
                  </p>
                  <div className="flex space-x-1 justify-center items-center">
                    <StarFill color="#EAB308" className="w-5 h-5" />
                    <StarFill color="#EAB308" className="w-5 h-5" />
                    <StarFill color="#EAB308" className="w-5 h-5" />
                    <StarFill color="#EAB308" className="w-5 h-5" />
                    <StarFill color="#EAB308" className="w-5 h-5" />
                  </div>
                </div>
                <div className="mb-12 md:mb-0">
                  <h5 className="mb-4 text-xl font-semibold">Maria Smantha</h5>
                  <h6 className="mb-4 font-semibold text-primary dark:text-primary-500">
                    Web Developer
                  </h6>

                  <p className="mb-4 flex">
                    <span className="w-7 h-7 ">
                      <Quote />
                    </span>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Quod eos id officiis hic tenetur quae quaerat ad velit ab
                    hic tenetur.
                  </p>
                  <div className="flex space-x-1 justify-center items-center">
                    <StarFill color="#EAB308" className="w-5 h-5" />
                    <StarFill color="#EAB308" className="w-5 h-5" />
                    <StarFill color="#EAB308" className="w-5 h-5" />
                    <StarFill color="#EAB308" className="w-5 h-5" />
                    <StarFill color="#EAB308" className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* review end */}
        </main>
      </>
    </>
  );
};
export default Home;
