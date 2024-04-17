import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const PopularBlogs = ({ blogsData }) => {
  const filteredBlogsData = blogsData.slice(0, 3);
  return (
    <div className=" bg-white p-[24px] border-[1px] border-black/10 w-[90%] lg:w-[380px]">
      <h3 className="text-[#262323] font-[700] text-[20px]">Popular Blogs</h3>

      {blogsData && (
        <div>
          {filteredBlogsData.map((item, index) => (
            <React.Fragment key={item.id}>
              <Link href={`/blog/${item.slug}`} className="mt-[24px] flex">
                <div>
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    width={200}
                    height={200}
                  />
                </div>
                <div className="ml-[12px]">
                  <h4 className="font-[600] text-[16px]">
                    {/* Display blog title */}
                    {item.title}
                  </h4>
                  <div className="text-[12px] font-[500] text-[#6F6767] mt-[12px]">
                    <div>
                      {/* Format date and display views count */}
                      {format(item.created_at, "MMMM dd, yyyy")} •{" "}
                      {item.views[0]?.views ?? 0} Views
                    </div>
                  </div>
                </div>
              </Link>
              {index < 2 ? (
                <hr className="h-px my-[24px] bg-[#3B444F] opacity-10 border-1" />
              ) : (
                <div className="mb-[40px]"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default PopularBlogs;
