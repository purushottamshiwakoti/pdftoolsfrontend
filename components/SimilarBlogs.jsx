import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";

const SimilarBlogs = ({ blogsData }) => {
  console.log(blogsData);
  return (
    <div className="mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Similar Blogs</CardTitle>
          <Separator />
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 lg:space-x-4 md:space-y-4   mt-3 ">
            {blogsData !== null && blogsData.length > 0 ? (
              blogsData.map((item, index) =>
                index == 0 ? null : index < 4 ? (
                  <div className="shadow-md bg-white p-2  hover:scale-105 transition-all ease-in-out duration-300 delay-200 cursor-pointer">
                    <Link
                      href={`/blog/${item.slug}`}
                      className="space-y-3"
                      key={index}
                    >
                      <div className="relative h-[200px] w-[320px] ">
                        <Image
                          fill
                          src={item.image}
                          alt={item.imageAlt}
                          className="rounded-md "
                        />
                      </div>
                      <div className="space-y-2">
                        <h2 className="font-bold text-black/80 line-clamp-1">
                          {item.title}
                        </h2>
                        <p className="line-clamp-2 text-gray-600 ">
                          {parse(item.description)}
                        </p>
                      </div>
                    </Link>
                  </div>
                ) : null
              )
            ) : (
              <p>No blogs found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimilarBlogs;
