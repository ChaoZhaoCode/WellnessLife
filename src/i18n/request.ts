import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, defaultLocale, type Locale } from "@/i18n/config";
import zhMessages from "./messages/zh.json";
import jaMessages from "./messages/ja.json";

const messagesMap: Record<Locale, object> = {
  zh: zhMessages,
  ja: jaMessages,
};

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  const safeLocale: Locale = locale && locales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale;
  return {
    locale: safeLocale,
    messages: messagesMap[safeLocale],
  };
});
