import Header from "./Header";
import Breadcrumb from "./Breadcrumb";
import Footer from "./Footer";
import BackToTop from "./BackToTop";

function DefaultLayout({ children }) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Header />
      <Breadcrumb />

      <main style={{ flex: 1 }}>{children}</main>

      <Footer />
      <BackToTop />
    </div>
  );
}

export default DefaultLayout;
