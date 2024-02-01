import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations"; // Add this import
import Image from "next/image";
import { notFound, redirect, useParams, useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import parse from "html-react-parser";

import AddComment from "@/components/AddComment";
import BlogCategory from "@/components/BlogCategory";
import SimilarBlogs from "@/components/SimilarBlogs";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import NotFound from "../404";

export async function getStaticPaths() {
  return {
    paths: [
      // String variant:
      "/blog/first-post", // Corrected path
      // Object variant:
      { params: { slug: "second-post" } },
    ],
    fallback: true,
  };
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "about"])),
    },
  };
}

const BlogDetail = () => {
  const router = useRouter();
  const params = useParams();
  const [myData, setMyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isWindows, setIsWindows] = useState(false);
  const [categoriesData, setCategoriesData] = useState(null);
  const [similarBlogsData, setSimilarBlogsData] = useState(null);
  const [noBlog, setNoBlog] = useState(false);

  console.log(similarBlogsData);
  if (noBlog) {
    router.push("/blogs");
  }

  useEffect(() => {
    fetch(`/api/blogs/${params.slug}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.error);
        if (data.error) {
          setNoBlog(true);
        }
        setMyData(data.data);
        setLoading(false);
        setIsWindows(navigator.userAgent.includes("Windows"));
        if (myData) {
          fetch(`/api/blogs`)
            .then((res) => res.json())
            .then((data) => {
              setSimilarBlogsData(
                data.data.filter(
                  (item) => item.category.name == myData.category.name
                )
              );
            });
        }
      });

    fetch(`/api/categories`)
      .then((res) => res.json())
      .then((data) => {
        setCategoriesData(data.data);
      });
  }, []);

  const { t } = useTranslation();

  return (
    <>
      <div>
        <section
          className={`hero mt-8 mb-8 lg:mt-5 lg:mb-32 ${
            isWindows ? "lg:mx-[12rem]" : "lg:mx-[5rem]"
          } mx-[1rem] md:mx-[3.8rem]`}
        >
          {myData ? (
            <div className="flex justify-between space-x-7">
              <div className="space-y-4 ">
                <h2 className="text-[#7D64FF] text-lg font-bold line-clamp-1 tracking-wide">
                  {myData.title}
                </h2>
                <Button variant="ghost" className="text-[#7D64FF]">
                  {myData.category.name}
                </Button>
                <div className="flex items-center space-x-3">
                  <p className="tracking-tighter text-gray-600 font-medium">
                    {format(new Date(myData.created_at), "MMMM dd, yyyy")}
                  </p>
                  <p className="tracking-tighter text-gray-600 font-medium">
                    420 views
                  </p>
                </div>
                <div className="relative h-[400px] w-[800px]">
                  <Image
                    fill
                    src={myData.image}
                    alt={myData.imageAlt}
                    className="rounded-md "
                  />
                </div>
                <p>{parse(myData.description)}</p>
              </div>
              <div>
                {categoriesData && (
                  <BlogCategory categoriesData={categoriesData} />
                )}
              </div>
            </div>
          ) : (
            <p>Loading..</p>
          )}

          <div>{myData && <AddComment id={myData.id} />}</div>
          <div>
            {similarBlogsData && <SimilarBlogs blogsData={similarBlogsData} />}
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogDetail;
