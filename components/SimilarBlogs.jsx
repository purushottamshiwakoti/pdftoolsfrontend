import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import parse, { domToReact } from "html-react-parser";

const SimilarBlogs = ({ blogsData, blogId }) => {
  return (
    <div className="">
      {blogsData.length > 0 && (
        <div>
          <h2 className="font-[600] text-[32px] text-[#262323]">
            Other similar blogs
          </h2>
        </div>
      )}
      <div className="mt-[48px]">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-[40px]  ">
          {blogsData ? (
            blogsData.map((item, index) =>
              item.id === blogId ? null : index < 4 ? (
                <Link
                  href={`/blog/${item.slug}`}
                  className="relative w-[90%] border-[1px] bg-white border-black/10"
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
              text-[##262323] 
              leading-[24.2px]
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
                        <p className="text-[12px] font-[500] text-[#EE1B22]">
                          {" "}
                          By AllPDFconverter
                        </p>
                      </div>
                    </div>
                    <div className="mt-[12px]">
                      <div className="text-[#6F6767] text-sm font-normal line-clamp-2">
                        {parse(item.description)}
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

export default SimilarBlogs;
