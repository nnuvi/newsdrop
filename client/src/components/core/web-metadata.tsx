
import { Platform } from "react-native";
import Head from "expo-router/head";

const SITE_URL = "https://newsdrop-sigma.vercel.app";
const TITLE = "NewsDrop | Your Personalized News Summary";
const DESCRIPTION =
  "Your topics. Your news. Summarized by AI. Discover personalized news and AI-powered summaries with NewsDrop.";
const OG_IMAGE = `${SITE_URL}/public/og-image.png`;

export function WebMetadata() {
  if (Platform.OS !== "web") {
    return null;
  }

  return (
    <Head>
      <title>{TITLE}</title>

      <meta name="description" content={DESCRIPTION} />
      <meta name="theme-color" content="#4f66ff" />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="NewsDrop" />
      <meta property="og:title" content={TITLE} />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:url" content={`${SITE_URL}/`} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={TITLE} />
      <meta name="twitter:description" content={DESCRIPTION} />
      <meta name="twitter:image" content={OG_IMAGE} />
    </Head>
  );
}
