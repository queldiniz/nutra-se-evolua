import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function DetalhesPaciente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [paciente, setPaciente] = useState(
    location.state?.dadosPaciente || null
  );

  useEffect(() => {
    // Só busco no servidor se NÃO tiver o paciente ainda
    if (!paciente) {
      const buscarPaciente = async () => {
        try {
          const resposta = await fetch("/db.json");
          const dados = await resposta.json();
          const pacienteEncontrado = dados.pacientes.find(
            (p) => p.id === parseInt(id)
          );
          setPaciente(pacienteEncontrado);
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
        }
      };
      buscarPaciente();
    }
  }, [id, paciente]);

  // Se não tiver paciente carregado ainda, mostra mensagem
  if (!paciente) {
    return (
      <div style={{ padding: "50px", textAlign: "center", color: "#666" }}>
        <h2>Carregando dados...</h2>
        <p>Se demorar muito, o paciente pode não existir no banco de dados.</p>
        <button onClick={() => navigate("/gestao")}>Voltar</button>
      </div>
    );
  }

  return (
    <div className="container-principal" style={{ padding: "40px" }}>
      <h1>Perfil de {paciente.nome}</h1>

      <div
        className="card"
        style={{ maxWidth: "600px", margin: "20px auto", padding: "20px" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div>
            <h3>Dados Pessoais</h3>
            <p>
              <strong>Idade:</strong> {paciente.idade} anos
            </p>
            <p>
              <strong>Gênero:</strong> {paciente.genero}
            </p>
            <p>
              <strong>Atividade:</strong> {paciente.atividade}
            </p>
          </div>
          <div>
            <h3>Metas</h3>
            <p>
              <strong>Meta Calórica:</strong> {paciente.calorias || "N/A"} kcal
            </p>
            <p>
              <strong>Peso Atual:</strong> {paciente.peso} kg
            </p>
            <p>
              <strong>Gordura:</strong> {paciente.gordura || "N/A"}%
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/gestao")}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#4c546c",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Voltar para Lista
        </button>
      </div>
    </div>
  );
}

export default DetalhesPaciente;
