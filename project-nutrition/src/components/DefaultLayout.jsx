import { Outlet } from "react-router-dom";
import Header from "./Header";
import Breadcrumb from "./Breadcrumb";
import Footer from "./Footer";
import BackToTop from "./BackToTop";

function DefaultLayout() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Header />
      <Breadcrumb />

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}

export default DefaultLayout;
