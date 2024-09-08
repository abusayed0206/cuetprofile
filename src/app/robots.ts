import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/", // Disallow all user agents from accessing any part of the site
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
