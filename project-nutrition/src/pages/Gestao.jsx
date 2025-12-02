import { useState } from "react";
import { Link } from "react-router-dom";

function Gestao() {
  const [pacientes, setPacientes] = useState([
    {
      id: 1,
      nome: "Karen Doe",
      altura: 1.65,
      peso: 58,
      idade: 27,
      genero: "Feminino",
      atividade: "Moderadamente Ativo",
      calorias: 2000,
      gordura: 27,
    },
  ]);

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

  // Estado para controlar o aviso verde
  const [mostrarAviso, setMostrarAviso] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const novoPaciente = {
      id: Date.now(),
      ...form,
    };

    setPacientes([...pacientes, novoPaciente]);

    // Limpa o formulário
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

    setMostrarAviso(true); // Mostra o aviso
    setTimeout(() => {
      setMostrarAviso(false); // Esconde depois de 3 segundos
    }, 3000);
  };

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir?")) {
      setPacientes(pacientes.filter((p) => p.id !== id));
    }
  };

  return (
    <section className="pacientes">
      <div className="pacientes-container">
        {/* LISTA */}
        <div className="patient-list">
          <h1>Lista de Pacientes</h1>
          <table id="patientsTable">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Altura</th>
                <th>Peso</th>
                <th>Idade</th>
                <th>Gênero</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((paciente) => (
                <tr key={paciente.id}>
                  <td>
                    {/* IMPORTANTE: Aqui enviamos os dados pelo "state" */}
                    <Link
                      to={`/paciente/${paciente.id}`}
                      state={{ dadosPaciente: paciente }}
                      style={{ color: "#4c546c", fontWeight: "bold" }}
                    >
                      {paciente.nome}
                    </Link>
                  </td>
                  <td>{paciente.altura} m</td>
                  <td>{paciente.peso} kg</td>
                  <td>{paciente.idade}</td>
                  <td>{paciente.genero}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(paciente.id)}
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

        {/* FORMULÁRIO */}
        <div className="patient-form">
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
              step="0.01"
              name="altura"
              value={form.altura}
              onChange={handleChange}
              placeholder="Altura (m)"
              required
            />
            <input
              type="number"
              step="0.01"
              name="peso"
              value={form.peso}
              onChange={handleChange}
              placeholder="Peso (kg)"
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

            <select
              name="genero"
              value={form.genero}
              onChange={handleChange}
              required
            >
              <option value="" disabled selected>
                Gênero
              </option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </select>

            <select
              name="atividade"
              value={form.atividade}
              onChange={handleChange}
              required
            >
              <option value="" disabled selected>
                Nível de Atividade
              </option>
              <option value="Sedentário">Sedentário</option>
              <option value="Levemente Ativo">Levemente Ativo</option>
              <option value="Moderadamente Ativo">Moderadamente Ativo</option>
              <option value="Muito Ativo">Muito Ativo</option>
            </select>

            <input
              type="number"
              name="calorias"
              value={form.calorias}
              onChange={handleChange}
              placeholder="Calorias (kcal)"
            />
            <input
              type="number"
              name="gordura"
              value={form.gordura}
              onChange={handleChange}
              placeholder="% Gordura"
            />

            <button type="submit">Salvar Paciente</button>
          </form>
        </div>
      </div>

      {/* COMPONENTE DO AVISO (TOAST) */}
      {mostrarAviso && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#4c546c",
            color: "white",
            padding: "15px 25px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            zIndex: 1000,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span>✅</span> Paciente cadastrado com sucesso!
        </div>
      )}
    </section>
  );
}

export default Gestao;
