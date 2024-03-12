import Image from "next/image";
import React from "react";

const WhyChooseUs = ({ data }) => {
  return (
    <div>
      <h3 className="text-[#262323] font-[600]  text-[32px] md:text-4xl  text-center ">
        Why Choose Us
      </h3>
      <p className="text-[16px] text-[#6F6767] text-center mt-3 tracking-wide ">
        Merge, split, compress, convert, rotate, unlock, and watermark PDFs
        effortlessly with just a few clicks.
      </p>
      <div className="grid  lg:grid-cols-3 mt-5 md:grid-cols-2 grid-cols-1 gap-7">
        {data.map((item) => (
          <div className="space-y-3 mb-10" key={item.id}>
            <div className="relative w-[100px] h-[100px]">
              <Image src={item.image} alt={item.imageAlt} fill />
            </div>
            <div className="text-[##262323] text-[18px]  font-[600] my-4">
              {item.title}
            </div>
            <p className="text-[14px] font-[400] text-[#6F6767]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;
