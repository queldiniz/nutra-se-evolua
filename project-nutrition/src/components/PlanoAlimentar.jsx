function PlanoAlimentar({ refeicoes, onExcluirAlimento }) {
  const ordemRefeicoes = [
    "Cafe da Manha",
    "Café da Manhã",
    "Lanche da Manha",
    "Lanche da Manhã",
    "Almoco",
    "Almoço",
    "Lanche da Tarde",
    "Jantar",
    "Ceia",
  ];

  // Filtra apenas os tipos que existem nas refeicoes, mantendo a ordem
  const tiposPresentes = ordemRefeicoes.filter((tipo) =>
    refeicoes?.some((r) => r.tipo_refeicao === tipo),
  );

  const showActions = typeof onExcluirAlimento === "function";

  return (
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

      {!refeicoes || refeicoes.length === 0 ? (
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
          Ainda nao ha alimentos na dieta.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {tiposPresentes.map((tipo) => {
            const comidasDestaRefeicao = refeicoes.filter(
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
                  {tipo}
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
                        <th style={{ padding: "12px 20px" }}>
                          Alimento (100g){" "}
                        </th>
                        <th style={{ padding: "12px 20px" }}>Calorias </th>
                        <th style={{ padding: "12px 20px" }}>Carboidratos</th>
                        <th style={{ padding: "12px 20px" }}>Proteínas</th>
                        <th style={{ padding: "12px 20px" }}>Gorduras</th>
                        {showActions && (
                          <th
                            style={{
                              padding: "12px 20px",
                              textAlign: "center",
                            }}
                          >
                            Ação
                          </th>
                        )}
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
                          {showActions && (
                            <td
                              style={{
                                padding: "12px 20px",
                                textAlign: "center",
                              }}
                            >
                              <button
                                onClick={() => onExcluirAlimento(comida.id)}
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
                          )}
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
  );
}

export default PlanoAlimentar;
