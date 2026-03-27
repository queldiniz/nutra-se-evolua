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

  // Busca os dados do paciente DE VERDADE no seu Back-End
  useEffect(() => {
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
  }, [id]);

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px", color: "#4c546c" }}>
        Carregando Perfil...
      </h2>
    );
  }

  if (!dadosPaciente) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "50px",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <h2 style={{ color: "#4c546c" }}>Paciente não encontrado...</h2>
        <Link
          to="/gestao"
          style={{
            display: "inline-block",
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#4c546c",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
          }}
        >
          Voltar para Lista
        </Link>
      </div>
    );
  }

  // Cria um histórico FALSO apenas para os gráficos não ficarem vazios.
  // Num projeto futuro, você criaria uma tabela de Histórico no banco!
  const mockHistorico = [
    {
      mes: "Jan",
      peso: dadosPaciente.weight + 2,
      gordura: dadosPaciente.body_percentage + 1,
    },
    {
      mes: "Fev",
      peso: dadosPaciente.weight + 1,
      gordura: dadosPaciente.body_percentage + 0.5,
    },
    {
      mes: "Atual",
      peso: dadosPaciente.weight,
      gordura: dadosPaciente.body_percentage,
    },
  ];

  return (
    <section
      className="detalhes-container"
      style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}
    >
      {/* --- CABEÇALHO --- */}
      <div style={{ marginBottom: "30px", textAlign: "center" }}>
        <h1
          style={{
            color: "#4c546c",
            fontSize: "2.5rem",
            marginBottom: "10px",
            wordWrap: "break-word",
          }}
        >
          Perfil de {dadosPaciente.name}
        </h1>
        <span
          style={{
            backgroundColor: "#e0f2f1",
            color: "#00695c",
            padding: "5px 15px",
            borderRadius: "20px",
            fontWeight: "bold",
            fontSize: "0.9rem",
            display: "inline-block",
            marginBottom: "10px",
          }}
        >
          {/* AQUI FOI ALTERADO PARA PUXAR DIRETO DO BANCO */}
          Objetivo: {dadosPaciente.objective || "Não definido"}
        </span>
      </div>

      {/* --- CARD DE DADOS PESSOAIS --- */}
      <div
        className="card-perfil"
        style={{
          backgroundColor: "white",
          padding: "30px",
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
          Dados Pessoais
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          <div>
            <p style={{ margin: "5px 0" }}>
              <strong>Idade:</strong> {dadosPaciente.age} anos
            </p>
            <p style={{ margin: "5px 0" }}>
              <strong>Gênero:</strong> {dadosPaciente.gender}
            </p>
            <p style={{ margin: "5px 0" }}>
              <strong>Atividade:</strong> {dadosPaciente.activity_level}
            </p>
          </div>
          <div>
            <p style={{ margin: "5px 0" }}>
              <strong>Meta Calórica:</strong> {dadosPaciente.calories} kcal
            </p>
            <p style={{ margin: "5px 0" }}>
              <strong>Peso Atual:</strong> {dadosPaciente.weight} kg
            </p>
            <p style={{ margin: "5px 0" }}>
              <strong>Gordura Atual:</strong> {dadosPaciente.body_percentage}%
            </p>
          </div>
        </div>
      </div>

      {/* --- PLANO ALIMENTAR (NOVA SESSÃO) --- */}
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
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
            color: "#4CAF50",
          }}
        >
          Plano Alimentar (Dieta)
        </h3>

        {!dadosPaciente.refeicoes || dadosPaciente.refeicoes.length === 0 ? (
          <p
            style={{ textAlign: "center", color: "#999", fontStyle: "italic" }}
          >
            Ainda não há alimentos registrados para este paciente.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead style={{ backgroundColor: "#f8f9fa" }}>
                <tr>
                  <th
                    style={{
                      padding: "12px",
                      borderBottom: "2px solid #dee2e6",
                    }}
                  >
                    Alimento
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      borderBottom: "2px solid #dee2e6",
                    }}
                  >
                    Calorias
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      borderBottom: "2px solid #dee2e6",
                    }}
                  >
                    Carboidratos
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      borderBottom: "2px solid #dee2e6",
                    }}
                  >
                    Proteínas
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      borderBottom: "2px solid #dee2e6",
                    }}
                  >
                    Gorduras
                  </th>
                </tr>
              </thead>
              <tbody>
                {dadosPaciente.refeicoes.map((comida, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                    <td
                      style={{
                        padding: "12px",
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      {comida.food_name}
                    </td>
                    <td style={{ padding: "12px", color: "#e67e22" }}>
                      {comida.calories} kcal
                    </td>
                    <td style={{ padding: "12px" }}>{comida.carbs} g</td>
                    <td style={{ padding: "12px" }}>{comida.protein} g</td>
                    <td style={{ padding: "12px" }}>{comida.fat} g</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- ÁREA DOS GRÁFICOS (MANTIDA IGUAL, USANDO MOCK) --- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "30px",
        }}
      >
        {/* GRÁFICO 1: PESO */}
        <div
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "15px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            width: "100%",
            overflow: "hidden",
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
          <div
            style={{ width: "100%", overflowX: "auto", paddingBottom: "10px" }}
          >
            <div style={{ minWidth: "500px", height: 300 }}>
              <ResponsiveContainer>
                <LineChart
                  data={mockHistorico}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                  <XAxis dataKey="mes" stroke="#666" />
                  <YAxis
                    domain={["dataMin - 2", "dataMax + 2"]}
                    stroke="#4c546c"
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="peso"
                    name="Peso (kg)"
                    stroke="#4c546c"
                    strokeWidth={4}
                    dot={{ r: 5, fill: "#4c546c" }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* GRÁFICO 2: GORDURA */}
        <div
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "15px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            width: "100%",
            overflow: "hidden",
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
          <div
            style={{ width: "100%", overflowX: "auto", paddingBottom: "10px" }}
          >
            <div style={{ minWidth: "500px", height: 300 }}>
              <ResponsiveContainer>
                <LineChart
                  data={mockHistorico}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                  <XAxis dataKey="mes" stroke="#666" />
                  <YAxis
                    domain={["dataMin - 1", "dataMax + 1"]}
                    stroke="#ff7300"
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="gordura"
                    name="Gordura (%)"
                    stroke="#ff7300"
                    strokeWidth={4}
                    dot={{ r: 5, fill: "#ff7300" }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTÃO VOLTAR --- */}
      <div style={{ marginTop: "40px", textAlign: "center" }}>
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
            fontWeight: "600",
            boxShadow: "0 4px 10px rgba(76, 84, 108, 0.3)",
            transition: "transform 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        >
          Voltar para Lista
        </button>
      </div>
    </section>
  );
}

export default DetalhesPaciente;
