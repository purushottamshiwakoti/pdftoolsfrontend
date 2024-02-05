import Image from "next/image";
import React from "react";

const WhyChooseUs = ({ data }) => {
  return (
    <div>
      <h2 className="text-[#7D64FF] font-bold tracking-wider text-3xl md:text-4xl  text-center mb-10">
        Why Choose Us
      </h2>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
        {data.map((item) => (
          <div className="space-y-3 mb-10" key={item.id}>
            <div className="relative w-[100px] h-[100px]">
              <Image src={item.image} alt={item.imageAlt} fill />
            </div>
            <h2 className="text-xl font-medium">{item.title}</h2>
            <p className="text-black/60">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;
