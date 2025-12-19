import { useState, useEffect } from "react";

function WorkoutRecommendation({ paciente }) {
  const [plano, setPlano] = useState(null);

  useEffect(() => {
    // Se não tiver paciente carregado ainda, não faz nada
    if (!paciente) return;

    // --- DEFINIÇÃO DA FUNÇÃO---
    const gerarPlano = (p) => {
      let recomendacao = {
        titulo: "",
        foco: "",
        dicas: [],
        alerta: "",
      };

      // 1. HIPERTROFIA
      if (p.objetivo === "Hipertrofia" || p.objetivo === "Ganho de Massa") {
        recomendacao.titulo = "Hypertrophy Protocol";
        recomendacao.foco = "Weight Training & Progressive Overload";
        recomendacao.dicas = [
          "Prioritize compound movements (Squat, Bench Press, Deadlift).",
          "Perform 3-4 sets of 8-12 reps near failure.",
          "Rest at least 48h before training the same muscle group again.",
        ];

        if (p.gordura > 20) {
          recomendacao.alerta =
            "Body fat > 20%. Add 20min of post-workout cardio to gain lean mass.";
        } else {
          recomendacao.alerta =
            "Focus on a slight Caloric Surplus to fuel growth.";
        }
      }

      // 2. PERDA DE PESO
      else if (
        p.objetivo === "Perda de Peso" ||
        p.objetivo === "Emagrecimento"
      ) {
        recomendacao.titulo = "Fat Loss Protocol";
        recomendacao.foco = "Caloric Deficit + High Intensity";
        recomendacao.dicas = [
          "HIIT Workouts (High Intensity Interval Training) 3x a week.",
          "Strength training is essential to maintain metabolism.",
          "Increase protein intake to protect muscle mass.",
        ];

        if (p.peso > 90) {
          recomendacao.dicas.push(
            "Avoid high-impact jumps to protect your knees."
          );
        }
      }

      // 3. MANUTENÇÃO
      else {
        recomendacao.titulo = "Maintenance & Health Protocol";
        recomendacao.foco = "Consistency & Mobility";
        recomendacao.dicas = [
          "Maintain 150 minutes of moderate activity per week.",
          "Mix strength days with mobility/stretching sessions.",
          "Light cardio (walking) daily helps with recovery.",
        ];
      }

      setPlano(recomendacao);
    };

    gerarPlano(paciente);
  }, [paciente]); // O efeito roda sempre que o 'paciente' mudar

  // Se o plano ainda não foi gerado, não mostra nada
  if (!plano) return null;

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={{ fontSize: "2rem", marginRight: "10px" }}>💪</span>
        <h3 style={{ color: "#2c3e50", margin: 0 }}>
          Personalized Workout Plan
        </h3>
      </div>

      <div style={styles.content}>
        <h4 style={{ color: "#009688", marginTop: "0" }}>{plano.titulo}</h4>
        <p>
          <strong>Main Focus:</strong> {plano.foco}
        </p>

        <ul style={styles.lista}>
          {plano.dicas.map((dica, index) => (
            <li key={index} style={{ marginBottom: "8px" }}>
              {dica}
            </li>
          ))}
        </ul>

        {plano.alerta && (
          <div style={styles.alerta}>
            <strong>💡 Pro Tip:</strong> {plano.alerta}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    marginTop: "30px",
    borderLeft: "5px solid #009688",
  },
  header: {
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid #eee",
    paddingBottom: "15px",
    marginBottom: "20px",
  },
  content: {
    color: "#555",
    lineHeight: "1.6",
  },
  lista: {
    paddingLeft: "20px",
    marginBottom: "20px",
  },
  alerta: {
    backgroundColor: "#fff3cd",
    color: "#856404",
    padding: "10px",
    borderRadius: "5px",
    fontSize: "0.9rem",
  },
};

export default WorkoutRecommendation;
