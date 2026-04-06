import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Gestao() {
  const [pacientes, setPacientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  // === ESTADOS DO MODAL DE CADASTRO ===
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");
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

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const API_URL = `${API_BASE}/api/nutrition`;

  const carregarPacientes = async () => {
    try {
      const response = await fetch(`${API_URL}/`);
      if (!response.ok) throw new Error("Erro ao buscar pacientes");
      const data = await response.json();
      setPacientes(data);
      setLoading(false);
    } catch (err) {
      console.error("Erro na conexão com o back-end:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPacientes();
  }, []);

  // Controla o que é digitado no formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Salva o novo paciente
  const handleSubmit = async (e) => {
    e.preventDefault();

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

      setMensagemSucesso(`Paciente ${form.nome} cadastrado com sucesso!`);
      setTimeout(() => {
        setMensagemSucesso("");
        setMostrarModal(false); // Fecha o modal depois de 2 segundos
      }, 2000);

      // Limpa o form
      setForm({
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
      carregarPacientes(); // Atualiza os cards imediatamente
    } catch (err) {
      console.error("Erro ao salvar paciente:", err);
      alert("Erro ao salvar paciente. Verifique o servidor.");
    }
  };

  const pacientesFiltrados = pacientes.filter((p) =>
    p.name.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <section
      style={{
        padding: "40px 20px",
        maxWidth: "1100px",
        margin: "0 auto",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/*CABEÇALHO COM BOTÃO NOVO PACIENTE */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <h1 style={{ color: "#2c3e50", fontSize: "2.5rem", margin: 0 }}>
          Meus Pacientes
        </h1>
        <button
          onClick={() => setMostrarModal(true)}
          style={{
            backgroundColor: "#0d6efd",
            color: "white",
            border: "none",
            padding: "12px 25px",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(13, 110, 253, 0.2)",
            transition: "0.2s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0b5ed7")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#0d6efd")}
        >
          + Novo Paciente
        </button>
      </div>

      {/* --- BARRA DE PESQUISA --- */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "50px",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Pesquisar paciente pelo nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "600px",
            padding: "15px 25px",
            borderRadius: "30px",
            border: "1px solid #dee2e6",
            fontSize: "1.1rem",
            outline: "none",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          }}
        />
      </div>

      {/* --- GRID DE CARDS --- */}
      {loading ? (
        <h3 style={{ textAlign: "center", color: "#6c757d" }}>
          Carregando prontuários...
        </h3>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "30px",
          }}
        >
          {pacientesFiltrados.length > 0 ? (
            pacientesFiltrados.map((p) => (
              <div
                key={p.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "15px",
                  padding: "30px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                  borderTop: "5px solid #0d6efd",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h2
                    style={{
                      color: "#333",
                      fontSize: "1.5rem",
                      margin: "0 0 15px 0",
                    }}
                  >
                    {p.name}
                  </h2>
                  <p style={{ margin: "5px 0", color: "#555" }}>
                    <strong>Idade:</strong> {p.age} anos
                  </p>
                  <p style={{ margin: "5px 0", color: "#555" }}>
                    <strong>Estratégia:</strong>{" "}
                    <span
                      style={{
                        backgroundColor: "#e9ecef",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        fontSize: "0.9rem",
                      }}
                    >
                      {p.objective || "Não definida"}
                    </span>
                  </p>
                </div>
                <Link
                  to={`/paciente/${p.id}`}
                  style={{
                    display: "block",
                    textAlign: "center",
                    marginTop: "25px",
                    padding: "12px",
                    backgroundColor: "#f8f9fa",
                    color: "#0d6efd",
                    textDecoration: "none",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    border: "1px solid #dee2e6",
                  }}
                >
                  Abrir Prontuário ➔
                </Link>
              </div>
            ))
          ) : (
            <p
              style={{
                textAlign: "center",
                color: "#999",
                gridColumn: "1 / -1",
                fontSize: "1.2rem",
              }}
            >
              Nenhum paciente encontrado.
            </p>
          )}
        </div>
      )}

      {/* MODAL DE CADASTRO FLUTUANTE */}
      {mostrarModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "15px",
              width: "100%",
              maxWidth: "500px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "2px solid #eee",
                paddingBottom: "15px",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ margin: 0, color: "#2c3e50" }}>
                Cadastrar Paciente
              </h2>
              <button
                onClick={() => setMostrarModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#999",
                }}
              >
                ✖
              </button>
            </div>

            {mensagemSucesso && (
              <div
                style={{
                  backgroundColor: "#d1e7dd",
                  color: "#0f5132",
                  padding: "10px",
                  borderRadius: "5px",
                  marginBottom: "15px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {mensagemSucesso}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Nome Completo"
                required
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />

              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="number"
                  name="idade"
                  value={form.idade}
                  onChange={handleChange}
                  placeholder="Idade"
                  required
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    flex: 1,
                  }}
                />
                <select
                  name="genero"
                  value={form.genero}
                  onChange={handleChange}
                  required
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    flex: 1,
                  }}
                >
                  <option value="">Gênero</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="number"
                  name="altura"
                  value={form.altura}
                  onChange={handleChange}
                  placeholder="Altura (m)"
                  step="0.01"
                  required
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    flex: 1,
                  }}
                />
                <input
                  type="number"
                  name="peso"
                  value={form.peso}
                  onChange={handleChange}
                  placeholder="Peso (kg)"
                  step="0.1"
                  required
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    flex: 1,
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="number"
                  name="gordura"
                  value={form.gordura}
                  onChange={handleChange}
                  placeholder="% Gordura"
                  step="0.1"
                  required
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    flex: 1,
                  }}
                />
                <input
                  type="number"
                  name="calorias"
                  value={form.calorias}
                  onChange={handleChange}
                  placeholder="Consumo Calórico Diário"
                  required
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    flex: 1,
                  }}
                />
              </div>

              <select
                name="atividade"
                value={form.atividade}
                onChange={handleChange}
                required
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              >
                <option value="">Nível de Atividade</option>
                <option value="Sedentário">Sedentário</option>
                <option value="Levemente Ativo">Levemente Ativo</option>
                <option value="Moderadamente Ativo">Moderadamente Ativo</option>
                <option value="Ativo">Ativo</option>
                <option value="Muito Ativo">Muito Ativo</option>
              </select>

              <select
                name="objetivo"
                value={form.objetivo}
                onChange={handleChange}
                required
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              >
                <option value="">Objetivo da Dieta</option>
                <option value="Emagrecimento">Emagrecimento (Secar)</option>
                <option value="Hipertrofia">Hipertrofia (Ganhar Massa)</option>
                <option value="Manutenção">Manutenção</option>
              </select>

              <button
                type="submit"
                style={{
                  padding: "12px",
                  backgroundColor: "#198754",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginTop: "10px",
                  fontSize: "1.1rem",
                }}
              >
                Salvar Paciente
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Gestao;
