import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Gestao() {
  const [pacientes, setPacientes] = useState([]);

  // URL do seu Back-End Python
  const API_URL = "http://localhost:5000/api/nutrition";

  // Estados para Modal e Feedback
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [modalExclusao, setModalExclusao] = useState({ show: false, id: null });

  const [form, setForm] = useState({
    nome: "",
    altura: "",
    peso: "",
    idade: "",
    genero: "",
    atividade: "",
    calorias: "",
    gordura: "",
    objetivo: "",
  });

  // 1. GET: Busca os pacientes no Python ao abrir a tela
  const carregarPacientes = async () => {
    try {
      const response = await fetch(`${API_URL}/`);
      if (!response.ok) throw new Error("Erro ao buscar pacientes");
      const data = await response.json();
      setPacientes(data);
    } catch (err) {
      console.error("Erro na conexão com o back-end:", err);
    }
  };

  useEffect(() => {
    carregarPacientes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // --- Lógica do Modal ---
  const solicitarExclusao = (id) => {
    setModalExclusao({ show: true, id });
  };

  // 2. DELETE: Manda o Python apagar o paciente no banco de dados
  const confirmarExclusao = async () => {
    try {
      const response = await fetch(`${API_URL}/${modalExclusao.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setModalExclusao({ show: false, id: null });
        carregarPacientes(); // Recarrega a lista atualizada
      } else {
        throw new Error("Erro ao excluir");
      }
    } catch (err) {
      console.error("Erro ao excluir paciente:", err);
    }
  };

  const cancelarExclusao = () => {
    setModalExclusao({ show: false, id: null });
  };
  // ---------------------

  // 3. POST: Salva o novo paciente no banco de dados Python
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Traduzindo do Front (Português) para o Back (Inglês) com os tipos certos
    const payload = {
      name: form.nome,
      height: parseFloat(form.altura),
      weight: parseFloat(form.peso),
      age: parseInt(form.idade, 10),
      gender: form.genero,
      activity_level: form.atividade,
      calories: parseInt(form.calorias, 10),
      body_percentage: parseFloat(form.gordura),
      objective: form.objetivo,
    };

    try {
      const response = await fetch(`${API_URL}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erro ao salvar no banco");

      // Exibe mensagem de sucesso visual
      setMensagemSucesso(`Paciente ${form.nome} salvo com sucesso!`);
      setTimeout(() => setMensagemSucesso(""), 3000);

      // Limpa form
      setForm({
        nome: "",
        altura: "",
        peso: "",
        idade: "",
        genero: "",
        atividade: "",
        calorias: "",
        gordura: "",
      });

      // Puxa a lista nova do banco de dados
      carregarPacientes();
    } catch (err) {
      console.error("Erro ao salvar paciente:", err);
      alert("Erro ao salvar paciente. Verifique se o Back-End está rodando.");
    }
  };

  return (
    <section className="pacientes">
      {/* --- MODAL (Janela de Confirmação) --- */}
      {modalExclusao.show && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "10px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              textAlign: "center",
              maxWidth: "400px",
            }}
          >
            <h3 style={{ color: "#333", marginBottom: "10px" }}>
              Confirmar Exclusão
            </h3>
            <p style={{ marginBottom: "20px", color: "#666" }}>
              Tem certeza que deseja excluir o registro?
            </p>
            <div
              style={{ display: "flex", justifyContent: "center", gap: "15px" }}
            >
              <button
                onClick={cancelarExclusao}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  backgroundColor: "#e0e0e0",
                  color: "#333",
                  fontWeight: "600",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmarExclusao}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  backgroundColor: "#ff6b6b",
                  color: "white",
                  fontWeight: "600",
                }}
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pacientes-container">
        <div
          className="pacientes-container-flex"
          style={{
            display: "flex",
            gap: "30px",
            width: "100%",
            alignItems: "flex-start",
          }}
        >
          {/* === ESQUERDA (TABELAS) === */}
          <div
            className="left-content"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "40px",
              flex: 2,
              width: "100%",
              minWidth: 0,
            }}
          >
            {/* Tabela 1 */}
            <div className="patient-list" style={{ width: "100%" }}>
              <h1>Lista de Pacientes</h1>
              <div className="table-responsive">
                <table id="patientsTable">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Altura</th>
                      <th>Peso</th>
                      <th>Gênero</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Alterado p.nome para p.name, etc, para bater com o Python */}
                    {pacientes.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <Link
                            to={`/paciente/${p.id}`}
                            title="Ver Detalhes"
                            style={{ color: "#4c546c", fontWeight: "bold" }}
                          >
                            {p.name}
                          </Link>
                        </td>
                        <td>{p.height} m</td>
                        <td>{p.weight} kg</td>
                        <td>{p.gender}</td>
                        <td>
                          <button
                            onClick={() => solicitarExclusao(p.id)}
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

            {/* Tabela 2 */}
            <div className="patient-list" style={{ width: "100%" }}>
              <h1>Visão Geral</h1>
              <div className="table-responsive">
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: "500px",
                  }}
                >
                  <thead style={{ backgroundColor: "#2c3e50", color: "white" }}>
                    <tr>
                      <th style={{ padding: "12px" }}>Nome</th>
                      <th style={{ padding: "12px" }}>Gordura %</th>
                      <th style={{ padding: "12px" }}>Estratégia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pacientes.map((p) => (
                      <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
                        <td style={{ padding: "12px", fontWeight: "bold" }}>
                          {p.name}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            color: "#ff7300",
                            textAlign: "center",
                          }}
                        >
                          {p.body_percentage}%
                        </td>
                        <td style={{ padding: "12px", color: "#009688" }}>
                          {p.objective}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* === DIREITA (FORMULÁRIO) === */}
          <div
            className="patient-form"
            style={{
              flex: 1,
              position: "sticky",
              top: "20px",
              minWidth: "320px",
            }}
          >
            <h1>Novo Paciente</h1>
            {/* Mensagem de Sucesso */}
            {mensagemSucesso && (
              <div
                style={{
                  backgroundColor: "#d1e7dd",
                  color: "#0f5132",
                  padding: "10px",
                  marginBottom: "15px",
                  borderRadius: "5px",
                  textAlign: "center",
                  border: "1px solid #badbcc",
                }}
              >
                {mensagemSucesso}
              </div>
            )}

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
                required
              />
              <input
                type="number"
                name="peso"
                value={form.peso}
                onChange={handleChange}
                placeholder="Peso (kg)"
                step="0.1"
                required
              />
              <input
                type="number"
                name="idade"
                value={form.idade}
                onChange={handleChange}
                placeholder="Idade"
                required
              />
              <input
                type="number"
                name="gordura"
                value={form.gordura}
                onChange={handleChange}
                placeholder="% Gordura"
                step="0.1"
                required
              />
              <input
                type="number"
                name="calorias"
                value={form.calorias}
                onChange={handleChange}
                placeholder="Consumo de Calorias (kcal)"
                required
              />

              <select
                name="genero"
                value={form.genero}
                onChange={handleChange}
                required
              >
                <option value="">Gênero</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
              </select>

              <select
                name="atividade"
                value={form.atividade}
                onChange={handleChange}
                required
              >
                <option value="">Nível de Atividade</option>
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

              <select
                name="objetivo"
                value={form.objetivo}
                onChange={handleChange}
                required
              >
                <option value="">Objetivo da Dieta</option>
                <option value="Emagrecimento">Emagrecimento (Secar)</option>
                <option value="Hipertrofia">Hipertrofia (Ganhar Massa)</option>
                <option value="Manutenção">Manutenção</option>
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
