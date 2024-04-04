import BlogCategory from "@/components/BlogCategory";
import { Button } from "@/components/ui/button";
import parse from "html-react-parser";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "react-bootstrap-icons";

import PopularBlogs from "@/components/PopularBlogs";
import ReactPaginate from "react-paginate";

import { format } from "date-fns";
import { useSearchParams } from "next/navigation";

import { useRouter } from "next/router";
import { appUrl, dashboardUrl } from "@/lib/url";

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
  const searchParams = useSearchParams();
  const filterCategory = searchParams.get("category");
  const isLoading = false;

  const isWindows = false;

  const router = useRouter();
  const currentUrl = router.asPath;

  const [itemOffset, setItemOffset] = useState(0);

  // Simulate fetching items from another resources.
  // (This could be items from props; or items loaded in a local state
  // from an API endpoint with useEffect and useState)
  const itemsPerPage = 7;
  const endOffset = itemOffset + itemsPerPage;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = blogsData && blogsData.slice(itemOffset, endOffset);
  const pageCount = blogsData && Math.ceil(blogsData.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % blogsData.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  console.log(blogsData ? blogsData[0] : "bno");

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
        <link rel="canonical" href={`${appUrl}${currentUrl}`} key="canonical" />
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
          <header className="page_section header mb-0">
            {myData && (
              <>
                <h1 className="title">{myData.title}</h1>
                <h6 className="description">{parse(myData.description)}</h6>
              </>
            )}
          </header>

          <section
            className={`hero mt-8 mb-8 lg:mt-5 lg:mb-32 ${
              isWindows ? "lg:mx-[12rem]" : "lg:mx-[5rem]"
            } mx-[1rem] md:mx-[3.8rem]`}
          >
            <div>
              <Link href={`/blog/${blogsData[0].slug}`}>
                <div className="lg:flex lg:space-x-14 lg:justify-start lg:items-center hover:scale-105 transition-all ease-in-out duration-300 delay-200 cursor-pointer  ">
                  {blogsData && blogsData[0] && (
                    <div className="">
                      {blogsData[0].bannerImage ? (
                        <div className="relative w-[300px] h-[300px]">
                          <Image
                            src={blogsData[0].bannerImage}
                            alt={blogsData[0].bannerImageAlt}
                            className="rounded-md "
                            fill
                          />
                        </div>
                      ) : (
                        <Image
                          src={"/img/banner.jpg"}
                          alt={"img"}
                          className="rounded-md "
                          width={500}
                          height={500}
                        />
                      )}
                    </div>
                  )}
                  <div className=" lg:space-y-4 space-y-2">
                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <Button variant="ghost" className="text-[#7D64FF]">
                          {blogsData &&
                            blogsData[0] &&
                            blogsData[0].category.name}
                        </Button>
                      </div>
                      <div className="flex items-center space-x-3">
                        <p className="tracking-tighter  text-gray-600 font-medium">
                          {blogsData &&
                            blogsData[0] &&
                            format(
                              new Date(blogsData[0].created_at),
                              "MMMM dd, yyyy"
                            )}
                        </p>
                        <p className="tracking-tighter  text-gray-600 font-medium">
                          {blogsData && blogsData[0] && blogsData[0].views[0]
                            ? blogsData[0].views[0].views
                            : 0}{" "}
                          views
                        </p>
                      </div>
                    </div>

                    <h2 className="text-black/80  text-3xl font-bold line-clamp-2 tracking-wide">
                      {blogsData && blogsData[0] && blogsData[0].title}
                    </h2>
                    <p className="line-clamp-6 tracking-normal text-gray-600">
                      {blogsData &&
                        blogsData[0] &&
                        parse(blogsData[0].description)}
                    </p>
                    <Button
                      asChild
                      variant="link"
                      className="flex  lg:justify-start  "
                    >
                      {blogsData && blogsData[0] && (
                        <Link
                          href={`/blog/${blogsData[0].slug}`}
                          className="text-[#7D64FF]  "
                        >
                          Read More
                          <ArrowRight className="ml-2" />
                        </Link>
                      )}
                    </Button>
                  </div>
                </div>
              </Link>
            </div>
            <div>
              <h2 className="text-[#7D64FF]  text-3xl font-medium mt-4 lg:mt-3 ">
                All Blogs
              </h2>
              <div className="lg:flex ">
                <div className="mt-10 ">
                  <div className="grid md:grid-cols-2 grid-cols-1 ">
                    {blogsData && blogsData.length > 0 ? (
                      currentItems.map((item, index) =>
                        index === 0 ? null : (
                          <Link href={`/blog/${item.slug}`} key={index}>
                            <div className=" bg-white rounded-lg shadow-lg p-3 cursor-pointer hover:scale-105 transition-all ease-in-out duration-300 delay-200 mr-10 mb-10">
                              <div>
                                {item.bannerImage ? (
                                  <Image
                                    src={item.bannerImage}
                                    alt={item.bannerImageAlt}
                                    width={500}
                                    height={500}
                                    className="rounded-md  image   "
                                  />
                                ) : (
                                  <Image
                                    src={"/img/banner.jpg"}
                                    alt={"img"}
                                    className="rounded-md "
                                    width={500}
                                    height={500}
                                  />
                                )}
                              </div>
                              <div className="">
                                <div className="">
                                  <Button
                                    variant="link"
                                    className="text-[#7D64FF] -ml-6"
                                  >
                                    {item.category.name}
                                  </Button>
                                </div>

                                <div className="space-y-2">
                                  <h2 className="text-black/80 text-lg font-bold line-clamp-1 tracking-wide">
                                    {item.title}
                                  </h2>
                                  <div className="line-clamp-4 text-gray-600 h-9">
                                    {parse(item.description)}
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <p className="tracking-tighter text-gray-600 font-medium">
                                      {format(
                                        new Date(item.created_at),
                                        "MMMM dd, yyyy"
                                      )}
                                    </p>
                                    <p className="tracking-tighter text-gray-600 font-medium">
                                      {item.views[0] ? item.views[0].views : 0}{" "}
                                      views
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  asChild
                                  variant="link"
                                  className="flex lg:justify-end"
                                >
                                  <Link
                                    href={`/blog/${item.slug}`}
                                    className="text-[#7D64FF]"
                                  >
                                    Read More
                                    <ArrowRight className="ml-2" />
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </Link>
                        )
                      )
                    ) : (
                      <p>No blogs found</p>
                    )}
                  </div>
                </div>
                <div className="relative">
                  {categoriesData && (
                    <BlogCategory categoriesData={categoriesData} />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-2">
              <ReactPaginate
                breakLabel="..."
                nextLabel="Next"
                onPageChange={handlePageClick}
                pageRangeDisplayed={6}
                pageCount={pageCount}
                previousLabel="Previous"
                renderOnZeroPageCount={null}
                activeClassName="bg-purple-600 text-white p-2 rounded"
                disabledClassName="disabled"
                containerClassName="flex space-x-5 p-2 items-end justify-center"
                pageClassName="hover:bg-purple-200 p-2 rounded"
                previousClassName="hover:bg-purple-200 p-2 rounded"
                nextClassName="hover:bg-purple-200 p-2 rounded"
              />
            </div>
            <div>
              {blogsData && (
                <>
                  <PopularBlogs blogsData={blogsData} />
                </>
              )}
            </div>
          </section>
        </main>
      )}
    </>
  );
};

export default BlogsPage;
