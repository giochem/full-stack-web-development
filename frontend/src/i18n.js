import { createI18n } from "vue-i18n";
import vn from "./locales/vn-VN.json";
import en from "./locales/en-US.json";

function loadLocaleMessages() {
  const locales = [{ vn: vn }, { en: en }];
  const messages = {};
  locales.forEach((lang) => {
    const key = Object.keys(lang);
    messages[key] = lang[key];
  });
  return messages;
}

export default createI18n({
  legacy: false,
  locale: "vn",
  fallbackLocale: "en",
  messages: loadLocaleMessages()
});
