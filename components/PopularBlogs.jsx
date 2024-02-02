import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";
import { Button } from "./ui/button";
import { ArrowRight } from "react-bootstrap-icons";

const PopularBlogs = ({ blogsData }) => {
  return (
    <div className="mt-10">
      <div>
        <h2 className="text-[#7D64FF]  text-3xl font-medium mt-4 tracking-tight mb-2 ">
          Popular Blogs
        </h2>
        <Separator />
      </div>
      <div className="mt-3">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 lg:space-x-4 lg:space-y-0 md:space-y-4  ">
          {blogsData.length > 0 ? (
            blogsData.map((item, index) =>
              index == 0 ? null : index < 4 ? (
                <div className="hover:scale-105 transition-all ease-in-out duration-300 delay-200 cursor-pointer   ">
                  <div className="shadow-lg  p-5 bg-white rounded-lg">
                    <Link
                      href={`/blog/${item.slug}`}
                      className="space-y-3 "
                      key={index}
                    >
                      <div className="relative h-[200px] w-[320px] -ml-8  ">
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
                        <p className="line-clamp-2 text-gray-600 flex-1 h-10 ">
                          {parse(item.description)}
                        </p>
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
                    </Link>
                  </div>
                </div>
              ) : null
            )
          ) : (
            <p>No blogs found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopularBlogs;
