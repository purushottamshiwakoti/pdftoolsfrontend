import Head from "next/head";
import { useEffect, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/router";
import * as gtag from "../helpers/gtag";
import { appWithTranslation } from "next-i18next";
import Layout from "../components/Layout";
import "../styles/global.css";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  const [seoData, setSeoData] = useState(null);

  useEffect(() => {
    fetch(`/api/seo-settings`)
      .then((res) => res.json())
      .then((data) => {
        setSeoData(data.data);
      });
  }, []);

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
  return (
    <>
      <Head>
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <meta name="author" content="" />
        <meta name="theme-color" content="#2d3748" />
        <link rel="icon" href="/img/files.png" />
        <link rel="apple-touch-icon" href="/img/files.png" />

        {/* {seoData && (
          <>
            <meta
              name="google-site-verification"
              content={seoData.googleSiteVerificationCode}
            />
            <meta property="og:title" content={seoData.ogTitle} />
            <meta property="og:description" content={seoData.ogDescription} />
            <meta property="og:image" content={seoData.ogImage} />
            <meta property="og:title" content={seoData.ogTitle} />
            <meta property="og:description" content={seoData.ogDescription} />
          </>
        )} */}
      </Head>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <Layout>
        <NextTopLoader color="#7D64FF" />
        <Toaster richColors />
        <Component {...pageProps} />
      </Layout>
    </>
  );
};

export default appWithTranslation(MyApp);
