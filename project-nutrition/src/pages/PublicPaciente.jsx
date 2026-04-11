import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PacienteInfoCard from "../components/PacienteInfoCard";
import PlanoAlimentar from "../components/PlanoAlimentar";
import GraficosEvolucao from "../components/GraficosEvolucao";

function PublicPaciente() {
  const { token } = useParams();
  const [dadosPaciente, setDadosPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/public/paciente/${token}`);

        if (res.ok) {
          const data = await res.json();
          setDadosPaciente(data);
        } else if (res.status === 404) {
          setError({
            type: "not_found",
            title: "Link invalido",
            message:
              "Este link nao existe ou os dados do paciente nao estao mais disponiveis.",
          });
        } else if (res.status === 410) {
          const data = await res.json();
          const isRevoked = data.erro?.includes("revogado");
          setError({
            type: isRevoked ? "revoked" : "expired",
            title: isRevoked ? "Link revogado" : "Link expirado",
            message: isRevoked
              ? "Este link foi desativado pelo nutricionista."
              : "Este link expirou. Solicite um novo link ao seu nutricionista.",
          });
        } else {
          setError({
            type: "server_error",
            title: "Erro no servidor",
            message:
              "Ocorreu um erro ao carregar os dados. Tente novamente mais tarde.",
          });
        }
      } catch (err) {
        console.error("Erro ao buscar dados publicos:", err);
        setError({
          type: "server_error",
          title: "Erro de conexao",
          message:
            "Nao foi possivel conectar ao servidor. Verifique sua conexao e tente novamente.",
        });
      } finally {
        setLoading(false);
      }
    };

    buscarDados();
  }, [token]);

  // --- ESTADOS DE CARREGAMENTO E ERRO ---
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f7fa",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "4px solid #e0e0e0",
              borderTop: "4px solid #009688",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}
          />
          <p style={{ color: "#666", fontSize: "1.1rem" }}>
            Carregando prontuario...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (error) {
    const iconMap = {
      not_found: "🔍",
      revoked: "🚫",
      expired: "⏰",
      server_error: "⚠️",
    };

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f7fa",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "50px",
            borderRadius: "20px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            textAlign: "center",
            maxWidth: "450px",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "15px" }}>
            {iconMap[error.type] || "⚠️"}
          </div>
          <h2 style={{ color: "#4c546c", marginBottom: "10px" }}>
            {error.title}
          </h2>
          <p style={{ color: "#666", lineHeight: "1.6" }}>{error.message}</p>
        </div>
      </div>
    );
  }

  // --- PAGINA PUBLICA READ-ONLY ---
  const historicoReal = dadosPaciente.historico || [];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
      {/* HEADER MINIMO */}
      <header
        style={{
          backgroundColor: "#009688",
          padding: "15px 30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src="/img/nutrition-icon.jpg"
            alt="Logo"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
            onError={(e) => (e.target.style.display = "none")}
          />
          <span
            style={{
              color: "white",
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            Nutra-se e Evolua
          </span>
        </div>
        <span
          style={{
            backgroundColor: "rgba(255,255,255,0.2)",
            color: "white",
            padding: "6px 16px",
            borderRadius: "20px",
            fontSize: "0.85rem",
            fontWeight: "bold",
            letterSpacing: "0.5px",
          }}
        >
          Prontuario Compartilhado
        </span>
      </header>

      {/* CONTEUDO */}
      <main
        style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}
      >
        {/* Cabecalho do paciente */}
        <div style={{ marginBottom: "30px" }}>
          <h1
            style={{
              color: "#4c546c",
              fontSize: "2.2rem",
              margin: "0 0 10px 0",
            }}
          >
            {dadosPaciente.name}
          </h1>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <span
              style={{
                backgroundColor: "#e0f2f1",
                color: "#00695c",
                padding: "5px 15px",
                borderRadius: "20px",
                fontWeight: "bold",
                fontSize: "0.9rem",
              }}
            >
              Objetivo: {dadosPaciente.objective || "Nao definido"}
            </span>
            <span
              style={{
                backgroundColor: "#e8eaf6",
                color: "#3949ab",
                padding: "5px 15px",
                borderRadius: "20px",
                fontWeight: "bold",
                fontSize: "0.9rem",
              }}
            >
              Somente leitura
            </span>
          </div>
        </div>

        {/* Componentes reutilizados (sem callbacks de edicao) */}
        <PacienteInfoCard dadosPaciente={dadosPaciente} />
        <PlanoAlimentar
          refeicoes={dadosPaciente.refeicoes}
          metaCalorica={dadosPaciente.calories}
        />
        <GraficosEvolucao historico={historicoReal} />
      </main>

      {/* FOOTER MINIMO */}
      <footer
        style={{
          backgroundColor: "#2c3e50",
          padding: "20px",
          textAlign: "center",
          marginTop: "40px",
        }}
      >
        <p style={{ color: "#aaa", fontSize: "0.85rem", margin: 0 }}>
          Nutra-se e Evolua &mdash; Prontuario compartilhado pelo seu
          nutricionista
        </p>
      </footer>
    </div>
  );
}

export default PublicPaciente;
