import React, { useEffect, useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "next-i18next";
import useToolsData from "@/hooks/useToolsData";
import styles from "../styles/MegaMenu.module.css";
import { NavDown, NavUp } from "./icons/Icon";
import { DialogClose } from "@radix-ui/react-dialog";

const NavSheet = () => {
  const ref = useRef(null);
  const [handleClick, setHandleClick] = useState(false);
  const path = usePathname();
  const { t } = useTranslation();
  const toolsData = useToolsData();
  const [showModal, setShowModal] = useState(false);
  const [navToggleShow, setNavToggleShow] = useState(false);

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
     
    </>
  );
};

export default NavSheet;
