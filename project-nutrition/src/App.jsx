import { BrowserRouter, Routes, Route } from "react-router-dom";
import DefaultLayout from "./components/DefaultLayout";
import Home from "./pages/Home";
import Alimentos from "./pages/Alimentos";
import Gestao from "./pages/Gestao";
import DetalhesPaciente from "./pages/DetalhesPaciente";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <DefaultLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/alimentos" element={<Alimentos />} />
          <Route path="/gestao" element={<Gestao />} />
          <Route path="/paciente/:id" element={<DetalhesPaciente />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </DefaultLayout>
    </BrowserRouter>
  );
}

export default App;
