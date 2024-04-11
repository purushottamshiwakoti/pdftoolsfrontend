import BlogCategory from "@/components/BlogCategory";
import parse from "html-react-parser";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import PopularBlogs from "@/components/PopularBlogs";

import { format } from "date-fns";
import { useSearchParams } from "next/navigation";

import { appUrl, dashboardUrl } from "@/lib/url";
import { useRouter } from "next/router";

import Tags from "@/components/Tags";
import { Button } from "@/components/ui/button";

export async function getServerSideProps() {
  try {
    const [res, blogs, categories] = await Promise.all([
      fetch(`${dashboardUrl}/other/blogs`),
      fetch(`${dashboardUrl}/blogs`),
      fetch(`${dashboardUrl}/categories`),
    ]);

    const { page } = await res.json();
    const blogsData = await blogs.json();
    const categoriesData = (await categories.json()).data;

    return {
      props: {
        myData: page,
        blogsData: blogsData.data,
        categoriesData: categoriesData,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        myData: null,
        blogsData: null,
        categoriesData: null,
      },
    };
  }
}

const BlogsPage = ({ myData, blogsData, categoriesData }) => {
  const [data, setData] = useState(blogsData);
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const isLoading = false;

  const isWindows = false;

  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
    router.push(`/blogs?page=${pageNumber}`);
  };

  useEffect(() => {
    if (category) {
      const newData = blogsData.filter((item) => item.category_id == category);
      setData(newData);
    }
  }, [category]);

  return (
    <>
      <Head>
        {/* Anything you add here will be added this page only */}
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
          content="PDF tools, PDF manipulation, PDF merge, PDF split, PDF compress, PDF convert"
        />

        {/* You can add your canonical here */}
        {/* <link rel="canonical" href={`${appUrl}${currentUrl}`} key="canonical" /> */}
        {/* You can add your alternate here */}
      </Head>
      {isLoading ? (
        <div>
          <div className="flex  lg:items-center justify-center w-full flex-col space-y-3 mb-10">
            <div className="  lg:w-[20rem] h-6 bg-slate-200 animate-pulse" />
            <div className="  lg:w-[40rem] h-6 bg-slate-200 animate-pulse" />
          </div>
          <div
            className={`hero mt-8 mb-8 lg:mt-5 lg:mb-32 ${
              isWindows ? "lg:mx-[12rem]" : "lg:mx-[5rem]"
            } mx-[1rem] md:mx-[3.8rem] space-y-3 lg:flex items-center justify-between`}
          >
            <div className="  lg:w-[30rem] h-[20rem] bg-slate-200 animate-pulse" />
            <div className="space-y-3">
              <div className="  lg:w-[20rem] h-6 bg-slate-200 animate-pulse" />
              <div className="  lg:w-[40rem] h-6 bg-slate-200 animate-pulse" />
            </div>
          </div>
        </div>
      ) : (
        <main className="">
          <header className="">
            {myData && (
              <>
                <div className="h-[350px] mt-[72px] relative w-full flex flex-col items-center justify-center  bg-[url('/blog.jpeg')] bg-no-repeat bg-center bg-cover ">
                  <div className="absolute bg-black h-[350px] w-full  opacity-50 z-10" />
                  <h1 className="text-white font-[700] text-[40px] z-20">
                    {myData.title}
                  </h1>
                  <h6 className="mt-[24px] font-[400] text-[16px] text-white  z-20">
                    {parse(myData.description)}
                  </h6>
                  {/* Content inside the div */}
                </div>
              </>
            )}
          </header>

          <section className={`md:px-3 sm:px-3 px-[10px] lg:px-[120px] `}>
            <div>
              <div className=" mt-[48px] ">
                <div className="grid lg:grid-cols-3 md:grid-cols-2  ">
                  <div className="lg:col-span-2  lg:grid lg:grid-cols-2  gap-[24px] lg:gap-y-[24px]">
                    {currentItems &&
                      currentItems.length > 0 &&
                      currentItems.map((item) => (
                        <Link
                          href={`/blog/${item.slug}`}
                          className="relative  border-[1px] border-black/10"
                          key={item.id}
                        >
                          <Image
                            src={item.bannerImage}
                            alt={item.bannerImageAlt}
                            width={384}
                            height={193}
                          />
                          <div className="p-[15.5px]">
                            <div>
                              <h2
                                className="mt-[20px] font-[600] text-[20px]
                        text-[#262323] 
                        leading-[24.2px] flex-1
                        "
                              >
                                {item.title}
                              </h2>
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
                                <p className="text-[12px] font-[500] text-[#EE1B22] flex-1">
                                  {" "}
                                  By AllPDFconverter
                                </p>
                              </div>
                            </div>
                            <div className="mt-[12px]">
                              <div className="text-[#6F6767] text-sm font-normal line-clamp-2 max-w-[90%]">
                                {item.description.length > 20
                                  ? parse(item.description)
                                  : parse(item.description)}
                              </div>
                            </div>
                            <div className="mt-[16px] text-[#6F6767] text-[12px] font-[500] flex">
                              <div>
                                {format(item.created_at, "MMMM  dd,yyyy")}
                                {"  "}•{"  "} {item.views[0].views} Views{" "}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    {data.length > 0 ? (
                      <div className=" col-span-2 items-center justify-center flex">
                        <div className="flex items-center justify-center gap-[16px] lg:mb-0 mb-10  ">
                          {
                            <Button
                              className={
                                "border-1 border-[#6F6767] text-[#6F6767] rounded-none font-[600] text-[16px]"
                              }
                              disabled={currentPage == 1}
                              variant="ghost"
                              onClick={() => handlePagination(currentPage - 1)}
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M7.41165 1.91161L7.50004 1.82322L7.58842 1.91161L8.63842 2.96161L8.72681 3.05L8.63842 3.13839L4.65181 7.125H15H15.125V7.25V8.75V8.875H15H4.65181L8.63842 12.8616L8.72681 12.95L8.63842 13.0384L7.58842 14.0884L7.50004 14.1768L7.41165 14.0884L1.41165 8.08839L1.32326 8L1.41165 7.91161L7.41165 1.91161Z"
                                  fill="#6F6767"
                                  stroke="#6F6767"
                                  stroke-width="0.25"
                                />
                              </svg>
                              <p className="ml-[1.5px]">Previous</p>
                            </Button>
                          }

                          {Array.from({ length: totalPages }, (_, index) => (
                            <Button
                              className={
                                index + 1 == currentPage
                                  ? "bg-[#EE1B22] hover:bg-[#EE1B22]/80 text-white rounded-none font-[600] text-[16px]"
                                  : "border-1 border-[#6F6767] text-[#6F6767] rounded-none font-[600] text-[16px]"
                              }
                              variant="ghost"
                              key={index + 1}
                              onClick={() => handlePagination(index + 1)}
                            >
                              {index + 1}
                            </Button>
                          ))}

                          {
                            <Button
                              className="border-1 border-[#6F6767] text-[#6F6767] font-[600] text-[16px] rounded-none"
                              variant="ghost"
                              onClick={() => handlePagination(currentPage + 1)}
                              disabled={currentPage == totalPages}
                            >
                              <p className="mr-[1.5px]">Next</p>
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M8.58835 1.91161L8.49996 1.82322L8.41158 1.91161L7.36158 2.96161L7.27319 3.05L7.36158 3.13839L11.3482 7.125H1H0.875V7.25V8.75V8.875H1H11.3482L7.36158 12.8616L7.27319 12.95L7.36158 13.0384L8.41158 14.0884L8.49996 14.1768L8.58835 14.0884L14.5884 8.08839L14.6767 8L14.5884 7.91161L8.58835 1.91161Z"
                                  fill="#6F6767"
                                  stroke="#6F6767"
                                  stroke-width="0.25"
                                />
                              </svg>
                            </Button>
                          }
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p>No blogs found</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-[32px] lg:ml-[26px] w-[">
                    <PopularBlogs blogsData={blogsData} />
                    <BlogCategory categoriesData={categoriesData} />
                    <Tags />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}
    </>
  );
};

export default BlogsPage;
