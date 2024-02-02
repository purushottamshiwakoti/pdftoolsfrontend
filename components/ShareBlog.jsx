import React from "react";

import {
  FaFacebookF,
  FaFacebookMessenger,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
// import {
//   FacebookShareButton,
//   TwitterShareButton,
//   LinkedinShareButton,
// } from "next-share";
import { appUrl } from "@/lib/url";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
} from "react-share";

const ShareBlog = ({ slug }) => {
  return (
    <div className="-ml-10 mt-10 ">
      <div>
        <h2 className="text-gray-500 text-center">Share this article</h2>
        <div className="mt-3 space-x-5">
          <div
            class="w-20 h-20 rounded-full  
                inline-flex items-center justify-center  
                bg-white text-gray-700 text-xl font-bold
                border-2 border-[#7D64FF]
                cursor-pointer
                "
          >
            <FacebookShareButton url={`${appUrl}/blog/${slug}`}>
              <FaFacebookF className="w-8 h-8" color="#7D64FF" />
            </FacebookShareButton>
          </div>
          <div
            class="w-20 h-20 rounded-full  
                inline-flex items-center justify-center  
                bg-white text-gray-700 text-xl font-bold
                border-2 border-[#7D64FF]
                cursor-pointer
                "
          >
            <LinkedinShareButton url={`${appUrl}/blog/${slug}`}>
              <FaLinkedin className="w-8 h-8" color="#7D64FF" />
            </LinkedinShareButton>
          </div>
          <div
            class="w-20 h-20 rounded-full  
                inline-flex items-center justify-center  
                bg-white text-gray-700 text-xl font-bold
                border-2 border-[#7D64FF]
                cursor-pointer
                "
          >
            <WhatsappShareButton url={`${appUrl}/blog/${slug}`}>
              <FaWhatsapp className="w-8 h-8" color="#7D64FF" />
            </WhatsappShareButton>
          </div>
          <div
            class="w-20 h-20 rounded-full  
                inline-flex items-center justify-center  
                bg-white text-gray-700 text-xl font-bold
                border-2 border-[#7D64FF]
                cursor-pointer
                "
          >
            <TwitterShareButton url={`${appUrl}/blog/${slug}`}>
              <FaXTwitter className="w-8 h-8" color="#7D64FF" />
            </TwitterShareButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareBlog;
