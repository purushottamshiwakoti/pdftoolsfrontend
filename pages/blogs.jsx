import BlogCategory from "@/components/BlogCategory";
import { Button } from "@/components/ui/button";
import parse from "html-react-parser";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "react-bootstrap-icons";

import PopularBlogs from "@/components/PopularBlogs";
import ReactPaginate from "react-paginate";

import { format } from "date-fns";
import { useSearchParams } from "next/navigation";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "about"])),
    },
  };
}

const BlogsPage = () => {
  const searchParams = useSearchParams();
  const filterCategory = searchParams.get("category");
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(true);
  const [blogsData, setBlogsData] = useState(null);
  const [categoriesData, setCategoriesData] = useState(null);

  const [isWindows, setIsWindows] = useState(false);
  const [myData, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/other/${"blogs"}`)
      .then((res) => res.json())
      .then((data) => {
        const { page } = data;
        setData(page);
        setIsWindows(navigator.userAgent.includes("Windows"));
      });
    fetch(`/api/blogs`)
      .then((res) => res.json())
      .then((data) => {
        setBlogsData(data.data);
        if (filterCategory) {
          setBlogsData(
            data.data.filter((item) => item.category.name === filterCategory)
          );
        }
        setLoading(false);
      });
    fetch(`/api/categories`)
      .then((res) => res.json())
      .then((data) => {
        setCategoriesData(data.data);
      });
  }, [filterCategory]);

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

  return (
    <>
      <Head>
        {/* Anything you add here will be added this page only */}
        <title>{myData?.metaTitle}</title>
        <meta name="description" content={myData?.metaDescription} />
        <meta
          name="Keywords"
          content="PDF tools, PDF manipulation, PDF merge, PDF split, PDF compress, PDF convert"
        />
        <meta name="robots" content="noindex,nofollow" />
        {/* You can add your canonical here */}
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
                <p className="description">{parse(myData.description)}</p>
              </>
            )}
          </header>

          <section
            className={`hero mt-8 mb-8 lg:mt-5 lg:mb-32 ${
              isWindows ? "lg:mx-[12rem]" : "lg:mx-[5rem]"
            } mx-[1rem] md:mx-[3.8rem]`}
          >
            <div>
              <div className="lg:flex lg:space-x-14 lg:justify-start lg:items-center hover:scale-105 transition-all ease-in-out duration-300 delay-200 cursor-pointer  ">
                {blogsData && blogsData[0] && (
                  <Link href={`/blog/${blogsData[0].slug}`}>
                    <div className="relative min-h-[200px] lg:min-h-[400px] lg:min-w-[500px]">
                      <Image
                        fill
                        src={blogsData[0].image}
                        alt={blogsData[0].imageAlt}
                        className="rounded-md "
                      />
                    </div>
                  </Link>
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
                        420 views
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
            </div>
            <div>
              <h2 className="text-[#7D64FF]  text-3xl font-medium mt-4 ">
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
                              <div className="relative h-[200px] w-[310px]">
                                <Image
                                  fill
                                  src={item.image}
                                  alt={item.imageAlt}
                                  className="rounded-md   "
                                />
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
                                  <p className="line-clamp-4 text-gray-600 h-9">
                                    {parse(item.description)}
                                  </p>
                                  <div className="flex items-center space-x-3">
                                    <p className="tracking-tighter text-gray-600 font-medium">
                                      {format(
                                        new Date(item.created_at),
                                        "MMMM dd, yyyy"
                                      )}
                                    </p>
                                    <p className="tracking-tighter text-gray-600 font-medium">
                                      420 views
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
                nextLabel="next"
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
