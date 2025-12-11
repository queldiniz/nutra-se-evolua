import { Link, useLocation } from "react-router-dom";

function Breadcrumb() {
  const location = useLocation();

  // Se estiver na Home, não mostra o breadcrumb
  if (location.pathname === "/") return null;

  // Divide a URL em partes (ex: /paciente/123 vira ["paciente", "123"])
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Dicionário para traduzir as rotas para português bonito
  const nomesAmigaveis = {
    alimentos: "Guia Nutricional",
    gestao: "Lista de Pacientes",
    paciente: "Detalhes do Paciente",
  };

  return (
    <nav className="breadcrumb">
      <ul className="breadcrumb-list">
        {/*O primeiro item sempre é a Home */}
        <li>
          <Link to="/">Home</Link>
        </li>

        {/*cria os outros itens baseado na URL */}
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1; // Verifica se é o último item
          const to = `/${pathnames.slice(0, index + 1).join("/")}`; // Reconstrói o link

          //para não mostrar números (IDs) feios
          let nomeExibicao = nomesAmigaveis[value] || value;

          // Se for um número (ID do paciente), muda o texto para "Perfil"
          if (!isNaN(value)) {
            nomeExibicao = "Perfil";
          }

          return (
            <li key={to}>
              <span className="separator">/</span>
              {last ? (
                // Se for o último, é apenas texto (não clicável)
                <span className="active">{nomeExibicao}</span>
              ) : (
                // Se for meio do caminho, é link
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
