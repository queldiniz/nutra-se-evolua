import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Alimentos from "./pages/Alimentos";
import Gestao from "./pages/Gestao";
import DetalhesPaciente from "./pages/DetalhesPaciente";
import Breadcrumb from "./components/Breadcrumb";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";

function App() {
  return (
    <BrowserRouter>
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Header />
        <Breadcrumb />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/alimentos" element={<Alimentos />} />
            <Route path="/gestao" element={<Gestao />} />
            <Route path="/paciente/:id" element={<DetalhesPaciente />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <BackToTop />
      </div>
    </BrowserRouter>
  );
}

export default App;
