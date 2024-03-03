import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, List, X } from "react-bootstrap-icons";
import useToolsData from "../hooks/useToolsData";
import styles from "../styles/MegaMenu.module.css";
import LangModal from "./LangModal";
import LanguageCountryFlag from "./LanguageCountryFlag";
import ToolsList from "./ToolsList";
import { NavDown, NavUp } from "./icons/Icon";

const Nav = React.memo(function Nav() {
  const router = useRouter();
  const toolsData = useToolsData();
  const { t } = useTranslation();
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

  return (
    <>
      <header className="relative">
        <div className="fixed top-0 w-full z-[999]  ">
          <nav className={`${styles.navigation} shadow-md relative`}>
            <Link href="/" className={`${styles.logo}`}>
              {/* <h3>
                <span style={{ color: "#7d64ff" }}>PDF</span>
                <span style={{ color: "#2d3748" }}>Tools</span>
                <span className="dot"></span>
              </h3> */}

              <Image
                src={"/all-pdf-convertor-logo.png"}
                alt="all-pdf-convertor-logo"
                width={210}
                height={80}
              />
            </Link>
            <ul
              ref={navMenuRef}
              className={`
              uppercase
              ${styles.nav_menu} ${navToggleShow ? "" : ""}
              
              `}
            >
              <li
                className={`  ${styles.nav_list} ${styles.remove_in_mobile} `}
              >
                <Link
                  href="/"
                  className={`${
                    styles.nav_link
                  }  hover:text-[#EE1B22] text-[16px] font-[600]:
                  ${path == "/" ? "text-[#EE1B22] relative " : ""}
                  `}
                >
                  {path == "/" && (
                    <span className="bg-red-500 h-[4px] w-[89px] absolute top-12 ml-3 "></span>
                  )}
                  <span>{t("common:home_page")}</span>
                </Link>
              </li>

              <li className={`${styles.nav_list} ${styles.remove_in_mobile}`}>
                <Link
                  href={toolsData["MergePDFTool"].href}
                  className={`${
                    styles.nav_link
                  }  hover:text-[#EE1B22] text-[16px] font-[500]
                  ${path == "/merge-pdf" ? "text-[#EE1B22] relative " : " "}
                  `}
                  prefetch={false}
                >
                  {path == "/merge-pdf" && (
                    <span className="bg-red-500 h-[4px] w-[110px] absolute top-12 ml-2  "></span>
                  )}
                  <span>{toolsData["MergePDFTool"].title}</span>
                </Link>
              </li>

              <li className={`${styles.nav_list} ${styles.remove_in_mobile}`}>
                <Link
                  href={toolsData["CompressPDFTool"].href}
                  className={`${
                    styles.nav_link
                  }  hover:text-[#EE1B22] text-[16px] font-[500] ${
                    path == "/compress-pdf" ? "text-[#EE1B22] relative " : ""
                  }
                  `}
                  prefetch={false}
                >
                  {path == "/compress-pdf" && (
                    <span className="bg-red-500 h-[4px] w-[150px] absolute top-12 ml-5  "></span>
                  )}
                  <span>{toolsData["CompressPDFTool"].title}</span>
                </Link>
              </li>

              <li
                className={`${styles.nav_list} ${
                  navToggleShow ? styles.nav_list_menu : ""
                }`}
              >
                <div
                  className={`${styles.nav_link} ${styles.remove_in_mobile} hover:text-[#EE1B22] flex items-center justify-center gap-2 relative`}
                  onClick={() => {
                    setNavToggleShow(!navToggleShow);
                  }}
                >
                  <span className=" font-[500] text-[16px]">
                    {t("common:all_pdf_tools")}
                  </span>
                  {navToggleShow ? (
                    <>
                      {NavUp}
                      <span className="bg-red-500 h-[4px] w-[200px] absolute top-12 ml-5  "></span>
                    </>
                  ) : (
                    NavDown
                  )}
                </div>
                <div className={`${styles.dropdown}`}>
                  <div className={`${styles.dropdown_inner}`}>
                    {navToggleShow && <ToolsList />}
                  </div>
                </div>
              </li>
            </ul>
            <div className={`${styles.nav_action}`}>
              <div
                className={`${styles.btn_primary}`}
                onClick={() => setShowModal(true)}
              >
                <LanguageCountryFlag locale={router.locale} />
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
      {showModal && (
        <LangModal show={showModal} onClose={() => setShowModal(false)} />
      )}
    </>
  );
});

export default Nav;
