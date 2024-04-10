import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "./ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const BlogCategory = ({ categoriesData }) => {
  const searchParams = useSearchParams();
  return (
    <div className=" bg-white p-[24px] border-[1px] border-black/10 w-[90%] lg:w-[380px]">
      <div className="px-[24px] pt-[24px]">
        <h4 className="text-[#262323] text-[20px] font-[700]">Categories</h4>
        <hr class="h-px mt-[16px] bg-[#3B444F] opacity-10 border-1" />
      </div>
      <div className="mt-[24px] pl-[32px] pr-[28px] pb-[32px]">
        {categoriesData &&
          categoriesData.map((item, index) => (
            <>
              <Link
                href={{
                  pathname: "/blogs",
                  query: { category: item.id },
                }}
                className="text-[#6F6767] font-[500] text-[16px] cursor-pointer"
                key={item.id}
              >
                {item.name}
              </Link>
              {categoriesData.length - 1 == index ? null : (
                <hr class="h-px mt-[24px] bg-[#3B444F] opacity-10 border-1" />
              )}
            </>
          ))}
      </div>
    </div>
  );
};

export default BlogCategory;
