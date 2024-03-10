import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Verticalbar } from "./icons/Icon";

const Footer = () => {
  return (
    <>
      <footer className="lg:px-[120px] px-[10px] pt-[80px]">
        <div className="grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 lg:space-y-0 space-y-3 lg:gap-[64px]">
          <div>
            <Image
              src={"/all-pdf-convertor-logo.png"}
              alt="all-pdf-convertor-logo"
              width={180}
              height={38}
            />
            <h2 className="mt-[24px] text-[14px] text-[#262323] leading-[20px] tracking-normal">
              Access all essential PDF tools for free, right at your fingertips!
            </h2>
            <p className="text-[#6F6767] text-[12px] mt-[8px] font-[400]">
              Copyright © 2024. All Rights Reserved.
            </p>
          </div>
          <div>
            <h3 className="text-[#EE1B22] text-[18px] font-[600] mb-[16px]">
              Company
            </h3>
            <div className="space-y-[12px] flex flex-col">
              <Link
                href={"/"}
                className="text-[#262323] text-[14px] font-[500]"
              >
                Home
              </Link>
              <Link
                href={"/about"}
                className="text-[#262323] text-[14px] font-[500]"
              >
                About us
              </Link>
              <Link
                href={"/blogs"}
                className="text-[#262323] text-[14px] font-[500]"
              >
                Blogs
              </Link>
              <Link
                href={"/contactus"}
                className="text-[#262323] text-[14px] font-[500]"
              >
                Contact us
              </Link>
              <Link
                href={"/privacy-policy"}
                className="text-[#262323] text-[14px] font-[500]"
              >
                Privacy Policy
              </Link>
              <Link
                href={"/terms-of-use"}
                className="text-[#262323] text-[14px] font-[500]"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-[#EE1B22] text-[18px] font-[600] mb-[16px]">
              Convert from PDF
            </h3>
            <div className="space-y-[12px] flex flex-col">
              <Link
                href={"/pdf-to-word"}
                className="text-[#262323] text-[14px] font-[500]"
              >
                PDF to Word
              </Link>
              <Link
                href={"/pdf-to-pptx"}
                className="text-[#262323] text-[14px] font-[500]"
              >
                PDF to Powerpoint
              </Link>
              <Link
                href={"/pdf-to-jpg"}
                className="text-[#262323] text-[14px] font-[500]"
              >
                PDF to JPG
              </Link>
              <Link
                href={"/pdf-to-png"}
                className="text-[#262323] text-[14px] font-[500]"
              >
                PDF to PNG
              </Link>
              <Link
                href={"/pdf-to-png"}
                className="text-[#262323] text-[14px] font-[500]"
              >
                PDF to PNG
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-[#EE1B22] text-[18px] font-[600] mb-[16px]">
              Convert to PDF
            </h3>
            <div className="space-y-[12px] flex flex-col">
              <Link
                href={"/word-to-pdf"}
                className="text-[#262323] text-[14px] font-[500]"
              >
                Word to PDF
              </Link>
              <Link
                href={"/pptx-to-pdf"}
                className="text-[#262323] text-[14px] font-[500]"
              >
                Powerpoint to PDF
              </Link>
              <Link
                href={"/jpg-to-pdf"}
                className="text-[#262323] text-[14px] font-[500]"
              >
                JPG to PDF
              </Link>
              <Link
                href={"/png-to-pdf"}
                className="text-[#262323] text-[14px] font-[500]"
              >
                PNG to PDF
              </Link>
              <Link
                href={"/png-to-pdf"}
                className="text-[#262323] text-[14px] font-[500]"
              >
                PNG to PDF
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-[#EE1B22] text-[18px] font-[600] mb-[16px]">
              Popular PDF Editor
            </h3>
            <div className="space-y-[12px] flex flex-col">
              <Link
                href={"/merge-pdf"}
                className="text-[#262323] text-[14px] font-[500]"
              >
                Merge PDF
              </Link>
              <Link
                href={"/remove-pdf-pages"}
                className="text-[#262323] text-[14px] font-[500]"
              >
                Remove Pages
              </Link>
              <Link
                href={"/compress-pdf"}
                className="text-[#262323] text-[14px] font-[500]"
              >
                Compress PDF
              </Link>
              <Link
                href={"/unlock-pdf"}
                className="text-[#262323] text-[14px] font-[500]"
              >
                Unlock PDF
              </Link>
              <Link
                href={"/unlock-pdf"}
                className="text-[#262323] text-[14px] font-[500]"
              >
                Unlock PDF
              </Link>
            </div>
          </div>
        </div>
      </footer>
      <div className="mt-[80px] bg-[#262323] lg:px-[120px] px-[10px] lg:py-[10px] flex lg:flex-row  flex-col lg:items-center lg:justify-between">
        <p className="text-[14px] font-[400] text-[#fff]">
          Made with love ❤️ by
          <span className="font-[400] "> Makura Creations.</span>
        </p>
        <div className="flex  items-center space-x-[22px] ">
          <div className="text-[#fff]">Facebook</div>
          {Verticalbar}
          <div className="text-[#fff]">Instagram</div>
          {Verticalbar}
          <div className="text-[#fff]">Linkedin</div>
        </div>
      </div>
    </>
  );
};

export default Footer;
