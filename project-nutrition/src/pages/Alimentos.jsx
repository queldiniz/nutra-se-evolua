import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function Alimentos() {
  const [searchParams] = useSearchParams();

  const [pesquisa, setPesquisa] = useState("");
  const [resultados, setResultados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  // Estados dos pacientes e da refeição
  const [pacientes, setPacientes] = useState([]);
  const idPaciente = searchParams.get("paciente");
  const [pacienteSelecionado, setPacienteSelecionado] = useState(idPaciente || "");

  const [refeicaoSelecionada, setRefeicaoSelecionada] =
    useState("Café da Manhã");

  // 1. Estado para o balão de feedback (Toast)
  const [toast, setToast] = useState({ texto: "", tipo: "" });
  // 2. Estados para editar o nome direto no Card
  const [idEditando, setIdEditando] = useState(null);
  const [nomeEditado, setNomeEditado] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const API_URL_FATSECRET = `${API_BASE}/api/alimentos/buscar`;
  const API_URL_PACIENTES = `${API_BASE}/api/nutrition/`;
  const API_URL_REFEICOES = `${API_BASE}/api/refeicoes`;

  useEffect(() => {
    fetch(API_URL_PACIENTES)
      .then((res) => res.json())
      .then((data) => setPacientes(data))
      .catch((err) => console.error("Erro ao carregar pacientes:", err));
  }, []);

  // Função para chamar o feedback flutuante que some sozinho em 3s
  const mostrarFeedback = (texto, tipo) => {
    setToast({ texto, tipo });
    setTimeout(() => {
      setToast({ texto: "", tipo: "" });
    }, 3000);
  };

  const buscarAlimentos = async (e) => {
    e.preventDefault();
    if (!pesquisa) return;

    setCarregando(true);
    setErro("");
    setResultados([]);
    setIdEditando(null);

    try {
      const response = await fetch(
        `${API_URL_FATSECRET}?pesquisa=${encodeURIComponent(pesquisa)}`,
      );

      if (!response.ok) throw new Error("Erro ao buscar dados do servidor.");

      const data = await response.json();
      console.log("Resposta do Python (FatSecret):", data);

      let listaAlimentos = [];

      if (data.foods && data.foods.food) {
        listaAlimentos = Array.isArray(data.foods.food)
          ? data.foods.food
          : [data.foods.food];
      } else if (Array.isArray(data)) {
        listaAlimentos = data;
      } else if (data.food) {
        listaAlimentos = Array.isArray(data.food) ? data.food : [data.food];
      }

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

  //Ao clicar no botão azul, abre o campo de edição no próprio card
  const iniciarAdicao = (alimento) => {
    if (!pacienteSelecionado) {
      mostrarFeedback(
        "⚠️ Por favor, selecione um paciente no topo da tela!",
        "erro",
      );
      return;
    }
    setIdEditando(alimento.food_id);
    setNomeEditado(alimento.food_name);
  };

  //Ao confirmar, envia para o bd
  const confirmarAdicao = async (alimento) => {
    const desc = alimento.food_description;
    const matchCal = desc.match(/(?:Calories|Calorias):\s*([\d.,]+)kcal/i);
    const matchCarbs = desc.match(/(?:Carbs|Carboidratos|Carb):\s*([\d.,]+)g/i);
    const matchProt = desc.match(/(?:Protein|Proteínas|Prot):\s*([\d.,]+)g/i);
    const matchFat = desc.match(/(?:Fat|Gorduras|Gord):\s*([\d.,]+)g/i);

    const parseNumber = (match) =>
      match ? parseFloat(match[1].replace(",", ".")) : 0;

    const payload = {
      food_name: nomeEditado.trim() || alimento.food_name,
      calories: parseNumber(matchCal),
      carbs: parseNumber(matchCarbs),
      protein: parseNumber(matchProt),
      fat: parseNumber(matchFat),
      tipo_refeicao: refeicaoSelecionada,
      paciente_id: parseInt(pacienteSelecionado),
    };

    try {
      const response = await fetch(API_URL_REFEICOES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        mostrarFeedback(
          `✅ "${payload.food_name}" adicionado com sucesso!`,
          "sucesso",
        );
        setIdEditando(null);
      } else {
        throw new Error("Erro ao salvar no banco");
      }
    } catch (err) {
      mostrarFeedback(
        "Erro ao salvar o alimento. Verifique o servidor.",
        "erro",
      );
      console.error(err);
    }
  };

  return (
    <section
      className="info-alimentacao"
      style={{ padding: "40px 20px", position: "relative" }}
    >
      {/* NOTIFICAÇÃO FLUTUANTE DE FEEDBACK */}
      {toast.texto && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
            backgroundColor: toast.tipo === "erro" ? "#f8d7da" : "#d4edda",
            color: toast.tipo === "erro" ? "#721c24" : "#155724",
            padding: "15px 25px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            fontWeight: "bold",
            borderLeft: `5px solid ${toast.tipo === "erro" ? "#dc3545" : "#28a745"}`,
            transition: "opacity 0.3s ease-in-out",
          }}
        >
          {toast.texto}
        </div>
      )}

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
          Consulta de Alimentos
        </h1>

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
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {/* SELEÇÃO DO PACIENTE */}
            <label style={{ fontWeight: "bold" }}>Adicionar dieta para:</label>
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

            <label style={{ fontWeight: "bold", marginLeft: "10px" }}>
              Para o:
            </label>
            <select
              value={refeicaoSelecionada}
              onChange={(e) => setRefeicaoSelecionada(e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            >
              <option value="Café da Manhã">Café da Manhã</option>
              <option value="Lanche da Manhã">Lanche da Manhã</option>
              <option value="Almoço">Almoço</option>
              <option value="Lanche da Tarde">Lanche da Tarde</option>
              <option value="Jantar">Jantar</option>
              <option value="Ceia">Ceia</option>
            </select>
          </div>
        </div>

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
            placeholder="Ex: Chicken Breast..."
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
                    marginBottom: "8px",
                  }}
                >
                  {alimento.food_name}
                </h2>

                {alimento.brand_name && (
                  <span
                    style={{
                      display: "inline-block",
                      backgroundColor: "#e9ecef",
                      color: "#495057",
                      padding: "4px 10px",
                      borderRadius: "15px",
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      marginBottom: "15px",
                    }}
                  >
                    🏢 Marca: {alimento.brand_name}
                  </span>
                )}

                <p
                  style={{
                    color: "#666",
                    lineHeight: "1.6",
                    fontSize: "0.95rem",
                    marginBottom: "20px",
                    marginTop: alimento.brand_name ? "10px" : "0",
                  }}
                >
                  {alimento.food_description}
                </p>
              </div>

              {idEditando === alimento.food_id ? (
                <div
                  style={{
                    marginTop: "10px",
                    padding: "15px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    border: "1px dashed #ccc",
                  }}
                >
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      color: "#666",
                      marginBottom: "5px",
                      fontWeight: "bold",
                    }}
                  >
                    Ajustar nome:
                  </label>
                  <input
                    type="text"
                    value={nomeEditado}
                    onChange={(e) => setNomeEditado(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      marginBottom: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ced4da",
                    }}
                  />
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => confirmarAdicao(alimento)}
                      style={{
                        flex: 1,
                        padding: "8px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => setIdEditando(null)}
                      style={{
                        flex: 1,
                        padding: "8px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => iniciarAdicao(alimento)}
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
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "#0d6efd")
                  }
                >
                  + Adicionar à Dieta
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Alimentos;
