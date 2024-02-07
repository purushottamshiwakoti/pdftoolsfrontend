import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

import { useTranslation } from "next-i18next";
import DocumentPreview from "../components/DocumentPreview";

import { ZipFiles, handlePDFToZIPFileSelection } from "../helpers/utils.js";

import EditFilesFormStep from "../components/EditFilesFormStep";
import Features from "../components/Features";
import Share from "../components/Share";
import Steps from "../components/Steps";
import UploadAreaFormStep from "../components/UploadAreaFormStep";
import useDocuments from "../hooks/useDocuments";
import useToolsData from "../hooks/useToolsData";
import pageStyles from "../styles/Page.module.css";
import styles from "../styles/UploadContainer.module.css";

import parse from "html-react-parser";

import { useRouter } from "next/router";
import { appUrl } from "@/lib/url";
// export async function getStaticProps({ locale }) {
//   const url = `${process.env.API_URL}/pdf-to-zip`;
//   const response = await fetch(url);
//   const data = await response.json();
//   const { page } = data;
//   return {
//     props: {
//       myData: page,
//       ...(await serverSideTranslations(locale, ["common", "pdf-to-zip"])),
//     },
//   };
// }

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "pdf-to-zip"])),
    },
  };
}

const PDFToZipPage = () => {
  const [myData, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const router = useRouter();
  const currentUrl = router.asPath;

  useEffect(() => {
    fetch(`/api/data/${"pdf-to-zip"}`)
      .then((res) => res.json())
      .then((data) => {
        const { page } = data;
        setData(page);
        setLoading(false);
      });
  }, []);
  const { PDFToZIPTool } = useToolsData();

  const {
    documents,
    handleAddDocument,
    handleDeleteDocument,
    handleResetInitialDocumentsState,
  } = useDocuments();

  const { t } = useTranslation();

  const mountedRef = useRef(false);
  const [isSpinnerActive, setIsSpinnerActive] = useState(false);
  //loadedfilesCount is used to count the files currently being loaded to show progress spinner while loading the files //
  const [loadedfilesCount, setLoadedFilesCount] = useState(0);

  const handleChange = (event) => {
    //Calling handlePDFToZIPFileSelection function to extract pdf pages and their data and insert them in an array
    handlePDFToZIPFileSelection(
      event,
      setLoadedFilesCount,
      handleAddDocument,
      t,
      mountedRef,
      PDFToZIPTool
    );
  };

  const handleDownload = () => {
    ZipFiles(documents);
  };

  useEffect(() => {
    //set mountedRef to true
    mountedRef.current = true;

    //cleanup function
    return () => {
      //set mounedRef to false
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    // if loadedfilesCount (count of file currently being loaded) is greater than zero than show spinner
    if (loadedfilesCount > 0) {
      //show spinner
      if (mountedRef.current) {
        setIsSpinnerActive(true);
      }
    } else {
      //after all files are loaded, hide spinner
      if (mountedRef.current) {
        setIsSpinnerActive(false);
      }
    }
  }, [loadedfilesCount]);

  const pagesComponentsArray = (
    <div className={`${styles.previewer_content} d-flex flex-wrap`}>
      {documents.map((doc) => {
        return (
          <DocumentPreview
            key={"doc-" + doc.id}
            blob={doc.inputBlob}
            fileName={doc.fileName}
            width={doc.width}
            height={doc.height}
            numberOfPages={doc.numberOfPages}
            degree={doc.previewRotation}
            rotationsCounter={doc.rotationsCounter}
            handleDeleteDocument={(event) => {
              event.preventDefault();
              handleDeleteDocument(doc.id);
            }}
          />
        );
      })}
    </div>
  );
  return (
    <>
      <Head>
        {/* Anything you add here will be added to this page only */}
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
        <meta
          name="Keywords"
          content="PDF to ZIP Conversion, Online PDF to ZIP Converter, Convert PDF to ZIP, PDF to ZIP Compression, PDF to ZIP File Conversion"
        />
        {/* You can add your canonical link here */}
        <link rel="canonical" href={`${appUrl}${currentUrl}`} key="canonical" />
        {/* <link
          rel="canonical"
          href={`https://www.example.com${PDFToZIPTool.href}`}
          key="canonical"
        /> */}
        {/* You can add your alternate links here, example: */}
        {/* <link
          rel="alternate"
          href={`https://www.example.com/en${PDFToZIPTool.href}`}
          hrefLang="en"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/es${PDFToZIPTool.href}`}
          hrefLang="es"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/ar${PDFToZIPTool.href}`}
          hrefLang="ar"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/zh${PDFToZIPTool.href}`}
          hrefLang="zh"
        />{" "}
        <link
          rel="alternate"
          href={`https://www.example.com/de${PDFToZIPTool.href}`}
          hrefLang="de"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/fr${PDFToZIPTool.href}`}
          hrefLang="fr"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/it${PDFToZIPTool.href}`}
          hrefLang="it"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/pt${PDFToZIPTool.href}`}
          hrefLang="pt"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/ru${PDFToZIPTool.href}`}
          hrefLang="ru"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/uk${PDFToZIPTool.href}`}
          hrefLang="uk"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/id${PDFToZIPTool.href}`}
          hrefLang="id"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/da${PDFToZIPTool.href}`}
          hrefLang="da"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/nl${PDFToZIPTool.href}`}
          hrefLang="nl"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/hi${PDFToZIPTool.href}`}
          hrefLang="hi"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/ko${PDFToZIPTool.href}`}
          hrefLang="ko"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/ja${PDFToZIPTool.href}`}
          hrefLang="ja"
        /> */}
      </Head>

      <main>
        <header className="page_section header mb-0">
          {isLoading ? (
            <>
              <h1 className="title  bg-slate-200 h-6  w-[12rem] lg:w-[25rem] animate-pulse"></h1>
              <p className=" bg-slate-200 h-6 w-[20rem] lg:w-[35rem] animate-pulse"></p>
            </>
          ) : (
            <>
              <h1 className="title">{myData?.title}</h1>
              <p className="description">{myData?.shortDescription}</p>
            </>
          )}
        </header>
        <section className="page_section mt-0">
          <article className="container ">
            <section className={pageStyles.tool_container_wrapper}>
              {/* Container start */}

              {documents.length <= 0 ? (
                <UploadAreaFormStep
                  handleChange={handleChange}
                  isSpinnerActive={isSpinnerActive}
                  isMultipleInput={true}
                  acceptedMimeType={PDFToZIPTool.acceptedInputMimeType}
                />
              ) : (
                <EditFilesFormStep
                  acceptedMimeType={PDFToZIPTool.acceptedInputMimeType}
                  files={documents}
                  enableAddingMoreFiles={true}
                  filesComponents={pagesComponentsArray}
                  handleChange={handleChange}
                  isSpinnerActive={isSpinnerActive}
                  isMultipleInput={true}
                  isFilesSelectionActive={false}
                  isPanelTopSticky={false}
                  isPanelBottomSticky={false}
                  positionPanelBottomItems={styles.centered}
                  deleteFiles={handleResetInitialDocumentsState}
                  action={() => handleDownload()}
                  actionTitle={t("pdf-to-zip:create_zip")}
                />
              )}

              {/* Conatiner end */}
            </section>
          </article>
        </section>
        {/* steps Start */}
        {isLoading ? (
          <div className="flex items-center justify-center w-full ">
            <div className="bg-[#F1EEFF] w-[20rem] md:w-[40rem] lg:w-[72rem] p-4 rounded-md h-[20rem] lg:h-[30rem]">
              <p className="mt-3 lg:mt-10  items-center justify-center flex">
                <span className="bg-slate-200 h-6 w-[10rem] md:w-[20rem] lg:w-[25rem] animate-pulse"></span>
              </p>
              <div className="mt-16 space-y-10">
                <div className="bg-slate-200 h-6 lg:w-[25rem] animate-pulse"></div>
                <div className="bg-slate-200 h-6 lg:w-[25rem] animate-pulse"></div>
                <div className="bg-slate-200 h-6 lg:w-[25rem] animate-pulse"></div>
              </div>
            </div>
          </div>
        ) : (
          <Steps
            // title={t("merge-pdf:how_to_title")}
            title={myData?.stepDescription}
            // stepsArray={[
            //   {
            //     number: 1,
            //     description: t("merge-pdf:how_to_step_one"),
            //   },
            //   {
            //     number: 2,
            //     description: t("merge-pdf:how_to_step_two"),
            //   },
            //   {
            //     number: 3,
            //     description: t("merge-pdf:how_to_step_three"),
            //   },
            //   {
            //     number: 4,
            //     description: t("merge-pdf:how_to_step_four"),
            //   },
            //   {
            //     number: 5,
            //     description: t("merge-pdf:how_to_step_five"),
            //   },
            // ]}
            stepsArray={
              myData?.Steps &&
              myData.Steps.map((item, index) => ({
                number: index + 1,
                description: item.title,
              }))
            }
          />
        )}
        {/* steps end */}
        {/* features start */}
        {isLoading ? (
          <div className="flex items-center justify-center w-full   ">
            <div className="bg-[#F1EEFF]  w-[20rem] md:w-[40rem] lg:w-[72rem] p-4 rounded-md h-[30rem] mt-10">
              <p className="mt-3 lg:mt-10  items-center justify-center flex">
                <span className="bg-slate-200 h-6  w-[10rem] md:w-[20rem] lg:w-[25rem] animate-pulse"></span>
              </p>
              <div className="mt-16 space-x-10 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
                <div className="bg-slate-200 h-[14rem] lg:h-[15rem] lg:w-[20rem] animate-pulse"></div>
                <div className="bg-slate-200 lg:h-[15rem] lg:w-[20rem] animate-pulse"></div>
                <div className="bg-slate-200 lg:h-[15rem] lg:w-[20rem] animate-pulse"></div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Features
              // title={t("common:features_title")}
              title={myData?.featuresTitle}
              // featuresArray={[
              //   {
              //     title: "Fast",
              //     description: t("merge-pdf:feature_one_text"),
              //     icon: <LightningChargeFill />,
              //   },
              //   {
              //     title: t("merge-pdf:feature_two_title"),
              //     description: t("merge-pdf:feature_two_text"),
              //     icon: <InfinityIcon />,
              //   },
              //   {
              //     title: t("merge-pdf:feature_three_title"),
              //     description: t("merge-pdf:feature_three_text"),
              //     icon: <GearFill />,
              //   },
              //   {
              //     title: t("merge-pdf:feature_four_title"),
              //     description: t("merge-pdf:feature_four_text"),
              //     icon: <ShieldFillCheck />,
              //   },
              //   {
              //     title: t("merge-pdf:feature_five_title"),
              //     description: t("merge-pdf:feature_five_text"),
              //     icon: <HeartFill />,
              //   },

              //   {
              //     title: t("merge-pdf:feature_six_title"),
              //     description: t("merge-pdf:feature_six_text"),
              //     icon: <AwardFill />,
              //   },
              // ]}
              featuresArray={
                myData?.Features &&
                myData.Features.map((item) => ({
                  title: item.title,
                  description: item.description,
                  icon: item.icon,
                }))
              }
            />
          </>
        )}
        {/* features end */}
        {/* Article Start */}
        <section className="page_section">
          <article className={`container ${pageStyles.article_section}`}>
            <header className={pageStyles.article_header}>
              {isLoading ? (
                <div className=" flex md:ml-[10rem] lg:ml-[20rem]  bg-slate-200 h-6 md:w-[20rem] lg:w-[25rem] animate-pulse">
                  {/* {t("merge-pdf:article_title")} */}
                </div>
              ) : (
                <h4 className={pageStyles.title_section}>
                  {myData?.longDescriptionTitle}
                  {/* {t("merge-pdf:article_title")} */}
                </h4>
              )}
              <div
                className={`${pageStyles.divider} ${pageStyles.mx_auto}`}
              ></div>
            </header>

            {isLoading ? (
              <section>
                <p className=" bg-slate-200 h-4 lg:w-[55rem] animate-pulse"></p>
                <p className=" bg-slate-200 h-4 lg:w-[55rem] animate-pulse  mt-2"></p>
                <p className=" bg-slate-200 h-4 lg:w-[55rem] animate-pulse  mt-2"></p>
                <p className=" bg-slate-200 h-4 lg:w-[55rem] animate-pulse  mt-2"></p>
                <p className=" bg-slate-200 h-4 lg:w-[55rem] animate-pulse  mt-2"></p>
                <p className=" bg-slate-200 h-4 lg:w-[55rem] animate-pulse  mt-2"></p>
              </section>
            ) : (
              <section className={pageStyles.article_content}>
                {/* <p>{t("merge-pdf:article_paragraph_01")}</p>
              <p>{t("merge-pdf:article_paragraph_02")}</p>
              <p>{t("merge-pdf:article_paragraph_03")}</p> */}
                {myData?.longDescription && parse(myData.longDescription)}
              </section>
            )}
          </article>
        </section>
        {/* Article End */}
        {/* <AvailableTools /> */}
        <Share />
      </main>
    </>
  );
};
export default PDFToZipPage;
