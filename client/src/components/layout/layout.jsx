import { Outlet } from "react-router-dom";
import Footer from "../ui/footer.jsx";
import Header from "../ui/header.jsx";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";


export function LayoutPage() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set direction to RTL for Urdu, LTR otherwise
    const dir = i18n.language === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.body.dir = dir;
  }, [i18n.language]);

  return (
    <div className={i18n.language === 'ur' ? 'font-urdu' : ''}>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
