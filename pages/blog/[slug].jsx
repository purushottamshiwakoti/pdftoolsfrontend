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
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
  const [isWindows, setIsWindows] = useState(false);
  const [categoriesData, setCategoriesData] = useState(null);
  const [similarBlogsData, setSimilarBlogsData] = useState(null);

  useEffect(() => {
    setSimilarBlogsData(null);
    if (slug) {
      fetch(`/api/blogs/${slug}`)
        .then((res) => res.json())
        .then((data) => {
          setMyData(data.data);
          if (data.error) {
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
                  <h2 className="text-[#7D64FF] text-lg font-bold line-clamp-1 tracking-wide">
                    {myData.title}
                  </h2>
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
                  <div className="relative h-[200px] w-[350px] lg:h-[400px] lg:w-[800px]">
                    <Image
                      fill
                      src={myData.image}
                      alt={myData.imageAlt}
                      className="rounded-md "
                    />
                  </div>
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
