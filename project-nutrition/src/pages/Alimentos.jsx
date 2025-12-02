import { useState, useEffect } from "react";
import CardNutricao from "../components/CardNutrition";
import SkeletonCard from "../components/SkeletonCard";

function Alimentos() {
  const [alimentos, setAlimentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const resposta = await fetch("/db.json");
        if (!resposta.ok) throw new Error("Erro ao buscar dados");

        const dados = await resposta.json();
        setAlimentos(dados.nutricao);
      } catch {
        setErro("Falha ao carregar alimentos.");
      } finally {
        setLoading(false);
      }
    };

    buscarDados();
  }, []);

  if (erro) {
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
        {erro}
      </div>
    );
  }

  return (
    <section className="info-alimentacao">
      <div className="container-principal">
        <h1>Guia Rápido de Nutrição</h1>

        <div className="slider-wrapper">
          <div className="card-container">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))
              : alimentos.map((item) => (
                  <CardNutricao
                    key={item.id}
                    titulo={item.titulo}
                    imagem={item.imagem}
                    recomendacao={item.recomendacao}
                    fontes={item.fontes}
                    citacao={item.citacao}
                  />
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Alimentos;
