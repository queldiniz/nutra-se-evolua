import { BrowserRouter, Routes, Route } from "react-router-dom";
import DefaultLayout from "./components/DefaultLayout";
import Home from "./pages/Home";
import Alimentos from "./pages/Alimentos";
import Gestao from "./pages/Gestao";
import DetalhesPaciente from "./pages/DetalhesPaciente";
import PublicPaciente from "./pages/PublicPaciente";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota publica — fora do DefaultLayout (sem header/nav admin) */}
        <Route path="/public/:token" element={<PublicPaciente />} />

        {/* Rotas internas — dentro do DefaultLayout (com header/nav/footer) */}
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/alimentos" element={<Alimentos />} />
          <Route path="/gestao" element={<Gestao />} />
          <Route path="/paciente/:id" element={<DetalhesPaciente />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
