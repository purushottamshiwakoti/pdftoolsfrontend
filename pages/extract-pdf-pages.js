import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  AwardFill,
  GearFill,
  HeartFill,
  ShieldFillCheck,
  Infinity as InfinityIcon,
  LightningChargeFill,
  Check2Circle,
  ExclamationTriangle,
} from "react-bootstrap-icons";
import { isMobile } from "react-device-detect";
import { useTranslation } from "next-i18next";
import Selecto from "react-selecto";
import DocumentPreviewSelectable from "../components/DocumentPreviewSelectable";
import ProcessingFilesFormStep from "../components/ProcessingFilesFormStep";
import {
  notify,
  uploadFiles,
  saveNewFiles,
  downloadFiles,
  handleExtractPagesFileSelection,
} from "../helpers/utils.js";
import Steps from "../components/Steps";
import styles from "../styles/UploadContainer.module.css";
import Features from "../components/Features";
import Share from "../components/Share";
import UploadingFilesFormStep from "../components/UploadingFilesFormStep";
import DownloadFilesFormStep from "../components/DownloadFilesFormStep";
import UploadAreaFormStep from "../components/UploadAreaFormStep";
import AvailableTools from "../components/AvailableTools";
import useUploadStats from "../hooks/useUploadStats";
import useDocuments from "../hooks/useDocuments";
import usePages from "../hooks/usePages";
import useToolsData from "../hooks/useToolsData";
import Option from "../components/Option";
import SelectOptionFormStep from "../components/SelectOptionFormStep";
import EditFilesFormStep from "../components/EditFilesFormStep";
import Alerts from "../components/Alerts";
import pageStyles from "../styles/Page.module.css";
import parse from "html-react-parser";

// export async function getStaticProps({ locale }) {
//   const url = `${process.env.API_URL}/extract-pdf-pages`;
//   const response = await fetch(url);
//   const data = await response.json();
//   const { page } = data;
//   return {
//     props: {
//       myData: page,
//       ...(await serverSideTranslations(locale, [
//         "common",
//         "extract-pdf-pages",
//       ])),
//     },
//   };
// }

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "extract-pdf-pages",
      ])),
    },
  };
}

const ExtractPagesPage = () => {
  const [myData, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/data/${"extract-pdf-pages"}`)
      .then((res) => res.json())
      .then((data) => {
        const { page } = data;
        setData(page);
        setLoading(false);
      });
  }, []);

  const { ExtractPagesTool } = useToolsData();
  const mountedRef = useRef(false);
  const [isSpinnerActive, setIsSpinnerActive] = useState(false);
  const [formStep, updateFormStep] = useState(0);
  //loadedfilesCount is used to count the files currently being loaded to show progress spinner while loading the files //
  const [loadedfilesCount, setLoadedFilesCount] = useState(0);
  const [requestSignal, setRequestSignal] = useState();
  const [scrollOptions, setScrollOptions] = useState({});
  const [extractionOption, setExtractionOption] = useState(
    "EXTRACT_SELECTED_PAGES"
  );
  const { t } = useTranslation();

  const {
    currentUploadingFile,
    totalUploadingProgress,
    uploadSpeed,
    uploadTimeLeft,
    resultsInfoVisibility,
    resultsErrors,
    handleResetInitialUploadState,
    handleResetCurrentUploadingStatus,
    handleUpdateCurrentUploadingStatus,
    handleUpdateResultsDisplay,
  } = useUploadStats();

  const {
    documents,
    handleAddDocument,
    handleUpdateDocument,
    handleResetInitialDocumentsState,
  } = useDocuments();

  const {
    pages,
    handleAddPage,
    handleRemovePageSelection,
    handleClearPageSelection,
    handlePageSelection,
    handlePagesSelection,
    handleResetInitialPagesstate,
  } = usePages();

  const handlehandleResetInitialStates = () => {
    handleResetInitialDocumentsState();
    handleResetInitialUploadState();
    handleResetInitialPagesstate();
    updateFormStep(0);
    setExtractionOption("EXTRACT_EVEN_PAGES");
  };

  const handleChange = (event) => {
    //Calling handleExtractPagesFileSelection function to extract pdf pages and their data and insert them in an array
    handleExtractPagesFileSelection(
      event,
      setLoadedFilesCount,
      handleAddDocument,
      handleAddPage,
      t,
      mountedRef,
      ExtractPagesTool
    );
  };

  const extrcatPages = async (
    signal,
    documents,
    updateFormStep,
    extractionOption,
    selectedIndexesArray
  ) => {
    /**
     * Files compressing will be done on three steps:
     *** First step : uploading files one by one to server
     *** Second step : sending requests to server to Start Files Processing, sending individual request for each file
     *** Second step : sending periodic download requests to check if files are done compressing and return the result, sending individual download requests for each file.
     */

    // //updating form step in UI
    updateFormStep(3);
    //First step : Uploading Files & Start Files Processing

    // Array-like object
    const data = {
      selectedIndexesArray: selectedIndexesArray,
      extractionOption: extractionOption,
    };

    const { uploadResponsesArray, uploadResponsesUnseccessfulRequests } =
      await uploadFiles({
        signal: signal,
        documents: documents,
        handleUpdateCurrentUploadingStatus: handleUpdateCurrentUploadingStatus,
        uri: ExtractPagesTool.URI,
        data: data,
      });

    updateFormStep(4);

    // //Second step : Check if files are done processing
    const { downloadResponsesArray, downloadResponsesUnseccessfulRequests } =
      await downloadFiles({
        responseMimeType: ExtractPagesTool.outputFileMimeType,
        signal: signal,
        uploadResponsesArray: uploadResponsesArray,
        handleUpdateDocument: handleUpdateDocument,
      });

    //stroing all failed documents from each step in an array
    const failedFiles = [
      ...uploadResponsesUnseccessfulRequests,
      ...downloadResponsesUnseccessfulRequests,
    ];

    //check if all documents have been processed, no failed documents
    if (downloadResponsesArray.length === 1) {
      handleUpdateResultsDisplay(true, []);
    } else {
      //check if all documents have failed being processed
      handleUpdateResultsDisplay(false, failedFiles);
    }
    //updating form step in UI
    updateFormStep(5);
  };

  const handlePagesExtraction = () => {
    //reset upload status
    handleResetCurrentUploadingStatus();

    //Check if extraction option is "EXTRACT_EVEN_PAGES" and even pages doesn't exist
    if (extractionOption === "EXTRACT_EVEN_PAGES" && pages.length === 1) {
      notify(
        "warning",
        "No matching pages found. Correct your input and try again."
      );
      return;
    }

    //extract selected Pages indexes
    const selectedIndexesArray = [];

    pages.map((page, i) => {
      if (page.selected === true) {
        selectedIndexesArray.push(i + 1);
      }
    });

    //Check if extraction option is 3 === (select specific pages) and no page is selected
    if (
      extractionOption === "EXTRACT_SELECTED_PAGES" &&
      selectedIndexesArray.length === 0
    ) {
      notify(
        "warning",
        "No selected pages found. Please select at least one page."
      );
      return;
    }

    extrcatPages(
      requestSignal,
      documents,
      updateFormStep,
      extractionOption,
      selectedIndexesArray
    );
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

    setScrollOptions({
      container: document.body,
      getScrollPosition: () => [
        document.body.scrollLeft,
        document.body.scrollTop,
      ],
      throttleTime: 0,
      threshold: 0,
    });

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

  useEffect(() => {
    if (documents.length <= 0) {
      updateFormStep(0);
    } else {
      updateFormStep(1);
    }
  }, [documents.length]);

  const pagesComponentsArray = (
    <div
      className={`previewer_content ${styles.previewer_content} d-flex flex-wrap ${styles.previewer_content_scrollable} mb-0`}
    >
      {!isMobile && (
        <Selecto
          dragContainer={".previewer_content"}
          selectableTargets={[".preview"]}
          selectByClick={false}
          selectFromInside={false}
          toggleContinueSelect={["ctrl"]}
          boundContainer={false}
          hitRate={0}
          ratio={0}
          onSelectStart={(e) => {
            if (
              pages.filter((page) => page.selected === true).length > 0 &&
              !e.inputEvent.ctrlKey
            ) {
              handleClearPageSelection();
            }
          }}
          onSelect={(e) => {
            e.added.forEach((el) => {
              const index = parseInt(el.getAttribute("data-index"));
              handlePageSelection(index);
            });
            e.removed.forEach((el) => {
              const removedIndex = parseInt(el.getAttribute("data-index"));
              if (e.selected.length === 0) {
                handleClearPageSelection();
              } else {
                handleRemovePageSelection(removedIndex);
              }
            });
          }}
          scrollOptions={scrollOptions}
          onScroll={(e) => {
            document.body.scrollBy(e.direction[0] * 10, e.direction[1] * 10);
          }}
        />
      )}

      {pages.map((page, i) => {
        return (
          <DocumentPreviewSelectable
            key={"page-" + page.id}
            page={page}
            index={i}
            onSelectionChange={handlePagesSelection}
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
        <meta
          name="Keywords"
          content="extract pdf pages, pdf page extractor, extract specific pages from pdf, free online pdf page extractor."
        />
        {/* You can add your canonical link here */}
        <link
          rel="canonical"
          href={`https://www.example.com${ExtractPagesTool.href}`}
          key="canonical"
        />
        {/* You can add your alternate links here, example: */}
        <link
          rel="alternate"
          href={`https://www.example.com/en${ExtractPagesTool.href}`}
          hrefLang="en"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/es${ExtractPagesTool.href}`}
          hrefLang="es"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/ar${ExtractPagesTool.href}`}
          hrefLang="ar"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/zh${ExtractPagesTool.href}`}
          hrefLang="zh"
        />{" "}
        <link
          rel="alternate"
          href={`https://www.example.com/de${ExtractPagesTool.href}`}
          hrefLang="de"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/fr${ExtractPagesTool.href}`}
          hrefLang="fr"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/it${ExtractPagesTool.href}`}
          hrefLang="it"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/pt${ExtractPagesTool.href}`}
          hrefLang="pt"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/ru${ExtractPagesTool.href}`}
          hrefLang="ru"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/uk${ExtractPagesTool.href}`}
          hrefLang="uk"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/id${ExtractPagesTool.href}`}
          hrefLang="id"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/da${ExtractPagesTool.href}`}
          hrefLang="da"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/nl${ExtractPagesTool.href}`}
          hrefLang="nl"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/hi${ExtractPagesTool.href}`}
          hrefLang="hi"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/ko${ExtractPagesTool.href}`}
          hrefLang="ko"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/ja${ExtractPagesTool.href}`}
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
                  isMultipleInput={false}
                  acceptedMimeType={ExtractPagesTool.acceptedInputMimeType}
                />
              )}

              {formStep === 1 && (
                <SelectOptionFormStep
                  title={t("extract-pdf-pages:select_pages_extraction_option")}
                  action={() => {
                    //CONVERT ENTIRE PAGES
                    if (
                      extractionOption === "EXTRACT_ODD_PAGES" ||
                      extractionOption === "EXTRACT_EVEN_PAGES"
                    ) {
                      handlePagesExtraction();
                    } else if (extractionOption === "EXTRACT_SELECTED_PAGES") {
                      //Next Step select images to extact
                      updateFormStep(2);
                    }
                  }}
                  /* Start Images Extraction or Select Images to be extracted */
                  actionTitle={
                    extractionOption === "EXTRACT_ODD_PAGES" ||
                    extractionOption === "EXTRACT_EVEN_PAGES"
                      ? t("extract-pdf-pages:start_pages_extraction")
                      : t("extract-pdf-pages:select_pages_to_extract")
                  }
                >
                  <Option
                    onChange={() => setExtractionOption("EXTRACT_ODD_PAGES")}
                    isChecked={extractionOption === "EXTRACT_ODD_PAGES"}
                    value="1"
                  >
                    <span>
                      {t("extract-pdf-pages:extract_odd_pages")}{" "}
                      <span className={`${styles.pdf_to_image_option_desc}`}>
                        {t("extract-pdf-pages:extract_odd_pages_description")}
                      </span>
                    </span>
                  </Option>

                  <Option
                    onChange={() => setExtractionOption("EXTRACT_EVEN_PAGES")}
                    isChecked={extractionOption === "EXTRACT_EVEN_PAGES"}
                    value="2"
                  >
                    <span>
                      {t("extract-pdf-pages:extract_even_pages")}{" "}
                      <span className={`${styles.pdf_to_image_option_desc}`}>
                        {t("extract-pdf-pages:extract_even_pages_description")}
                      </span>
                    </span>
                  </Option>

                  <Option
                    onChange={() =>
                      setExtractionOption("EXTRACT_SELECTED_PAGES")
                    }
                    isChecked={extractionOption === "EXTRACT_SELECTED_PAGES"}
                    value="3"
                  >
                    <span>
                      {t("extract-pdf-pages:extract_selected_pages")}{" "}
                      <span className={`${styles.pdf_to_image_option_desc}`}>
                        {t(
                          "extract-pdf-pages:extract_selected_pages_description"
                        )}
                      </span>
                    </span>
                  </Option>
                </SelectOptionFormStep>
              )}

              {formStep === 2 &&
                extractionOption === "EXTRACT_SELECTED_PAGES" && (
                  <EditFilesFormStep
                    showTitle={t("extract-pdf-pages:select_pages_to_extract")}
                    acceptedMimeType={ExtractPagesTool.acceptedInputMimeType}
                    files={pages}
                    enableAddingMoreFiles={false}
                    filesComponents={pagesComponentsArray}
                    handleChange={handleChange}
                    isSpinnerActive={isSpinnerActive}
                    isMultipleInput={false}
                    isFilesSelectionActive={true}
                    isPanelTopSticky={false}
                    isPanelBottomSticky={true}
                    positionPanelBottomItems={styles.spaced}
                    action={handlePagesExtraction}
                    actionTitle={
                      formStep === 0
                        ? t("extract-pdf-pages:select_pages_extraction_option")
                        : t("extract-pdf-pages:start_pages_extraction")
                    }
                  />
                )}

              {formStep === 3 && (
                <UploadingFilesFormStep
                  title={t("common:uploading_file")}
                  uploadTimeLeft={uploadTimeLeft}
                  uploadSpeed={uploadSpeed}
                  totalUploadingProgress={totalUploadingProgress}
                  currentUploadingFileName={currentUploadingFile?.fileName}
                  currentUploadingFileSize={currentUploadingFile?.fileSize}
                />
              )}

              {formStep === 4 && (
                <ProcessingFilesFormStep
                  progress={t("extract-pdf-pages:extracting_pages")}
                />
              )}

              {formStep === 5 && (
                <DownloadFilesFormStep
                  title={t("extract-pdf-pages:pages_extraction_is_complete")}
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
              {/* {t("extract-pdf-pages:article_title")} */}
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
export default ExtractPagesPage;
