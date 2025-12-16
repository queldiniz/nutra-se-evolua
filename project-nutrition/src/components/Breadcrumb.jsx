import { Link, useLocation } from "react-router-dom";

function Breadcrumb() {
  const location = useLocation();

  // Se estiver na Home, não mostra o breadcrumb
  if (location.pathname === "/") return null;

  // Divide a URL em partes
  const pathnames = location.pathname.split("/").filter((x) => x);

  const nomesAmigaveis = {
    alimentos: "Guia Nutricional",
    gestao: "Lista de Pacientes",
    paciente: "Detalhes do Paciente",
  };

  return (
    <nav className="breadcrumb">
      <ul className="breadcrumb-list">
        {/* O primeiro item sempre é a Home */}
        <li>
          <Link to="/">Home</Link>
        </li>

        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;

          let nomeExibicao = nomesAmigaveis[value] || value;

          if (!isNaN(value)) {
            nomeExibicao = "Perfil";
          }

          // Verifica se este item específico deve ser bloqueado para clique.
          // Como a rota "/paciente" sozinha não existe, então o link dela é bloqueado.
          const apenasTexto = value === "paciente";

          return (
            <li key={to}>
              <span className="separator">/</span>

              {/* Se for o último OU se for a rota proibida "paciente", exibe só texto */}
              {last || apenasTexto ? (
                <span className={last ? "active" : ""}>{nomeExibicao}</span>
              ) : (
                <Link to={to}>{nomeExibicao}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default Breadcrumb;
