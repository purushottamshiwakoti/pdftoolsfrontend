import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  Infinity as InfinityIcon,
  LightningChargeFill,
  GearFill,
  HeartFill,
  ShieldFillCheck,
  AwardFill,
  Check2Circle,
  ExclamationTriangle,
} from "react-bootstrap-icons";
import { useTranslation } from "next-i18next";
import DocumentPreview from "../components/DocumentPreview";
import {
  handleFileSelection,
  uploadFiles,
  downloadFiles,
  saveNewFiles,
} from "../helpers/utils.js";
import ProcessingFilesFormStep from "../components/ProcessingFilesFormStep";

import styles from "../styles/UploadContainer.module.css";
import Steps from "../components/Steps";
import Features from "../components/Features";
import Share from "../components/Share";
import UploadingFilesFormStep from "../components/UploadingFilesFormStep";
import DownloadFilesFormStep from "../components/DownloadFilesFormStep";
import UploadAreaFormStep from "../components/UploadAreaFormStep";
import EditFilesFormStep from "../components/EditFilesFormStep";
import AvailableTools from "../components/AvailableTools";
import useUploadStats from "../hooks/useUploadStats";
import useDocuments from "../hooks/useDocuments";
import useToolsData from "../hooks/useToolsData";
import Alerts from "../components/Alerts";
import pageStyles from "../styles/Page.module.css";

import parse from "html-react-parser";

// export async function getStaticProps({ locale }) {
//   const url = `${process.env.API_URL}/pdf-to-word`;
//   const response = await fetch(url);
//   const data = await response.json();
//   const { page } = data;
//   return {
//     props: {
//       myData: page,
//       ...(await serverSideTranslations(locale, ["common", "pdf-to-word"])),
//     },
//   };
// }

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "pdf-to-word"])),
    },
  };
}

const PDFToWordPage = () => {
  const [myData, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/data/${"pdf-to-word"}`)
      .then((res) => res.json())
      .then((data) => {
        const { page } = data;
        setData(page);
        setLoading(false);
      });
  }, []);
  const { PDFToWORDTool } = useToolsData();
  const mountedRef = useRef(false);
  const [isSpinnerActive, setIsSpinnerActive] = useState(false);
  const [formStep, updateFormStep] = useState(0);
  //loadedfilesCount is used to count the files currently being loaded to show progress spinner while loading the files //
  const [loadedfilesCount, setLoadedFilesCount] = useState(0);
  const [requestSignal, setRequestSignal] = useState();
  const { t } = useTranslation();

  const {
    currentUploadingFile,
    currentUploadedFilesCounter,
    currentProccessedFilesCounter,
    totalUploadingProgress,
    uploadSpeed,
    uploadTimeLeft,
    resultsInfoVisibility,
    resultsErrors,
    handleResetInitialUploadState,
    handleResetCurrentUploadingStatus,
    handleUpdateCurrentUploadingStatus,
    handleUpdateResultsDisplay,
    handleResetCurrentProcessingStatus,
    handleUpdateCurrentProcessingStatus,
  } = useUploadStats();

  const {
    documents,
    handleAddDocument,
    handleUpdateDocument,
    handleDeleteDocument,
    handleResetInitialDocumentsState,
  } = useDocuments();

  const handleChange = (event) => {
    //Calling handleFileSelection function to extract pdf pages and their data and insert them in an array
    handleFileSelection(
      event,
      setLoadedFilesCount,
      handleAddDocument,
      t,
      mountedRef,
      PDFToWORDTool
    );
  };

  const handleConvertPDFToWord = async () => {
    //reset upload status
    handleResetCurrentUploadingStatus();
    handleResetCurrentProcessingStatus();
    //convert Files
    /**
     **  Files compressing will be done on three steps:
     *** First step : uploading files one by one to server and start processing the files
     *** Second step : sending periodic download requests to check if files are done compressing and return the result, sending individual download requests for each file.
     */

    //updating form step in UI
    updateFormStep(2);
    //First step : Uploading Files & Start Files Processing
    const { uploadResponsesArray, uploadResponsesUnseccessfulRequests } =
      await uploadFiles({
        signal: requestSignal,
        documents,
        handleUpdateCurrentUploadingStatus,
        uri: PDFToWORDTool.URI,
      });

    //updating form step in UI
    updateFormStep(3);

    //Second step : Check if files are done processing
    const { downloadResponsesArray, downloadResponsesUnseccessfulRequests } =
      await downloadFiles({
        responseMimeType: PDFToWORDTool.outputFileMimeType,
        signal: requestSignal,
        uploadResponsesArray,
        handleUpdateDocument,
        handleUpdateCurrentProcessingStatus,
      });

    //stroing all failed documents from each step in an array
    const failedFiles = [
      ...uploadResponsesUnseccessfulRequests,
      ...downloadResponsesUnseccessfulRequests,
    ];

    //check if all documents have been processed, no failed documents
    if (downloadResponsesArray.length === documents.length) {
      handleUpdateResultsDisplay(true, []);
    } else {
      //check if all documents have failed being processed
      if (failedFiles.length === documents.length) {
        handleUpdateResultsDisplay(false, failedFiles);
      } else {
        //If some documents have being successfuly processed and some documents have failed being processed
        handleUpdateResultsDisplay(true, failedFiles);
      }
    }
    //updating form step in UI
    updateFormStep(4);
  };

  const handlehandleResetInitialStates = () => {
    handleResetInitialDocumentsState();
    handleResetInitialUploadState();
    updateFormStep(0);
  };

  const handleDownload = () => {
    saveNewFiles(documents);
  };

  useEffect(() => {
    //set mountedRef to true
    mountedRef.current = true;

    //Axios AbortController to abort requests
    const controller = new AbortController();
    const signal = controller.signal;
    setRequestSignal(signal);

    //cleanup function
    return () => {
      // cancel all the requests
      controller.abort();
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
            id={doc.id}
            blob={doc.inputBlob}
            fileName={doc.fileName}
            width={doc.width}
            height={doc.height}
            degree={doc.previewRotation}
            numberOfPages={doc.numberOfPages}
            handleDeleteDocument={(event) => {
              event.preventDefault();
              handleDeleteDocument(doc.id);
            }}
          />
        );
      })}
    </div>
  );

  useEffect(() => {
    if (documents.length <= 0) {
      updateFormStep(0);
    } else {
      updateFormStep(1);
    }
  }, [documents.length]);

  return (
    <>
      <Head>
        {/* Anything you add here will be added to this page only */}
        <title>Convert PDF to Word | Best PDF to Word Converter Online</title>
        <meta
          name="description"
          content="Convert your PDF documents to editable Microsoft Word format with our online tool. Retain the formatting, layout, and images of your PDF files in the resulting Word document."
        />
        <meta
          name="Keywords"
          content="PDF to Word, convert PDF to Word, PDF to Word converter, online PDF to Word converter, convert PDF to editable Word, PDF to Word online, PDF to Word conversion tool"
        />
        {/* You can add your canonical link here */}
        <link
          rel="canonical"
          href={`https://www.example.com${PDFToWORDTool.href}`}
          key="canonical"
        />
        {/* You can add your alternate links here, example: */}
        <link
          rel="alternate"
          href={`https://www.example.com/en${PDFToWORDTool.href}`}
          hrefLang="en"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/es${PDFToWORDTool.href}`}
          hrefLang="es"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/ar${PDFToWORDTool.href}`}
          hrefLang="ar"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/zh${PDFToWORDTool.href}`}
          hrefLang="zh"
        />{" "}
        <link
          rel="alternate"
          href={`https://www.example.com/de${PDFToWORDTool.href}`}
          hrefLang="de"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/fr${PDFToWORDTool.href}`}
          hrefLang="fr"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/it${PDFToWORDTool.href}`}
          hrefLang="it"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/pt${PDFToWORDTool.href}`}
          hrefLang="pt"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/ru${PDFToWORDTool.href}`}
          hrefLang="ru"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/uk${PDFToWORDTool.href}`}
          hrefLang="uk"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/id${PDFToWORDTool.href}`}
          hrefLang="id"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/da${PDFToWORDTool.href}`}
          hrefLang="da"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/nl${PDFToWORDTool.href}`}
          hrefLang="nl"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/hi${PDFToWORDTool.href}`}
          hrefLang="hi"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/ko${PDFToWORDTool.href}`}
          hrefLang="ko"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/ja${PDFToWORDTool.href}`}
          hrefLang="ja"
        />
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
              {formStep === 0 && (
                <UploadAreaFormStep
                  handleChange={handleChange}
                  isSpinnerActive={isSpinnerActive}
                  isMultipleInput={true}
                  acceptedMimeType={PDFToWORDTool.acceptedInputMimeType}
                />
              )}

              {formStep === 1 && (
                <EditFilesFormStep
                  acceptedMimeType={PDFToWORDTool.acceptedInputMimeType}
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
                  action={() => handleConvertPDFToWord()}
                  actionTitle={t("pdf-to-word:convert_to_word")}
                />
              )}

              {formStep === 2 && (
                <UploadingFilesFormStep
                  title={`${t(
                    "common:uploading_file"
                  )} ${currentUploadedFilesCounter} ${t("common:of")} ${
                    documents.length
                  }`}
                  uploadTimeLeft={uploadTimeLeft}
                  uploadSpeed={uploadSpeed}
                  totalUploadingProgress={totalUploadingProgress}
                  currentUploadingFileName={currentUploadingFile?.fileName}
                  currentUploadingFileSize={
                    currentUploadingFile?.inputBlob.size
                  }
                />
              )}

              {formStep === 3 && (
                <ProcessingFilesFormStep
                  progress={`${t(
                    "common:processing"
                  )} ${currentProccessedFilesCounter} ${t("common:of")} ${
                    documents.length
                  }`}
                />
              )}

              {formStep === 4 && (
                <DownloadFilesFormStep
                  title={
                    documents.length === 1
                      ? t("common:your_document_is_ready")
                      : documents.length > 1
                      ? t("common:your_documents_are_ready")
                      : ""
                  }
                  handleDownload={handleDownload}
                  handleResetInitialState={handlehandleResetInitialStates}
                >
                  {resultsInfoVisibility && (
                    <div className="row w-100 d-flex justify-content-center text-center mt-5 mb-5">
                      <Check2Circle size={130} color="#7d64ff" />
                    </div>
                  )}
                  {resultsErrors.length > 0 && (
                    <Alerts
                      alerts={resultsErrors}
                      type="error"
                      icon={<ExclamationTriangle size={22} />}
                    />
                  )}
                </DownloadFilesFormStep>
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
                <h2 className=" flex md:ml-[10rem] lg:ml-[20rem]  bg-slate-200 h-6 md:w-[20rem] lg:w-[25rem] animate-pulse">
                  {/* {t("merge-pdf:article_title")} */}
                </h2>
              ) : (
                <h2 className={pageStyles.title_section}>
                  {myData?.longDescriptionTitle}
                  {/* {t("merge-pdf:article_title")} */}
                </h2>
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
        <AvailableTools />
        <Share />
      </main>
    </>
  );
};
export default PDFToWordPage;
