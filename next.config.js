const { i18n } = require("./next-i18next.config");

module.exports = {
  reactStrictMode: false,
  swcMinify: true,
  i18n: {
    defaultLocale: "en",
    locales: [
      "ar",
      "da",
      "de",
      "en",
      "es",
      "fr",
      "hi",
      "id",
      "it",
      "ja",
      "ko",
      "nl",
      "pt",
      "ru",
      "uk",
      "zh",
    ],
  },
  images: {
    domains: ["cdnjs.cloudflare.com", "res.cloudinary.com", "i.pinimg.com"],
  },
  env: {
    NEXT_PUBLIC_GA_ID: "your_google_analytics_tracking_id",
    /**
     * Timout out to stop sending download requests. In case
     * there's no response back after one hour from sending the first download request
     */
    NEXT_PUBLIC_DOWNLOAD_TIMEOUT: "3600000", // 1 hour in miliseconds  //1 h = 3600000 ms
    // Timout to delete saved files from server, if their last edited date has exceeded one hour
    NEXT_PUBLIC_DELETION_TIMEOUT: "3600000", // 1 hour in miliseconds  //1 h = 3600000 ms
    // 1.01 hour is time duration to start checking if files last edited date has exceeded one hour
    NEXT_PUBLIC_DELETION_INTERVAL_DURATION: "3636000", //1.01 hour in miliseconds //1.01 h = 3636000 ms
    //delay between two download requests // sending download request every 5s
    NEXT_PUBLIC_DOWNLOAD_REQUEST_DELAY: "5000", // 5 seconds in miliseconds  // 5s = 5000
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: false,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
};
