import AddComment from "@/components/AddComment";
import BlogCategory from "@/components/BlogCategory";
import ShareBlog from "@/components/ShareBlog";
import SimilarBlogs from "@/components/SimilarBlogs";
import { dashboardUrl } from "@/lib/url";
import { format } from "date-fns";
import parse, { domToReact } from "html-react-parser";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import styles from "../../styles/UploadContainer.module.css";

import PopularBlogs from "@/components/PopularBlogs";
import Tags from "@/components/Tags";
import { appUrl } from "@/lib/url";
import { notFound } from "next/navigation";

export async function getServerSideProps({ params }) {
  const res = await fetch(`${dashboardUrl}/blogs/${params.slug}`);
  const blogs = await fetch(`${dashboardUrl}/blogs`);
  const blogsData = await blogs.json();

  let myData = await res.json();
  if (!myData) {
    notFound();
  }
  myData = myData.data;

  return {
    props: {
      myData: myData,
      blogsData: blogsData.data,
    },
  };
}

const BlogDetail = ({ myData, blogsData }) => {
  console.log(myData);
  const router = useRouter();
  const { slug } = router.query;

  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [isWindows, setIsWindows] = useState(false);
  const [categoriesData, setCategoriesData] = useState(null);
  const [similarBlogsData, setSimilarBlogsData] = useState(null);
  const currentUrl = router.asPath;

  if (notFound) {
    router.push("/not-found");
  }

  useEffect(() => {
    setSimilarBlogsData(null);

    fetch(`/api/categories`)
      .then((res) => res.json())
      .then((data) => {
        setCategoriesData((prevData) => data.data);
      });

    if (myData) {
      fetch(`/api/blogs`)
        .then((res) => res.json())
        .then((data) => {
          setSimilarBlogsData((prevData) =>
            data.data.filter(
              (item) => item.category.name == myData.category.name
            )
          );
        });
      fetch(`/api/views`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: myData.id,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [slug, !myData]);

  const filteredBlogs = blogsData.filter((item) => item.id !== myData.id);

  function calculateAverageWordsPerSentence(text) {
    // Split text into sentences using regular expression
    const sentences = text.split(/[.!?]/);

    let totalWords = 0;

    // Iterate over each sentence
    sentences.forEach((sentence) => {
      // Split sentence into words by whitespace and filter out empty strings
      const words = sentence
        .trim()
        .split(/\s+/)
        .filter((word) => word !== "");
      // Increment totalWords by number of words in current sentence
      totalWords += words.length;
    });

    // Calculate average words per sentence
    const totalSentences = sentences.length;
    const averageWordsPerSentence = totalWords / totalSentences;

    return Math.ceil(averageWordsPerSentence);
  }

  return (
    <>
      <Head>
        {/* Anything you add here will be added this page only */}
        <title>{myData && myData.metaTitle}</title>
        <meta name="Keywords" content={myData && myData.metaDescription} />
        {myData && (
          <>
            <meta property="og:title" content={myData.ogTitle} />
            <meta property="og:description" content={myData.ogDescription} />
            <meta property="og:image" content={myData.ogImage} />
            <meta property="og:image:alt" content={myData.ogImageAlt} />
          </>
        )}
        <link rel="canonical" href={`${appUrl}${currentUrl}`} key="canonical" />
        {/* You can add your canonical here */}
        {/* You can add your alternate here */}
      </Head>
      <div className={styles}>
        <div className="bg-[#f9f8f8]">
          <section>
            {myData ? (
              <div>
                <div>
                  <div>
                    <h1 className="text-center text-[#262323] font-[700] lg:text-[48px] lg:px-[150px] ">
                      {myData.title}
                    </h1>
                    <div className="flex lg:gap-[32px] gap-[10px] lg:flex-row flex-col justify-center mt-[10px]">
                      <div className="flex mt-[20px] space-y-[4px] items-center">
                        <svg
                          width="21"
                          height="20"
                          viewBox="0 0 21 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_151_1578)">
                            <path
                              d="M10.5 17.5C14.6421 17.5 18 14.1421 18 10C18 5.85786 14.6421 2.5 10.5 2.5C6.35786 2.5 3 5.85786 3 10C3 14.1421 6.35786 17.5 10.5 17.5Z"
                              stroke="#EE1B22"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M10.5 10.8333C11.8807 10.8333 13 9.71403 13 8.33331C13 6.9526 11.8807 5.83331 10.5 5.83331C9.11929 5.83331 8 6.9526 8 8.33331C8 9.71403 9.11929 10.8333 10.5 10.8333Z"
                              fill="#EE1B22"
                              stroke="#EE1B22"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M5.64014 15.7075C5.84639 15.0211 6.26844 14.4194 6.84368 13.9917C7.41891 13.564 8.11668 13.3332 8.83347 13.3334H12.1668C12.8845 13.3331 13.5831 13.5645 14.1588 13.9932C14.7344 14.4219 15.1564 15.0249 15.3618 15.7125"
                              stroke="#EE1B22"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_151_1578">
                              <rect
                                width="20"
                                height="20"
                                fill="white"
                                transform="translate(0.5)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                        <p className="text-[14px] font-[500] ml-[4px] text-[#EE1B22]">
                          {" "}
                          By AllPDFconverter
                        </p>
                      </div>
                      <div className="flex mt-[20px] space-y-[4px] items-center">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_154_2038)">
                            <path
                              d="M15.0007 4.16666H5.00065C4.08018 4.16666 3.33398 4.91285 3.33398 5.83332V15.8333C3.33398 16.7538 4.08018 17.5 5.00065 17.5H15.0007C15.9211 17.5 16.6673 16.7538 16.6673 15.8333V5.83332C16.6673 4.91285 15.9211 4.16666 15.0007 4.16666Z"
                              stroke="#6F6767"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M13.334 2.5V5.83333"
                              stroke="#6F6767"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M6.66602 2.5V5.83333"
                              stroke="#6F6767"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M3.33398 9.16666H16.6673"
                              stroke="#6F6767"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M9.16602 12.5H9.99935"
                              stroke="#6F6767"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M10 12.5V15"
                              stroke="#6F6767"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_154_2038">
                              <rect width="20" height="20" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>

                        <p className="text-[14px] font-[500] text-[#6F6767] ml-[4px]">
                          {" "}
                          {format(new Date(myData.created_at), "MMMM dd, yyyy")}
                        </p>
                      </div>
                      <div className="flex mt-[20px] space-y-[4px] items-center">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_154_2056)">
                            <path
                              d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
                              stroke="#6F6767"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M10 5.83333V10L12.5 12.5"
                              stroke="#6F6767"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_154_2056">
                              <rect width="20" height="20" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>

                        <div className="text-[14px] font-[500] text-[#6F6767] ml-[4px]">
                          {" "}
                          {calculateAverageWordsPerSentence(
                            myData.description
                          )}{" "}
                          Mins Read
                        </div>
                      </div>
                      <div className="flex mt-[20px] space-y-[4px] items-center">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_154_2067)">
                            <path
                              d="M10.0007 11.6667C10.9211 11.6667 11.6673 10.9205 11.6673 10C11.6673 9.07954 10.9211 8.33334 10.0007 8.33334C9.08018 8.33334 8.33398 9.07954 8.33398 10C8.33398 10.9205 9.08018 11.6667 10.0007 11.6667Z"
                              stroke="#6F6767"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M18.3327 9.99999C16.1102 13.8892 13.3327 15.8333 9.99935 15.8333C6.66602 15.8333 3.88852 13.8892 1.66602 9.99999C3.88852 6.11082 6.66602 4.16666 9.99935 4.16666C13.3327 4.16666 16.1102 6.11082 18.3327 9.99999Z"
                              stroke="#6F6767"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_154_2067">
                              <rect width="20" height="20" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>

                        <p className="text-[14px] font-[500] text-[#6F6767] ml-[4px]">
                          {" "}
                          {myData.views[0] ? myData.views[0].views : 0} Views
                        </p>
                      </div>
                    </div>
                    {myData.image && (
                      <Image
                        src={myData.image}
                        alt={myData.imageAlt}
                        className="mt-[24px] "
                        width={1200}
                        height={603}
                      />
                    )}
                  </div>
                  <div className="grid lg:grid-cols-3 mt-[48px]">
                    <div className="lg:col-span-2">
                      <p className=" ">
                        {parse(myData.description, {
                          replace: (domNode) => {
                            if (
                              domNode.type === "tag" &&
                              domNode.name === "ul"
                            ) {
                              return React.createElement(
                                "ul",
                                {
                                  style: { listStyle: "disc" }, // Apply style here
                                  key: domNode.children
                                    .map((child) => child.data)
                                    .join("-"),
                                },
                                domToReact(domNode.children)
                              );
                            } else if (
                              domNode.type === "tag" &&
                              domNode.name === "ol"
                            ) {
                              return React.createElement(
                                "ol",
                                {
                                  style: { listStyle: "decimal" }, // Apply style here
                                  key: domNode.children
                                    .map((child) => child.data)
                                    .join("-"),
                                },
                                domToReact(domNode.children)
                              );
                            }
                          },
                        })}
                      </p>
                    </div>
                    <div className="lg:ml-[26px] lg:mt-0 mt-[10px] lg:space-y-0 space-y-3">
                      <PopularBlogs blogsData={filteredBlogs} />
                      {categoriesData && (
                        <BlogCategory categoriesData={categoriesData} />
                      )}
                      <Tags />
                    </div>
                  </div>
                </div>
                <div className="flex items-center lg:w-[800px] justify-center">
                  <ShareBlog slug={myData.slug} />
                </div>
                <div className="grid grid-cols-3">
                  <hr class="h-px my-[72px] lg:block hidden bg-[#3B444F] opacity-10 border-1 col-span-2" />
                  <div></div>
                </div>
                <div className="grid grid-cols-3">
                  <div className="col-span-2">
                    <h3 className="text-[#262323] font-[700] text-[24px] ">
                      Comments
                    </h3>
                    <div className="mt-[16px] bg-white border-[1.5px] border-[#3B444F]/10 pt-[32px] pl-[24px] pr-[28px] pb-[31px]"></div>
                  </div>
                  <div></div>
                </div>
                <div>{myData && <AddComment id={myData.id} />}</div>
                <div>
                  {similarBlogsData !== null && (
                    <SimilarBlogs
                      blogsData={similarBlogsData}
                      blogId={myData.id}
                    />
                  )}
                </div>
              </div>
            ) : (
              <p>Loading..</p>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default BlogDetail;
