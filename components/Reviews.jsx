import Image from "next/image";

const Reviews = ({ data }) => {
  const images = ["/person.png", "/person1.png", "/person2.jpg"];
  return (
    <div>
      <h3 className="text-[#262323] font-[600]  text-[32px] md:text-4xl text-center mb-[16px]">
        Join the community of 1M+ Happy Customers
      </h3>
      <p className="text-center  mb-[48px] text-[16px] leading-[22px] tracking-normal text-[#6F6767] font-[400]">
        Merge, split, compress, convert, rotate, unlock, and watermark PDFs
        effortlessly with just a few clicks. Compress, convert, rotate, unlock,
        and watermark PDFs effortlessly with just a few clicks.
      </p>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
        {data.map((item, index) => (
          <div className="text-center relative h-[188px] mx-[28px]">
            <div className="">
              <p className="text-[14px] text-[#262323] tracking-normal text-center font-[500] leading-[22px] italic">
                <q>{item.description}</q>
              </p>
              <div className="flex items-center mt-[24px] justify-center gap-[9px]">
                <div className="w-[50px] h-[50px] flex items-center justify-center relative">
                  <Image
                    src={images[index]}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full "
                  />
                </div>
                <h5 className="  mt-[28px] text-[#262323] text-[16px] font-[600]">
                  {item.name}
                </h5>
              </div>
            </div>
            <div className="">
              <div className="absolute top-0">
                <svg
                  width="1"
                  height="188"
                  viewBox="0 0 1 188"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    opacity="0.05"
                    x1="0.5"
                    y1="2.18557e-08"
                    x2="0.499992"
                    y2="188"
                    stroke="black"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
