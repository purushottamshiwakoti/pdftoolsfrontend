import AddComment from "@/components/AddComment";
import BlogCategory from "@/components/BlogCategory";
import ShareBlog from "@/components/ShareBlog";
import SimilarBlogs from "@/components/SimilarBlogs";
import { Button } from "@/components/ui/button";
import { dashboardUrl } from "@/lib/url";
import { format } from "date-fns";
import parse from "html-react-parser";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { redirect } from "next/dist/server/api-utils";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { appUrl } from "@/lib/url";

export async function getStaticPaths() {
  const res = await fetch(`${dashboardUrl}/blogs `, {
    cache: "no-store",
    method: "GET",
  });

  const data = await res.json();

  const paths = data.data.map((blog) => ({
    params: { slug: blog.slug }, // Use the unique slug as the path parameter
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps() {
  return {
    props: {
      ...(await serverSideTranslations("en", ["common", "home"])),
    },
  };
}

const BlogDetail = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { slug } = router.query;

  const [myData, setMyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [isWindows, setIsWindows] = useState(false);
  const [categoriesData, setCategoriesData] = useState(null);
  const [similarBlogsData, setSimilarBlogsData] = useState(null);
  const currentUrl = router.asPath;

  console.log(myData);

  if (notFound) {
    router.push("/not-found");
  }

  useEffect(() => {
    setSimilarBlogsData(null);
    if (slug) {
      fetch(`/api/blogs/${slug}`)
        .then((res) => res.json())
        .then((data) => {
          setMyData(data.data);
          if (data.error) {
            setNotFound(true);
          }

          setLoading(false);
          setIsWindows(navigator.userAgent.includes("Windows"));
        });
    }

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
      <div>
        <section
          className={`hero mt-8 mb-8 lg:mt-5 lg:mb-32 ${
            isWindows ? "lg:mx-[12rem]" : "lg:mx-[5rem]"
          } mx-[1rem] md:mx-[3.8rem]`}
        >
          {myData ? (
            <div className="  md:space-y-4 justify-between space-x-7">
              <div className="grid grid-cols-4">
                <div className="space-y-4  lg:col-span-3 col-span-4">
                  <h1 className="text-[#7D64FF] text-lg font-bold line-clamp-1 tracking-wide">
                    {myData.title}
                  </h1>
                  <div className="flex items-start justify-start">
                    <Button variant="link" className="text-[#7D64FF] -ml-6">
                      {myData.category.name}
                    </Button>
                  </div>
                  <div className="flex items-center space-x-3">
                    <p className="tracking-tighter text-gray-600 font-medium">
                      {format(new Date(myData.created_at), "MMMM dd, yyyy")}
                    </p>
                    <p className="tracking-tighter text-gray-600 font-medium">
                      {myData.views[0] ? myData.views[0].views : 0} views
                    </p>
                  </div>
                  {myData.image && (
                    <Image
                      src={myData.image}
                      alt={myData.imageAlt}
                      className="rounded-md "
                      width={1920}
                      height={1080}
                    />
                  )}
                  <p className="lg:max-w-[800px]">
                    {parse(myData.description)}
                  </p>
                </div>
                <div className="mt-10 mb-10">
                  {categoriesData && (
                    <BlogCategory categoriesData={categoriesData} />
                  )}
                </div>
              </div>
              <div className="flex items-center lg:w-[800px] justify-center">
                <ShareBlog slug={myData.slug} />
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
    </>
  );
};

export default BlogDetail;
