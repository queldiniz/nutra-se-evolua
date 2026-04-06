function PacienteInfoCard({ dadosPaciente }) {
  return (
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
          <strong>Genero:</strong> {dadosPaciente.gender}
        </p>
        <p>
          <strong>Peso Atual:</strong> {dadosPaciente.weight} kg
        </p>
        <p>
          <strong>Gordura:</strong> {dadosPaciente.body_percentage}%
        </p>
        <p>
          <strong>Meta Calorica:</strong> {dadosPaciente.calories} kcal
        </p>
        <p>
          <strong>Atividade:</strong> {dadosPaciente.activity_level}
        </p>
      </div>
    </div>
  );
}

export default PacienteInfoCard;
