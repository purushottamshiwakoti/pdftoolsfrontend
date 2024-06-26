import GoodCompany from "@/components/GoodCompany";
import Reviews from "@/components/Reviews";
import WhyChooseUs from "@/components/WhyChooseUs";
import { Button } from "@/components/ui/button";
import parse from "html-react-parser";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { MergePdf } from "@/components/icons/Icon";
import useToolsIndexData from "@/hooks/useToolsIndexData";
import { appUrl, dashboardUrl } from "@/lib/url";
import { useRouter } from "next/router";
export const dynamic = "force-dynamic";

export async function getServerSideProps(context) {
  const [res, choose, reviews, company, seo] = await Promise.all([
    fetch(`${dashboardUrl}/other/home`, { cache: "no-cache" }),
    fetch(`${dashboardUrl}/choose-us`, { next: { revalidate: 1 } }),
    fetch(`${dashboardUrl}/reviews`, { cache: "no-store" }),
    fetch(`${dashboardUrl}/company-image`, { cache: "no-store" }),
    fetch(`${dashboardUrl}/seo-settings`, { cache: "no-store" }),
  ]);

  let seoData = await seo.json();
  seoData = seoData.data;

  let CompanyImagesData = await company.json();
  CompanyImagesData = CompanyImagesData.data;
  let reviewsData = await reviews.json();
  reviewsData = reviewsData.data;

  const { data } = await choose.json();

  const { page } = await res.json();

  return {
    props: {
      myData: page,
      chooseUsData: data,
      reviewsData: reviewsData,
      CompanyImagesData: CompanyImagesData,
      seoData: seoData,
    },
  };
}

const Home = ({
  myData,
  chooseUsData,
  reviewsData,
  CompanyImagesData,
  seoData,
}) => {
  const toolsData = useToolsIndexData();
  const router = useRouter();
  const currentUrl = router.asPath;

  let title = myData.Settings[0]?.title.split(" ");
  const blackTitle = title[title.length - 1];

  title.pop();

  return (
    <>
      <Head>
        {/* Anything you add here will be added to this page only */}
        <title>{myData?.metaTitle}</title>

        <meta name="description" content={myData?.metaDescription} />

        {/* {myData && (
          <>
            <meta property="og:title" content={myData.ogTitle} />
            <meta property="og:description" content={myData.ogDescription} />
            <meta property="og:image" content={myData.ogImage} />
            <meta property="og:image:alt" content={myData.ogImageAlt} />
          </>
        )} */}

        <meta
          name="google-site-verification"
          content={seoData.googleSiteVerificationCode}
        />
        <meta property="og:title" content={seoData.ogTitle} />
        <meta property="og:description" content={seoData.ogDescription} />
        <meta property="og:image" content={seoData.ogImage} />
        <meta property="og:title" content={seoData.ogTitle} />
        <meta property="og:description" content={seoData.ogDescription} />

        <link rel="canonical" href={`${appUrl}${currentUrl}`} key="canonical" />
      </Head>

      <>
        <main className="">
          <section className={`hero    `}>
            <div className=" space-y-7 lg:flex items-center justify-around">
              <div className="lg:space-y-7 space-y-5">
                <h1
                  className="lg:text-[48px] text-[30px] font-[500] w-full lg:max-w-[80%] leading-[
58.09px] "
                >
                  <span className="text-[rgb(238,27,34)] font-[700]">
                    {title.join(" ")}
                  </span>
                  <span className="text-[#262323]">{` ${blackTitle}`}</span>
                </h1>

                <p className="lg:w-[40rem] lg:mr-20 text-[#6F6767] text-[16px] font-[400]">
                  {myData.Settings[0]?.description}
                </p>

                <div className="md:space-x-6 lg:space-y-0 space-y-5  ">
                  <Button
                    asChild
                    className="w-full md:w-auto h-[46px] bg-[#EE1B22]  text-[18px] font-[400]
                    hover:bg-[#EE1B22]/80
                    "
                    size="lg"
                  >
                    <Link
                      href={myData.Settings[0]?.buttonHref}
                      className=" flex justify-start items-center gap-[8px]"
                    >
                      <span className="w-[20px] h-[20px]">{MergePdf}</span>
                      {myData.Settings[0]?.button}
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    asChild
                    className="w-full h-[46px] md:w-auto "
                  >
                    <Link
                      href={myData.Settings[0]?.buttonTwoHref}
                      className=" flex justify-start items-center gap-[8px]"
                    >
                      <span className="w-[20px] h-[20px]">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_40_3025)">
                            <g clip-path="url(#clip1_40_3025)">
                              <path
                                d="M2.60001 11.7L4.10001 13.1L0 17.2L2.79998 20L6.89999 16L8.30001 17.4L8.99999 11L2.60001 11.7Z"
                                fill="#EE1B22"
                              />
                              <path
                                d="M20 2.79998L17.2 0L13.1 3.99998L11.7 2.60001L11 8.99999L17.4 8.30001L15.9 6.89999L20 2.79998Z"
                                fill="#EE1B22"
                              />
                              <path
                                d="M0 0V8.99999H2.00001V2.00001H8.99999V0H0Z"
                                fill="#EE1B22"
                              />
                              <path
                                d="M18 11V18H11V20H20V11H18Z"
                                fill="#EE1B22"
                              />
                            </g>
                          </g>
                          <defs>
                            <clipPath id="clip0_40_3025">
                              <rect width="20" height="20" fill="white" />
                            </clipPath>
                            <clipPath id="clip1_40_3025">
                              <rect width="20" height="20" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </span>
                      <span className="lg:text-[18px] font-[500] text-[#EE1B22]">
                        {myData.Settings[0]?.buttonTwo}
                      </span>
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
          <header className="page_section mt-[142px] header mb-0">
            {/* <h1 className="title">{t("common:page_header_title")}</h1> */}
            {/* <h2 className="title">{myData.title}</h2> */}
            <h2 className="text-[32px] font-[600]  text-[#262323] text-center">
              {myData.title}
            </h2>
            {/* <p className="description">{t("common:page_header_text")}</p>  */}
            {/* <div className="description">
              {myData?.description && parse(myData.description)}
            </div> */}
            <div className="mt-[16px] text-[16px] font-[400] text-[#6F6767] tracking-wide text-center">
              {myData?.description && parse(myData.description)}
            </div>
          </header>
          <section className=" mt-0">
            <article className="container">
              <section
                style={{
                  marginBottom: "10px",
                  marginTop: "10px",
                }}
              >
                <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1  gap-[24px]">
                  {Object.keys(toolsData).map((key) => (
                    <Link key={key} href={toolsData[key].href} prefetch={false}>
                      <div
                        className={`p-[20px] border-[1px] bg-[${toolsData[key].color}] bg-opacity-[2%] rounded-[8px] max-w-[25rem] min-h-[10rem] border-[${toolsData[key].color}]/20 space-y-[12px]`}
                      >
                        <div>{toolsData[key].icon}</div>
                        <div className="text-[#262323] text-[18px] font-[600]">
                          {toolsData[key].title}
                        </div>
                        <p className="text-[14px] text-[#6F6767] font-[400]">
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

          {/* <section
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
          </section> */}
          {/* simple task end */}
          {/* why choose us start  */}
          <section className={`hero mt-8 mb-8 lg:mt-20 lg:mb-32  `}>
            {chooseUsData && <WhyChooseUs data={chooseUsData} />}
          </section>
          {/* why choose us end */}

          {/* good company start  */}
          <section
            className={`hero mt-8 mb-8 lg:mt-20 lg:mb-32  mx-[1rem] md:mx-[3.8rem]`}
          >
            <div>
              <h3 className="text-[#262323] font-[600]  text-[32px] md:text-4xl  text-center mb-10">
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

          {/* thank you starts  */}

          {/* thank you end */}

          {/* share  */}
          {/* <Share /> */}
        </main>
      </>
    </>
  );
};
export default Home;
