import { Outlet } from "react-router-dom";
import  FooterPage  from "../ui/footer.jsx";
import HeaderPage from "../ui/header.jsx";

export function LayoutPage() {
  return (
    <>
      <HeaderPage />
      <Outlet />
      <FooterPage />
    </>
  );
}
