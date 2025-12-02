import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Alimentos from "./pages/Alimentos";
import Gestao from "./pages/Gestao";
import DetalhesPaciente from "./pages/DetalhesPaciente";

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/alimentos" element={<Alimentos />} />
        <Route path="/gestao" element={<Gestao />} />
        {/* <Route path="/paciente/:id" element={<DetalhesPaciente />} /> */}

        {/* Rota de Detalhes do Paciente */}
        <Route path="/paciente/:id" element={<DetalhesPaciente />} />
        {/* Rota 404 */}
        <Route
          path="*"
          element={
            <div style={{ textAlign: "center", marginTop: "50px" }}>
              <h1>Erro 404</h1>
              <p>Página não encontrada</p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
