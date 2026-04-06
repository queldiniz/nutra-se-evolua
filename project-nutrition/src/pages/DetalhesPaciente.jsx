import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function DetalhesPaciente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dadosPaciente, setDadosPaciente] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados para o formulário de Histórico
  const [novaAvaliacao, setNovaAvaliacao] = useState({
    data_registro: "",
    peso: "",
    gordura: "",
  });

  const buscarDadosPaciente = () => {
    fetch(`http://localhost:5000/api/nutrition/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Paciente não encontrado");
        return res.json();
      })
      .then((data) => {
        setDadosPaciente(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    buscarDadosPaciente();
  }, [id]);

  // --- LÓGICA DE EXCLUSÃO ---
  const excluirPaciente = async () => {
    if (
      !window.confirm(
        "🚨 Tem certeza absoluta? Isso apagará este paciente, a dieta e todo o histórico dele para sempre!",
      )
    )
      return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/nutrition/${id}`,
        { method: "DELETE" },
      );
      if (response.ok) {
        alert("Paciente excluído com sucesso.");
        navigate("/gestao");
      } else throw new Error("Erro ao excluir paciente");
    } catch (err) {
      alert("Erro ao excluir paciente.");
      console.error(err);
    }
  };

  const excluirAlimento = async (idRefeicao) => {
    if (!window.confirm("Remover este alimento da dieta?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/refeicoes/${idRefeicao}`,
        { method: "DELETE" },
      );
      if (response.ok) {
        buscarDadosPaciente(); // Recarrega a tela para o alimento sumir
      } else throw new Error("Erro ao excluir alimento");
    } catch (err) {
      alert("Erro ao excluir o alimento do banco de dados.");
      console.error(err);
    }
  };

  const salvarHistorico = async (e) => {
    e.preventDefault();
    const payload = {
      data_registro: novaAvaliacao.data_registro,
      peso: parseFloat(novaAvaliacao.peso),
      gordura: parseFloat(novaAvaliacao.gordura),
      paciente_id: parseInt(id),
    };

    try {
      const response = await fetch("http://localhost:5000/api/historico/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setNovaAvaliacao({ data_registro: "", peso: "", gordura: "" });
        buscarDadosPaciente();
      } else throw new Error("Erro ao salvar histórico");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar a avaliação no banco de dados.");
    }
  };

  if (loading)
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px", color: "#4c546c" }}>
        Carregando Prontuário...
      </h2>
    );
  if (!dadosPaciente)
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Paciente não encontrado.
      </h2>
    );

  const historicoReal = dadosPaciente.historico || [];

  // Ordem oficial das refeições para desenharmos na tela
  const ordemRefeicoes = [
    "Café da Manhã",
    "Lanche da Manhã",
    "Almoço",
    "Lanche da Tarde",
    "Jantar",
    "Ceia",
  ];

  return (
    <section
      style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}
    >
      {/* CABEÇALHO */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <div>
          <h1
            style={{
              color: "#4c546c",
              fontSize: "2.5rem",
              margin: "0 0 10px 0",
            }}
          >
            Prontuário: {dadosPaciente.name}
          </h1>
          <span
            style={{
              backgroundColor: "#e0f2f1",
              color: "#00695c",
              padding: "5px 15px",
              borderRadius: "20px",
              fontWeight: "bold",
            }}
          >
            Objetivo: {dadosPaciente.objective || "Não definido"}
          </span>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Link
            to="/alimentos"
            style={{
              backgroundColor: "#0d6efd",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            + Adicionar Alimentos
          </Link>
          <button
            onClick={excluirPaciente}
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Excluir Paciente
          </button>
        </div>
      </div>

      {/* DADOS PESSOAIS */}
      <div
        style={{
          backgroundColor: "white",
          padding: "25px",
          borderRadius: "15px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          marginBottom: "30px",
        }}
      >
        <h3
          style={{
            borderBottom: "2px solid #f0f0f0",
            paddingBottom: "10px",
            marginBottom: "20px",
            color: "#4c546c",
          }}
        >
          Dados Corporais
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
          }}
        >
          <p>
            <strong>Idade:</strong> {dadosPaciente.age} anos
          </p>
          <p>
            <strong>Gênero:</strong> {dadosPaciente.gender}
          </p>
          <p>
            <strong>Peso Atual:</strong> {dadosPaciente.weight} kg
          </p>
          <p>
            <strong>Gordura:</strong> {dadosPaciente.body_percentage}%
          </p>
          <p>
            <strong>Meta Calórica:</strong> {dadosPaciente.calories} kcal
          </p>
          <p>
            <strong>Atividade:</strong> {dadosPaciente.activity_level}
          </p>
        </div>
      </div>

      {/* DIETA SEPARADA POR REFEIÇÃO */}
      <div style={{ marginBottom: "40px" }}>
        <h2
          style={{
            color: "#4CAF50",
            borderBottom: "3px solid #4CAF50",
            paddingBottom: "10px",
            marginBottom: "25px",
          }}
        >
          Plano Alimentar Prescrito
        </h2>

        {!dadosPaciente.refeicoes || dadosPaciente.refeicoes.length === 0 ? (
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "15px",
              textAlign: "center",
              color: "#999",
              fontStyle: "italic",
            }}
          >
            Ainda não há alimentos na dieta. Vá em "+ Adicionar Alimentos" para
            começar.
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {ordemRefeicoes.map((tipo) => {
              // Filtra as comidas que pertencem a este "tipo" (ex: só almoço)
              const comidasDestaRefeicao = dadosPaciente.refeicoes.filter(
                (r) => r.tipo_refeicao === tipo,
              );

              if (comidasDestaRefeicao.length === 0) return null;

              return (
                <div
                  key={tipo}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "15px",
                    overflow: "hidden",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#f8f9fa",
                      padding: "15px 20px",
                      borderBottom: "1px solid #dee2e6",
                      fontWeight: "bold",
                      color: "#2c3e50",
                      fontSize: "1.1rem",
                    }}
                  >
                    ☕ {tipo}
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        textAlign: "left",
                      }}
                    >
                      <thead>
                        <tr style={{ color: "#6c757d", fontSize: "0.9rem" }}>
                          <th style={{ padding: "12px 20px" }}>Alimento</th>
                          <th style={{ padding: "12px 20px" }}>Calorias</th>
                          <th style={{ padding: "12px 20px" }}>Carbos</th>
                          <th style={{ padding: "12px 20px" }}>Proteínas</th>
                          <th style={{ padding: "12px 20px" }}>Gorduras</th>
                          <th
                            style={{
                              padding: "12px 20px",
                              textAlign: "center",
                            }}
                          >
                            Ação
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {comidasDestaRefeicao.map((comida) => (
                          <tr
                            key={comida.id}
                            style={{ borderTop: "1px solid #eee" }}
                          >
                            <td
                              style={{
                                padding: "12px 20px",
                                fontWeight: "bold",
                                color: "#333",
                              }}
                            >
                              {comida.food_name}
                            </td>
                            <td
                              style={{
                                padding: "12px 20px",
                                color: "#e67e22",
                                fontWeight: "bold",
                              }}
                            >
                              {comida.calories} kcal
                            </td>
                            <td style={{ padding: "12px 20px" }}>
                              {comida.carbs} g
                            </td>
                            <td style={{ padding: "12px 20px" }}>
                              {comida.protein} g
                            </td>
                            <td style={{ padding: "12px 20px" }}>
                              {comida.fat} g
                            </td>
                            <td
                              style={{
                                padding: "12px 20px",
                                textAlign: "center",
                              }}
                            >
                              <button
                                onClick={() => excluirAlimento(comida.id)}
                                style={{
                                  backgroundColor: "transparent",
                                  color: "#dc3545",
                                  border: "1px solid #dc3545",
                                  borderRadius: "5px",
                                  padding: "5px 10px",
                                  cursor: "pointer",
                                  fontSize: "0.85rem",
                                  transition: "0.2s",
                                }}
                                onMouseOver={(e) => {
                                  e.target.style.backgroundColor = "#dc3545";
                                  e.target.style.color = "white";
                                }}
                                onMouseOut={(e) => {
                                  e.target.style.backgroundColor =
                                    "transparent";
                                  e.target.style.color = "#dc3545";
                                }}
                              >
                                Excluir
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FORMULÁRIO DE AVALIAÇÃO */}
      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "15px",
          marginBottom: "30px",
          border: "1px solid #dee2e6",
        }}
      >
        <h3
          style={{ color: "#4c546c", marginBottom: "15px", fontSize: "1.2rem" }}
        >
          + Lançar Nova Avaliação (Histórico)
        </h3>
        <form
          onSubmit={salvarHistorico}
          style={{
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Mês (ex: Abril/2026)"
            value={novaAvaliacao.data_registro}
            onChange={(e) =>
              setNovaAvaliacao({
                ...novaAvaliacao,
                data_registro: e.target.value,
              })
            }
            required
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              flex: "1",
              minWidth: "150px",
            }}
          />
          <input
            type="number"
            step="0.1"
            placeholder="Peso (kg)"
            value={novaAvaliacao.peso}
            onChange={(e) =>
              setNovaAvaliacao({ ...novaAvaliacao, peso: e.target.value })
            }
            required
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              flex: "1",
              minWidth: "100px",
            }}
          />
          <input
            type="number"
            step="0.1"
            placeholder="% Gordura"
            value={novaAvaliacao.gordura}
            onChange={(e) =>
              setNovaAvaliacao({ ...novaAvaliacao, gordura: e.target.value })
            }
            required
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              flex: "1",
              minWidth: "100px",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#0d6efd",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Salvar Evolução
          </button>
        </form>
      </div>

      {/* ÁREA DOS GRÁFICOS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "30px",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "15px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          }}
        >
          <h3
            style={{
              color: "#4c546c",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            Evolução do Peso (kg)
          </h3>
          {historicoReal.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={historicoReal}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                <XAxis dataKey="data_registro" />
                <YAxis domain={["dataMin - 2", "dataMax + 2"]} />
                <Tooltip /> <Legend />
                <Line
                  type="monotone"
                  dataKey="peso"
                  name="Peso (kg)"
                  stroke="#4c546c"
                  strokeWidth={4}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ textAlign: "center", color: "#999" }}>
              Adicione avaliações para gerar o gráfico.
            </p>
          )}
        </div>

        <div
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "15px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          }}
        >
          <h3
            style={{
              color: "#ff7300",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            Percentual de Gordura (%)
          </h3>
          {historicoReal.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={historicoReal}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                <XAxis dataKey="data_registro" />
                <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
                <Tooltip /> <Legend />
                <Line
                  type="monotone"
                  dataKey="gordura"
                  name="Gordura (%)"
                  stroke="#ff7300"
                  strokeWidth={4}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ textAlign: "center", color: "#999" }}>
              Adicione avaliações para gerar o gráfico.
            </p>
          )}
        </div>
      </div>

      {/*BOTÃO VOLTAR */}
      <div style={{ marginTop: "50px", textAlign: "center" }}>
        <button
          onClick={() => navigate("/gestao")}
          style={{
            backgroundColor: "#4c546c",
            color: "white",
            border: "none",
            padding: "12px 35px",
            borderRadius: "30px",
            fontSize: "1rem",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 4px 10px rgba(76, 84, 108, 0.3)",
            transition: "transform 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        >
          ⬅ Voltar para Meus Pacientes
        </button>
      </div>
    </section>
  );
}

export default DetalhesPaciente;
