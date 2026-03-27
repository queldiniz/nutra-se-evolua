import React, { useState, useEffect } from "react";

function Alimentos() {
  const [pesquisa, setPesquisa] = useState("");
  const [resultados, setResultados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  // Estados para listar os pacientes e saber quem foi selecionado
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState("");

  const API_URL_FATSECRET = "http://localhost:5000/api/alimentos/buscar";
  const API_URL_PACIENTES = "http://localhost:5000/api/nutrition/";
  const API_URL_REFEICOES = "http://localhost:5000/api/refeicoes/";

  // 1. Busca os pacientes assim que a tela abre para colocar no Select
  useEffect(() => {
    fetch(API_URL_PACIENTES)
      .then((res) => res.json())
      .then((data) => setPacientes(data))
      .catch((err) => console.error("Erro ao carregar pacientes:", err));
  }, []);

  const buscarAlimentos = async (e) => {
    e.preventDefault();
    if (!pesquisa) return;

    setCarregando(true);
    setErro("");
    setResultados([]);

    try {
      // Nota: Dependendo de como você fez o seu Back-End,
      // a URL pode precisar ser `${API_URL_FATSECRET}/${pesquisa}` em vez de usar o `?pesquisa=`
      const response = await fetch(
        `${API_URL_FATSECRET}?pesquisa=${encodeURIComponent(pesquisa)}`,
      );

      if (!response.ok) throw new Error("Erro ao buscar dados do servidor.");

      const data = await response.json();

      // 👇 ESSA LINHA É NOSSO RAIO-X: Vai imprimir a resposta do Python no seu navegador!
      console.log("Resposta do Python (FatSecret):", data);

      let listaAlimentos = [];

      // Tornando o React resiliente a vários formatos de resposta do seu Python:
      if (data.foods && data.foods.food) {
        listaAlimentos = Array.isArray(data.foods.food)
          ? data.foods.food
          : [data.foods.food];
      } else if (Array.isArray(data)) {
        listaAlimentos = data; // Se o Python já mandar a lista limpa direto
      } else if (data.food) {
        listaAlimentos = Array.isArray(data.food) ? data.food : [data.food];
      }

      // Verifica se a lista final tem itens
      if (listaAlimentos.length > 0) {
        setResultados(listaAlimentos);
      } else {
        setErro("Nenhum alimento encontrado com esse nome.");
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      setErro("Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  };

  // 2. A MÁGICA: Função disparada ao clicar no botão "Adicionar à Dieta"
  const adicionarNaDieta = async (alimento) => {
    if (!pacienteSelecionado) {
      alert(
        "⚠️ Por favor, selecione um paciente no topo da tela antes de adicionar um alimento!",
      );
      return;
    }

    // O "Recortador" agora entende Inglês e Português, e lida com vírgulas!
    const desc = alimento.food_description;
    const matchCal = desc.match(/(?:Calories|Calorias):\s*([\d.,]+)kcal/i);
    const matchCarbs = desc.match(/(?:Carbs|Carboidratos|Carb):\s*([\d.,]+)g/i);
    const matchProt = desc.match(/(?:Protein|Proteínas|Prot):\s*([\d.,]+)g/i);
    const matchFat = desc.match(/(?:Fat|Gorduras|Gord):\s*([\d.,]+)g/i);

    // Converte os números (trocando a vírgula do padrão brasileiro por ponto pro Python)
    const parseNumber = (match) =>
      match ? parseFloat(match[1].replace(",", ".")) : 0;

    const payload = {
      food_name: alimento.food_name,
      calories: parseNumber(matchCal),
      carbs: parseNumber(matchCarbs),
      protein: parseNumber(matchProt),
      fat: parseNumber(matchFat),
      paciente_id: parseInt(pacienteSelecionado),
    };

    try {
      const response = await fetch(API_URL_REFEICOES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(
          `✅ ${alimento.food_name} adicionado à dieta do paciente com sucesso!`,
        );
      } else {
        throw new Error("Erro ao salvar no banco");
      }
    } catch (err) {
      alert(
        "❌ Erro ao adicionar alimento. Verifique se o Back-End está rodando.",
      );
      console.error(err);
    }
  };

  return (
    <section className="info-alimentacao" style={{ padding: "40px 20px" }}>
      <div
        className="container-principal"
        style={{ maxWidth: "1200px", margin: "0 auto" }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#2c3e50",
            marginBottom: "10px",
          }}
        >
          Consulta de Alimentos (FatSecret)
        </h1>

        {/* === SELEÇÃO DE PACIENTE === */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              backgroundColor: "#e9ecef",
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #ced4da",
            }}
          >
            <label style={{ fontWeight: "bold", marginRight: "10px" }}>
              Adicionar dieta para:
            </label>
            <select
              value={pacienteSelecionado}
              onChange={(e) => setPacienteSelecionado(e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">-- Escolha um paciente --</option>
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Barra de Pesquisa */}
        <form
          onSubmit={buscarAlimentos}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "40px",
          }}
        >
          <input
            type="text"
            placeholder="Ex: Peito de Frango..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            style={{
              padding: "12px 20px",
              width: "100%",
              maxWidth: "400px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />
          <button
            type="submit"
            disabled={carregando}
            style={{
              padding: "12px 24px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: carregando ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            {carregando ? "Buscando..." : "Pesquisar"}
          </button>
        </form>

        {erro && (
          <p
            style={{
              textAlign: "center",
              color: "#ff6b6b",
              fontWeight: "bold",
            }}
          >
            {erro}
          </p>
        )}

        {/* Resultados da Pesquisa em Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {resultados.map((alimento) => (
            <div
              key={alimento.food_id}
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                padding: "20px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                borderTop: "4px solid #4CAF50",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: "1.2rem",
                    color: "#333",
                    marginBottom: "15px",
                  }}
                >
                  {alimento.food_name}
                </h2>
                <p
                  style={{
                    color: "#666",
                    lineHeight: "1.6",
                    fontSize: "0.95rem",
                    marginBottom: "20px",
                  }}
                >
                  {alimento.food_description}
                </p>
              </div>

              {/* === BOTÃO DE SALVAR NO BANCO === */}
              <button
                onClick={() => adicionarNaDieta(alimento)}
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#0d6efd",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "0.2s",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#0b5ed7")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#0d6efd")}
              >
                + Adicionar à Dieta
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Alimentos;
