import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Gestao() {
  const [pacientes, setPacientes] = useState([]);
  const [form, setForm] = useState({
    nome: "",
    altura: "",
    peso: "",
    idade: "",
    genero: "",
    atividade: "",
    calorias: "",
    gordura: "",
  });

  useEffect(() => {
    fetch("/db.json")
      .then((res) => res.json())
      .then((data) => {
        if (data.pacientes) setPacientes(data.pacientes);
      })
      .catch((err) => console.error(err));
  }, []);

  const gerarEstrategia = (p) => {
    const obj = p.objetivo || "";
    if (obj.includes("Hipertrofia") || obj.includes("Massa"))
      return "Treino de Força e Sobrecarga Progressiva";
    if (obj.includes("Perda") || obj.includes("Emagrecimento"))
      return "Foco em HIIT e Déficit Calórico";
    return "Rotina de Manutenção e Mobilidade";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleDelete = (id) => {
    if (window.confirm("Excluir?"))
      setPacientes(pacientes.filter((p) => p.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Salvar", form);
    alert("Dados capturados no console (F12): " + JSON.stringify(form));
  };

  return (
    <section className="pacientes">
      <div className="pacientes-container">
        {/* Container Flex: Define o layout lado a lado */}
        <div
          className="pacientes-container-flex"
          style={{
            display: "flex",
            gap: "40px",
            width: "100%",
            alignItems: "flex-start", // Evita que o form estique até o fim da página
          }}
        >
          {/* === COLUNA ESQUERDA (TABELAS) - Ocupa mais espaço (flex: 3) === */}
          <div
            className="left-content"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "40px",
              flex: 3, // AQUI: Dá mais espaço para a tabela
              width: "100%",
              minWidth: 0,
            }}
          >
            {/* Tabela 1: Lista de Pacientes */}
            <div className="patient-list" style={{ width: "100%" }}>
              <h1>Lista de Pacientes</h1>
              <div className="table-responsive">
                <table id="patientsTable">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Altura</th>
                      <th>Peso</th>
                      <th>Idade</th>
                      <th>Gênero</th>
                      <th>Gordura</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pacientes.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <Link
                            to={`/paciente/${p.id}`}
                            style={{ color: "#4c546c", fontWeight: "bold" }}
                          >
                            {p.nome}
                          </Link>
                        </td>
                        <td>{p.altura} m</td>
                        <td>{p.peso} kg</td>
                        <td>{p.idade}</td>
                        <td>{p.genero}</td>
                        <td>{p.gordura}%</td>
                        <td>
                          <button
                            onClick={() => handleDelete(p.id)}
                            style={{
                              backgroundColor: "#ff6b6b",
                              color: "white",
                              border: "none",
                              padding: "5px 10px",
                              borderRadius: "4px",
                              cursor: "pointer",
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

            {/* Tabela 2: Visão Geral */}
            <div className="patient-list" style={{ width: "100%" }}>
              <h1>Visão Geral de Treinos</h1>
              <div className="table-responsive">
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: "600px",
                  }}
                >
                  <thead style={{ backgroundColor: "#2c3e50", color: "white" }}>
                    <tr>
                      <th style={{ padding: "15px" }}>Nome</th>
                      <th style={{ padding: "15px" }}>Objetivo</th>
                      <th style={{ padding: "15px" }}>Peso</th>
                      <th style={{ padding: "15px" }}>Gordura %</th>
                      <th style={{ padding: "15px" }}>Estratégia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pacientes.map((p) => (
                      <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
                        <td style={{ padding: "15px", fontWeight: "bold" }}>
                          {p.nome}
                        </td>
                        <td style={{ padding: "15px" }}>{p.objetivo}</td>
                        <td style={{ padding: "15px" }}>{p.peso} kg</td>
                        <td
                          style={{
                            padding: "15px",
                            color: "#ff7300",
                            textAlign: "center",
                          }}
                        >
                          {p.gordura}%
                        </td>
                        <td style={{ padding: "15px", color: "#009688" }}>
                          {gerarEstrategia(p)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* === COLUNA DIREITA (FORMULÁRIO) - Barra Lateral */}
          <div
            className="patient-form"
            style={{
              flex: 1, // Ocupa menos espaço que a tabela
              position: "sticky", // Faz o menu acompanhar a rolagem
              top: "10px", // Distância do topo quando rolar
              minWidth: "600px",
            }}
          >
            <h1>Adicionar Novo Paciente</h1>
            <form id="ntrForm" onSubmit={handleSubmit}>
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Nome Completo"
                required
              />
              <input
                type="number"
                name="altura"
                value={form.altura}
                onChange={handleChange}
                placeholder="Altura (m)"
                step="0.01"
              />
              <input
                type="number"
                name="peso"
                value={form.peso}
                onChange={handleChange}
                placeholder="Peso (kg)"
                step="0.1"
              />
              <input
                type="number"
                name="idade"
                value={form.idade}
                onChange={handleChange}
                placeholder="Idade"
              />

              <input
                type="number"
                name="gordura"
                value={form.gordura}
                onChange={handleChange}
                placeholder="% Gordura Corporal"
                step="0.1"
              />

              <input
                type="number"
                name="calorias"
                value={form.calorias}
                onChange={handleChange}
                placeholder="Consumo de Calorias (kcal)"
              />

              <select name="genero" value={form.genero} onChange={handleChange}>
                <option value="">Gênero</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
              </select>

              <select
                name="atividade"
                value={form.atividade}
                onChange={handleChange}
              >
                <option value="">Nível de Atividade Física</option>
                <option value="Sedentário">
                  Sedentário (pouco ou nenhum exercício)
                </option>
                <option value="Levemente Ativo">
                  Levemente Ativo (exercício leve 1-3 dias/semana)
                </option>
                <option value="Moderadamente Ativo">
                  Moderadamente Ativo (exercício moderado 3-5 dias/semana)
                </option>
                <option value="Ativo">
                  Ativo (exercício pesado 6-7 dias/semana)
                </option>
                <option value="Muito Ativo">
                  Muito Ativo (trabalho físico + exercício pesado)
                </option>
              </select>

              <button type="submit">Salvar Paciente</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Gestao;
