import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import PacienteInfoCard from "../components/PacienteInfoCard";
import PlanoAlimentar from "../components/PlanoAlimentar";
import GraficosEvolucao from "../components/GraficosEvolucao";

function DetalhesPaciente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dadosPaciente, setDadosPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [novaAvaliacao, setNovaAvaliacao] = useState({
    data_registro: "",
    peso: "",
    gordura: "",
  });

  const [showSharePanel, setShowSharePanel] = useState(false);
  const [shareLinks, setShareLinks] = useState([]);
  const [newLinkLabel, setNewLinkLabel] = useState("");
  const [newLinkExpiry, setNewLinkExpiry] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [shareLoading, setShareLoading] = useState(false);

  const [mostrarModalExclusao, setMostrarModalExclusao] = useState(false);

  const [mostrarModalEdicao, setMostrarModalEdicao] = useState(false);
  const [erroEdicao, setErroEdicao] = useState("");
  const [mensagemSucessoEdicao, setMensagemSucessoEdicao] = useState("");

  const [formEdicao, setFormEdicao] = useState({
    name: "",
    age: "",
    weight: "",
    body_percentage: "",
    objective: "",
    calories: "",
  });

  const buscarDadosPaciente = () => {
    fetch(`${API_BASE}/api/nutrition/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Paciente nao encontrado");
        return res.json();
      })
      .then((data) => {
        setDadosPaciente(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    buscarDadosPaciente();
  }, [id]);

  const abrirModalEdicao = () => {
    setErroEdicao("");
    setMensagemSucessoEdicao("");
    setFormEdicao({
      name: dadosPaciente.name || "",
      age: dadosPaciente.age || "",
      weight: dadosPaciente.weight
        ? parseFloat(dadosPaciente.weight).toFixed(2)
        : "",
      body_percentage: dadosPaciente.body_percentage
        ? parseFloat(dadosPaciente.body_percentage).toFixed(2)
        : "",
      objective: dadosPaciente.objective || "",
      calories: dadosPaciente.calories || "",
    });
    setMostrarModalEdicao(true);
  };

  const handleChangeEdicao = (e) => {
    let { name, value } = e.target;

    if (name === "weight" || name === "body_percentage") {
      let apenasNumeros = value.replace(/\D/g, "");
      if (apenasNumeros.length > 2) {
        value = apenasNumeros.replace(/(\d+)(\d{2})$/, "$1.$2");
      } else {
        value = apenasNumeros;
      }
    }

    setFormEdicao({ ...formEdicao, [name]: value });
  };

  const salvarEdicao = async (e) => {
    e.preventDefault();
    setErroEdicao("");
    setMensagemSucessoEdicao("");

    const payloadTratado = {
      name: formEdicao.name,
      objective: formEdicao.objective,
      age: formEdicao.age !== "" ? parseInt(formEdicao.age, 10) : null,
      calories:
        formEdicao.calories !== "" ? parseInt(formEdicao.calories, 10) : null,
      weight: formEdicao.weight !== "" ? parseFloat(formEdicao.weight) : null,
      body_percentage:
        formEdicao.body_percentage !== ""
          ? parseFloat(formEdicao.body_percentage)
          : null,
      height: dadosPaciente.height,
      gender: dadosPaciente.gender,
      activity_level: dadosPaciente.activity_level,
    };

    try {
      const response = await fetch(`${API_BASE}/api/nutrition/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadTratado),
      });

      if (response.ok) {
        setMensagemSucessoEdicao("Paciente atualizado com sucesso!");
        buscarDadosPaciente();

        setTimeout(() => {
          setMensagemSucessoEdicao("");
          setMostrarModalEdicao(false);
        }, 2000);
      } else {
        setErroEdicao(
          "Não foi possível salvar as alterações. Verifique se preencheu corretamente.",
        );
      }
    } catch (err) {
      console.error(err);
      setErroEdicao("Erro de conexão. Verifique se o servidor está rodando.");
    }
  };

  const excluirPaciente = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/nutrition/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setMostrarModalExclusao(false);
        navigate("/gestao");
      } else throw new Error("Erro ao excluir paciente");
    } catch (err) {
      alert("Erro ao excluir paciente.");
      console.error(err);
    }
  };

  const excluirAlimento = async (idRefeicao) => {
    if (!window.confirm("Remover este alimento da dieta?")) return;

    try {
      const response = await fetch(`${API_BASE}/api/refeicoes/${idRefeicao}`, {
        method: "DELETE",
      });
      if (response.ok) {
        buscarDadosPaciente();
      } else throw new Error("Erro ao excluir alimento");
    } catch (err) {
      alert("Erro ao excluir o alimento do banco de dados.");
      console.error(err);
    }
  };

  const formatarMesAno = (valor) => {
    if (!valor || !valor.includes("-")) return valor;
    const [ano, mes] = valor.split("-");
    const meses = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];
    return `${meses[parseInt(mes, 10) - 1]}/${ano}`;
  };

  const salvarHistorico = async (e) => {
    e.preventDefault();
    const payload = {
      data_registro: formatarMesAno(novaAvaliacao.data_registro),
      peso: parseFloat(novaAvaliacao.peso),
      gordura: parseFloat(novaAvaliacao.gordura),
      paciente_id: parseInt(id),
    };

    try {
      const response = await fetch(`${API_BASE}/api/historico/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setNovaAvaliacao({ data_registro: "", peso: "", gordura: "" });
        buscarDadosPaciente();
      } else throw new Error("Erro ao salvar historico");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar a avaliação no banco de dados.");
    }
  };

  const carregarLinks = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/api/nutrition/${id}/shares?active_only=true`,
      );
      if (res.ok) {
        const data = await res.json();
        setShareLinks(data);
      }
    } catch (err) {
      console.error("Erro ao carregar links:", err);
    }
  };

  const toggleSharePanel = () => {
    const novoEstado = !showSharePanel;
    setShowSharePanel(novoEstado);
    if (novoEstado) carregarLinks();
  };

  const gerarLink = async () => {
    setShareLoading(true);
    try {
      const body = {};
      if (newLinkExpiry) body.expires_in_days = parseInt(newLinkExpiry);
      if (newLinkLabel.trim()) body.label = newLinkLabel.trim();

      const res = await fetch(`${API_BASE}/api/nutrition/${id}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setNewLinkLabel("");
        setNewLinkExpiry("");
        carregarLinks();
      }
    } catch (err) {
      alert("Erro ao gerar link de compartilhamento.");
      console.error(err);
    } finally {
      setShareLoading(false);
    }
  };

  const revogarLink = async (tokenId) => {
    if (
      !window.confirm(
        "Revogar este link? Quem tiver o link nao podera mais acessar.",
      )
    )
      return;
    try {
      const res = await fetch(
        `${API_BASE}/api/nutrition/${id}/share/${tokenId}`,
        {
          method: "DELETE",
        },
      );
      if (res.ok) carregarLinks();
    } catch (err) {
      alert("Erro ao revogar link.");
      console.error(err);
    }
  };

  const copiarLink = async (token, tokenId) => {
    const url = `${window.location.origin}/public/${token}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(tokenId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopiedId(tokenId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  if (loading)
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px", color: "#4c546c" }}>
        Carregando Prontuario...
      </h2>
    );
  if (!dadosPaciente)
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Paciente nao encontrado.
      </h2>
    );

  const historicoReal = dadosPaciente.historico || [];

  return (
    <section
      style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}
    >
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
        <div>
          <h1
            style={{
              color: "#4c546c",
              fontSize: "2.5rem",
              margin: "0 0 10px 0",
            }}
          >
            Prontuario: {dadosPaciente.name}
          </h1>
          <span
            style={{
              backgroundColor: "#e0f2f1",
              color: "#00695c",
              padding: "5px 15px",
              borderRadius: "20px",
              fontWeight: "bold",
            }}
          >
            Objetivo: {dadosPaciente.objective || "Nao definido"}
          </span>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={toggleSharePanel}
            style={{
              backgroundColor: showSharePanel ? "#00897b" : "#00a896",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {showSharePanel ? "Fechar Compartilhamento" : "Compartilhar"}
          </button>

          <button
            onClick={abrirModalEdicao}
            style={{
              backgroundColor: "#f5a623",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Editar Paciente
          </button>

          <button
            onClick={() => setMostrarModalExclusao(true)}
            style={{
              backgroundColor: "#ed5565",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Excluir Paciente
          </button>
        </div>
      </div>

      {mostrarModalEdicao && (
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
              <h2 style={{ color: "#4c546c", margin: 0 }}>
                Editar Dados do Paciente
              </h2>
              <button
                onClick={() => setMostrarModalEdicao(false)}
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

            {mensagemSucessoEdicao && (
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
                {mensagemSucessoEdicao}
              </div>
            )}

            {erroEdicao && (
              <div
                style={{
                  backgroundColor: "#f8d7da",
                  color: "#842029",
                  padding: "10px",
                  borderRadius: "5px",
                  marginBottom: "15px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {erroEdicao}
              </div>
            )}

            <form
              onSubmit={salvarEdicao}
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    color: "#666",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                >
                  Nome Completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={formEdicao.name}
                  onChange={handleChangeEdicao}
                  placeholder="Nome Completo"
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      color: "#666",
                      fontWeight: "bold",
                      marginBottom: "5px",
                    }}
                  >
                    Idade
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formEdicao.age}
                    onChange={handleChangeEdicao}
                    placeholder="Idade"
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      color: "#666",
                      fontWeight: "bold",
                      marginBottom: "5px",
                    }}
                  >
                    Peso Inicial (kg)
                  </label>
                  <input
                    type="text"
                    name="weight"
                    value={formEdicao.weight}
                    onChange={handleChangeEdicao}
                    placeholder="Peso Inicial"
                    maxLength="6"
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      color: "#666",
                      fontWeight: "bold",
                      marginBottom: "5px",
                    }}
                  >
                    Gordura Atual (%)
                  </label>
                  <input
                    type="text"
                    name="body_percentage"
                    value={formEdicao.body_percentage}
                    onChange={handleChangeEdicao}
                    placeholder="% Gordura"
                    maxLength="5"
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      color: "#666",
                      fontWeight: "bold",
                      marginBottom: "5px",
                    }}
                  >
                    Objetivo
                  </label>
                  <select
                    name="objective"
                    value={formEdicao.objective}
                    onChange={handleChangeEdicao}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      boxSizing: "border-box",
                      backgroundColor: "white",
                    }}
                  >
                    <option
                      value=""
                      disabled
                    >
                      Selecione um objetivo
                    </option>
                    <option value="Emagrecimento">Emagrecimento (Secar)</option>
                    <option value="Hipertrofia">
                      Hipertrofia (Ganhar Massa)
                    </option>
                    <option value="Manutenção">Manutenção</option>
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      color: "#666",
                      fontWeight: "bold",
                      marginBottom: "5px",
                    }}
                  >
                    Meta Calórica (kcal)
                  </label>
                  <input
                    type="number"
                    name="calories"
                    value={formEdicao.calories}
                    onChange={handleChangeEdicao}
                    placeholder="Meta Calórica"
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  padding: "12px",
                  backgroundColor: "#f5a623",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginTop: "10px",
                  fontSize: "1.1rem",
                }}
              >
                Salvar Alterações
              </button>
            </form>
          </div>
        </div>
      )}

      {mostrarModalExclusao && (
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
              maxWidth: "400px",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            <h2
              style={{ color: "#dc3545", marginBottom: "15px", marginTop: 0 }}
            >
              Atenção!
            </h2>
            <p
              style={{
                color: "#555",
                marginBottom: "25px",
                fontSize: "1.1rem",
              }}
            >
              Tem certeza de que deseja excluir? Isso apagará todo o prontuário
              deste paciente.
            </p>
            <div
              style={{ display: "flex", justifyContent: "center", gap: "15px" }}
            >
              <button
                onClick={() => setMostrarModalExclusao(false)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  flex: 1,
                }}
              >
                Cancelar
              </button>
              <button
                onClick={excluirPaciente}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  flex: 1,
                }}
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {showSharePanel && (
        <div
          style={{
            backgroundColor: "#e0f2f1",
            padding: "25px",
            borderRadius: "15px",
            marginBottom: "30px",
            border: "1px solid #b2dfdb",
          }}
        >
          <h3 style={{ color: "#00695c", marginBottom: "15px" }}>
            Links de Compartilhamento
          </h3>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <input
              type="text"
              placeholder="Rotulo (opcional)"
              value={newLinkLabel}
              onChange={(e) => setNewLinkLabel(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                flex: "1",
                minWidth: "150px",
              }}
            />
            <select
              value={newLinkExpiry}
              onChange={(e) => setNewLinkExpiry(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                minWidth: "150px",
              }}
            >
              <option value="">Sem expiração</option>
              <option value="7">7 dias</option>
              <option value="30">30 dias</option>
              <option value="90">90 dias</option>
            </select>
            <button
              onClick={gerarLink}
              disabled={shareLoading}
              style={{
                padding: "10px 20px",
                backgroundColor: "#009688",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: shareLoading ? "not-allowed" : "pointer",
                fontWeight: "bold",
                opacity: shareLoading ? 0.7 : 1,
              }}
            >
              {shareLoading ? "Gerando..." : "Gerar Link"}
            </button>
          </div>

          {shareLinks.length === 0 ? (
            <p style={{ color: "#666", fontStyle: "italic" }}>
              Nenhum link ativo. Gere um link acima para compartilhar.
            </p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  backgroundColor: "white",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: "#f5f5f5",
                      color: "#555",
                      fontSize: "0.85rem",
                    }}
                  >
                    <th style={{ padding: "10px 15px", textAlign: "left" }}>
                      Rotulo
                    </th>
                    <th style={{ padding: "10px 15px", textAlign: "left" }}>
                      Criado em
                    </th>
                    <th style={{ padding: "10px 15px", textAlign: "left" }}>
                      Expira em
                    </th>
                    <th style={{ padding: "10px 15px", textAlign: "center" }}>
                      Acessos
                    </th>
                    <th style={{ padding: "10px 15px", textAlign: "center" }}>
                      Acoes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shareLinks.map((link) => (
                    <tr
                      key={link.id}
                      style={{ borderTop: "1px solid #eee" }}
                    >
                      <td style={{ padding: "10px 15px", color: "#333" }}>
                        {link.label || "Sem rotulo"}
                      </td>
                      <td style={{ padding: "10px 15px", color: "#666" }}>
                        {new Date(link.created_at).toLocaleDateString("pt-BR")}
                      </td>
                      <td style={{ padding: "10px 15px", color: "#666" }}>
                        {link.expires_at
                          ? new Date(link.expires_at).toLocaleDateString(
                              "pt-BR",
                            )
                          : "Nunca"}
                      </td>
                      <td
                        style={{
                          padding: "10px 15px",
                          textAlign: "center",
                          fontWeight: "bold",
                          color: "#009688",
                        }}
                      >
                        {link.access_count}
                      </td>
                      <td
                        style={{
                          padding: "10px 15px",
                          textAlign: "center",
                          display: "flex",
                          gap: "8px",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          onClick={() => copiarLink(link.token, link.id)}
                          style={{
                            backgroundColor:
                              copiedId === link.id ? "#4CAF50" : "#0d6efd",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            padding: "5px 12px",
                            cursor: "pointer",
                            fontSize: "0.85rem",
                            transition: "0.2s",
                            minWidth: "75px",
                          }}
                        >
                          {copiedId === link.id ? "Copiado!" : "Copiar"}
                        </button>
                        <button
                          onClick={() => revogarLink(link.id)}
                          style={{
                            backgroundColor: "transparent",
                            color: "#dc3545",
                            border: "1px solid #dc3545",
                            borderRadius: "5px",
                            padding: "5px 12px",
                            cursor: "pointer",
                            fontSize: "0.85rem",
                            transition: "0.2s",
                          }}
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = "#dc3545";
                            e.target.style.color = "white";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.backgroundColor = "transparent";
                            e.target.style.color = "#dc3545";
                          }}
                        >
                          Revogar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <PacienteInfoCard dadosPaciente={dadosPaciente} />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "15px",
          marginTop: "20px",
        }}
      >
        <Link
          to={`/alimentos?paciente=${id}`}
          style={{
            backgroundColor: "#4285f4",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          + Adicionar Alimentos
        </Link>
      </div>

      <PlanoAlimentar
        refeicoes={dadosPaciente.refeicoes}
        onExcluirAlimento={excluirAlimento}
        metaCalorica={dadosPaciente.calories}
      />

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          marginBottom: "30px",
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
          <span style={{ fontSize: "1rem", color: "#aaa" }}>⊕</span>
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: "700",
              color: "#aaa",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Nova Avaliação
          </span>
        </div>

        {/* Corpo do formulário */}
        <form onSubmit={salvarHistorico} style={{ padding: "24px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            {/* Mês / Ano */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.72rem",
                  fontWeight: "700",
                  color: "#aaa",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "6px",
                }}
              >
                Mês / Ano
              </label>
              <input
                type="month"
                value={novaAvaliacao.data_registro}
                onChange={(e) =>
                  setNovaAvaliacao({
                    ...novaAvaliacao,
                    data_registro: e.target.value,
                  })
                }
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0",
                  fontSize: "0.95rem",
                  color: "#2c3e50",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>

            {/* Peso */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.72rem",
                  fontWeight: "700",
                  color: "#aaa",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "6px",
                }}
              >
                Peso (kg)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="Ex: 72.5"
                value={novaAvaliacao.peso}
                onChange={(e) =>
                  setNovaAvaliacao({ ...novaAvaliacao, peso: e.target.value })
                }
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0",
                  fontSize: "0.95rem",
                  color: "#2c3e50",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>

            {/* % Gordura */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.72rem",
                  fontWeight: "700",
                  color: "#aaa",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "6px",
                }}
              >
                % Gordura
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="Ex: 18.3"
                value={novaAvaliacao.gordura}
                onChange={(e) =>
                  setNovaAvaliacao({
                    ...novaAvaliacao,
                    gordura: e.target.value,
                  })
                }
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0",
                  fontSize: "0.95rem",
                  color: "#2c3e50",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Linha separadora */}
          <div
            style={{
              height: "1px",
              backgroundColor: "#f5f5f5",
              marginBottom: "20px",
            }}
          />

          {/* Botão alinhado à direita */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="submit"
              style={{
                padding: "10px 28px",
                backgroundColor: "#4c546c",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "0.9rem",
                letterSpacing: "0.03em",
                transition: "opacity 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.opacity = "0.85")}
              onMouseOut={(e) => (e.target.style.opacity = "1")}
            >
              Salvar Evolução
            </button>
          </div>
        </form>
      </div>

      <GraficosEvolucao historico={historicoReal} />

      <div style={{ marginTop: "50px", textAlign: "center" }}>
        <button
          onClick={() => navigate("/gestao")}
          style={{
            backgroundColor: "#4c546c",
            color: "white",
            border: "none",
            padding: "12px 35px",
            borderRadius: "30px",
            fontSize: "1rem",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 4px 10px rgba(76, 84, 108, 0.3)",
            transition: "transform 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        >
          Voltar para Meus Pacientes
        </button>
      </div>
    </section>
  );
}

export default DetalhesPaciente;
