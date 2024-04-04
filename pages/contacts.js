import ContactForm from "@/components/ContactForm";
import parse from "html-react-parser";
import Head from "next/head";

import { appUrl, dashboardUrl } from "@/lib/url";
import { useRouter } from "next/router";

export async function getServerSideProps() {
  const res = await fetch(`${dashboardUrl}/other/contact-us`);
  const { page } = await res.json();
  return {
    props: {
      myData: page,
    },
  };
}

const Contacts = ({ myData }) => {
  const router = useRouter();
  const currentUrl = router.asPath;

  const isLoading = false;
  const isWindows = false;

  return (
    <>
      <Head>
        {/* Anything you add here will be added this page only */}
        <title>{myData.metaTitle ? myData.metaTitle : myData.title}</title>
        <meta
          name="description"
          content={
            myData.metaDescription
              ? myData.metaDescription
              : myData.shortDescription
          }
        />
        {myData && (
          <>
            <meta property="og:title" content={myData.ogTitle} />
            <meta property="og:description" content={myData.ogDescription} />
            <meta property="og:image" content={myData.ogImage} />
            <meta property="og:image:alt" content={myData.ogImageAlt} />
          </>
        )}
        <meta name="Keywords" content="" />
        <link rel="canonical" href={`${appUrl}${currentUrl}`} key="canonical" />

        <meta name="robots" content="noindex,nofollow" />
        {/* You can add your canonical here */}
        {/* You can add your alternate here */}
      </Head>
      <main>
        <header className="page_section header mb-0">
          {isLoading ? (
            <h1 className="title bg-slate-200 h-6  w-[12rem] lg:w-[25rem] animate-pulse"></h1>
          ) : (
            <h1 className="title">{myData.title}</h1>
          )}
        </header>
        <section className="page_section mt-0">
          <article className="container">
            <section>
              {/* <p className={`${pageStyles.paragraph_text}`}>
                {t("contact:contact_text")}
              </p> */}

              {isLoading ? (
                <div className="space-y-4">
                  <p className="bg-slate-200 h-6  w-[15rem] lg:w-[25rem] animate-pulse"></p>
                  <p className="bg-slate-200 h-6  w-[15rem] lg:w-[25rem] animate-pulse"></p>
                  <p className="bg-slate-200 h-6  w-[15rem] lg:w-[25rem] animate-pulse"></p>
                </div>
              ) : (
                <div className="text-3xl">
                  {myData?.description && parse(myData.description)}
                </div>
              )}
            </section>
          </article>
          <section>
            <div>
              <h2 className="text-[#262323] font-bold tracking-wider text-xl md:text-3xl ">
                Contact Us
              </h2>
              <div className="mt-2">
                <ContactForm />
              </div>
            </div>
          </section>
        </section>
      </main>
    </>
  );
};

export default Contacts;
