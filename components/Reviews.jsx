import React from "react";
import { Quote, StarFill } from "react-bootstrap-icons";

const Reviews = ({ data }) => {
  return (
    <div>
      <h2 className="text-[#7D64FF] font-bold tracking-wider text-3xl md:text-4xl  text-center mb-10">
        Reviews
      </h2>
      <div className="grid gap-6 text-center md:grid-cols-3 lg:gap-12">
        {data.map((item) => (
          <div className="mb-12 md:mb-0" key={item.id}>
            <h5 className="mb-4 text-xl font-semibold">{item.name}</h5>
            <h6 className="mb-4 font-semibold text-primary dark:text-primary-500">
              {item.role}
            </h6>

            <p className="mb-4 flex">
              <span className="w-7 h-7 ">
                <Quote />
              </span>
              {item.description}
            </p>
            <div className="flex space-x-1 justify-center items-center">
              {Array.from({ length: item.rating }, (_, index) => (
                <StarFill key={index} color="#EAB308" className="w-5 h-5" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;