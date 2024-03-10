import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CardImage,
  Check2Circle,
  ExclamationTriangle,
  FileEarmarkPdf,
  Images,
} from "react-bootstrap-icons";
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
  handlePDFToImageFileSelection,
  saveNewFiles,
  uploadFiles,
} from "../helpers/utils.js";
import useDocuments from "../hooks/useDocuments";
import usePages from "../hooks/usePages";
import useToolsData from "../hooks/useToolsData";
import useUploadStats from "../hooks/useUploadStats";
import pageStyles from "../styles/Page.module.css";
import styles from "../styles/UploadContainer.module.css";

import parse from "html-react-parser";

import { appUrl, dashboardUrl } from "@/lib/url";
import { useRouter } from "next/router";

// export async function getStaticProps({ locale }) {
//   const url = `${process.env.API_URL}/pdf-to-bmp`;
//   const response = await fetch(url);
//   const data = await response.json();
//   const { page } = data;
//   return {
//     props: {
//       myData: page,
//       ...(await serverSideTranslations(locale, ["common", "pdf-to-bmp"])),
//     },
//   };
// }
export async function getStaticProps({ locale }) {
  const res = await fetch(`${dashboardUrl}/page/pdf-to-bmp`);
  const { page } = await res.json();
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "pdf-to-bmp"])),
      myData: page,
    },
  };
}

const PDFToBMPPage = ({ myData }) => {
  const isLoading = false;
  const router = useRouter();
  const currentUrl = router.asPath;

  const { PDFToBMPTool } = useToolsData();
  const mountedRef = useRef(false);
  const [isSpinnerActive, setIsSpinnerActive] = useState(false);
  const [formStep, updateFormStep] = useState(0);
  //loadedfilesCount is used to count the files currently being loaded to show progress spinner while loading the files //
  const [loadedfilesCount, setLoadedFilesCount] = useState(0);
  const [requestSignal, setRequestSignal] = useState();
  const [scrollOptions, setScrollOptions] = useState({});
  const [extractionOption, setExtractionOption] = useState(1);
  const { t } = useTranslation();

  const {
    currentUploadingFile,
    currentUploadedFilesCounter,
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
    setExtractionOption(1);
  };

  const handleChange = (event) => {
    //Calling handlePDFToImageFileSelection function to extract pdf pages and their data and insert them in an array
    handlePDFToImageFileSelection(
      event,
      setLoadedFilesCount,
      handleAddDocument,
      handleAddPage,
      t,
      mountedRef,
      PDFToBMPTool
    );
  };

  const handleImageExtraction = async () => {
    //reset upload status
    handleResetCurrentUploadingStatus();

    //extract selected Pages indexes
    const selectedIndexesArray = [];
    pages.map((page, i) => {
      if (page.selected === true) {
        selectedIndexesArray.push(i + 1);
      }
    });

    /**
     * Files compressing will be done on three steps:
     *** First step : uploading files one by one to server & Start Files Processing
     *** Second step : sending periodic download requests to check if files are done compressing and return the result, sending individual download requests for each file.
     */

    //updating form step in UI
    updateFormStep(3);
    //First step : Uploading Files & Start Files Processing
    // storing selectedIndexesArray in Array-like object
    const data = {
      selectedIndexesArray: selectedIndexesArray,
    };
    const { uploadResponsesArray, uploadResponsesUnseccessfulRequests } =
      await uploadFiles({
        signal: requestSignal,
        documents: documents,
        handleUpdateCurrentUploadingStatus: handleUpdateCurrentUploadingStatus,
        uri: PDFToBMPTool.URI,
        data: data,
      });
    //updating form step in UI
    updateFormStep(4);

    // Second step : Check if files are done processing
    const { downloadResponsesArray, downloadResponsesUnseccessfulRequests } =
      await downloadFiles({
        responseMimeType: PDFToBMPTool.outputFileMimeType,
        signal: requestSignal,
        uploadResponsesArray: uploadResponsesArray,
        handleUpdateDocument: handleUpdateDocument,
      });

    // stroing all failed documents from each step in an array
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
      className={`previewer_content ${styles.previewer_content} d-flex flex-wrap ${styles.previewer_content_scrollable}`}
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
          content="PDF to BMP, convert PDF to BMP, online PDF to BMP converter, free PDF to BMP converter, PDF to BMP conversion tool"
        />
        {/* You can add your canonical link here */}
        <link rel="canonical" href={`${appUrl}${currentUrl}`} key="canonical" />
        {/* <link
          rel="canonical"
          href={`https://www.example.com${PDFToBMPTool.href}`}
          key="canonical"
        /> */}
        {/* You can add your alternate links here, example: */}
        {/* <link
          rel="alternate"
          href={`https://www.example.com/en${PDFToBMPTool.href}`}
          hrefLang="en"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/es${PDFToBMPTool.href}`}
          hrefLang="es"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/ar${PDFToBMPTool.href}`}
          hrefLang="ar"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/zh${PDFToBMPTool.href}`}
          hrefLang="zh"
        />{" "}
        <link
          rel="alternate"
          href={`https://www.example.com/de${PDFToBMPTool.href}`}
          hrefLang="de"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/fr${PDFToBMPTool.href}`}
          hrefLang="fr"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/it${PDFToBMPTool.href}`}
          hrefLang="it"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/pt${PDFToBMPTool.href}`}
          hrefLang="pt"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/ru${PDFToBMPTool.href}`}
          hrefLang="ru"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/uk${PDFToBMPTool.href}`}
          hrefLang="uk"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/id${PDFToBMPTool.href}`}
          hrefLang="id"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/da${PDFToBMPTool.href}`}
          hrefLang="da"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/nl${PDFToBMPTool.href}`}
          hrefLang="nl"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/hi${PDFToBMPTool.href}`}
          hrefLang="hi"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/ko${PDFToBMPTool.href}`}
          hrefLang="ko"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/ja${PDFToBMPTool.href}`}
          hrefLang="ja"
        /> */}
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
          <article className="container">
            <section className={pageStyles.tool_container_wrapper}>
              {/* Container start */}

              {/* Container start */}
              {formStep === 0 && (
                <UploadAreaFormStep
                  handleChange={handleChange}
                  isSpinnerActive={isSpinnerActive}
                  isMultipleInput={false}
                  acceptedMimeType={PDFToBMPTool.acceptedInputMimeType}
                />
              )}

              {formStep === 1 && (
                <SelectOptionFormStep
                  title={t("common:select_conversion_option")}
                  action={() => {
                    //CONVERT ENTIRE PAGES
                    if (extractionOption === 1) {
                      handleImageExtraction();
                    } else {
                      //Next Step select images to extact
                      updateFormStep(2);
                    }
                  }}
                  /* Start Images Extraction or Select Images to be extracted */
                  actionTitle={t("common:next")}
                >
                  <Option
                    onChange={() => setExtractionOption(1)}
                    isChecked={extractionOption === 1}
                    value="all"
                    icon={
                      <>
                        <FileEarmarkPdf size={50} color="#ffa34f" />
                        <ArrowRight size={30} />
                        <CardImage size={50} />
                      </>
                    }
                  >
                    <span className={`${styles.pdf_to_image_option_title}`}>
                      {t("common:convert_all_pages")}
                    </span>
                    <span className={`${styles.pdf_to_image_option_desc}`}>
                      {t("common:convert_all_pages_description")}
                    </span>
                  </Option>

                  <Option
                    onChange={() => setExtractionOption(2)}
                    isChecked={extractionOption === 2}
                    value="selected"
                    icon={
                      <>
                        <FileEarmarkPdf size={50} color="#ffa34f" />
                        <ArrowRight size={30} />
                        <Images size={50} alt="images" />
                      </>
                    }
                  >
                    <span className={`${styles.pdf_to_image_option_title}`}>
                      {t("common:convert_selected_pages")}
                    </span>
                    <span className={`${styles.pdf_to_image_option_desc}`}>
                      {t("common:convert_selected_pages_description")}
                    </span>
                  </Option>
                </SelectOptionFormStep>
              )}

              {formStep === 2 && (
                <EditFilesFormStep
                  showTitle={t("common:select_pages_to_convert")}
                  acceptedMimeType={PDFToBMPTool.acceptedInputMimeType}
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
                  action={() => {
                    handleImageExtraction();
                  }}
                  actionTitle={t("common:start_images_extraction")}
                />
              )}

              {formStep === 3 && (
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
                  currentUploadingFileSize={currentUploadingFile?.file.size}
                />
              )}

              {formStep === 4 && (
                <ProcessingFilesFormStep
                  progress={t("common:extracting_images")}
                />
              )}

              {formStep === 5 && (
                <DownloadFilesFormStep
                  title={t("common:images_extraction_is_complete")}
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
export default PDFToBMPPage;
