import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { Check2Circle, ExclamationTriangle } from "react-bootstrap-icons";
import { isMobile } from "react-device-detect";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import Selecto from "react-selecto";
import Alerts from "../components/Alerts.js";
import DownloadFilesFormStep from "../components/DownloadFilesFormStep";
import Features from "../components/Features";
import ImageDragLayer from "../components/ImageDragLayer";
import ImagePreviewDraggable from "../components/ImagePreviewDraggable";
import ProcessingFilesFormStep from "../components/ProcessingFilesFormStep";
import SetPagesSettingsFormStep from "../components/SetPagesSettingsFormStep";
import Share from "../components/Share";
import Steps from "../components/Steps";
import UploadAreaFormStep from "../components/UploadAreaFormStep";
import {
  convertImageToPDF,
  handleImagesSelection,
  handleMerge,
  saveNewFiles,
} from "../helpers/utils.js";
import useImages from "../hooks/useImages";
import useToolsData from "../hooks/useToolsData";
import useUploadStats from "../hooks/useUploadStats";
import pageStyles from "../styles/Page.module.css";
import styles from "../styles/UploadContainer.module.css";

import parse from "html-react-parser";

import { appUrl, dashboardUrl } from "@/lib/url";
import { useRouter } from "next/router";

// export async function getStaticProps({ locale }) {
//   const url = `${process.env.API_URL}/bmp-to-pdf`;
//   const response = await fetch(url);
//   const data = await response.json();
//   const { page } = data;
//   return {
//     props: {
//       myData: page,
//       ...(await serverSideTranslations(locale, ["common", "bmp-to-pdf"])),
//     },
//   };
// }
export async function getStaticProps({ locale }) {
  const res = await fetch(`${dashboardUrl}/page/bmp-to-pdf`,{
    cache:"no-store"
  });
  const { page } = await res.json();
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "bmp-to-pdf"])),
      myData: page,
    },
  };
}

const BMPToPDFPage = ({ myData }) => {
  console.log(myData);
  const router = useRouter();
  const currentUrl = router.asPath;

  const { BMPToPDFTool } = useToolsData();
  const {
    pages,
    hoverIndex,
    insertIndex,
    handleResetInitialState,
    handleAddPage,
    handleDeletePage,
    handleUpdateDocument,
    //Pages Organization
    handleSetInsertIndex,
    handleRearrangePages,
    //Pages selection
    handlePageSelection,
    handleRemovePageSelection,
    handlePagesSelection,
    handleDeleteSelectedPages,
    handleRotateSelectedPagesToRight,
    handleClearPageSelection,
    //Pages Settings
    handleRotatePageRight,
    handleOrientationChange,
    handlePageSizeChange,
    handleMarginChange,
  } = useImages();

  const {
    resultsInfoVisibility,
    resultsErrors,
    handleResetInitialUploadState,
    handleResetCurrentUploadingStatus,
    handleUpdateResultsDisplay,
  } = useUploadStats();

  const { t } = useTranslation();

  const [isSpinnerActive, setIsSpinnerActive] = useState(false);
  const [formStep, updateFormStep] = useState(0);
  const mountedRef = useRef(false);
  //loadedfilesCount is used to count the files currently being loaded to show progress spinner while loading the files //
  const [loadedfilesCount, setLoadedFilesCount] = useState(0);
  const [scrollOptions, setScrollOptions] = useState({});
  const [mergePages, setMergePages] = useState(true);
  const opts = {
    scrollAngleRanges: [
      { start: 30, end: 150 },
      { start: 210, end: 330 },
    ],
  };
  const [requestSignal, setRequestSignal] = useState();

  const handleChange = (event) => {
    //Calling handleImagesSelection function to extract pdf pages and their data and insert them in an array
    handleImagesSelection(
      event,
      setLoadedFilesCount,
      handleAddPage,
      t,
      mountedRef,
      BMPToPDFTool
    );
    //To empty input value; to input same file many time in a row
    event.target.value = null;
  };

  const handleconvertBMPToPDF = async () => {
    //reset upload status
    handleResetCurrentUploadingStatus();

    // updating form step in UI
    updateFormStep(2);

    // Uploading Files and converting images to pdf
    const { successfullyConvertedFiles, failedFiles } = await convertImageToPDF(
      BMPToPDFTool.outputFileMimeType,
      requestSignal,
      pages,
      handleUpdateDocument,
      BMPToPDFTool.URI
    );

    //check if all documents have been processed, no failed documents
    if (successfullyConvertedFiles.length === pages.length) {
      handleUpdateResultsDisplay(true, []);
    } else {
      //check if all documents have failed being processed
      if (failedFiles.length === pages.length) {
        handleUpdateResultsDisplay(false, failedFiles);
      } else {
        //If some documents have being successfuly processed and some documents have failed being processed
        handleUpdateResultsDisplay(true, failedFiles);
      }
    }
    //updating form step in UI
    updateFormStep(3);
  };

  const handleCheckboxChange = (e) => {
    setMergePages(e.target.checked);
  };

  const handlehandleResetInitialStates = () => {
    handleResetInitialState();
    handleResetInitialUploadState();
    setMergePages(true);
    updateFormStep(0);
  };

  const handleDownload = () => {
    if (mergePages) {
      // Merge all pages into a single pdf file
      handleMerge(pages, BMPToPDFTool.newFileNameSuffix);
    } else {
      // Download each page in a separate pdf file
      saveNewFiles(pages);
    }
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
    if (pages.length <= 0) {
      updateFormStep(0);
    } else {
      updateFormStep(1);
    }
  }, [pages.length]);

  const pagesComponentsArray = (
    <DndProvider
      backend={isMobile ? TouchBackend : HTML5Backend}
      options={isMobile ? opts : null}
    >
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
        <ImageDragLayer />
        {pages.map((page, i) => {
          const insertLineOnLeft = hoverIndex === i && insertIndex === i;
          const insertLineOnRight = hoverIndex === i && insertIndex === i + 1;
          return (
            <ImagePreviewDraggable
              key={"page-" + page.id}
              index={i}
              page={page}
              selectedPages={pages.filter((page) => page.selected === true)}
              handleRearrangePages={handleRearrangePages}
              handleSetInsertIndex={handleSetInsertIndex}
              onSelectionChange={handlePagesSelection}
              handleClearPageSelection={handleClearPageSelection}
              insertLineOnLeft={insertLineOnLeft}
              insertLineOnRight={insertLineOnRight}
              handleDeletePage={() => handleDeletePage(page.id)}
              handleRotatePageRight={(e) => {
                // Stop event bubbling after click event handler executes, to prevent parent click event from unselecting/selecting page
                e.stopPropagation();
                handleRotatePageRight(page.id);
              }}
            />
          );
        })}
      </div>
    </DndProvider>
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

        <>
          <meta property="og:title" content={myData.ogTitle} />
          <meta property="og:description" content={myData.ogDescription} />
          <meta property="og:image" content={myData.ogImage} />
          <meta property="og:image:alt" content={myData.ogImageAlt} />
        </>
        <meta
          name="Keywords"
          content="BMP to PDF converter, convert BMP to PDF online, free BMP to PDF converter, BMP to PDF online conversion, BMP to PDF online converter"
        />
        <link rel="canonical" href={`${appUrl}${currentUrl}`} key="canonical" />
        {/* You can add your canonical link here */}
        {/* <link
          rel="canonical"
          href={`https://www.example.com${BMPToPDFTool.href}`}
          key="canonical"
        /> */}
        {/* You can add your alternate links here, example: */}
        {/* <link
          rel="alternate"
          href={`https://www.example.com/en${BMPToPDFTool.href}`}
          hrefLang="en"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/es${BMPToPDFTool.href}`}
          hrefLang="es"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/ar${BMPToPDFTool.href}`}
          hrefLang="ar"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/zh${BMPToPDFTool.href}`}
          hrefLang="zh"
        />{" "}
        <link
          rel="alternate"
          href={`https://www.example.com/de${BMPToPDFTool.href}`}
          hrefLang="de"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/fr${BMPToPDFTool.href}`}
          hrefLang="fr"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/it${BMPToPDFTool.href}`}
          hrefLang="it"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/pt${BMPToPDFTool.href}`}
          hrefLang="pt"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/ru${BMPToPDFTool.href}`}
          hrefLang="ru"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/uk${BMPToPDFTool.href}`}
          hrefLang="uk"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/id${BMPToPDFTool.href}`}
          hrefLang="id"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/da${BMPToPDFTool.href}`}
          hrefLang="da"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/nl${BMPToPDFTool.href}`}
          hrefLang="nl"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/hi${BMPToPDFTool.href}`}
          hrefLang="hi"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/ko${BMPToPDFTool.href}`}
          hrefLang="ko"
        />
        <link
          rel="alternate"
          href={`https://www.example.com/ja${BMPToPDFTool.href}`}
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

              {formStep === 0 && (
                <UploadAreaFormStep
                  handleChange={handleChange}
                  isSpinnerActive={isSpinnerActive}
                  isMultipleInput={true}
                  acceptedMimeType={BMPToPDFTool.acceptedInputMimeType}
                />
              )}

              {formStep === 1 && (
                <SetPagesSettingsFormStep
                  acceptedMimeType={BMPToPDFTool.acceptedInputMimeType}
                  files={pages}
                  enableAddingMoreFiles={true}
                  filesComponents={pagesComponentsArray}
                  handleChange={handleChange}
                  isSpinnerActive={isSpinnerActive}
                  isMultipleInput={true}
                  deleteFiles={handleDeleteSelectedPages}
                  rotateFilesToRight={handleRotateSelectedPagesToRight}
                  action={handleconvertBMPToPDF}
                  actionTitle={t("common:convert_to_pdf")}
                  handleCheckboxChange={handleCheckboxChange}
                  handleMarginChange={handleMarginChange}
                  handleOrientationChange={handleOrientationChange}
                  handlePageSizeChange={handlePageSizeChange}
                  mergePages={mergePages}
                />
              )}

              {formStep === 2 && (
                <ProcessingFilesFormStep
                  // progress={t("common:converting_images_to_PDF")}
                  progress={t("common:converting_images_to_PDF")}
                />
              )}

              {formStep === 3 && (
                <DownloadFilesFormStep
                  title={t("common:images_conversion_is_complete")}
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
        {/* steps end */}

        {/* features start */}

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
export default BMPToPDFPage;
