import Image from "next/image";
import React from "react";
import { Facebook, HorizantalLine, Instagram, Linkdin } from "./icons/Icon";

const Thankyou = () => {
  return (
    <div className="bg-[#F9F4F4] relative flex lg:flex-row flex-col items-center justify-between w-full pl-[120px] lg:h-[400px] overflow-x-hidden overflow-y-hidden mb-10 ">
      <div className="lg:max-w-xl">
        <h4 className="text-[24px] text-[#262323] md:max-w-lg max-w-sm font-[600] tracking-wide">
          Thank you for using our services
        </h4>
        <p className="text-[#262323] text-[16px] font-[400] mt-[16px] md:max-w-lg max-w-sm">
          If you could spread the word about our website to your friends,
          highlighting that we offer everything for free, it would be greatly
          appreciated.
        </p>
        <div className="mt-[24px] flex items-center gap-[16px]">
          <span className="cursor-pointer">{Facebook}</span>
          <span className="cursor-pointer">{Linkdin}</span>
          <span className="cursor-pointer">{Instagram}</span>
        </div>
        <div className="mt-[32px]">{HorizantalLine}</div>
        <div>
          <div className="flex items-center mt-[24px]  ">
            <div className="w-[50px] h-[50px] flex  items-center justify-center relative">
              <Image
                src={"/manimg.png"}
                layout="fill"
                objectFit="cover"
                className="rounded-full border-[1px] border-[#F9F4F4]"
              />
            </div>
            <div className="w-[50px] h-[50px] flex -ml-5 items-center justify-center relative">
              <Image
                src={"/manimg.png"}
                layout="fill"
                objectFit="cover"
                className="rounded-full  border-[1px] border-[#F9F4F4] "
              />
            </div>
            <div className="w-[50px] h-[50px] flex -ml-5  items-center justify-center relative">
              <Image
                src={"/manimg.png"}
                layout="fill"
                objectFit="cover"
                className="rounded-full border-[1px] border-[#F9F4F4]  "
              />
            </div>
            <div className="w-[50px] h-[50px] flex -ml-5  items-center justify-center relative">
              <Image
                src={"/manimg.png"}
                layout="fill"
                objectFit="cover"
                className="rounded-full border-[1px] border-[#F9F4F4] "
              />
            </div>
          </div>
          <div className="mt-[8px]">
            <p className="text-[#6F6767] text-[14px] font-[700] uppercase tracking-wide">
              100,000 monthly users{" "}
            </p>
          </div>
        </div>
      </div>
      <div className="lg:relative  ">
        <div className="bg-[#EE1B22] srelative lg:ml-[30rem] lg:-mr-[5rem] lg:w-[580px] lg:h-[580px] w-[100] h-[100] lg:mt-[15rem] rounded-full"></div>
        <div className="absolute lg:top-[8rem]  lg:left-[25rem] lg:w-[54rem] lg:h-[54rem] w-[2rem] h-[2rem]">
          <Image
            src={"/lap.png"}
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Thankyou;
