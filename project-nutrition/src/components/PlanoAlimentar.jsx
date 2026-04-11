function PlanoAlimentar({ refeicoes, onExcluirAlimento, metaCalorica }) {
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

  const totalCaloriasPlano =
    refeicoes?.reduce((sum, r) => sum + (r.calories || 0), 0) ?? 0;
  const totalCarbs =
    refeicoes?.reduce((sum, r) => sum + (r.carbs || 0), 0) ?? 0;
  const totalProtein =
    refeicoes?.reduce((sum, r) => sum + (r.protein || 0), 0) ?? 0;
  const totalFat = refeicoes?.reduce((sum, r) => sum + (r.fat || 0), 0) ?? 0;

  const temMeta = metaCalorica && Number(metaCalorica) > 0;
  const meta = temMeta ? Number(metaCalorica) : null;
  const percentual = temMeta ? (totalCaloriasPlano / meta) * 100 : null;
  const diferenca = temMeta ? totalCaloriasPlano - meta : null;

  const getStatusInfo = (pct, diff) => {
    const abs = Math.abs(pct - 100);
    if (abs <= 5)
      return {
        color: "#27ae60",
        bg: "#eafaf1",
        label: `Dentro da meta calórica`,
        icon: "✓",
      };
    if (pct > 100)
      return {
        color: "#e67e22",
        bg: "#fef5ec",
        label: `+${diff} kcal acima da meta`,
        icon: "↑",
      };
    return {
      color: "#3498db",
      bg: "#ebf5fb",
      label: `${diff} kcal abaixo da meta`,
      icon: "↓",
    };
  };

  const statusInfo = temMeta ? getStatusInfo(percentual, diferenca) : null;
  const barWidth = temMeta ? Math.min(percentual, 100) : 0;
  const barColor = statusInfo ? statusInfo.color : "#4CAF50";

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
          Ainda não há alimentos na dieta.
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

                      <tr style={{ borderTop: "2px solid #eee" }}>
                        <td
                          style={{
                            padding: "12px 20px",
                            fontWeight: "bold",
                            color: "#2c3e50",
                          }}
                        >
                          Total
                        </td>
                        <td
                          style={{
                            padding: "12px 20px",
                            color: "#e67e22",
                            fontWeight: "bold",
                          }}
                        >
                          {comidasDestaRefeicao.reduce(
                            (sum, c) => sum + c.calories,
                            0,
                          )}{" "}
                          kcal
                        </td>
                        <td style={{ padding: "12px 20px" }}>
                          {comidasDestaRefeicao.reduce(
                            (sum, c) => sum + c.carbs,
                            0,
                          )}{" "}
                          g
                        </td>
                        <td style={{ padding: "12px 20px" }}>
                          {comidasDestaRefeicao.reduce(
                            (sum, c) => sum + c.protein,
                            0,
                          )}{" "}
                          g
                        </td>
                        <td style={{ padding: "12px 20px" }}>
                          {comidasDestaRefeicao.reduce(
                            (sum, c) => sum + c.fat,
                            0,
                          )}{" "}
                          g
                        </td>
                        {showActions && <td style={{ padding: "12px 20px" }} />}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {refeicoes && refeicoes.length > 0 && (
        <div
          style={{
            marginTop: "30px",
            backgroundColor: "white",
            borderRadius: "15px",
            overflow: "hidden",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          }}
        >
          {/* Header interno */}
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid #f0f0f0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "1rem", color: "#aaa" }}>◎</span>
            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: "700",
                color: "#aaa",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Resumo do Plano
            </span>
          </div>

          {/* Corpo principal */}
          <div style={{ padding: "24px" }}>
            {/* Linha de métricas: plano | barra | meta */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
                alignItems: "center",
                gap: "24px",
                marginBottom: "20px",
              }}
            >
              {/* Coluna esquerda - Total do Plano */}
              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#999",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "4px",
                  }}
                >
                  Total do Plano
                </div>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "800",
                    color: "#2c3e50",
                    lineHeight: 1,
                  }}
                >
                  {totalCaloriasPlano.toLocaleString("pt-BR")}
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#999",
                      marginLeft: "4px",
                    }}
                  >
                    kcal
                  </span>
                </div>
              </div>

              {/* Divisor central */}
              <div
                style={{
                  width: "1px",
                  height: "48px",
                  backgroundColor: "#eee",
                }}
              />

              {/* Coluna direita - Meta Calórica */}
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#999",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "4px",
                  }}
                >
                  Meta Calórica
                </div>
                {temMeta ? (
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "800",
                      color: "#2c3e50",
                      lineHeight: 1,
                    }}
                  >
                    {Number(metaCalorica).toLocaleString("pt-BR")}
                    <span
                      style={{
                        fontSize: "1rem",
                        fontWeight: "600",
                        color: "#999",
                        marginLeft: "4px",
                      }}
                    >
                      kcal
                    </span>
                  </div>
                ) : (
                  <div
                    style={{
                      fontSize: "1rem",
                      color: "#ccc",
                      fontStyle: "italic",
                    }}
                  >
                    Não definida
                  </div>
                )}
              </div>
            </div>

            {/* Barra de progresso */}
            {temMeta && (
              <>
                <div
                  style={{
                    position: "relative",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "999px",
                    height: "10px",
                    overflow: "hidden",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      width: `${barWidth}%`,
                      height: "100%",
                      backgroundColor: barColor,
                      borderRadius: "999px",
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>

                {/* Badge de status */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: statusInfo.bg,
                    color: statusInfo.color,
                    padding: "6px 12px",
                    borderRadius: "999px",
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    marginBottom: "24px",
                  }}
                >
                  <span>{statusInfo.icon}</span>
                  <span>{statusInfo.label}</span>
                  <span
                    style={{
                      opacity: 0.65,
                      fontWeight: "500",
                      fontSize: "0.8rem",
                    }}
                  >
                    ({percentual.toFixed(0)}%)
                  </span>
                </div>
              </>
            )}

            {/* Separador */}
            <div
              style={{
                height: "1px",
                backgroundColor: "#f5f5f5",
                marginBottom: "20px",
              }}
            />

            {/* Macros totais */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
              }}
            >
              {[
                { label: "Carboidratos", value: totalCarbs, color: "#f39c12" },
                { label: "Proteínas", value: totalProtein, color: "#9b59b6" },
                { label: "Gorduras", value: totalFat, color: "#e74c3c" },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  style={{
                    backgroundColor: "#fafafa",
                    borderRadius: "10px",
                    padding: "14px 16px",
                    borderLeft: `3px solid ${color}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.72rem",
                      color: "#aaa",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: "4px",
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: "800",
                      color: "#2c3e50",
                    }}
                  >
                    {value.toLocaleString("pt-BR")}
                    <span
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        color: "#aaa",
                        marginLeft: "3px",
                      }}
                    >
                      g
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlanoAlimentar;
