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

  useEffect(() => {
    fetch("/db.json")
      .then((res) => res.json())
      .then((data) => {
        const pacienteEncontrado = data.pacientes.find(
          (p) => p.id === Number(id)
        );
        setDadosPaciente(pacienteEncontrado);
      })
      .catch((error) => console.error("Erro ao buscar dados:", error));
  }, [id]);

  if (!dadosPaciente) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "50px",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <h2 style={{ color: "#4c546c" }}>
          Carregando ou Paciente não encontrado...
        </h2>
        <p>Verifique se o paciente existe na lista.</p>
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
          Perfil de {dadosPaciente.nome}
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
          Objetivo: {dadosPaciente.objetivo || "Não definido"}
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
              <strong>Idade:</strong> {dadosPaciente.idade} anos
            </p>
            <p style={{ margin: "5px 0" }}>
              <strong>Gênero:</strong> {dadosPaciente.genero}
            </p>
            <p style={{ margin: "5px 0" }}>
              <strong>Atividade:</strong> {dadosPaciente.atividade}
            </p>
          </div>
          <div>
            <p style={{ margin: "5px 0" }}>
              <strong>Meta Calórica:</strong> {dadosPaciente.calorias} kcal
            </p>
            <p style={{ margin: "5px 0" }}>
              <strong>Peso Atual:</strong> {dadosPaciente.peso} kg
            </p>
            <p style={{ margin: "5px 0" }}>
              <strong>Gordura Atual:</strong>{" "}
              {dadosPaciente.gordura ? dadosPaciente.gordura + "%" : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* --- ÁREA DOS GRÁFICOS (COM ROLAGEM NO MOBILE) --- */}
      <div
        style={{
          display: "grid",
          /* Isso permite que os cards fiquem um embaixo do outro no celular */
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

          {dadosPaciente.historico && dadosPaciente.historico.length > 0 ? (
            /*Wrapper de Rolagem Horizontal */
            <div
              style={{
                width: "100%",
                overflowX: "auto",
                paddingBottom: "10px",
              }}
            >
              {/* Força uma largura mínima de 500px para o gráfico não espremer */}
              <div style={{ minWidth: "500px", height: 300 }}>
                <ResponsiveContainer>
                  <LineChart
                    data={dadosPaciente.historico}
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
          ) : (
            <p style={{ textAlign: "center", color: "#999", padding: "20px" }}>
              Sem histórico de peso registrado.
            </p>
          )}
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

          {dadosPaciente.historico &&
          dadosPaciente.historico.some((h) => h.gordura) ? (
            /* Wrapper de Rolagem Horizontal */
            <div
              style={{
                width: "100%",
                overflowX: "auto",
                paddingBottom: "10px",
              }}
            >
              <div style={{ minWidth: "500px", height: 300 }}>
                <ResponsiveContainer>
                  <LineChart
                    data={dadosPaciente.historico}
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
          ) : (
            <p style={{ textAlign: "center", color: "#999", padding: "20px" }}>
              Sem histórico de gordura registrado.
            </p>
          )}
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
