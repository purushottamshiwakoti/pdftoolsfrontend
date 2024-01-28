import React, { useState, useEffect } from "react";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Share from "../components/Share";
import pageStyles from "../styles/Page.module.css";
import parse from "html-react-parser";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "about"])),
    },
  };
}

const BlogsPage = () => {
    const { t } = useTranslation();
  return (
    <div>BlogsPage</div>
  )
}

export default BlogsPage