import { Outlet } from "react-router-dom";
import Footer from "../ui/footer.jsx";
import Header from "../ui/header.jsx";

export function LayoutPage() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
