import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Alimentos from "./pages/Alimentos";
import Gestao from "./pages/Gestao";
import DetalhesPaciente from "./pages/DetalhesPaciente";
import Breadcrumb from "./components/Breadcrumb";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Breadcrumb />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/alimentos" element={<Alimentos />} />
        <Route path="/gestao" element={<Gestao />} />
        {/* <Route path="/paciente/:id" element={<DetalhesPaciente />} /> */}

        {/* Rota de Detalhes do Paciente */}
        <Route path="/paciente/:id" element={<DetalhesPaciente />} />
        {/* Rota 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
