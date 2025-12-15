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

  const [erros, setErros] = useState({});
  const [mostrarAviso, setMostrarAviso] = useState(false);

  // Cor da Borda
  const COR_ERRO_BORDA = "rgb(182 64 64 / 49%)";

  // Cor do Texto
  const COR_ERRO_TEXTO = "#d32f2f";

  // Função para a Borda
  const getEstiloBorda = (erro) => ({
    borderColor: erro ? COR_ERRO_BORDA : "",
    borderWidth: erro ? "2px" : "1px",
  });

  const validarCampo = (nomeCampo, valor) => {
    let erro = null;

    switch (nomeCampo) {
      case "nome":
        if (!valor || valor.length < 3 || /\d/.test(valor)) {
          erro = "Insira um nome válido (apenas letras). Ex: Raquel";
        }
        break;
      case "altura":
        if (!valor || isNaN(valor) || valor < 0.5 || valor > 2.5) {
          erro = "Use ponto para decimais. Ex: 1.55";
        }
        break;
      case "peso":
        if (!valor || isNaN(valor) || valor <= 0) {
          erro = "Insira um peso válido. Ex: 65.5 ou 70";
        }
        break;
      case "idade":
        if (
          !valor ||
          isNaN(valor) ||
          valor <= 0 ||
          !Number.isInteger(Number(valor))
        ) {
          erro = "A idade deve ser um número inteiro. Ex: 25";
        }
        break;
      default:
        break;
    }
    return erro;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (erros[name]) {
      setErros({ ...erros, [name]: null });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const erroEncontrado = validarCampo(name, value);
    setErros({ ...erros, [name]: erroEncontrado });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const novosErros = {};
    let temErro = false;

    Object.keys(form).forEach((campo) => {
      const erro = validarCampo(campo, form[campo]);
      if (erro) {
        novosErros[campo] = erro;
        temErro = true;
      }
    });

    if (temErro) {
      setErros(novosErros);
      return;
    }

    const novoPaciente = {
      id: Date.now(),
      ...form,
    };

    setPacientes([...pacientes, novoPaciente]);
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

    setMostrarAviso(true);
    setTimeout(() => {
      setMostrarAviso(false);
    }, 3000);
  };

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir?")) {
      setPacientes(pacientes.filter((p) => p.id !== id));
    }
  };

  // Objeto de estilo para o TEXTO do erro
  const estiloErro = {
    color: COR_ERRO_TEXTO,
    fontSize: "0.8rem",
    fontWeight: "bold",
    marginTop: "-10px",
    marginBottom: "10px",
    display: "block",
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
            {/* Campo NOME */}
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Nome Completo"
              required
              style={getEstiloBorda(erros.nome)}
            />
            {erros.nome && <span style={estiloErro}>{erros.nome}</span>}

            {/* Campo ALTURA */}
            <input
              type="text"
              name="altura"
              value={form.altura}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Altura (m) ex: 1.65"
              required
              style={getEstiloBorda(erros.altura)}
            />
            {erros.altura && <span style={estiloErro}>{erros.altura}</span>}

            {/* Campo PESO */}
            <input
              type="number"
              step="0.01"
              name="peso"
              value={form.peso}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Peso (kg)"
              required
              style={getEstiloBorda(erros.peso)}
            />
            {erros.peso && <span style={estiloErro}>{erros.peso}</span>}

            {/* Campo IDADE */}
            <input
              type="number"
              name="idade"
              value={form.idade}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Idade"
              required
              style={getEstiloBorda(erros.idade)}
            />
            {erros.idade && <span style={estiloErro}>{erros.idade}</span>}

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

      {/* TOAST DE SUCESSO */}
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
