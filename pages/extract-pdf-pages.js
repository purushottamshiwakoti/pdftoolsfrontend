import parse from "html-react-parser";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { Check2Circle, ExclamationTriangle } from "react-bootstrap-icons";
import { isMobile } from "react-device-detect";
import Selecto from "react-selecto";
import Alerts from "../components/Alerts";
import DocumentPreviewSelectable from "../components/DocumentPreviewSelectable";
import DownloadFilesFormStep from "../components/DownloadFilesFormStep";
import EditFilesFormStep from "../components/EditFilesFormStep";
import Features from "../components/Features";
import Option from "../components/Option";
import ProcessingFilesFormStep from "../components/ProcessingFilesFormStep";
import SelectOptionFormStep from "../components/SelectOptionFormStep";
import Share from "../components/Share";
import Steps from "../components/Steps";
import UploadAreaFormStep from "../components/UploadAreaFormStep";
import UploadingFilesFormStep from "../components/UploadingFilesFormStep";
import {
  downloadFiles,
  handleExtractPagesFileSelection,
  notify,
  saveNewFiles,
  uploadFiles,
} from "../helpers/utils.js";
import useDocuments from "../hooks/useDocuments";
import usePages from "../hooks/usePages";
import useToolsData from "../hooks/useToolsData";
import useUploadStats from "../hooks/useUploadStats";
import pageStyles from "../styles/Page.module.css";
import styles from "../styles/UploadContainer.module.css";

import { useRouter } from "next/router";
import { appUrl, dashboardUrl } from "@/lib/url";

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

export async function getServerSideProps() {
  const res = await fetch(`${dashboardUrl}/page/extract-pdf-pages`, {
    cache: "no-store",
  });
  const { page } = await res.json();
  return {
    props: {
      myData: page,
    },
  };
}

const ExtractPagesPage = ({ myData }) => {
  const router = useRouter();
  const currentUrl = router.asPath;
  const isLoading = false;

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
  let t;

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
        <title>{myData.metaTitle ? myData.metaTitle : myData.title}</title>
        <meta
          name="description"
          content={
            myData.metaDescription
              ? myData.metaDescription
              : myData.shortDescription
          }
        />
        <meta
          name="Keywords"
          content="extract pdf pages, pdf page extractor, extract specific pages from pdf, free online pdf page extractor."
        />
        {myData && (
          <>
            <meta property="og:title" content={myData.ogTitle} />
            <meta property="og:description" content={myData.ogDescription} />
            <meta property="og:image" content={myData.ogImage} />
            <meta property="og:image:alt" content={myData.ogImageAlt} />
          </>
        )}
        <link rel="canonical" href={`${appUrl}${currentUrl}`} key="canonical" />
      </Head>

      <main>
        <header className=" mb-0">
          {/* <h1 className="title">{t("merge-pdf:page_header_title")}</h1> */}

          <h1 className="text-center text-[##262323] text-[40px] font-[800]">
            {myData?.title}
          </h1>
          <p className="text-[##6F6767] text-center text-[16px] leading-[22px] font-[400] mt-[16px]">
            {myData?.shortDescription}
          </p>

          {/* <p className="description">{t("merge-pdf:page_header_text")}</p> */}
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
                  title={"Select Extraction option"}
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
                      ? "Start Pages Extraction"
                      : "Select pages to extract"
                  }
                >
                  <Option
                    onChange={() => setExtractionOption("EXTRACT_ODD_PAGES")}
                    isChecked={extractionOption === "EXTRACT_ODD_PAGES"}
                    value="1"
                  >
                    <span>
                      {"Extract All Odd Pages"}{" "}
                      <span className={`${styles.pdf_to_image_option_desc}`}>
                        {
                          "(Get a new document containing only the odd pages 1,3,5,7 etc from the original)"
                        }
                      </span>
                    </span>
                  </Option>

                  <Option
                    onChange={() => setExtractionOption("EXTRACT_EVEN_PAGES")}
                    isChecked={extractionOption === "EXTRACT_EVEN_PAGES"}
                    value="2"
                  >
                    <span>
                      {"Extract All Even Pages"}{" "}
                      <span className={`${styles.pdf_to_image_option_desc}`}>
                        {
                          "(Get a new document containing only the even pages 2,4,6,8, etc from the original)"
                        }
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
                      {"extract_selected_pages"}{" "}
                      <span className={`${styles.pdf_to_image_option_desc}`}>
                        {
                          "(Get a new document containing only the desired pages from the original)"
                        }
                      </span>
                    </span>
                  </Option>
                </SelectOptionFormStep>
              )}

              {formStep === 2 &&
                extractionOption === "EXTRACT_SELECTED_PAGES" && (
                  <EditFilesFormStep
                    showTitle={"Select pages to extract"}
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
                        ? "Select Extraction option"
                        : "Start Pages Extraction"
                    }
                  />
                )}

              {formStep === 3 && (
                <UploadingFilesFormStep
                  title={"Uploading file"}
                  uploadTimeLeft={uploadTimeLeft}
                  uploadSpeed={uploadSpeed}
                  totalUploadingProgress={totalUploadingProgress}
                  currentUploadingFileName={currentUploadingFile?.fileName}
                  currentUploadingFileSize={currentUploadingFile?.fileSize}
                />
              )}

              {formStep === 4 && (
                <ProcessingFilesFormStep progress={"Extracting Pages"} />
              )}

              {formStep === 5 && (
                <DownloadFilesFormStep
                  title={"Your page(s) extraction is complete!"}
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
        <section className=" ">
          <article className={`mt-[100px] `}>
            <div className="lg:flex ">
              <header className="">
                <h4 className="text-[#262323] lg:w-[200%] text-[32px] font-[600] tracking-wide">
                  {myData?.longDescriptionTitle}
                </h4>
              </header>

              <section className="lg:ml-[220px] text-[16px] font-[400] leading-[24px] lg:mt-0 mt-5 text-[##6F6767]">
                {myData?.longDescription && parse(myData.longDescription)}
              </section>
            </div>
          </article>
        </section>

        {/* Article End */}
        {/* <AvailableTools /> */}
      </main>
    </>
  );
};
export default ExtractPagesPage;
