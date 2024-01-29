import Image from "next/image";
import React from "react";

const GoodCompany = ({ data }) => {
  return (
    <div className="grid lg:grid-cols-4 space-y-3 md:gap-y-3 md:space-y-0 md:gap-x-4 md:grid-cols-2 grid-cols-1">
      <Image src={data.image} alt={data.imageAlt} width={300} height={300} />
      <Image
        src={data.imageTwo}
        alt={data.imageTwoAlt}
        width={300}
        height={300}
      />
      <Image
        src={data.imageThree}
        alt={data.imageThreeAlt}
        width={300}
        height={300}
      />
      <Image
        src={data.imageFour}
        alt={data.imageFourAlt}
        width={300}
        height={300}
      />
    </div>
  );
};

export default GoodCompany;
