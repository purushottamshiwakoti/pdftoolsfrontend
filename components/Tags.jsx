import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "./ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const Tags = () => {
  const searchParams = useSearchParams();
  const tagsLists = [
    "Free Convert",
    "Online Converter",
    "PNG",
    "Online Converter",
    "Tips",
    "Convert",
  ];
  return (
    <div className="w-[380px] mt-[32px] border-[1px] border-black/10">
      <div className="px-[24px] pt-[24px]">
        <h4 className="text-[#262323] text-[20px] font-[700]">Tags</h4>
        <hr class="h-px mt-[16px] bg-[#3B444F] opacity-10 border-1" />
      </div>
      <div className="mt-[24px] pl-[32px] pr-[24px] pb-[20px]">
        {/* <p className="text-[#6F6767] font-[500] text-[16px] cursor-pointer">
          Free Convert
        </p> */}
        <div className="flex flex-wrap justify-between    ">
          {tagsLists.map((item, index) => (
            <Button
              className="rounded-[16px] text-[12px] h-[28px] mb-[12px]     bg-[#EE1B22] hover:bg-[#EE1B22]/80 px-[16px]  py-[4px]  "
              key={index}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tags;
