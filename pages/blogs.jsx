import React, { useState, useEffect } from "react";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Share from "../components/Share";
import pageStyles from "../styles/Page.module.css";
import parse from "html-react-parser";
import styles from "../styles/index.module.css";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "react-bootstrap-icons";
import BlogCategory from "@/components/BlogCategory";

import ReactPaginate from "react-paginate";
import { blogItems } from "@/lib/blogs";
import PopularBlogs from "@/components/PopularBlogs";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "about"])),
    },
  };
}

const BlogsPage = () => {
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(true);

  const [isWindows, setIsWindows] = useState(false);
  const [myData, setData] = useState(null);
  useEffect(() => {
    fetch(`/api/other/${"home"}`)
      .then((res) => res.json())
      .then((data) => {
        const { page } = data;
        setData(page);
        setLoading(false);
        setIsWindows(navigator.userAgent.includes("Windows"));
      });
  }, []);

  const [itemOffset, setItemOffset] = useState(0);

  // Simulate fetching items from another resources.
  // (This could be items from props; or items loaded in a local state
  // from an API endpoint with useEffect and useState)
  const itemsPerPage = 6;
  const endOffset = itemOffset + itemsPerPage;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = blogItems.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(blogItems.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % blogItems.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  return (
    <>
      <main className="">
        <header className="page_section header mb-0">
          <h1 className="title">Hello man</h1>
          <p className="description">ok man</p>
        </header>
        <section
          className={`hero mt-8 mb-8 lg:mt-5 lg:mb-32 ${
            isWindows ? "lg:mx-[12rem]" : "lg:mx-[5rem]"
          } mx-[1rem] md:mx-[3.8rem]`}
        >
          <div>
            <div className="lg:flex lg:space-x-14 lg:justify-start lg:items-center hover:scale-105 transition-all ease-in-out duration-300 delay-200 cursor-pointer  ">
              <div className="relative min-h-[200px] lg:min-h-[400px] lg:min-w-[500px]">
                <Image
                  fill
                  src={"/img/blog.jpg"}
                  alt="hello"
                  className="rounded-md object-contain"
                />
              </div>
              <div className=" lg:space-y-4 space-y-2">
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <Button variant="ghost" className="text-[#7D64FF]">
                      Lifestyle
                    </Button>
                  </div>
                  <div className="flex items-center space-x-3">
                    <p className="tracking-tighter  text-gray-600 font-medium">
                      09 Nov 2022
                    </p>
                    <p className="tracking-tighter  text-gray-600 font-medium">
                      420 views
                    </p>
                  </div>
                </div>

                <h2 className="text-black/80  text-3xl font-bold line-clamp-2 tracking-wide">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Id
                  itaque, ipsum eos assumenda eveniet doloremque veniam itaque,
                  ipsum eos assumenda eveniet doloremque veniam
                </h2>
                <p className="line-clamp-6 tracking-normal text-gray-600">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Nihil, dolorem esse! Aliquid, at itaque voluptate dolorem
                  quibusdam quae fugit reiciendis voluptatum vero, aperiam
                  repellat quis error voluptas, voluptatem esse. Odio reiciendis
                  molestias eius minima accusantium iusto culpa voluptatem
                  quidem possimus ipsum nobis fugit vero repudiandae cumque
                  asperiores exercitationem porro mollitia a facilis at, ducimus
                  natus maiores magnam pariatur? Nam laudantium illo officia
                  praesentium repellendus, aut inventore iusto maiores numquam
                  velit, tempore dolorum impedit corporis nesciunt veritatis
                </p>
                <Button
                  asChild
                  variant="link"
                  className="flex  lg:justify-start  "
                >
                  <Link href="/" className="text-[#7D64FF]  ">
                    Read More
                    <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-[#7D64FF]  text-3xl font-medium ">All Blogs</h2>
            <div className="flex">
              <div className="mt-10">
                <div className=" grid grid-cols-2   ">
                  {currentItems.map((item) => (
                    <div className=" p-2 bg-white-500 rounded-lg shadow-md cursor-pointer hover:scale-105 transition-all ease-in-out duration-300 delay-200 mr-10 mb-10   ">
                      <div className="relative h-[200px] w-[320px] ">
                        <Image
                          fill
                          src={"/img/blog.jpg"}
                          alt="hello"
                          className="rounded-md object-contain"
                        />
                      </div>
                      <div className="space-y-3 ">
                        <div>
                          <Button
                            variant="ghost"
                            className="text-[#7D64FF] mt-2"
                          >
                            Lifestyle
                          </Button>
                        </div>

                        <h2 className="text-black/80  text-3xl font-bold line-clamp-1  tracking-wide">
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Id itaque, ipsum eos assumenda eveniet
                          doloremque veniam itaque, ipsum eos assumenda eveniet
                          doloremque veniam
                        </h2>
                        <p className="line-clamp-4 text-gray-600">
                          Lorem ipsum dolor sit amet consectetur, adipisicing
                          elit. Nihil, dolorem esse! Aliquid, at itaque
                          voluptate dolorem quibusdam quae fugit reiciendis
                          voluptatum vero, aperiam repellat quis error voluptas,
                          voluptatem esse. Odio reiciendis molestias eius minima
                          accusantium iusto culpa voluptatem quidem possimus
                          ipsum nobis fugit vero repudiandae cumque asperiores
                          exercitationem porro mollitia a facilis at, ducimus
                          natus maiores magnam pariatur? Nam laudantium illo
                          officia praesentium repellendus, aut inventore iusto
                          maiores numquam velit, tempore dolorum impedit
                          corporis nesciunt veritatis
                        </p>
                        <div className="flex items-center space-x-3 ">
                          <p className="tracking-tighter  text-gray-600 font-medium">
                            09 Nov 2022
                          </p>
                          <p className="tracking-tighter  text-gray-600 font-medium">
                            420 views
                          </p>
                        </div>
                        <Button
                          asChild
                          variant="link"
                          className="flex  lg:justify-end  "
                        >
                          <Link href="/" className="text-[#7D64FF]  ">
                            Read More
                            <ArrowRight className="ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className=" space-y-10">
                <PopularBlogs />
                <BlogCategory />
              </div>
            </div>{" "}
          </div>
          <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={6}
            pageCount={pageCount}
            previousLabel="< Previous"
            renderOnZeroPageCount={null}
            activeClassName="bg-purple-600 text-white p-2 rounded"
            disabledClassName="disabled"
            containerClassName="flex space-x-5 p-2 items-end justify-center"
            pageClassName="hover:bg-purple-200 p-2 rounded"
            previousClassName="hover:bg-purple-200 p-2 rounded"
            nextClassName="hover:bg-purple-200 p-2 rounded"
          />
        </section>
      </main>
    </>
  );
};

export default BlogsPage;
