import Image from "next/image";
import React from "react";

const GoodCompany = ({ data }) => {
  console.log(data);
  return (
    <div className="grid lg:grid-cols-4 space-y-3 md:gap-y-3 md:space-y-0 md:gap-x-4 md:grid-cols-2 grid-cols-1">
      <Image src={data.image} alt="facebook" width={300} height={300} />
      <Image src={data.imageTwo} alt="facebook" width={300} height={300} />
      <Image src={data.imageThree} alt="facebook" width={300} height={300} />
      <Image src={data.imageFour} alt="facebook" width={300} height={300} />    
    </div>
  );
};

export default GoodCompany;
