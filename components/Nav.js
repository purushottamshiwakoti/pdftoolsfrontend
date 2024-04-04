import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import LangModal from "./LangModal";
import ToolsList from "./ToolsList";
import LanguageCountryFlag from "./LanguageCountryFlag";
import styles from "../styles/MegaMenu.module.css";
import { List, ChevronDown, X, ChevronUp } from "react-bootstrap-icons";
import useToolsData from "../hooks/useToolsData";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NavDown, NavUp } from "./icons/Icon";
import NavSheet from "./NavSheet";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DialogClose } from "@radix-ui/react-dialog";
import { Menu } from "lucide-react";

const Nav = React.memo(function Nav() {
  const ref = useRef(null);
  const [handleClick, setHandleClick] = useState(false);
  const router = useRouter();
  const toolsData = useToolsData();
  const [showModal, setShowModal] = useState(false);
  const [navToggleShow, setNavToggleShow] = useState(false);
  const navMenuRef = useRef(null);
  const path = usePathname();

  const handleRouteChange = () => {
    //Route changes
    // close the menu
    setNavToggleShow(false);
  };

  const handleClickOutside = (event) => {
    if (navMenuRef.current && !navMenuRef.current.contains(event.target)) {
      // clicked outside the nav menu, close it
      // close the menu
      setNavToggleShow(false);
    }
  };

  useEffect(() => {
    //Add event listener on the document object to close the dropdown menu when clicking outside the dropdown menu
    document.addEventListener("mousedown", handleClickOutside);

    //Add event listener to close the dropdown menu when route change
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      // remove event listener when component unmounts
      document.removeEventListener("mousedown", handleClickOutside);
      // remove event listener when component unmounts
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  useEffect(() => {
    const handleOutSideClick = (event) => {
      if (!ref.current?.contains(event.target)) {
        setHandleClick(false);
      }
    };

    window.addEventListener("mousedown", handleOutSideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [ref]);

  return (
    <>
      <header className=" ">
        <div className="fixed top-0 w-full z-40  ">
          <nav className="flex items-center justify-between w-full h-20 bg-white shadow-md px-[10px]  lg:px-[120px]    ">
            {/* <nav className={`flex items-center justify-between `}> */}
            <Link href="/" className={`${styles.logo}`}>
              {/* <h3>
                <span style={{ color: "#7d64ff" }}>PDF</span>
                <span style={{ color: "#2d3748" }}>Tools</span>
                <span className="dot"></span>
              </h3> */}

              <Image
                src={"/all-pdf-convertor-logo.png"}
                alt="all-pdf-convertor-logo"
                width={180}
                height={38}
              />
            </Link>
            <div className="lg:hidden block">
              <Sheet>
                <SheetTrigger>
                  <Menu className="w-7 h-7" />
                </SheetTrigger>
                <SheetContent>
                  <ul className=" space-y-11 text-[#6F6767] text-[16px] font-[500] uppercase ">
                    <li className={`relative`}>
                      <DialogClose asChild>
                        <Link
                          href="/"
                          className={
                            path === "/" && !handleClick
                              ? "text-[#EE1B22] font-[600]"
                              : "hover:text-[#EE1B22]"
                          }
                        >
                          {/* <span>{t("common:home_page")}</span> */}
                          <span>Home</span>
                          {path == "/" && !handleClick && (
                            <span className="bg-[#EE1B22] w-[89px] h-[4px] absolute bottom-0 -left-4 top-10    "></span>
                          )}
                        </Link>
                      </DialogClose>
                    </li>

                    <li className="relative">
                      <DialogClose asChild>
                        <Link
                          href={toolsData["MergePDFTool"].href}
                          className={
                            path === "/merge-pdf" && !handleClick
                              ? "text-[#EE1B22] font-[600]"
                              : "hover:text-[#EE1B22]"
                          }
                          prefetch={false}
                        >
                          <span>
                            {/* {toolsData["MergePDFTool"].title} */}
                            Merge PDF
                          </span>
                          {path == "/merge-pdf" && !handleClick && (
                            <span className="bg-[#EE1B22] w-[120px] h-[4px] absolute bottom-0 -left-2 top-10   "></span>
                          )}
                        </Link>
                      </DialogClose>
                    </li>

                    <DialogClose asChild>
                      <li className={"relative"}>
                        <Link
                          href={toolsData["CompressPDFTool"].href}
                          className={
                            path === "/compress-pdf" && !handleClick
                              ? "text-[#EE1B22] font-[600]"
                              : "hover:text-[#EE1B22]"
                          }
                          prefetch={false}
                        >
                          <span>
                            {/* {toolsData["CompressPDFTool"].title} */}
                            Compress PDF
                          </span>
                          {path == "/compress-pdf" && !handleClick && (
                            <span className="bg-[#EE1B22] w-[160px] h-[4px] absolute bottom-0 -left-2 top-6   "></span>
                          )}
                        </Link>
                      </li>
                    </DialogClose>
                    {/* <li
                      className={` ${
                        navToggleShow ? styles.nav_list_menu : ""
                      }`}
                    >
                      <div
                        className={` relative `}
                        ref={ref}
                        onClick={() => {
                          setNavToggleShow(!navToggleShow),
                            setHandleClick(!handleClick);
                        }}
                      >
                        <div className="flex items-center gap-[6px]">
                          <span
                            className={handleClick ? "text-[#EE1B22]" : null}
                          >
                            {t("common:all_pdf_tools")}
                          </span>
                          {navToggleShow ? NavUp : NavDown}
                        </div>
                        {handleClick && (
                          <span className="bg-[#EE1B22] w-[165px] h-[4px] absolute bottom-0 -left-3 top-12"></span>
                        )}
                      </div>
                      <div className={``}>
                        <div>
                          {navToggleShow && (
                            <div className="h-10">
                              <ToolsList />
                            </div>
                          )}
                        </div>
                      </div>
                    </li> */}
                  </ul>
                </SheetContent>
              </Sheet>
            </div>
            <ul
              ref={navMenuRef}
              className="lg:flex hidden items-center gap-[40px] text-[#6F6767] text-[16px] font-[500] uppercase "
            >
              <li className={`relative`}>
                <Link
                  href="/"
                  className={
                    path === "/" && !handleClick
                      ? "text-[#EE1B22] font-[600]"
                      : "hover:text-[#EE1B22]"
                  }
                >
                  {/* <span>{t("common:home_page")}</span> */}
                  <span>Home</span>
                  {path == "/" && !handleClick && (
                    <span className="bg-[#EE1B22] w-[89px] h-[4px] absolute bottom-0 -left-4 top-12"></span>
                  )}
                </Link>
              </li>

              <li className="relative">
                <Link
                  href={toolsData["MergePDFTool"].href}
                  className={
                    path === "/merge-pdf" && !handleClick
                      ? "text-[#EE1B22] font-[600]"
                      : "hover:text-[#EE1B22]"
                  }
                  prefetch={false}
                >
                  <span>
                    {/* {toolsData["MergePDFTool"].title} */}
                    Merge PDF
                  </span>
                  {path == "/merge-pdf" && !handleClick && (
                    <span className="bg-[#EE1B22] w-[120px] h-[4px] absolute bottom-0 -left-2 top-12"></span>
                  )}
                </Link>
              </li>

              <li className={"relative"}>
                <Link
                  href={toolsData["CompressPDFTool"].href}
                  className={
                    path === "/compress-pdf" && !handleClick
                      ? "text-[#EE1B22] font-[600]"
                      : "hover:text-[#EE1B22]"
                  }
                  prefetch={false}
                >
                  <span>
                    {/* {toolsData["CompressPDFTool"].title} */}
                    Compress PDF
                  </span>
                  {path == "/compress-pdf" && !handleClick && (
                    <span className="bg-[#EE1B22] w-[160px] h-[4px] absolute bottom-0 -left-2 top-12"></span>
                  )}
                </Link>
              </li>

              <li className={` ${navToggleShow ? styles.nav_list_menu : ""}`}>
                <div
                  className={`${styles.nav_link} ${styles.remove_in_mobile} relative `}
                  ref={ref}
                  onClick={() => {
                    setNavToggleShow(!navToggleShow),
                      setHandleClick(!handleClick);
                  }}
                >
                  <div className="flex items-center gap-[6px]">
                    <span className={handleClick ? "text-[#EE1B22]" : null}>
                      {/* {t("common:all_pdf_tools")} */}
                      All PDF Tools
                    </span>
                    {navToggleShow ? NavUp : NavDown}
                  </div>
                  {handleClick && (
                    <span className="bg-[#EE1B22] w-[165px] h-[4px] absolute bottom-0 -left-3 top-12"></span>
                  )}
                </div>
                <div className={`${styles.dropdown}`}>
                  <div className={`${styles.dropdown_inner}`}>
                    {navToggleShow && <ToolsList />}
                  </div>
                </div>
              </li>
            </ul>
            <div className={`lg:block hidden`}>
              <div
                className={`lg:flex items-center gap-[4px] cursor-pointer hidden`}
                onClick={() => setShowModal(true)}
              >
                <LanguageCountryFlag locale={router.locale} />
                {/* {NavDown} */}
              </div>
              <div
                className={`${styles.nav_toggle}`}
                onClick={() => setNavToggleShow(!navToggleShow)}
              >
                {navToggleShow ? <X size={25} /> : <List size={25} />}
              </div>
            </div>
          </nav>
        </div>
      </header>
      {/* {showModal && (
        <LangModal show={showModal} onClose={() => setShowModal(false)} />
      )} */}
    </>
  );
});

export default Nav;
