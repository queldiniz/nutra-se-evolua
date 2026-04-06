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

function GraficosEvolucao({ historico }) {
  return (
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
          Evolucao do Peso (kg)
        </h3>
        {historico.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={historico}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
              <XAxis dataKey="data_registro" />
              <YAxis domain={["dataMin - 2", "dataMax + 2"]} />
              <Tooltip />
              <Legend />
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
            Adicione avaliacoes para gerar o grafico.
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
        {historico.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={historico}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
              <XAxis dataKey="data_registro" />
              <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
              <Tooltip />
              <Legend />
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
            Adicione avaliacoes para gerar o grafico.
          </p>
        )}
      </div>
    </div>
  );
}

export default GraficosEvolucao;
